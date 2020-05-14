// components/commonTop.js
const app = getApp();
const beats = app.beats;
const API = app.API;
const icom = require('../../common/js/base/com.js');
let _this;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    avatarUrl: {
      type: String,
      value: 'default value',
    },
    nickName: {
      type: String,
      value: 'default value',
    },
    hasUserinfo: {
      type: Boolean,
      value: false,
    },
    isLettershow: {
      type: Boolean,
      value: true, //消息当前页不用显示提示信息icon
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    letterNum: ''
  },
  /**
   * 组件定义生命周期方法
   */
  lifetimes: {
    created() {
      _this = this;
    },
    attached() {
      // 在组件实例进入页面节点树时执行
      console.log('在组件实例进入页面节点树时执行');
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件所在页面的生命周期
   */
  pageLifetimes: {
    show() {
      // 页面被展示
      console.log('页面被展示');
    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    userinfoClick(){
      wx.navigateTo({ url: decodeURIComponent('/pages/testimg/testimg') })
    }
  }
})