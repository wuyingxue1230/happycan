App({
  globalData: {
    userInfo: null,
    currentTask: null,
    tasks: []
  },
  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'your-env-id',
        traceUser: true
      });
    }
  }
});