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
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
    network.requestLoading(
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
      function () {
        wx.showToast({
          title: '加载数据失败',
        })
      }
    )
  }
}

Page(pageObject)
