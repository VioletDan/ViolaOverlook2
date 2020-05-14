function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  const hour = parseInt(time / 3600, 10)
  time %= 3600
  const minute = parseInt(time / 60, 10)
  time = parseInt(time % 60, 10)
  const second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

function fib(n) {
  if (n < 1) return 0
  if (n <= 2) return 1
  return fib(n - 1) + fib(n - 2)
}

function formatLeadingZeroNumber(n, digitNum = 2) {
  n = n.toString()
  const needNum = Math.max(digitNum - n.length, 0)
  return new Array(needNum).fill(0).join('') + n
}

function formatDateTime(date, withMs = false) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const ms = date.getMilliseconds()

  let ret = [year, month, day].map(value => formatLeadingZeroNumber(value, 2)).join('-') +
    ' ' + [hour, minute, second].map(value => formatLeadingZeroNumber(value, 2)).join(':')
  if (withMs) {
    ret += '.' + formatLeadingZeroNumber(ms, 3)
  }
  return ret
}
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
  let pages = getCurrentPages();
  let $page = pages[pages.length - 1];
  let timeout;
  return function (event) {
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.call($page, event)
    } else {
      timeout = setTimeout(() => {
        func.call($page, event)
      }, wait)
    }
  }
}

/**
 * 节流
 * 时间戳版和定时器版
 * 时间戳版和定时器版的节流函数的区别就是，时间戳版的函数触发是在时间段内开始的时候，而定时器版的函数触发是在时间段内结束的时候。
 */
/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
function throttle(func, wait, type) {
  let pages = getCurrentPages();
  let $page = pages[pages.length - 1];
  if (type === 1) {
    var previous = 0;
  } else if (type === 2) {
    var timeout;
  }
  return function (event) {
    let context = $page;
    let args = arguments;
    if (type === 1) {
      let now = Date.now();
      if (now - previous > wait) {
        func.call(context, event);
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.call(context, event)
        }, wait)
      }
    }
  }
}



module.exports = {
  formatTime,
  formatLocation,
  fib,
  formatDateTime,
  debounce,
  throttle
}
