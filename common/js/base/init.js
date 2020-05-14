import icom from '../base/com.js';
import regeneratorRuntime from '../plugs/regeneratorRuntime';
import promisify from '../plugs/promisify.js';
import config from '../../../config.js';
import API from '../API.js';
const cityDataObj = require('../cityData/cityData.js');
class Inits {
  constructor() {
    userInfo: null
  }

  /**
   * 初始化 拿code
   */
  async signIn() {
    // const login = promisify(wx.login);
    // //code
    // let {
    //   code
    // } = await login();
    // this.code = code
    // //发送给服务器
    // await this.send()
    // //获取用户头像和昵称
    // await this.getUserInfo().then(res=>{}).catch(res=>{
    //   console.log(res)
    // });

    // await wx.cloud.init()
    let userData = await API.callFunction('getOpenID')
    icom.storage("OpenID", userData.userInfo.openId)
    config.OpenID = userData.userInfo.openId
    //请求门店
    let cityData = await API.callFunction('getStore')
    config.cityData = cityData.data
    //头像信息
    let {authSetting} = await promisify(wx.getSetting)()
    this.authSetting = authSetting
    if (this.authSetting['scope.userInfo']) await this.getUserInfo()
  }
  /**
   * 发送给服务器code去换 openid sessionKey啥的
  */
  
  async send() {
    const wxResuest = promisify(wx.request);
    let {
      data
    } = await wxResuest({
      url: config.domain + '/Api/Handler.ashx?method=GetOpenID',
      data: {
        code: this.code,
      }
    })
    if (data.errcode != 0) {
      wx.showModal({
        title: '提示',
        content: data.errmsg,
        showCancel: false
      })
      return
    }
    icom.storage("SessionKey", data.result.SessionKey);
    icom.storage("OpenID", data.result.OpenID);
    icom.storage("firstScene", data.result.Scene);
    config.OpenID = data.result.OpenID;
    config.SessionKey = data.result.SessionKey;
    config.firstScene = data.result.Scene;
  }

  /**
   * 获取头像昵称信息
   */
  async getUserInfo() {
    //获取小程序用户信息
    let pages = getCurrentPages();
    let page = pages[pages.length - 1];
    if (this.userInfo) {
      page.setData({
        hasUserInfo: true,
        userInfo: this.userInfo
      });
    } //edn if
    else {
      const getUserInfo = promisify(wx.getUserInfo);
      const {
        userInfo
      } = await getUserInfo();
      //存储一下userInfo
      this.userInfo = userInfo;
      page.setData({
        hasUserInfo: true,
        userInfo: this.userInfo
      });
      
    } //end else
  }
  /**
   * 解析下用户信息
   */
  parse(data) {
    // console.log('user', data);
    this.encryptedData = data.encryptedData;
    this.iv = data.iv;
    this.rawData = data.rawData;
    this.signature = data.signature;
    this.userInfo = data.userInfo;
    console.log('user info', this.userInfo);
  }
}
module.exports = new Inits();