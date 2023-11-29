/*
 * @Author: Matbin
 * @Date: 2023-11-21 13:51:04
 * @Description: 音乐请求配置
 */


import http from "../utils/axiosInterceptors";

/**
   * 搜索歌曲
   * @param {object} keyword 
   * @returns music-list
   */
export function reqMusicList (keyword) {
  return new Promise((resolve, reject) => {
    http.get(`/search?keywords=${keyword}`).then(res => { resolve(res) }).catch(err => reject(err))
  })
}

/**
 * 获取歌曲资源路径
 * @param {number} id 
 * @returns music-url
 */
export function reqSongUrl (id) {
  return new Promise((resolve, reject) => {
    http.get(`/song/url/v1?id=${id}&level=exhigh`).then(res => resolve(res)).catch(err => reject(err))
  })
}

/**
 * 获取歌曲歌词
 * @param {number} id 
 * @returns music-lyric
 */
export function reqSongLyric (id) {
  return new Promise((resolve, reject) => {
    http.get(`/lyric?id=${id}`).then(res => resolve(res)).catch(err => reject(err))
  })

}

/**
 * 获取歌曲详情
 * 主要是获取封面
 * @param {number} id 
 * @returns music-imageUrl
 */
export function reqSongDetail (id) {
  return new Promise((resolve, reject) => {
    http.get(`/song/detail?ids=${id}`).then(res => resolve(res)).catch(err => reject(err))
  })
}