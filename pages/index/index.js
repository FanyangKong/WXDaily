//index.js
//获取应用实例
const app = getApp()

var network = require("../../utils/network.js")

// 声音资源
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = false
innerAudioContext.src = app.globalData.BASE_URL + app.globalData.MUSIC_PATH
innerAudioContext.onPlay(() => {
  console.log('开始播放')
})
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})

var pageObject = {
  data: {
    tip: '',
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animationData: {
      status: 'close', //默认动画窗口关闭状态
      animationTop:{},
      animationBottom:{}
    },
    animationDuration: 600,
    shakeInfo: {
      num:0
    },
    shakeData: {
      x:0,
      y:0,
      z:0,
      lastX: 0,
      lastY: 0,
      lastZ: 0,
      lastTime: 0,
      shakeSpeed: 6,
      timeInterval: 1000,
      isRequest: false,
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 开始动画，动画结束后执行回调
  shake_shake_start: function(callback) {
    // 动画结束执行
    if(this.data.animationData.status == 'close') {
      callback()
      return
    }
    this.animation()    
    setTimeout(function () {
      console.log("shake_shake_start!!")  //官方写法就这样.暂时没有找到相关api.
      this.data.animationData.status = 'close'      
      callback()
    }.bind(this), this.data.animationDuration)
  },
  shake_shake_end: function(callback) {
    if(this.data.animationData.status == 'open') {
      return
    }
    this.animation()    
    setTimeout(function () {
      console.log("shake_shake_end!!")  //官方写法就这样.暂时没有找到相关api.
      this.data.animationData.status = 'open'
      callback()
      this.data.shakeData.isRequest = false
    }.bind(this), this.data.animationDuration)
  },
  animation: function() {
    console.log(this.data.animationData)
    
    var scroll_height
    if (this.data.animationData.status == 'close') {
      scroll_height = app.globalData.screen_height * 0.5 //向两侧移动
      this.data.animationData.status = 'open'
    } else {
      scroll_height = 0 // 回到原位
      this.data.animationData.status = 'close'
    }
    var animationTop = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: this.data.animationDuration,
      timingFunction: "ease-in",
      delay: 0
    })
    animationTop.translate(0, -scroll_height).step()
    var animationBottom = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: this.data.animationDuration,
      timingFunction: "ease-in",
      delay: 0
    })
    animationBottom.translate(0, scroll_height).step()

    this.setData({
      animationData: {
        status: this.data.animationData.status,
        animationTop: animationTop.export(),
        animationBottom: animationBottom.export()
      }
    })
  },
  shake: function (acceleration) {
    //编写摇一摇方法
    var nowTime = new Date().getTime();//记录当前时间
    var diffTime = nowTime - this.data.shakeData.lastTime;//记录时间段    
    //如果这次摇的时间距离上次摇的时间有一定间隔 才执行
    console.log('shake   ' + acceleration)
    if (!this.data.shakeData.isRequest && (diffTime > this.data.shakeData.timeInterval)) {
      this.setData({
        log_text: '进入判定回调' + nowTime
      })
      this.data.shakeData.lastTime = nowTime;//记录本次摇动时间，为下次计算摇动时间做准备
      var x = acceleration.x;//获取x轴数值，x轴为垂直于北轴，向东为正
      var y = acceleration.y;//获取y轴数值，y轴向正北为正
      var z = acceleration.z;//获取z轴数值，z轴垂直于地面，向上为正
    
      //计算 公式的意思是 单位时间内运动的路程，即为我们想要的速度
      var speed = Math.abs(x + y + z - this.data.shakeData.lastX - this.data.shakeData.lastY - this.data.shakeData.lastZ) / diffTime * 10000;
      this.setData({
        content: (x+y+z) + "  " + speed + "  " + this.data.shakeData.shakeSpeed
      })
      if (speed > this.data.shakeData.shakeSpeed) {//如果计算出来的速度超过了阈值，那么就算作用户成功摇一摇
        this.data.shakeData.isRequest = true      
        this.data.shakeInfo.num = 1
        innerAudioContext.play()        
        wx.stopAccelerometer()
        this.getAnswer();
      }
      this.data.shakeData.lastX = x;//赋值，为下一次计算做准备
      this.data.shakeData.lastY = y;//赋值，为下一次计算做准备
      this.data.shakeData.lastZ = z;//赋值，为下一次计算做准备
    }
  },
  onLoad: function () {
    this.setData({
      clientHeight: app.globalData.screen_height,
      overflow: 'hidden'
    })
    wx.onAccelerometerChange(this.shake)
  },
  onShow:function() {
    this.startAccelerometerProxy()
  },
  startAccelerometerProxy() {
    wx.startAccelerometer({
      interval:'normal'
    })
  }
  ,
  onHide: function() {
    wx.stopAccelerometer()
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getAnswer:function (e) {
    console.log('isRequest ' + this.data.shakeData.isRequest)
    this.shake_shake_start(this.requestAnswer)
  },
  requestAnswer: function (e) {

    // 如果当前窗口处于open状态，则需要先close再发起请求

    wx.stopAccelerometer()
    console.log("getAnswer")
    var that = this
    var url = app.globalData.BASE_URL + app.globalData.QUERY_PATH + app.globalData.URL_SUFFIX
    console.log(url)
    network.requestLoading(
      url,
      'this.data.params', 
      '正在加载数据', 
      function (res) {
        //res就是我们请求接口返回的数据
        console.log(res)
        that.setData({
          msgUrl: res.url,
          motto: res.msg
        })
        //that.animation()
        that.shake_shake_end(that.startAccelerometerProxy)
      },
      function (res) {
        that.setData({
          error_log:res
        })
        wx.showToast({
          title: '加载数据失败',
        })
        that.shake_shake_end(that.startAccelerometerProxy)
      }
    )
  }
}

Page(pageObject)