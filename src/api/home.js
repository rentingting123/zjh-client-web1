import request from '@/utils/request'

//获取企业id
export function appCronId(query) {
  return request.get('/user/app/cronId',query)
}

//获取token
export function appToken(query) {
  return request.get('/user/app/getToken',query)
}

// 首页-应用列表
export function applicationList(query) {
  return request.get('/app/sysApplication/list',query)
}

// 导学看板
export function bulletin(query) {
  return request.get('/app/group/bulletin',query)
}

//获取用户信息
export function getUserInfo(query) {
  return request.get('/app/userInfo/getUserInfo',query)
}
//导师画像参数
export function getPortrait(query) {
  return request.get('/app/userInfo/portrait/param',query)
}

