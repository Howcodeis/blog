
/*
 * @Author: Matbin
 * @Date: 2023-11-21 18:01:13
 * @Description: 音乐工具配置
 */

import { reqMusicList, reqSongDetail, reqSongLyric, reqSongUrl } from "../../api/reqMusic";

/*
 * @Author: Matbin
 * @Date: 2023-11-17 18:35:00
 * @Description: 音乐播放模式以及播放列表模式
 */
export const PLAYMODEL = [
  "LISTLOOP", // 列表循环
  "RANDOM", // 随机播放
  "SINGLELOOP" // 单曲循环
]

export const PLAYTYPE = {
  FAVORITE: "FAVORITE", //收藏歌单
  SEARCH: "SEARCH" // 搜索歌单
}

/*
 * @Author: Matbin
 * @Date: 2023-11-17 18:35:00
 * @Description: 顺序播放状态值
 */
const randomPlay = (index, len) => {
  if (len == 1) {
    return index
  }
  let res = Math.floor(Math.random() * (len + 1))
  if (res == index) {
    randomPlay(index)
  } else {
    return res
  }
}

/*
 * @Author: Matbin
 * @Date: 2023-11-17 18:35:00
 * @Description: 上下首播放状态值
 */
export function getNextSong (len, index, playMode, isPlayNext) {
  let nextIndex = 0
  switch (playMode) {
    case "RANDOM":
      nextIndex = randomPlay(index, len)
      break
    case "LISTLOOP":
      if (isPlayNext) {
        if (index == len - 1) {
          nextIndex = 0
        } else if (index != -1) {
          nextIndex = index + 1
        } else {
          nextIndex = 0
        }
      } else {
        if (index == 0) {
          nextIndex = len - 1
        } else if (index != -1) {
          nextIndex = index - 1
        } else {
          nextIndex = 0
        }
      }
      break

    case "SINGLELOOP":
      nextIndex = index
      break
  }
  return nextIndex
}

/*
 * @Author: Matbin
 * @Date: 2023-11-17 18:35:00
 * @Description: 播放时间和总时间
 */
export function timeFormat (time) {
  let minute = Math.floor(time / 60),
    second = Math.floor(time) - minute * 60
  if (minute <= 9) minute = `0${minute}`
  if (second <= 9) second = `0${second}`
  return minute + ":" + second
}


/*
 * @Author: Matbin
 * @Date: 2023-11-17 18:35:00
 * @Description: 播放进度百分比
 */
export function PercentageOfProgress (currentTime, duration) {
  return Math.floor((currentTime / duration) * 1000) / 10
}

/*
 * @Author: Matbin
 * @Date: 2023-11-17 18:35:00
 * @Description: 播放时间
 */
export function TimeOfProgress (currentTime) {
  return timeFormat(currentTime)
}

/*
 * @Author: Matbin
 * @Date: 2023-11-21 18:01:13
 * @Description: 获取音乐路径
 * @param {number} id 
 * @returns 音乐数据，主要获取音乐路径
 */
export const getSongUrl = async (id) => {
  const res = await reqSongUrl(id)
  if (res.code == 200) {
    return res.data[0]
  }
}

/*
 * @Author: Matbin
 * @Date: 2023-11-21 18:01:13
 * @Description: 处理歌词
 * @param {number} id 
 * @returns 处理过后的歌词
 */
export const getSongLyric = async (id) => {
  const res = await reqSongLyric(id)
  if (res.code == 200) {
    const LyricList = []
    let handlerLrc = res.lrc.lyric.split('\n')
    handlerLrc.forEach(lrc => {
      let words = lrc.split(']'),
        time = words[0].substring(1).split(':'),
        Ftime = +time[0] * 60 + +time[1],
        wordsObj = {
          time: Ftime,
          word: words[1]
        }
      LyricList.push(wordsObj)
    });
    return LyricList
  }
}

/*
 * @Author: Matbin
 * @Date: 2023-11-21 18:01:13
 * @Description: 返回歌曲详情
 * @param {number} id 
 * @returns 返回歌曲详情
 */
export const getSongDetails = async (id) => {
  const res = await reqSongDetail(id)
  if (res.code == 200) {
    return res.songs
  }
}

/*
 * @Author: Matbin
 * @Date: 2023-11-21 18:01:13
 * @Description: 返回歌曲列表
 * @param {object} keyword 
 * @returns 返回歌曲列表
 */
export const getMusicList = async (keyword) => {
  const res = await reqMusicList(keyword)
  if (res.code == 200) {
    return res.result.songs
  }
}