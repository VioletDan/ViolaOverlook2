const app = getApp();
const beats = app.beats;
const API = app.API;
const icom = require('../../common/js/base/com.js');
const cityDataObj = require('../../common/js/cityData/cityData.js');
const util = require('../../util/util.js');
const formatLocation = util.formatLocation;
import regeneratorRuntime from '../../common/js/plugs/regeneratorRuntime';
import promisify from '../../common/js/plugs/promisify.js';
import config from '../../config.js';
import QQMapWX from "../../util/qqmap-wx-jssdk.js"; //腾讯地图，reverseGeocoder逆地址转码
let qqmapsdk;
//-------------------------------------------------------初始化-------------------------------------------------------
let $page, $query, SessionKey, OpenID;
let PageData = {
  appData: app.data, //拿到全局的数据
  items: [],
  mainActiveIndex: 0,
  topTitle1: '',
  topTitle2: ''
};

Page({
  data: Object.assign({
    userInfo: {},
    hasUserInfo: false
  }, PageData), //页面的初始数据
  async onLoad(option) {
    $page = this;
    $query = option;
    console.log('getQueryString', option);
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'FRRBZ-ZDZRI-LGDGT-5PUE6-VLPU3-Q7BJN'
    });
    this.setData({
      items:config.cityData
    })
  },
  async onShow() {},
  async onReady() {
    if (icom.storage('cityName')) {
      let cityName = icom.storage('cityName').split(' ')
      let res = await cityDataObj.screenCurrentCity(cityName)
      console.log(res)
      $page.setData({
        mainActiveIndex: res.mainActiveIndex,
        activeId: res.activeId,
        topTitle1: cityName[0],
        topTitle2: cityName[1]
      })
    }
  },
  onClickNav({
    detail = {}
  }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
      topTitle1: `${this.data.items[detail.index].text}`,
      topTitle2: ''
    });
  },

  onClickItem({
    detail = {}
  }) {
    console.log(detail)
    this.setData({
      activeId: detail.id,
      topTitle2: `${detail.text}`
    });
    icom.storage('mainActiveIndex', this.data.mainActiveIndex)
    icom.storage('cityName', this.data.items[this.data.mainActiveIndex].text + ' ' + detail.text)
    icom.storage('isStore', 1)
    wx.navigateBack({
      delta: 1
    })
  },
  //根据坐标逆解析详细地址
  getCityinfo(res) {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: res.dataX,
        longitude: res.dataY
      },
      success(res) {
        console.log("地址转码成功", res);
        const _res = res.result;
        return
      },
      fail: function(res) {
        console.log(res);
      }
    });
  }
}) //end page

//-------------------------------------------------------业务逻辑-------------------------------------------------------