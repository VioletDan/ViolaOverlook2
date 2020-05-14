const imath = require('math.js');

const icom = function() {
  let com = {};
  //合并字符串
  com.combineUrl = function(url, option) {
    if (Object.keys(option).length === 0 || !url) {
      return
    }
    if (option.reqUrl) {
      //如果有reqUrl,代表需要通过开屏页跳到另外的页面,那么合成后面带参路径时就删除这个属性,
      delete option.reqUrl;
    }
    url += (url.indexOf('?') < 0 ? '?' : '&') + com.param(option);
    return url
  }
  //拼接字符串
  com.param = function(data) {
    let url = ''
    for (var k in data) {
      let value = data[k] !== undefined ? data[k] : ''
      url += `&${k}=${encodeURIComponent(value)}`
    }
    return url ? url.substring(1) : ''
  }
  com.page = function() {
    let pages = getCurrentPages();
    return pages[pages.length - 1];
  } //edn func

  com.pages = function() {
    return getCurrentPages();
  } //edn func

  com.ajax = function(url, data, onSucces, onFail, method) {
    if (url && data) {
      wx.request({
        url: url,
        data: data,
        method: method,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        dataType: 'json',
        success: function success(res) {
          onSucces(res.data);
        },
        fail: function fail(err) {
          onFail(err);
        }
      });
    } //end if
  }

  com.get = function(url, data, onSucces, onFail) {
    this.ajax(url, data, onSucces, onFail, 'GET');
  }

  com.post = function(url, data, onSucces, onFail) {
    this.ajax(url, data, onSucces, onFail, 'POST');
  }

  com.toggle = function(show, showKey, animationKey, animationClass, animationTime) {
    let pages = getCurrentPages();
    let page = pages[pages.length - 1];
    if (showKey) {
      if (animationKey && animationClass && animationTime > 0) {
        if (show) {
          page.setData({
            [showKey]: show,
            [animationKey]: 'showTransparent'
          });
          setTimeout(function() {
            page.setData({
              [animationKey]: animationClass
            });
          }, 20);
        } //edn if
        else {
          page.setData({
            [animationKey]: animationClass
          });
          setTimeout(function() {
            page.setData({
              [showKey]: show
            });
          }, animationTime);
        } //edn else
      } //edn if
      else {
        page.setData({
          [showKey]: show
        });
      } //end else
    } //end if
  }

  com.show = function(showKey, animationKey, animationClass = 'fadeIn', animationTime = 350) {
    this.toggle(true, showKey, animationKey, animationClass, animationTime);
  }

  com.hide = function(showKey, animationKey, animationClass = 'fadeOut', animationTime = 300) {
    this.toggle(false, showKey, animationKey, animationClass, animationTime);
  }

  com.loadBox = function(show = true, loadBox = 'loadBox') {
    if (show) {
      this.show(loadBox);
    } //edn if
    else {
      com.hide(loadBox);
    } //edn else
  }

  com.loading = function(title = '') {
    let opts = {
      title: title,
      mask: true
    };
    wx.showLoading(opts);
  }

  com.loadingHide = function() {
    wx.hideLoading();
  }

  com.sign = function(title = '', icon = 'none', duration = 1000, callback = function() {}) {
    let opts = {
      title: title,
      icon: icon,
      duration: duration,
      mask: true
    };
    wx.showToast(opts);
    setTimeout(callback, duration);
  }

  com.signHide = function() {
    wx.hideToast();
  }

  com.alert = function(content = '', title = '', callback = function() {}) {
    let opts = {
      content: content,
      success: callback,
      showCancel: false
    };
    if (title) {
      opts.title = title
    }
    wx.showModal(opts);
  }
  com.modal = function(opts) {
    wx.showModal({
      title: opts.title || '',
      content: opts.content || '',
      cancelText: opts.cancelText || '取消',
      confirmText: opts.confirmText || '确认',
      showCancel: opts.showCancel || false,
      success(res) {
        if (res.confirm) {
          if (opts.success) opts.success()
        } else if (res.cancel) {
          if (opts.fail) opts.fail()
        }
      }
    })
  }
  com.actionSheet = function(options = {}) {
    wx.showActionSheet(options);
  }
  com.dilaog = function(options = {}) {
    let opts = {};
    let defaults = {
      title: '',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F'
    };
    Object.assign(opts, defaults, options);
    wx.showModal(opts);
  }
  com.getBound = function(selector, callback = function() {}) {
    if (selector) {
      let bound = {};
      wx.createSelectorQuery().select(selector).boundingClientRect(function(rect) {
        bound.left = rect.left // 节点的左边界坐标
        bound.right = rect.right // 节点的右边界坐标
        bound.top = rect.top // 节点的上边界坐标
        bound.bottom = rect.bottom // 节点的下边界坐标
        bound.width = rect.width // 节点的宽度
        bound.height = rect.height // 节点的高度
      }).exec();
      bound_get();
    } //end if
    function bound_get() {
      setTimeout(function() {
        if (imath.objectLength(bound) > 0) {
          callback(bound);
        } //edn if
        else {
          bound_get();
        } //end else
      }, 33);
    } //edn func
  }

  com.hitTest = function(target, source, callback = function() {}) {
    if (source && target) {
      wx.createIntersectionObserver().relativeTo(source).observe(target, (res) => {
        callback(res.intersectionRatio);
      });
    } //edn if
  }

  com.hitArea = function(target, source = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }, callback = function() {}) {
    if (target) {
      wx.createIntersectionObserver().relativeToViewport(source).observe(target, (res) => {
        callback(res.intersectionRatio);
      });
    } //edn if
  }

  com.hitOff = function() {
    wx.createIntersectionObserver().disconnect();
  }

  com.getUrl = function(url = '', canBack = false) {
    if (url != '') {
      if (canBack) {
        wx.navigateTo({
          url: url
        });
      } //edn if
      else {
        wx.redirectTo({
          url: url
        });
      } //edn if
    } //edn if
  }

  com.backUrl = function(delta = 1) {
    wx.navigateBack({
      delta: delta
    });
  }

  com.reLaunch = function(url = '../index/index') {
    wx.reLaunch({
      url: url
    });
  }

  com.checkStr = function(str = '', type = 0) {
    if (str != '') {
      let reg;
      switch (type) {
        case 0:
          reg = new RegExp(/^1[3-9]\d{9}$/); //手机号码验证
          break;
        case 1:
          reg = new RegExp(/^[1-9]\d{5}$/); //邮政编码验证
          break;
        case 2:
          reg = new RegExp(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/); //匹配EMAIL
          break;
        case 3:
          reg = new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/); //匹配身份证
          break;
        case 4:
          reg = new RegExp(/^\d+$/); //是否为0-9的数字
          break;
        case 5:
          reg = new RegExp(/^[a-zA-Z\u0391-\uFFE5]*[\w\u0391-\uFFE5]*$/); //不能以数字或符号开头
          break;
        case 6:
          reg = new RegExp(/^\w+$/); //匹配由数字、26个英文字母或者下划线组成的字符串
          break;
        case 7:
          reg = new RegExp(/^[\u0391-\uFFE5]+$/); //匹配中文
          break;
        case 8:
          reg = new RegExp(/^[a-zA-Z\u0391-\uFFE5]+$/); //不能包含数字和符号
          break;
        case 9:
          reg = new RegExp(/^\d{6}$/); //6位验证码验证
          break;
        case 10:
          reg = new RegExp(/^\d{4}$/); //4位验证码验证
          break;
      } //end switch
      if (reg.exec(this.trim(str))) return true;
      else return false;
    } //end if
    else return false;
  }

  com.trim = function(str = '') {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }

  com.click = function(fn, gapTime = 1500) {
    let _lastTime = null;
    return function() {
      let _nowTime = +new Date();
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
        fn.apply(this, arguments); //将this和传递给原函数
        _lastTime = _nowTime;
      } //edn if
    } //end return
  }

  com.storage = function(key, value) {
    if (key) {
      if (value != null && value != undefined) {
        wx.setStorageSync(key, value);
      } //edn func
      else {
        return wx.getStorageSync(key);
      } //end else
    } //edn if
  }

  com.removeStorage = function(key) {
    if (key) wx.removeStorageSync(key);
  }

  com.clearStorage = function() {
    wx.clearStorage();
  }

  com.storageInfo = function() {
    return wx.getStorageInfoSync();
  }

  com.shake = function(xName, yName, options) {
    let pages = getCurrentPages();
    let page = pages[pages.length - 1];
    console.log(xName + '/' + yName);
    if (xName && yName) {
      let defaults = {
        rx: 5,
        ry: 5,
        delay: 33,
        now: 0,
        max: 5,
        restore: true
      };
      let opts = {};
      Object.assign(opts, defaults, options);
      console.log(opts);
      let x = imath.randomRange(-opts.rx, opts.rx);
      let y = imath.randomRange(-opts.ry, opts.ry);
      console.log(x + '/' + y);
      page.setData({
        [xName]: x + 'px',
        [yName]: y + 'px'
      });
      opts.now++;
      if (opts.now > opts.max) {
        if (opts.restore) {
          page.setData({
            [xName]: 0,
            [yName]: 0
          });
        } //edn if
        if (opts.onComplete) opts.onComplete();
      } //end if
      else setTimeout(com.shake, opts.delay, xName, yName, opts);
    } //end if
  }

  com.vibrate = function(long = true) {
    if (long) {
      wx.vibrateLong();
    } //end if
    else {
      wx.vibrateShort();
    } //end else
  }

  com.screenBrightness = function(vc) {
    if (vc >= 0 && vc <= 1) {
      wx.setScreenBrightness({
        value: vc
      });
    } //end if
    else if (typeof(vc) === 'function') {
      wx.getScreenBrightness({
        success: vc
      });
    } //end else
  }

  com.screenCapture = function(callback = function() {}) {
    wx.onUserCaptureScreen(callback);
  }

  com.clipboardData = function(vc, callback = function() {}) {
    if (vc != null) {
      wx.setClipboardData({
        data: vc,
        success: callback
      })
    } //end if
    else if (typeof(vc) === 'function') {
      wx.getClipboardData({
        success: function(res) {
          vc(res.data);
        }
      })
    } //end else
  }

  com.setData = function(data) {
    let pages = getCurrentPages();
    pages[pages.length - 1].setData(data);
  }

  com.animation = function(style = '', name = '', duration = 1000, timingFunction = 'ease', delay = 0, iterationCount = 1, direction = 'normal', fillMode = 'forwards', callback = function() {}) {
    if (style != '' && name != '') {
      let pages = getCurrentPages();
      let page = pages[pages.length - 1];
      let css = '';
      css += 'animation-name:' + name + ';';
      css += 'animation-duration:' + duration + 'ms;';
      css += 'animation-timing-function:' + timingFunction + ';';
      css += 'animation-iteration-count:' + iterationCount + ';';
      css += 'animation-direction:' + direction + ';';
      css += 'animation-fill-mode:' + fillMode + ';';
      page.setData({
        [style]: css
      });
      setTimeout(callback, duration + delay);
    } //end if
  }

  com.timeRange = function(today, start, end, type = 'in') {
    let list = today.split('/');
    let isBefore, isAfter;
    for (var i = 0; i < list.length; i++) {
      list[i] = parseInt(list[i]);
    } //edn if
    if (start) {
      isBefore = (list[0] < start[0]) || (list[0] == start[0] && list[1] < start[1]) || (list[0] == start[0] && list[1] == start[1] && list[2] < start[2]);
    } //end if
    if (end) {
      isAfter = (list[0] > end[0]) || (list[0] == end[0] && list[1] > end[1]) || (list[0] == end[0] && list[1] == end[1] && list[2] >= end[2]);
    } //edn if
    if (type == 'in') return (!isBefore && !isAfter);
    else if (type == 'before') return (isBefore);
    else if (type == 'after') return (isAfter);
    else return false;
  } //edn func

  com.OS = function() {
    let info = wx.getSystemInfoSync();
    console.log(info);
    let os = {};
    os.info = info;
    os.android = info.platform == 'android';
    os.iphone = info.brand == 'iPhone';
    os.ios = info.platform == 'ios';
    os.iphoneType = info.model.replace(/^iPhone \w+<$/);
    os.iphoneX = info.model.match(/iPhone X/) ? true : false;
    os.screenHeight = info.screenHeight;
    os.screenWidth = info.screenWidth;
    os.windowHeight = info.windowHeight;
    os.windowWidth = info.windowWidth;
    os.statusbarHeight = info.statusbarHeight;
    os.screen159 = (info.screenWidth == 360 && info.windowHeight < 540);
    os.screen189 = (info.screenWidth == 360 && info.windowHeight > 590) || (info.screenWidth == 393 && info.windowHeight > 660);
    os.xiaomi = info.brand.match(/Xiaomi/) || info.brand.match(/Redmi/) ? true : false;
    os.huawei = info.brand.match(/HUAWEI/) ? true : false;
    os.oppo = info.brand.match(/OPPO/) ? true : false;
    os.vivo = info.brand.match(/vivo/) ? true : false;
    return os;
  } //edn func


  return com;
};

module.exports = icom();