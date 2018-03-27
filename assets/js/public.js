var baseUrl = 'http://192.168.100.212:8081/zld/';  // 内网
// var baseUrl = 'http://zhenglin.kaituocn.com/';  // 外网
// var baseUrl = 'http://api.zhenglinc.com/'; // 正式

var HOST = baseUrl + '/api';
var baseUrl1 = baseUrl + '/';
var wapUrl = 'http://www.zhenglinc.com/';
var newllisten = 'http://api.zhenglinc.com';

var mobileReg = /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/;
var passReg = /^[\w\.\+\-\*\<>!\?\,~@#$%^&/]{6,20}$/;

var regular = {
    mobile: /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/,
    idcard: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
};

function openWin(winName, url) {
  api.openWin({
    name: winName,
    url: url
  });
}

function openView(fmName, fmUrl, winTitle, winName, winUrl, fmParams, winParams) {
  var options = {
    name: '',
    url: '',
    pageParam: {
      winTitle: '',
      win: {},
      fmName: '',
      fmUrl: '',
      fm: {}
    }
  };
  options.pageParam.fmName = fmName;
  options.pageParam.fmUrl = 'widget://html/' + fmUrl + '.html';
  if (winName) {
    options.name = winName;
  } else {
    options.name = fmName;
  }
  if (winUrl) {
    options.url = 'widget://html/common/win/' + winUrl + '.html';
  } else {
    options.url = 'widget://html/common/win/win.html';
  }
  options.pageParam.winTitle = winTitle || '';
  options.pageParam.winTitle = winTitle;
  if (winParams) {
    options.pageParam.win = winParams;
  }
  if (fmParams) {
    options.pageParam.fm = fmParams;
  }
  api.openWin(options);
}

function closeWindow(winName) {
  if (winName) {
    api.closeWin({
      name: winName,
      animation: "reveal"
    });
  } else {
    api.closeWin({
      animation: "reveal"
    });
  }
}

function formatDate(date, fmt) {
    if(typeof date === 'string') {
      if(date === '') {
        return false;
      } else {
        date = new Date(date);
        if (isNaN(date.getTime())) {
          return false;
        }
      }
    }
    if ((typeof date === 'object') && date instanceof Date) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      var o = {
        'm+': date.getMonth() +1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'i+': date.getMinutes(),
        's+': date.getSeconds()
      };
      for (var k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          var str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
      }
      return fmt;
    } else {
      return false;
    }
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

function formatImg(imgUrl, allowCache) {
  if (imgUrl) {
    imgUrl = imgUrl.split(',')[0];
    if (imgUrl.indexOf('http') !== 0) {
      imgUrl = baseUrl + imgUrl;
    }

    if (allowCache) {
      return imgUrl;
    } else {
      return imgUrl + '?' + Math.random();
    }
  } else {
    imgUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEI5MUQyQTdEM0U1MTFFNjg0NUZDOEZDMDlGNDg0Q0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEI5MUQyQThEM0U1MTFFNjg0NUZDOEZDMDlGNDg0Q0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4QjkxRDJBNUQzRTUxMUU2ODQ1RkM4RkMwOUY0ODRDRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4QjkxRDJBNkQzRTUxMUU2ODQ1RkM4RkMwOUY0ODRDRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt5PRCcAAAE1UExURdzc3P///5mZ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';
    return imgUrl;
  }
}

function formatShareImg(imgUrl) {
  if (imgUrl) {
    imgUrl = imgUrl.split(',')[0];
    if (imgUrl.indexOf('http') !== 0) {
      imgUrl = baseUrl + imgUrl;
    }
  } else {
    imgUrl = baseUrl + 'static/loadIngPack/296-205.png';
  }

  return imgUrl;
}

function cutImgurl(imgurl, num) {
  if (imgurl) {
    var arr = imgurl.split(',');
    if (num && arr.length > num) {
      arr = arr.slice(0, num);
    }
    return arr;
  }
}

function openFm(fmName, url, pageParam) {
  var posY = $api.offset($api.dom("header")).h;
  var fmUrl = url ? url : fmName + "_fm.html";
  api.openFrame({
    name: fmName,
    url: fmUrl,
    pageParam: pageParam ? pageParam : {},
    rect: {
      x: 0,
      y: posY
    },
    bounces: true,
    hScrollBarEnabled: false,
    vScrollBarEnabled: false
  });
}

function toastMsg(msg) {
  api.toast({
    msg: msg,
    duration: 3000,
    location: "middle"
  });
}

// 双击退出
function exit_app() {
  var appId = api.appId;
  api.addEventListener({
    name: 'keyback'
  }, function (ret, err) {
    api.toast({
      msg: '再按一次返回键退出' + api.appName,
      duration: 2000,
      location: 'bottom'
    });
    api.addEventListener({
      name: 'keyback'
    }, function (ret, err) {
      api.closeWidget({
        id: appId,     //应用ID
        retData: {name: 'closeWidget'},
        silent: true
      });
    });
  });
}

function fixStatusBar(t) {
  var e = api.systemType;
  if ("ios" == e) fixIos7Bar(t);
  else if ("android" == e) {
    var a = api.systemVersion;
    a = parseFloat(a), a >= 4.4 && (t.style.paddingTop = "1.36rem", t.style.height = "3.56rem", t.style.lineHeight = "2.2rem");
  }
}

function fixIos7Bar(t) {
  var e = api.systemType;
  if ("ios" == e) {
    var a = api.systemVersion,
      n = parseInt(a, 10),
      i = api.fullScreen,
      o = api.iOS7StatusBarAppearance;
    n >= 7 && !i && o && (t.style.paddingTop = "1rem", t.style.height = "3.2rem")
  }
}

function getHeight(id) {
  return document.getElementById(id).offsetHeight;
}

function getToken() {
  if ($api.getStorage('token')) {
    return $api.getStorage('token')
  } else {
    return '';
  }
}

function sendAjax(_this, post, callback) {
  Vue.http.options.emulateJSON = true;
  _this.$http.post(baseUrl + 'api', post).then(function (res) {
    switch (res.data.code) {
      case 1:
        callback(res.data);
        break;
      case -2:
        callback(res.data);
        break;
      case -4:
        callback(res.data);
        break;
      case -6:
        api.sendEvent({name: "loginOut"});
        openView('login', 'common/login', '会员登录');
        break;
      case -58:
        toastMsg(res.data.message);
        callback(res.data);
        break;
      // 您所选的课程不在当前城市下，马上为您跳转到所属城市...
      case -73:
        callback(res.data);
        break;
      // 您所选的琴馆不在当前城市下，马上为您跳转到所属城市...
      case -74:
        callback(res.data);
        break;
      case -128:
        callback(res.data);
        break;
      default:
        toastMsg(res.data.message);
        break;
    }

    if (res.data.code != 1) {
      MINT.Indicator.close();
      refreshDone();
      loadEnd();
    }
  }, function (err) {
    toastMsg('网络超时');
    MINT.Indicator.close();
    refreshDone();
    loadEnd();
  });
}


function isLogined(_this, callback) {
  Vue.http.options.emulateJSON = true;

  _this.$http.post(baseUrl + 'api', {
    cmd: 'checkTokenIsRight',
    token: getToken()
  }).then(function (res) {
    if (res.data.code == 1) {
      callback(true);
    } else {
      api.sendEvent({name: "loginOut"});
      callback(false);
    }
  }, function () {
    callback(false);
  });
}


function getcitycode() {
  return $api.getStorage('cityCode') || '110000';
}

function getcityname() {
  return $api.getStorage('cityName') || '北京';
}

// function loadStart() {
//     var ele = document.createElement("div");
//     ele.id = 'loading-zhenglin-upp';
//     ele.innerHTML = '<img src="../../../assets/images/loading.gif" />';
//     document.body.appendChild(ele);
// }

function loadEnd() {
  //等待dom渲染完成后再执行，以防找不到ele
  setTimeout(function () {
      var ele = document.getElementById('loadStart');
      if (ele) {
          ele.style.opacity = 0;
          setTimeout(function () {
              ele.remove();
          }, 1000);
      }
  }, 100)
}

// function setStorage(key, value) {
//     localStorage.setItem(key, JSON.stringify(value));
// }

//content转化为html
function charToHtml(str) {
  if (str) {
    str = str.replace(/&amp;/g, '&');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&quot;/g, '"');
    str = str.replace(/&apos;/g, "'");
    str = str.replace(/&nbsp;/g, ' ');
    str = str.replace(/&#039;/g, ' ');
  }
  return str;
}

// 下面有两个似乎毫无意义的 splice ，实际上是为了 vue 的数组更新使用的
function arrayCopy(origin, copy) {
    for (var i = 0; i < origin.length; i++) {
        copy[i] = origin[i];
    }
    origin.splice(0, 0);
    copy.splice(0, 0);
}

//api.Ajaxurl地址
function Ajaxurl() {
  return baseUrl + 'api';
}

// 得到数字序列
function getSeq(length, initial) {
  var arr = new Array(length);
  if (!initial) {
    initial = 0;
  }
  for (var i = 0; i < arr.length; i++) {

    if (initial + i < 10) {
      arr[i] = '0' + (i + initial);
    } else {
      arr[i] = i + initial;
    }
  }
  return arr;
}

function clone(obj) {
  var o;
  switch (typeof obj) {
    case 'undefined':
      break;
    case 'string':
      o = obj + '';
      break;
    case 'number':
      o = obj - 0;
      break;
    case 'boolean':
      o = obj;
      break;
    case 'object':
      if (obj === null) {
        o = null;
      } else {
        if (obj instanceof Array) {
          o = [];
          for (var i = 0, len = obj.length; i < len; i++) {
            o.push(this.clone(obj[i]));
          }
        } else {
          o = {};
          for (var k in obj) {
            o[k] = this.clone(obj[k]);
          }
        }
      }
      break;
    default:
      o = obj;
      break;
  }
  return o;
}

// 创造一个从 start 开始到 end 的数组
mkSequence = function (start, end) {
  var length = end - start + 1;
  var arr = new Array(length);
  for (var i = 0; i < length; i++) {
    arr[i] = start + i;
  }
  return arr;
};

trim = function (str) {
  if (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  } else {
    return '';
  }
};

refresh = function (callback) {
  api.setCustomRefreshHeaderInfo({
    bgColor: '#eee',
    images: [
      'widget://assets/images/pull/refresh1.png',
      'widget://assets/images/pull/refresh2.png',
      'widget://assets/images/pull/refresh3.png',
      'widget://assets/images/pull/refresh4.png'
    ],
    tips: {
      pull: '让琴友更便捷',
      threshold: '松开刷新',
      load: '正在刷新'
    }
  }, function () {
    callback();
  });
};

refreshDone = function (mess) {
  if (mess) {
    toastMsg(mess);
  }
  setTimeout(function () {
    api.refreshHeaderLoadDone();
  }, 500)
};

openLogin = function () {
  api.openWin({
    name: 'albumhome_win',
    url: 'widget://html/common/login.html'
  });
};

// 推送绑定
function pushBind(userName, userId) {
  var push = api.require('push');
  push.bind({
    userName: userName,
    userId: userId
  }, function (ret) {
    // if (ret) {
    //   alert(userName+ '绑定成功，userId' + userId + JSON.stringify(ret));
    // }
  });
}


// 推送解绑
function pushUnBind() {
  var userId = $api.getStorage('id');
  var userName = $api.getStorage('nickname');

  if (userId) {
    var push = api.require('push');
    push.unbind({
      userId: userId,
      userName: userName
    }, function (ret) {
      // if (ret) {
      //   alert(userName+ '解绑成功，userId' + userId + JSON.stringify(ret));
      // }
    });
  }
}


function notifyTitleSub(notifyList, length) {
  if (!length) {
    length = 6;
  }

  if (notifyList && notifyList.length != 0) {
    for (var i = 0; i < notifyList.length; i++) {
      if (notifyList[i].title.length > length) {
        notifyList[i].title = notifyList[i].title.substr(0, length) + '…';
      }
    }
  }
}