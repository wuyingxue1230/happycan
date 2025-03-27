Page({
  data: {
    completedCount: 0,
    ongoingCount: 0,
    completionRate: 0,
    historyTasks: [] as ITask[],
    statusText: {
      completed: '已完成',
      ongoing: '进行中',
      failed: '已失败',
      pending: '未开始'
    }
  },

  onShow() {
    this.loadHistoryTasks();
  },

  loadHistoryTasks() {
    const historyTasks = wx.getStorageSync('historyTasks') || [];
    const completedTasks = historyTasks.filter((task: ITask) => task.status === 'completed');
    const ongoingTasks = historyTasks.filter((task: ITask) => task.status === 'ongoing');
    
    // 为每个任务添加格式化的时间
    const tasksWithFormattedTime = historyTasks.map((task: ITask) => ({
      ...task,
      updateTimeText: task.updateTime ? new Date(task.updateTime).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }) : undefined
    }));

    const completionRate = historyTasks.length > 0
      ? Math.round((completedTasks.length / historyTasks.length) * 100)
      : 0;

    this.setData({
      historyTasks: tasksWithFormattedTime,
      completedCount: completedTasks.length,
      ongoingCount: ongoingTasks.length,
      completionRate
    });
  },

  formatDate(timestamp: number) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
});