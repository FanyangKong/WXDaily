//index.js
//获取应用实例
const app = getApp()

var network = require("../../utils/network.js")


var pageObject = {
  data: {
    tip: '',
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animationData: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  animation: function() {
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    animation.translate(100,100).step({duration:4000})
    animation.scale(2, 2).rotate(45).step()
    this.setData({
      animationData: animation.export()
    })

    // 动画结束执行
    setTimeout(function () {
      console.log("这里写结束处理程序!!")  //官方写法就这样.暂时没有找到相关api.
    }.bind(this), 1000)
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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
    console.log("getAnswer")
    this.getData()
  },
  getData: function () {
    var that = this
    var url = app.globalData.BASE_URL + app.globalData.QUERY_PATH + app.globalData.URL_SUFFIX
    console.log(url)
    network.requestLoading(
      //url,
      'https://www.baidu.com',
      'this.data.params', 
      '正在加载数据', 
      function (res) {
        //res就是我们请求接口返回的数据
        console.log(res)
        that.setData({
          msgUrl:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533985059572&di=bae2d1875ac2bf36594377bef1fff620&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F0b55b319ebc4b74560d94cd3c3fc1e178b8215a1.jpg',
          motto:"好死不如赖活着"
        })
      },
      function (res) {
        that.setData({
          error_log:res
        })
        wx.showToast({
          title: '加载数据失败',
        })
      }
    )
  }
}

Page(pageObject)
