import request from '@/utils/request'

//找导师-找同学
export function userInfo(query) {
  return request.get('/app/userInfo/search',query)
}

// 团队动态-新增
export function messageAdd(query) {
  return request.post('/app/message/createGroupMsg',query)
}
// 用户反馈
export function feedbackAdd(query) {
  return request.post('/app/feedback/create',query)
}
// 用户反馈-类型列表
export function feedbackType(query) {
  return request.get('/app/feedback/type/list',query)
}

export function feedbackList(query) {
  return request.get('/app/feedback/page',query)
}