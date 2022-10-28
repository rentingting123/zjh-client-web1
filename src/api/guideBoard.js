import request from "@/utils/request";

// 
export function apidepartmentList() {
  return request({
    url: '/app/department/list',
    method: 'get',
  })
}

// 
export function apibulletinNum(param) {
  return request({
    url: '/app/group/bulletin/num',
    method: 'get',
    params:param
  })
}

// 
export function apibulletinUserNum(param) {
  return request({
    url: '/app/group/bulletin/userNum',
    method: 'get',
    params:param
  })
}

// 
export function apibulletinConFreq(param) {
  return request({
    url: '/app/group/bulletin/conFreq',
    method: 'get',
    params:param
  })
}
// 
export function apibulletinConDeptFreq(param) {
  return request({
    url: '/app/group/bulletin/conDeptFreq',
    method: 'get',
    params:param
  })
}
// 
export function apibulletinGroupConFreq(param) {
  return request({
    url: '/app/group/bulletin/groupConFreq',
    method: 'get',
    params:param
  })
}
