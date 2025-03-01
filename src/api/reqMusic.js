/*
 * @Author: Matbin
 * @Date: 2023-11-21 13:51:04
 * @Description: 音乐请求配置
 */


import http from "../utils/axiosInterceptors";

/**
   * 搜索歌曲
   * @param {string} keyword 
   * @returns music-list
   */
export const reqMusicList = async (keywords, limit, offset) => {
  const url = `/search?keywords=${keywords}&limit=${limit}&offset=${offset}`;
  return await http.get(url)
}

/**
 * 获取歌曲资源路径
 * @param {number} id 
 * @returns music-url
 */
export const reqSongUrl = async id => {
  const url = `/song/url/v1?id=${id}&level=exhigh`;
  return await http.get(url);
};

/**
 * 获取歌曲歌词
 * @param {number} id 
 * @returns music-lyric
 */
export const reqSongLyric = async id => {
  const url = `/lyric?id=${id}`;
  return await http.get(url)

}

/**
 * 获取歌曲详情
 * 主要是获取封面
 * @param {number} id 
 * @returns music-imageUrl
 */
export const reqSongDetail = async id => {
  const url = `/song/detail?ids=${id}`;
  return await http.get(url)
}

/**
 * 异步请求歌曲评论数据
 * 
 * 该函数通过HTTP GET请求获取指定歌曲ID的评论数据。
 * 使用者需要提供歌曲的ID，函数将拼接请求URL并发送请求。
 * 
 * @param {number} id - 歌曲的ID，用于构建请求URL，识别特定歌曲的评论。
 * @returns {Promise} 返回一个Promise对象，解析后的结果为HTTP请求的响应数据。
 */
export const reqSongComment = async id => {
  // 构建请求URL，包含歌曲ID
  const url = `/comment/music?id=${id}`;
  // 发送GET请求获取歌曲评论数据
  return await http.get(url)
}