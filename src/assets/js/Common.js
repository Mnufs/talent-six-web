import router from '@/router'
import {
  MessageBox,
  Message
} from 'element-ui'

let loading;

Date.prototype.format = function(format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
        date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}

String.prototype.endWith = function(str) {
  if (str == null || str == "" || this.length == 0 || str.length > this.length) {
    return false;
  }
  if (this.substring(this.length - str.length)) {
    return true;
  } else {
    return false;
  }
  return true;
};

String.prototype.startWith = function(str) {
  if (str == null || str == "" || this.length == 0 || str.length > this.length) {
    return false;
  }
  if (this.substr(0, str.length) == str) {
    return true;
  } else {
    return false;
  }
  return true;
};

export default {
  clearLocalStorage: () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("tokenExpireTime");
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("nickName");
    window.localStorage.removeItem("userName");
  },
  setLocalStorage(res) {
    window.localStorage.setItem('token', res.data.data.token);
    window.localStorage.setItem('tokenExpireTime', res.data.data.tokenExpireTime);
    window.localStorage.setItem('userId', res.data.data.userId);
    window.localStorage.setItem('nickName', res.data.data.nickName);
    window.localStorage.setItem('userName', res.data.data.userName);
  },
  setChatRecord(friendId, content, type, time) {

    //存储聊天记录
    let friendMessages = window.localStorage.getItem("friend-" + friendId);

    let jsonMessage = null;
    if (friendMessages) {
      jsonMessage = JSON.parse(friendMessages);

      jsonMessage.push({
        type: type,
        content: content,
        time: time
      });
    } else {
      jsonMessage = [{
        type: type,
        content: content,
        time: time
      }]
    }

    window.localStorage.setItem("friend-" + friendId, JSON.stringify(jsonMessage));
  },
  isEmpty: object => {
    if (object === null || object === undefined) {
      return true;
    } else {
      if (typeof(object) == "string" && (object.trim() === "" || object.length === 0 || object.trim() === "null")) {
        return true;
      } else if (typeof(object) == "number" && object === 0) {
        return true;
      }
    }
    return false;
  },
  isObject: param => {
    if (Object.prototype.toString.call(param) === "[object Object]") {
      return true;
    }
    return false;
  },
  startLoading: () => {
    loading = $Loading.service({
      lock: true,
      text: '加载中……',
      background: 'rgba(0, 0, 0, 0.4)'
    });
  },
  endLoading: () => {
    if (loading) {
      loading.close();
    }
  },
  axios: {
    interceptors: function() {
      // 请求拦截
      $axios.interceptors.request.use(config => {
        config.headers.token = window.localStorage.getItem("token");
        config.headers.tokenExpireTime = window.localStorage.getItem("tokenExpireTime");
        if (config.loading) {
          $Common.startLoading();
          $('body').removeClass('el-loading-parent--relative');
        }
        return config;
      });
      // 响应拦截
      $axios.interceptors.response.use(response => {
        if (response.config.loading) {
          $Common.endLoading();
        }

        let err = new Error();

        if (response && response.data) {
          switch (response.data.code) {
            case "500":
            case "503":
              err.message = response.data.message;
              return Promise.reject(err);
          }
        } else {
          err.message = "服务处理错误！";
          return Promise.reject(err);
        }

        return response;
      }, err => {
        //==============  错误处理  ====================
        if (err && err.response) {
          switch (err.response.status) {
            case 500:
              err.message = '请求服务错误！';
              break;
            case 502:
              err.message = '请求失败，服务无响应！';
              break;
            case 503:
              err.message = '服务不可用，请稍后再试！';
              break;
            case 504:
              err.message = '请求服务超时！';
              break;
            default:
              err.message = '服务异常！';
          }
        } else {
          err.message = '服务器开小差了.....'
        }

        console.error(err);
        $Common.endLoading();

        return Promise.reject(err);
      });
    },
    request: (url, method, params, success, loading, isPrompt, error) => {

      //是否提示、默认否
      isPrompt = $Common.isEmpty(isPrompt) ? false : true;
      //异常处理
      error = $Common.isEmpty(error) ? (err => {
        //登录限制，不输出错误提示
        if (isPrompt)
          Message.error(err.message);
      }) : error;

      let config = {
        method: method,
        url: url,
        loading: $Common.isEmpty(loading) ? false : loading
      }

      switch (method) {
        case "POST":
          config.data = $Common.isEmpty(params) ? {} : params;
          break;
        case "GET":
          config.params = $Common.isEmpty(params) ? {} : params;
          break;
        default:
          break;
      }

      $axios(config)
        .then(success)
        .catch(error)
    },
    asyncRequest: async function(url, method, params, loading) {
      let config = {
        method: method,
        url: url,
        data: $Common.isEmpty(params) ? {} : params,
        loading: $Common.isEmpty(loading) ? false : loading
      }
      return await $axios(config)
    }
  }
}
