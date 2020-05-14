// pages/testimg/testimg.js
const app = getApp();
const beats = app.beats;
const API = app.API;
const icom = require('../../common/js/base/com.js');
import config from '../../config.js';
import regeneratorRuntime from '../../common/js/plugs/regeneratorRuntime';
import promisify from '../../common/js/plugs/promisify.js';
let $page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _IndexArticle:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option){
    $page = this;
    GetIndexArticle();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

//---------------------------------------------------------初始化文章显示
async function GetIndexArticle() {
  wx.showLoading({
    title: '加载中...',
  })
  let data = await API.GetIndexArticle({})
  await wx.hideLoading();
  for (var i = 0; i < data.result.length; i++) {
    data.result[i].Classes1 = data.result[i].Classes1.split('/');
    data.result[i].Pageview = dealNum(data.result[i].Pageview);
    data.result[i].CountLike = dealNum(data.result[i].CountLike);
    data.result[i].show = false;
    data.result[i].def = "http://t.viola.be-xx.com/T1QYOyXqRaXXaY1rfd-32-32.gif";
    // data.result[i].Cover = "http://t.viola.be-xx.com/test.jpg";
  }
  $page.setData({
    _IndexArticle: data.result,
  });
  delIMg($page.data._IndexArticle)
} //end func

//---------------------------------------------------------初始化文章显示处理点赞数和阅读数
function dealNum(num) {
  if (num > 1000) {
    num = (Math.round(num / 100)) / 10;
    return num + "k";
  } else {
    return num;
  }
} //end func
async function delIMg(group){
  for (let i in group) {
    wx.createIntersectionObserver().relativeToViewport({ bottom: 20 }).observe('.listItem-' + i, (ret) => {
      if (ret.intersectionRatio > 0) {
        var _show = '_IndexArticle[' + i + '].show';
        $page.setData({
          [_show]:true
        })
      } 
      // $page.setData({ // 更新数据
      //   _IndexArticle:group
      // })
    })
  }
}