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
  cityName: '未获取当前位置',
  hasLocation: false,
  currentLatitude: 0,
  currentLongitude: 0,
  scale:14,
  markers: [],
  centerLatitude: '',//中心纬度
  centerLongitude: '',//中心经度
  resultArr:[],//搜索结果
};

Page({
  data: Object.assign({
    userInfo: {},
    hasUserInfo: false,
    show:false,
    searchValue:'', //搜索关键词
  }, PageData), //页面的初始数据
  async onLoad(option) {
    $page = this;
    $query = option;
    console.log('getQueryString', option);
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'FRRBZ-ZDZRI-LGDGT-5PUE6-VLPU3-Q7BJN'
    });
    await this.getMyPosition();
    await wx.getSetting({
      success: (res) => {
        // console.log(res)
        if (!res.authSetting['scope.userLocation'])
          this.openConfirm()
      }
    })
  },
  async onShow() {
    console.log('isStore:' +icom.storage('isStore'))
    if (Number(icom.storage('isStore')) == 1) {
      this.setData({
        cityName: icom.storage('cityName')
      })
      await this.getStore(icom.storage('cityName'))
    }
  },
  //获取门店
  async getStore(name) {
    if (name) {
      let cityName = name.split(' ')
      let res = await cityDataObj.screenCurrentCity(cityName)
      let store = config.cityData[res.mainActiveIndex].store
      dealData(store, false)
    }
  },
  //获取地理位置
  async getMyPosition() {
    let res = await promisify(wx.getLocation)({
      type: 'gcj02 '
    }).catch(err => {
      console.log(err)
    })
    if (res && res.errMsg == 'getLocation:ok') {
      console.log(res)
      this.setData({
        hasLocation: true,
        currentLatitude: res.latitude,
        currentLongitude: res.longitude,
      })
      await this.getCityinfo(res)
      await this.getStore(icom.storage('cityName'))
    }
  },
  //未授权地理位置的情况下提示弹窗
  async openConfirm() {
    icom.modal({
      content: '检测到您没打开小程序的定位权限,是否去设置打开',
      showCancel: true,
      success: function() {
        wx.openSetting({
          success: (res) => {
            $page.getMyPosition()
          }
        })
      },
      fail: function() {
        $page.setData({
          cityName: '上海市 徐汇区'
        })
        //默认显示北京市的地理位置
        $page.cityNameGetPosition('上海市 徐汇区').then(res=>{
          //未授权情况下显示默认的门店
          $page.getStore('上海市 徐汇区')
        })
      }
    })
  },
  //根据坐标逆解析详细地址
  async getCityinfo(res) {
    return await new Promise((resolve, reject) => {
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success(res) {
          // console.log("地址转码成功", res);
          const _res = res.result;
          $page.setData({
            cityName: _res.address_component.city + _res.address_component.district
          })
          icom.storage('cityName', _res.address_component.city + ' ' + _res.address_component.district)
          resolve(res)
        },
        fail: function (res) {
          console.log(res);
          reject(res)
        }
      });
    })
  },
  //根据城市/地址解析成坐标
  async cityNameGetPosition(name) {
    return await new Promise((resolve, reject) => {
      qqmapsdk.geocoder({
        address: name,
        success(res) {
          // console.log("根据地址转换坐标", res);
          const _res = res.result.location;
          $page.setData({
            currentLatitude: _res.lat,
            currentLongitude: _res.lng,
          })
          resolve(res)
        },
        fail(err) {
          console.log("根据地址转换坐标err", err);
          reject(err)
        }
      });
    })
  },
  markertap(e) {
    positionMarker(e)
  },
  //选择城市
  selectCity() {
    wx.navigateTo({
      url: '/pages/selectCity/selectCity',
    })
  },
  searchClick(e) {
    this.setData({
      show:true
    })
  },
  //监听输入变化
  onChange: util.debounce(function (e) {
    // console.log(e.detail)
    if (!e.detail) return
    searchhandle(e)
  },1000,true),
  // 确定搜索
  async onSearch (e) {
    console.log(e.detail)
    if (!e.detail) return icom.alert('请输入关键词~')
    searchhandle(e)
  },
  //取消搜索
  onCancel() {
    cancelData()
  },
  //点击搜索列表项
  itemClick (e) {
    // console.log(e)
    let area_id = Number(e.currentTarget.id)
    let name = e.currentTarget.dataset.name
    API.callFunction('getCurrentstore', { area_id: area_id }).then(res => {
      // console.log(res)
      if (res && res.data) {
        dealData(res.data, true, name)
      }
    })
  },
  //蒙层关闭
  onClose(){
    cancelData()
  },
  //去看看
  viewStore(e){
    // wx.navigateTo({
    //   url: `/pages/storeInfo/storeInfo?id=${e.currentTarget.id}`,
    // })
    let currentID = e.currentTarget.id
    this.data.markers.map((v, index) => {
      if (v.id == currentID) {
        const latitude = Number(v.latitude)
        const longitude = Number(v.longitude)
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
    })
    icom.storage('isStore',2)
  }
}) //end page

//-------------------------------------------------------业务逻辑-------------------------------------------------------
function cancelData() {
  $page.setData({
    show: false,
    resultArr:[],
    searchValue:''
  })
}//end func

//确认搜索数据结果
function searchhandle(e) {
  API.callFunction('search', { value: e.detail }).then(res => {
    let resultArr = []
    // console.log(res)
    if (res && res.data) {
      resultArr = res.data
      $page.setData({
        resultArr: resultArr
      })
    }
  })
}

//处理搜索的数据结果
function dealData(data,search,name){
  let store = data
  let currentIndex
  store.map((v, index) => {
    let distance = GetDistance(v.latitude, v.longitude, $page.data.currentLatitude, $page.data.currentLongitude)
    v.distance = 0
    v.distance = Number(distance)
    v.id = index+1
    v.iconPath = '/images/common/icon_write.png'
    v.width = 20
    v.height = 20
    v.callout = {
      content: v.name + ' >',
      borderWidth: 4,
      borderColor: '#fff',
      bgColor: "#fff",
      padding: 5,
      borderRadius: 5,
      display: 'BYCLICK'
    }
    if (name && name == v.name){
      currentIndex = index+1
    }
  })
  if (search){
    $page.setData({
      markers: store.sort(compare("distance")),
      centerLatitude: store.sort(compare("distance"))[0].latitude,//中心纬度
      centerLongitude: store.sort(compare("distance"))[0].longitude,//中心经度
      scrollTop: 0,
      scale: 14,
      show: false,
      resultArr: [],
      searchValue: '',
      cityName: store[0].province
    })
  }else{
    $page.setData({
      markers: store.sort(compare("distance")),
      centerLatitude: store.sort(compare("distance"))[0].latitude,//中心纬度
      centerLongitude: store.sort(compare("distance"))[0].longitude,//中心经度
      scrollTop: 0,
      scale: 14
    })
  }
  if (name) positionMarker({ id: currentIndex })
}

//定位地图中心位置
function positionMarker(e) {
  let currentID = e.id || e.markerId || e.currentTarget.id
  $page.data.markers.map((v, index) => {
    let display = `markers[${index}].callout.display`
    if (v.id == currentID) {
      $page.setData({
        centerLatitude: v.latitude,//中心纬度
        centerLongitude: v.longitude,//中心经度
        toView: 'mark-' + (currentID),
        scale:16
      })
      if (e.id || e.currentTarget.id) {
        $page.setData({
          [display]: 'ALWAYS'
        })
      } 
    }
  })
}//end func

//进行经纬度转换为距离的计算
function Rad(d) {
  return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
}

//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = Rad(Number(lat1));
  var radLat2 = Rad(Number(lat2));
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里
  s = s.toFixed(2);
  return s;
}
//排序
function compare(p) { //这是比较函数
  return function(m, n) {
    var a = m[p];
    var b = n[p];
    return a - b; //升序
  }
} //end func

/**
 * 防抖
 * 非立即执行版
 * 触发事件后函数不会立即执行，而是在 n 秒后执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
 * 立即执行版
 * 触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果。
 */
/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce(func, wait = 1000, immediate) {
  let timeout;
  return function (event) {
    if (timeout) clearTimeout(timeout)
    if(immediate) {
      var callNow = !timeout
      timeout = setTimeout(()=>{
        timeout = null
      },wait)
      if (callNow) func.call($page, event)
    }else{
      timeout = setTimeout(() => {
        func.call($page, event)
      }, wait)
    } 
  }
}
