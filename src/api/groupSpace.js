import request from '@/utils/request'

//获取获取日历默认日期
export function groupConferenceDay(query) {
  return request.get('/app/groupConference/days',query)
}

//新建组会
export function meetingAdd(data) {
  return request.post('/app/groupConference/create',data)
}

//组会上传文件
export function groupConAttrUpload(data) {
  return request.post('/app/groupConAttr/upload',data)
}

//获取获取列表
export function groupConferenceList(query) {
  return request.get('/app/groupConference/list',query)
}

//获取获取详情
export function groupConferenceDetail(query) {
  return request.get('/app/groupConference/detail',query)
}
export function groupConferenceUpdate(query) {
  return request.post('/app/groupConference/update',query)
}


//文件删除
export function groupConAttrDelete(data) {
  return request.post('/app/groupConAttr/delete',data)
}

//文件删除
export function groupConferenceDelete(data) {
  return request.post('/app/groupConference/delete',data)
}


