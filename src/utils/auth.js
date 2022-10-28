import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function getCode() {
    return Cookies.get("codeKey")
}

export function setCode(code) {
    return Cookies.set("codeKey", code)
}

export function setUserinfo(userinfo) {
    return Cookies.set("userInfo", userinfo)
}

export function getUserinfo() {
    return Cookies.set("userInfo")
}
// 获取
export function getGroupId() {
    return Cookies.get("groupId")
}
export function setGroupId(groupId) {
    return Cookies.set("groupId", groupId)
}

export function getstudentNum() {
  return Cookies.get("studentNumber")
}
export function setstudentNum(studentNumber) {
  return Cookies.set("studentNumber", studentNumber)
}

export function getuserRole() {
  return Cookies.get("userRole")
}
export function setuserRole(userRole) {
  return Cookies.set("userRole", userRole)
}

export function getuserId() {
  return Cookies.get("tearcherId")
}
export function setuserId(tearcherId) {
  return Cookies.set("tearcherId", tearcherId)
}

// 获取
export function getRole() {
  return Cookies.get("role")
}
export function setRole(role) {
  return Cookies.set("role", role)
}
