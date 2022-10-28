import request from '@/utils/request'

//loginByDDCode
export function loginByDDCode(code,agentId,researchId,serialNo){  
  return request.get('/dingDing/keyLogin',{code,agentId,researchId,serialNo})
}

// 用户信息
export function getInfo(){
  return request.get('/system/user/profile')
}
// jsapi鉴权
export function jsAuth(data){
  return request.get('/user/app/js/auth',data)
}
