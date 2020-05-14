/**
 * 全页面的请求接口都统一放在API.js里
 * 一般的接口请求都需要SessionKey,所以这里会统一写好传给后端
 * 前端可以传其他需要的参数
 *  统一的接口域名请求在config.js里,前端可以自己配置
 */
const app = getApp();
import regeneratorRuntime from 'plugs/regeneratorRuntime';
import promisify from 'plugs/promisify.js';
import icom from 'base/com.js';
import config from '../../config.js';
import Init from 'base/init.js';


class API {
  constructor() {
    this.DOMAIN = config.domain;
    this.DEBUG = true;
  }
  /**
   * 初始化
   */
  _send(method, data) {
    //data里面不带SessionKey才赋值
    // if (!this.SessionKey && !data.hasOwnProperty('SessionKey')) data.SessionKey = config.SessionKey;
    if (!this.OpenID && !data.hasOwnProperty('OpenID')) data.OpenID = config.OpenID;
    let _this = this;
    return new Promise((resolve, reject) => {
      promisify(wx.request)({
        url: this.DOMAIN + "/Api/Handler.ashx?method=" + method,
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        }
      }).then(res => {
        if (_this.DEBUG) {
          console.log(method + "success")
          console.log(res.data)
        }
        if (res.data && res.data.errcode != 0) {
          wx.hideLoading();
          resolve(null)
          icom.alert(res.data.errmsg)
        } else {
          resolve(res.data)
        }
      }).catch(err => {
        console.log(err)
        reject(err)
        icom.alert(err.data.errmsg)
      })
    })
  }
  /**
   * 接口示意
   * @params Promise then方法接收res 如果为null说明服务器报错了或者errcod非0
   * GetUserMessage 为接口的名称,两个保持一致即可
   */
  GetUserMessage(data) {
    return new Promise((resolve, reject) => {
      this._send('GetUserMessage', data || {}).then(res=>{
        resolve(res)
      }).catch(err=>{
        reject(err)
      })
    })
  }

  GetIndexArticle(data) {
    return new Promise((resolve, reject) => {
      this._send('GetIndexArticle', data || {}).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
  /**
   * 云函数封装示意
   */
  callFunction(name, data) {
    return new Promise((resolve, reject) => {
      wx.cloud.init()
      wx.cloud.callFunction({
          // 云函数名称
          name: name,
          // 传给云函数的参数
          data: data || {}
        })
        .then(res => {
          if (res.errMsg == 'cloud.callFunction:ok') {
            resolve(res.result)
          }
        })
        .catch(err => {
          reject(err)
          icom.alert(err.errMsg)
          console.log(err)
        })
    })
  }
}

module.exports = new API();