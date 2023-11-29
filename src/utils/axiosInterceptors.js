/*
 * @Author: Matbin
 * @Date: 2023-11-21 13:51:04
 * @Description: 请求配置
 */
import axios from "axios";
import nProgress from 'nprogress'
import { normalBack } from "./MessageBack";

const http = axios.create({
  baseURL: '/api/',
  timeout: 10000,
  withCredentials: true,
})


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

http.interceptors.response.use(
  response => {
    if (response.status == 200) {
      nProgress.done()
      return response.data
    }
  },
  error => {
    nProgress.done()
    normalBack('warning', "网络异常")
    return Promise.reject(error)
  }
)

export default http