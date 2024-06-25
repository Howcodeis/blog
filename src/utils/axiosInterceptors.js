/*
 * @Author: Matbin
 * @Date: 2023-11-21 13:51:04
 * @Description: 请求配置
 */
import axios from "axios";
import nProgress from 'nprogress'

const http = axios.create({
  baseURL: '/api/',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// 请求拦截
http.interceptors.request.use(
  config => {
    nProgress.start()
    return config
  },
  error => {
    nProgress.done()
    return error
  }
)
// 响应拦截
http.interceptors.response.use(
  response => {
    if (response.status == 200) {
      nProgress.done()
      return response.data
    }
  },
  error => {
    nProgress.done()
    return error
  }
)

export default http