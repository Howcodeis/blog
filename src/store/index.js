/*
 * @Author: Matbin
 * @Date: 2023-11-21 15:32:08
 * @Description: pinia 配置 
 */
import { defineStore } from "pinia"
import {
  getMusicList,
  getSongDetails,
  getSongLyric,
  getSongUrl,
  PLAYMODEL,
  PLAYTYPE,
  getNextSong,
  PercentageOfProgress,
} from "../components/music/musicTools"
import { ref } from "vue"

const audio = new Audio()
const closeBeforeVolume = ref(0)

export const musicStatus = defineStore('music', {

  // readAndWrite
  state: () => ({
    playType: PLAYTYPE.SEARCH,// 播放列表
    playMode: PLAYMODEL[0],// 播放顺序
    currentMusic: '', // 当前歌曲
    currentLyricIndex: '',// 当前歌词所在索引
    playList: [],// 音乐列表
    favorite: [],// 收藏歌单
    audioSchedule: 0, // 播放进度百分比
    currentTime: 0, // 当前播放时间
    duration: 0, // 歌曲总时长
    volume: 0.5, // 初始播放音量
    isPlay: false, // 是否播放
    isShowLyricBoard: false,
    isTouch: false, // 是否拖动进度条
    currentMusicInfo: {
      name: '',// 当前歌曲名
      id: '', // 当前歌曲id
      url: '', // 音乐链接
      cover: '', // 音乐封面
      lyric: [], // 歌词
      artist: '', //艺人
      album: '' //专辑
    }
  }),

  // readOnly
  getters: {
    getPlayType () {
      return this.playType
    },
    getPlayMode () {
      return this.playMode
    },
    getCurrentMusic () {
      return this.currentMusic
    },
    getCurrentLyricIndex () {
      return this.currentLyricIndex
    },
    getPlayList () {
      return this.playList
    },
    getFavorite () {
      return this.favorite
    },
    getAudioSchedule () {
      return this.audioSchedule
    },
    getCurrentTime () {
      return this.currentTime
    },
    getDuration () {
      return this.duration
    },
    getVolume () {
      return this.volume
    },
    getIsplay () {
      return this.isPlay
    },
    getIsShowLyricBoard () {
      return this.isShowLyricBoard
    },
    getCurrentMusicInfo () {
      return this.currentMusicInfo
    },

  },

  // hooks
  actions: {
    // 初始化音乐
    initAudio () {
      audio.preload = true
      audio.loop = false
      // audio.autoplay = true
      audio.volume = this.volume
      this.isPlay = false

      if (this.currentMusic) this.duration = this.currentMusic.duration / 1000
      if (this.currentMusicInfo.url) audio.src = this.currentMusicInfo.url
      // if (this.currentMusic) this.setMusicInfo(this.currentMusic, true)

      if (this.currentMusic && audio.src) audio.currentTime = this.currentTime

      // 音乐播放时更新对应状态
      audio.ontimeupdate = () => {
        if (!audio.paused) this.isPlay = !audio.paused
        if (!this.isTouch) {
          this.audioSchedule = PercentageOfProgress(audio.currentTime, audio.duration)
          this.currentTime = audio.currentTime
        }
        if (this.duration != audio.duration && audio.duration) this.duration = audio.duration
        if (audio.ended) this.playNext(true)
        audio.volume = this.getVolume
        // 查找播放歌词
        let index = this.currentMusicInfo.lyric.findIndex(lrc => lrc.time >= audio.currentTime)
        this.currentLyricIndex = index - 1 < -1 ? this.currentMusicInfo.lyric.length - 2 : index - 1
      }
    },
    // 上下首播放设置
    playNext (data) {
      let tempList = this.playList
      switch (this.playType) {
        case "SEARCH":
          tempList = this.playList
          break;
        case "FAVORITE":
          tempList = this.favorite
          break;
      }
      let index = tempList.findIndex(item => item.id == this.currentMusicInfo.id)
      let len = tempList.length
      // 交给音乐工具处理
      const nextIndex = getNextSong(len, index, this.playMode, data)
      // 得到的下一首歌曲索引交给播放函数处理
      this.setMusicInfo(tempList[nextIndex])
    },
    // 获取歌曲信息 准备播放
    async setMusicInfo (music, B = false) {
      if (!music) return
      let res = null
      let musicUrl = null
      let lyricList = null
      try {
        res = await getSongDetails(music.id)
        musicUrl = await getSongUrl(music.id)
        lyricList = await getSongLyric(music.id)
      } catch (error) {
        this.isPlay = false
        console.log(error);
        return
      }
      this.currentMusic = music
      this.currentMusicInfo = {
        name: this.currentMusic.name,
        id: this.currentMusic.id,
        url: musicUrl.url,
        cover: res[0].al.picUrl,
        lyric: lyricList,
        artist: this.currentMusic.artists[0].name,
        album: this.currentMusic.album.name
      }
      audio.src = musicUrl.url
      this.setPlay(B)
    },

    // 搜索歌曲设置
    async setMusicList (value) {
      if (!value) { console.log('erro'); return }
      const res = await getMusicList(value)
      this.playList = res
    },
    // 播放设置
    setPlay (B = false) {
      if (B) {
        audio.currentTime = this.currentTime
      } else {
        audio.currentTime = 0
        this.currentTime = 0
      }
      if (B) {
        if (this.isPlay) {
          audio.play()
            .then(() => { this.isPlay = true })
            .catch(() => { this.isPlay = false })
        } else {
          audio.pause()
        }
      } else {
        audio.play()
          .then(() => { this.isPlay = true })
          .catch(() => { this.isPlay = false })
      }
    },
    // 播放控制
    togglePlay () {
      if (this.isPlay) {
        audio.pause()
        this.isPlay = false
      } else {
        audio.play().then(() => {
          this.isPlay = true
        })
      }
    },
    // 点击歌词跳转
    skipByLyric (lyric) {
      audio.currentTime = lyric.time
      this.currentTime = audio.currentTime
    },

    // 进度条拖动
    setProgress () {
      if (this.currentMusic) {
        this.isTouch = true
        this.currentTime = this.percentTime(this.audioSchedule)
      } else {
        this.currentTime = 0
      }
    },

    // 拖动进度条完毕
    setProgressDone () {
      if (this.currentMusic) {
        audio.currentTime = this.currentTime
        this.isTouch = false
        if (this.isPlay) audio.play()
      }
    },
    // 返回百分比对应的时间
    percentTime (value) {
      if (audio.duration) return Math.floor((audio.duration * (value / 100)))
      else return Math.floor((this.duration * (value / 100)))
    },


    stepCloseVolume () {
      closeBeforeVolume.value = this.volume
      this.volume = 0
    },

    stepOpenVolume () {
      if (closeBeforeVolume.value == 0) this.volume = 0.5
      else this.volume = closeBeforeVolume.value
    },
  },

  persist: {
    storage: localStorage
  }
})