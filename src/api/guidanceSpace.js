import request from '@/utils/request'

//获取token
export function appToken(query) {
  return request.get('/user/app/token',query)
}
// 导学空间-团队成员列表
export function teamUser(query) {
  return request.get('/app/groupUser/teamUser/list',query)
}
// 导学空间-退出团队
export function groupUserQuit(query) {
  return request.post('/app/groupUser/quit',query)
}
// 导学群-团队空间 和钉钉对接
export function groupPlugin(query) {
  return request.get('/app/plugin/group/space',query)
}
// 导学空间-修改介绍
export function groupUpdate(query) {
  return request.post('/app/group/update',query)
}
// 文件夹-列表
export function folderList(query) {
  return request.get('/app/groupFolder/list',query)
}

// 文件夹-创建
export function folderAdd(query) {
  return request.post('/app/groupFolder/create',query)
}

// 文件夹-删除 
export function folderDelete(query) {
  return request.post('/app/groupFolder/delete',query)
}
//文件夹-修改名称
export function folderUpdate(query) {
  return request.post('/app/groupFolder/update',query)
}
// 文件夹-权限列表
export function permissionList(query) {
  return request.get('/app/groupFolder/permission/list',query)
}
// 文件夹-分组权限成员
export function permissionUser(query) {
  return request.get('/app/groupFolder/permission/categoryUser',query)
}
// 文件夹-权限修改
export function permissionUpdate(query) {
  return request.post('/app/groupFolder/permission/update',query)
}
// 文件夹-权限枚举
export function permissionEnum(query) {
  return request.get('/app/groupFolder/permission/enum',query)
}

// 文件--上传
export function fileUpload(query) {
  return request.post('/app/groupFile/upload',query)
}
// 文件--修改名称
export function fileRename(query) {
  return request.post('/app/groupFile/rename',query)
}

// 文件-删除
export function fileDelete(query) {
  return request.post('/app/groupFile/delete',query)
}
// 团队动态
export function messagePage(query) {
  return request.get('/app/message/page',query)
}
// 团队动态-新增
export function messageAdd(query) {
  return request.post('/guidance/groupMessage/create',query)
}
// 文件-下载
export function download(query) {
  return request.get('/app/groupFile/download',query)
}

// 点赞
export function thumbsUp(query) {
  return request.post('/app/group/thumbsUp',query)
}