const app = getApp();
const beats = app.beats;
const API = app.API;
const icom = require('../../common/js/base/com.js');
import regeneratorRuntime from '../../common/js/plugs/regeneratorRuntime';
import promisify from '../../common/js/plugs/promisify.js';
import config from '../../config.js';
//-------------------------------------------------------初始化-------------------------------------------------------
let $page, $query, SessionKey, OpenID;
let PageData = {
  appData: app.data//拿到全局的数据
};

Page({
  data: Object.assign({
    userInfo: {},
    hasUserInfo: false,
    loadBox: false,
    bgmBtn: false,
    bgmPlay: false
  }, PageData), //页面的初始数据
  async onLoad(option) {
    $page = this;
    $query = option;
    console.log('getQueryString', option);
    let url = icom.combineUrl(option.reqUrl, Object.assign({ss:11},option,));
    if (url) {
      this.setData({
        redirectUrl: url
      })
    }
    //登陆
    await beats.signIn();
    wx.loadFontFace({
      family: 'DIN',
      source: 'url("https://upload.cdn.be-xx.com/12fresh/hkwt.TTF")',
      success: function () {
      }
    })
  },
  onReady: function() {}, //监听页面初次渲染完成
  onShow: function() {}, //监听页面显示
  onHide: function() {}, //监听页面隐藏
  onUnload: function() {}, //监听页面卸载
  onPullDownRefresh: function() {}, //页面相关事件处理函数--监听用户下拉动作
  onReachBottom: function() {}, //页面上拉触底事件的处理函数
  onShareAppMessage: function() { //用户点击右上角分享
    return app.setShareData();
  },
  async getUserInfo(userRes) {
    if (!userRes.detail.iv) {
      wx.showModal({
        title: '提示',
        content: '该小程序需要获取您的昵称和头像,请您允许该小程序访问您的个人信息。',
        showCancel: false
      })
      return
    }
    //解析数据
    beats.parse(userRes.detail);
    this.setData({
      hasUserInfo: true,
      userInfo: beats.userInfo
    });
    this.gotoNextPage();
  },
  gotoNextPage() {
    const redirectUrl = this.data.redirectUrl || '/pages/store/store'
    wx.navigateTo({ url: decodeURIComponent(redirectUrl) })
    icom.storage('isStore',2)
  },
  bgmClick: function() { //背景音乐按钮点击事件
    app.bgm.click();
  }
}) //end page

//-------------------------------------------------------业务逻辑-------------------------------------------------------