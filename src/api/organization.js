import request from '@/utils/request'

//首页-导学空间
export function groupList(query) {
  return request.get('/app/group/space',query)
}

// 组织机构-同步钉钉用户
export function syncDing(query) {
  return request.post('/app/groupUser/syncDing',query)
}
//组织机构-成员列表
export function groupUserList(query) {
  return request.get('/app/groupUser/list',query)
}
// 组织机构-搜索用户
export function groupUserSearch(query) {
  return request.get('/app/groupUser/user/page',query)
}
// 组织机构-添加成员
export function groupUserAdd(query) {
  return request.post('/app/groupUser/add',query)
}
// 组织机构-修改角色
export function groupUserUpdate(query) {
  return request.post('/app/groupUser/role/change',query)
}

// 组织机构-移除成员
export function groupUserDelete(query) {
  return request.post('/app/groupUser/remove',query)
}

// 组织机构-分组列表
export function categoryList(query) {
  return request.get('/app/groupCategory/list',query)
}
// 组织机构-新增分组
export function categoryAdd(query) {
  return request.post('/app/groupCategory/create',query)
}
// 组织机构-修改分组
export function categoryUpdate(query) {
  return request.post('/app/groupCategory/update',query)
}

// 组织机构-删除分组
export function categoryDelete(query) {
  return request.post('/app/groupCategory/delete',query)
}

// 组织机构-分组成员变动
export function categoryUserAdd(query) {
  return request.post('/app/groupCategory/user/change',query)
}
// 组织机构-分组成员移除
export function categoryUserDel(query) {
  return request.post('/app/groupCategory/user/delete',query)
}
// 组织机构-分组成员列表
export function categoryUserList(query) {
  return request.get('/app/groupCategory/user/list',query)
}