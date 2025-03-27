Page({
  data: {
    targetData: null,
    countdown: '',
    progress: 0,
    progressColor: '#ff0000',
    timer: null as any
  },

  onLoad() {
    this.loadTargetData()
  },

  onShow() {
    this.loadTargetData()
  },

  onUnload() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  },

  loadTargetData() {
    const targetData = wx.getStorageSync('targetData')
    if (targetData) {
      this.setData({ targetData }, () => {
        this.startCountdown()
      })
    }
  },

  startCountdown() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }

    const updateCountdown = () => {
      const now = new Date().getTime()
      const target = new Date(this.data.targetData.targetTime).getTime()
      const start = new Date(this.data.targetData.createTime).getTime()
      const total = target - start
      const remaining = target - now

      if (remaining <= 0) {
        clearInterval(this.data.timer)
        this.setData({
          countdown: '已结束',
          progress: 100,
          progressColor: '#07c160'
        })
        return
      }

      // 计算进度
      const progress = Math.floor(((total - remaining) / total) * 100)
      let progressColor = '#ff0000'
      if (progress > 70) {
        progressColor = '#07c160'
      } else if (progress > 30) {
        progressColor = '#ffd700'
      }

      // 格式化倒计时
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

      this.setData({
        countdown: `${days}天${hours}时${minutes}分${seconds}秒`,
        progress,
        progressColor
      })
    }

    updateCountdown()
    this.data.timer = setInterval(updateCountdown, 1000)
  },

  goToSetting() {
    wx.navigateTo({
      url: '/pages/setting/index'
    })
  },

  resetTarget() {
    wx.showModal({
      title: '确认重置',
      content: '确定要重置当前目标吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('targetData')
          if (this.data.timer) {
            clearInterval(this.data.timer)
          }
          this.setData({
            targetData: null,
            countdown: '',
            progress: 0
          })
        }
      }
    })
  }
})