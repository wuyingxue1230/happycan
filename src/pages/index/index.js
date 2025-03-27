// index.js
import { formatDuration, calculateProgress, getProgressColor } from '../../utils/time';
import Toast from '@vant/weapp/toast/toast';

Component({
  data: {
    currentTask: null,
    countdown: '',
    progress: 0,
    progressColor: '#ee0a24',
    timer: null,
    inputProgress: '',
  },

  lifetimes: {
    attached() {
      this.loadCurrentTask();
    },
    detached() {
      this.stopCountdown();
    }
  },

  pageLifetimes: {
    show() {
      this.loadCurrentTask();
      this.startCountdown();
    },
    hide() {
      this.stopCountdown();
    }
  },

  methods: {
    loadCurrentTask() {
      const app = getApp();
      let currentTask = app.globalData.currentTask;
      
      if (!currentTask) {
        // 如果全局状态中没有数据，尝试从本地存储获取
        currentTask = wx.getStorageSync('currentTask');
        if (currentTask) {
          app.globalData.currentTask = currentTask;
        }
      }
      
      if (currentTask) {
        this.setData({ currentTask });
        this.startCountdown();
      }
    },

    startCountdown() {
      if (this.data.timer) {
        this.stopCountdown();
      }

      const updateCountdown = () => {
        const { currentTask } = this.data;
        if (!currentTask) return;

        const now = Date.now();
        const remaining = currentTask.endTime - now;

        if (remaining <= 0) {
          this.stopCountdown();
          this.setData({
            countdown: '已结束',
            progress: 100
          });
          return;
        }

        const progress = calculateProgress(currentTask.startTime, currentTask.endTime);
        
        this.setData({
          countdown: formatDuration(remaining),
          progress,
          progressColor: getProgressColor(progress)
        });
      };

      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      this.setData({ timer });
    },

    stopCountdown() {
      if (this.data.timer) {
        clearInterval(this.data.timer);
        this.setData({ timer: null });
      }
    },

    navigateToSetting() {
      wx.navigateTo({
        url: '/pages/setting/setting'
      });
    },

    onProgressChange(event) {
      const value = event.detail;
      this.setData({ inputProgress: value });
    },

    updateProgress() {
      const { inputProgress, currentTask } = this.data;
      if (!currentTask) return;

      const progress = parseInt(inputProgress);
      
      if (isNaN(progress) || progress < 0 || progress > 100) {
        Toast.fail('请输入0-100之间的数字');
        return;
      }

      const updatedTask = {
        ...currentTask,
        progress,
        updateTime: Date.now()
      };

      const app = getApp();
      app.globalData.currentTask = updatedTask;

      wx.setStorage({
        key: 'currentTask',
        data: updatedTask,
        success: () => {
          Toast.success('进度更新成功');
          this.setData({
            currentTask: updatedTask,
            progress,
            progressColor: getProgressColor(progress),
            inputProgress: ''
          });
        },
        fail: () => {
          Toast.fail('更新失败，请重试');
        }
      });
    }
  }
});