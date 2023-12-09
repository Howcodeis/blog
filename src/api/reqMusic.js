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