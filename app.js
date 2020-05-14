const icom = require('common/js/base/com.js');
import config from 'config.js';
import Init from 'common/js/base/init.js';
import API from 'common/js/API.js';
let sceneName = ""; //来源
let scenariovalue = "";//场景值
let firstScene = "";//用户的第一次来源
App({
  onLaunch: function(options) {
    console.log('onLaunch', options);
    this.launchoptions= options;
    this.beats = Init;//初始化一下init.js,这样每个页面都可以拿到
    this.API = API;// 初始化 一下API.js, 这样每个页面都可以拿到
    if (options.query.scene) {
      sceneName = options.query.scene;
      this.data.sceneName = sceneName;
    }else{
      if (options.scene){
        sceneName = options.scene;
        this.data.sceneName = sceneName;
      }else{
        this.data.sceneName = "default";
      }
    }
    if (options.scene) {
      scenariovalue = options.scene;
      this.data.scenariovalue = scenariovalue;
      //传入后台
    } 
    //播放背景音乐
    // this.bgm = require('common/js/base/bgm.js');
    // this.bgm.on({ src: 'http://t.sky.be-xx.com/wxapp/wxapp_frame/sound/bgm.mp3'});
  },
  /**
   * 全局参数
   * */
  data: {

  },
  //初始化 end
  setShareData: function(options) {
    let _this = this;
    let defaults = {
      title: config.shareData.title,
      path: config.shareData.path,
      imageUrl: config.shareData.imageUrl,
    };
    let opts = {};
    Object.assign(opts, defaults, options);
    opts.path = icom.combineUrl(opts.path, { scene: config.firstScene, OpenID: config.OpenID, SessionKey: config.SessionKey });
    console.log(opts);
    return {
      title: opts.title,
      path: opts.path,
      imageUrl: opts.imageUrl
    };
  },
  onShow: function(options) {
  },

  onHide: function() {
   
  }
})