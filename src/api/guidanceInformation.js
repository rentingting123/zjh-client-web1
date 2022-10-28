import request from '@/utils/request'

//消息类型
export function sceneList(query) {
  return request.get('/app/messageScene/list',query)
}
// 消息列表
export function messageList(query) {
  return request.get('/app/message/page',query)
}
// 未读消息数
export function unReadCount(query) {
  return request.get('/app/message/unReadCount',query)
}
// 消息已读
export function read(query) {
  return request.post('/app/message/read',query)
}