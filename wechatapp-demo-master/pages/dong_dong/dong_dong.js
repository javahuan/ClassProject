// pages/user/center/dong_dong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgurl: "muyu.png",
    animationData: {},
    checkFalg: false,
    rippleStyle:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  setLoading: function (a) {
    this.setData({
      loading: !this.data.loading
    });
  },
  containerTap: function (res) {
    var that = this
    //var x = res.touches[0].pageX;
    //var y = res.touches[0].pageY + 85;
    this.checkImg();
    this.setData({
      rippleStyle: ''
    });
    setTimeout(function () {
      that.setData({
        rippleStyle: 'top:500px;left:153px;-webkit-animation: ripple 0.4s linear;animation:ripple 0.4s linear;'
      });
    }, 50)
  },
  animateFn: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    this.animation.scale(0.9).step()
    // 要执行的动画
    this.animation.scale(1).step()
    // 导出动画
    this.setData({
      bgurl: animation.export()
    })
  },
  //点击音效
  audioFn: function () {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = false  // 是否自动开始播放，默认为 false
    innerAudioContext.loop = false  // 是否循环播放，默认为 false

    wx.setInnerAudioOption({ // ios在静音状态下能够正常播放音效
      obeyMuteSwitch: true,   // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
      success: function (e) {
      },
      fail: function (e) {
      }
    })
    innerAudioContext.src = "pages/dong_dong/muyu.mp3";
    innerAudioContext.play()
  },
  //敲击切换图片
  checkImg: function () {
    this.setData({
      bgurl: "muyu1.png"
    })
    this.setData({
      checkFalg: true
    })
    this.audioFn();
    wx.vibrateShort();
    setTimeout(() => {
      this.setData({
        bgurl: "muyu.png"
      })
    }, 100);
  }
})