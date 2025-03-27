// setting.js
import Toast from '@vant/weapp/toast/toast';

Page({
  data: {
    title: '',
    description: '',
    endTime: Date.now(),
    endTimeText: '',
    showDatetimePicker: false,
    minDate: Date.now(),
  },

  onLoad() {
    this.setInitialEndTime();
  },

  setInitialEndTime() {
    const now = new Date();
    // 默认设置为24小时后
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    this.setData({
      endTime: tomorrow.getTime(),
      endTimeText: this.formatDateTime(tomorrow)
    });
  },

  formatDateTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  onTitleChange(event) {
    this.setData({
      title: event.detail
    });
  },

  onDescriptionChange(event) {
    this.setData({
      description: event.detail
    });
  },

  showDatetimePicker() {
    this.setData({
      showDatetimePicker: true
    });
  },

  onDatetimeConfirm(event) {
    const date = new Date(event.detail);
    this.setData({
      endTime: date.getTime(),
      endTimeText: this.formatDateTime(date),
      showDatetimePicker: false
    });
  },

  onDatetimeCancel() {
    this.setData({
      showDatetimePicker: false
    });
  },

  handleSubmit() {
    const { title, description, endTime } = this.data;
    
    if (!title) {
      Toast.fail('请输入重要事项');
      return;
    }

    if (endTime <= Date.now()) {
      Toast.fail('目标完成时间必须大于当前时间');
      return;
    }

    const task = {
      id: Date.now().toString(),
      title,
      description,
      startTime: Date.now(),
      endTime,
      status: 'ongoing',
      progress: 0,
      createTime: Date.now(),
      updateTime: Date.now()
    };

    const app = getApp();
    app.globalData.currentTask = task;

    // 保存到本地存储
    wx.setStorage({
      key: 'currentTask',
      data: task,
      success: () => {
        Toast.success('设置成功');
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      },
      fail: () => {
        Toast.fail('保存失败，请重试');
      }
    });
  }
});