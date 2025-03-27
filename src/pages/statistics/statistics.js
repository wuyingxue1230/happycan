// statistics.js
Page({
  data: {
    completedCount: 0,
    ongoingCount: 0,
    completionRate: 0,
    historyTasks: [],
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
    // 从本地存储获取历史任务
    wx.getStorage({
      key: 'historyTasks',
      success: (res) => {
        const historyTasks = res.data || [];
        const completedTasks = historyTasks.filter(task => task.status === 'completed');
        const ongoingTasks = historyTasks.filter(task => task.status === 'ongoing');
        
        const completionRate = historyTasks.length > 0
          ? Math.round((completedTasks.length / historyTasks.length) * 100)
          : 0;

        this.setData({
          historyTasks,
          completedCount: completedTasks.length,
          ongoingCount: ongoingTasks.length,
          completionRate
        });
      }
    });
  },

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
});