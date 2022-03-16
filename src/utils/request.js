import axios from 'axios'
axios.defaults.baseURL = ' http://www.tangxiaoyang.vip:8888/api/v2/'
axios.interceptors.request.use((config) => {
  const userInfo = JSON.parse(sessionStorage.getItem('userName'))
  config.headers.Authorization = userInfo ? userInfo.token : ''
  return config
})
export default axios
