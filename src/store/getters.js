const getters = {
  token: state => state.user.token,
  user: state=>state.user.userInfo,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
}
export default getters
