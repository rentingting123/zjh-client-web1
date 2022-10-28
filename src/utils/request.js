import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { Toast } from 'vant';

let errorCode = {
  '401': '认证失败，无法访问系统资源',
  '403': '当前操作没有权限',
  '404': '访问资源不存在',
  'default': '系统未知错误，请反馈给管理员'
}
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 10000
})
// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false

  if (getToken() && !isToken) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // config.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjhmM2RlMmFjLWFjYWEtNDE4Yy1hZjNjLTYyZGI4Yjk0YjY3YyJ9.mRGjwMY8CGYJoH_mYe3Gh4JTeszPPQhI51N3SYuui_my6dNFVgXUQpsAajebshXztJ0ifPXvvvZaX07T9Jf9WQ'// 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== null && typeof (value) !== "undefined") {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + "=";
            url += subPart + encodeURIComponent(value[key]) + "&";
          }
        } else {
          url += part + encodeURIComponent(value) + "&";
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  return config
}, error => {
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  // 未设置状态码则默认成功状态
  const code = res.data.responseCode || 10000;
  // 获取错误信息
  const msg = errorCode[code] || res.data.msg || errorCode['default']
  if (code === "103001") {
    store.dispatch('LogOut').then(() => {
      location.href = '/';
    })
  } else if (code === "100000") {
    return res.data
  } else {
    Toast.fail(res.data.message);
    return Promise.reject(new Error(msg))
  }
},
  error => {
    return Promise.reject(error)
  }
)

let request = c => {
  let _params = c.params,
    _data = c.data
  if (!c.method) c.method = 'get'
  if (c.method == 'get') {
    c.params = _params || _data
    //c.data = _params
  } else if (c.method == 'post') {
    c.data = _data || _params
    delete c.params
  } else {

  }
  return service(c)
}
request.get = (url, params, config) => {
  let c = { method: 'get', url, params, ...config }
  return request(c)
}
request.post = (url, data, config) => {
  let c = { method: 'post', url, data, ...config }
  return request(c)
}
//统一传参 可以不写get
export default request