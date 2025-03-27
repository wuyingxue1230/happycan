Page({
  data: {
    date: '',
    time: ''
  },

  onLoad() {
    // 初始化日期和时间
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    
    this.setData({
      date,
      time
    })
  },

  bindDateChange(e: any) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange(e: any) {
    this.setData({
      time: e.detail.value
    })
  },

  handleSubmit(e: any) {
    const { title, remark } = e.detail.value
    const { date, time } = this.data
    
    if (!title) {
      wx.showToast({
        title: '请输入重要事项',
        icon: 'none'
      })
      return
    }

    const targetData = {
      title,
      remark,
      targetTime: `${date} ${time}:00`,
      createTime: new Date().toISOString()
    }

    // 保存到本地存储
    wx.setStorageSync('targetData', targetData)

    // 返回首页
    wx.navigateBack({
      success: () => {
        // 通知首页刷新数据
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        prevPage.loadTargetData()
      }
    })
  }
})