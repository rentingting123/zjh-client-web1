import { loginByDDCode,getInfo } from '@/api/dingtalk'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    userInfo: '',
    name:''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
   
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_LOGIN_USER:(state,user)=>{
      state.userInfo = user
    },
  },

  actions: {
    // ddcode登录
    LoginByCode({ commit }, userInfo) {
      const {code,corpId,agentId,serialNumber} = userInfo
      console.log(userInfo)
      return new Promise((resolve, reject) => {
        loginByDDCode(code,agentId,corpId,serialNumber).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    //  退出系统
     LogOut({ commit, state }) {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
    },
    // 登录成功以后获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          console.log(res.data);
          const user = res.user
          commit('SET_LOGIN_USER',res.data)
          commit('SET_NAME', res.data.userName)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default user
