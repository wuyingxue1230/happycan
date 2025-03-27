import { formatDuration, calculateProgress, getProgressColor } from '../../utils/time';

Page({
  data: {
    tasks: [] as ITask[],
    countdown: {} as Record<string, string>,
    progress: {} as Record<string, number>,
    progressColor: {} as Record<string, string>,
    timers: {} as Record<string, number>,
    inputProgress: {} as Record<string, string>,
  },

  onLoad() {
    this.loadTasks();
  },

  onShow() {
    // 停止之前的所有倒计时
    this.stopAllCountdowns();
    // 重新加载任务
    this.loadTasks();
  },

  onHide() {
    this.stopAllCountdowns();
  },

  onUnload() {
    this.stopAllCountdowns();
  },

  loadTasks() {
    const app = getApp<IAppOption>();
    let tasks = app.globalData.tasks;
    
    if (!tasks || tasks.length === 0) {
      try {
        tasks = wx.getStorageSync('tasks') || [];
        if (tasks.length > 0) {
          app.globalData.tasks = tasks;
        }
      } catch (error) {
        console.error('加载任务失败:', error);
        tasks = [];
      }
    }
    
    // 过滤出进行中的任务
    const ongoingTasks = tasks.filter(task => task.status === 'ongoing');
    
    this.setData({ tasks: ongoingTasks });
    
    // 为每个任务启动倒计时
    ongoingTasks.forEach(task => {
      const progress = task.progress || calculateProgress(task.startTime, task.endTime);
      this.setData({
        [`progress.${task.id}`]: progress,
        [`progressColor.${task.id}`]: getProgressColor(progress)
      });
      this.startCountdown(task.id);
    });
  },

  startCountdown(taskId: string) {
    if (this.data.timers[taskId]) {
      clearInterval(this.data.timers[taskId]);
    }

    const updateCountdown = () => {
      const task = this.data.tasks.find(t => t.id === taskId);
      if (!task) return;

      const now = Date.now();
      const remaining = task.endTime - now;

      if (remaining <= 0) {
        this.stopCountdown(taskId);
        this.setData({
          [`countdown.${taskId}`]: '已结束',
          [`progress.${taskId}`]: 100
        });
        return;
      }

      this.setData({
        [`countdown.${taskId}`]: formatDuration(remaining)
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    this.setData({
      [`timers.${taskId}`]: timer
    });
  },

  stopCountdown(taskId: string) {
    if (this.data.timers[taskId]) {
      clearInterval(this.data.timers[taskId]);
      this.setData({
        [`timers.${taskId}`]: null
      });
    }
  },

  stopAllCountdowns() {
    Object.keys(this.data.timers).forEach(taskId => {
      this.stopCountdown(taskId);
    });
  },

  navigateToSetting() {
    wx.navigateTo({
      url: '/pages/setting/setting'
    });
  },

  onProgressChange(event: WechatMiniprogram.CustomEvent) {
    const { taskId } = event.currentTarget.dataset;
    const value = (event.detail as unknown) as string;
    this.setData({
      [`inputProgress.${taskId}`]: value
    });
  },

  updateProgress(event: WechatMiniprogram.CustomEvent) {
    const { taskId } = event.currentTarget.dataset;
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return;

    const progress = parseInt(this.data.inputProgress[taskId]);
    
    if (isNaN(progress) || progress < 0 || progress > 100) {
      wx.showToast({
        title: '请输入0-100之间的数字',
        icon: 'error'
      });
      return;
    }

    const updatedTask: ITask = {
      ...task,
      progress,
      updateTime: Date.now(),
      status: progress === 100 ? 'completed' as const : 'ongoing' as const
    };

    // 更新任务列表
    const app = getApp<IAppOption>();
    const tasks = app.globalData.tasks.map(t => 
      t.id === taskId ? updatedTask : t
    );
    
    // 如果任务完成，将其添加到已完成任务列表
    if (progress === 100) {
      const completedTasks = wx.getStorageSync('completedTasks') || [];
      completedTasks.push(updatedTask);
      wx.setStorageSync('completedTasks', completedTasks);
      
      // 从任务列表中移除已完成的任务
      const remainingTasks = tasks.filter(t => t.id !== taskId);
      app.globalData.tasks = remainingTasks;
      
      wx.setStorage({
        key: 'tasks',
        data: remainingTasks,
        success: () => {
          wx.showToast({
            title: '恭喜完成任务！',
            icon: 'success'
          });
          this.stopCountdown(taskId);
          this.loadTasks();
        }
      });
      return;
    }

    // 如果任务未完成，更新任务列表
    app.globalData.tasks = tasks;
    wx.setStorage({
      key: 'tasks',
      data: tasks,
      success: () => {
        wx.showToast({
          title: '进度更新成功',
          icon: 'success'
        });
        this.setData({
          tasks,
          [`progress.${taskId}`]: progress,
          [`progressColor.${taskId}`]: getProgressColor(progress),
          [`inputProgress.${taskId}`]: ''
        });
      },
      fail: () => {
        wx.showToast({
          title: '更新失败，请重试',
          icon: 'error'
        });
      }
    });
  }
});