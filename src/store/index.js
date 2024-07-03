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
import { ref, watch } from "vue"
import { normalBack } from "../utils/MessageBack"

const audio = new Audio()
const closeBeforeVolume = ref(0)

export const musicStatus = defineStore('music', {
  // readAndWrite
  state: () => ({
    keywords: '', // 搜索
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
    isShowLyricsPanel: false,// 是否展示歌曲界面
    isShowSPLyricsPanel: false,// 是否展示歌词特殊界面
    isTouch: false, // 是否拖动进度条
    currentMusicInfo: {
      name: '',// 当前歌曲名
      id: '', // 当前歌曲id
      url: '', // 音乐链接
      cover: '', // 音乐封面
      lyric: [], // 歌词
      artist: '', //艺人
      album: '' //专辑
    },
    searchSettngs: {
      limit: 30,
      offset: 0,
    }
  }),
  // readOnly
  getters: {
    getKeywords () {
      return this.keywords
    },
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
    getIsShowLyricsPanel () {
      return this.isShowLyricsPanel
    },
    getIsShowSPLyricsPanel () {
      return this.isShowSPLyricsPanel
    },
    getIsTouch () {
      return this.isTouch
    },
    getCurrentMusicInfo () {
      return this.currentMusicInfo
    },
    getSearchSettings () {
      return this.searchSettngs
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
      // 开发阶段需要加上
      if (this.currentMusicInfo.url) audio.src = this.currentMusicInfo.url
      // 开发阶段先注释掉，以免频繁刷新页面导致被墙
      // if (this.currentMusic) this.setMusicInfo(this.currentMusic)
      // 这里由于是开发阶段，所以需要结合上面代码加上audio.src
      // if (this.currentMusic && audio.src) audio.currentTime = this.currentTime

      // 音乐播放时更新对应状态
      audio.ontimeupdate = () => {
        // 更新音量
        audio.volume = this.getVolume
        // 更新播放状态需要配合autoplay使用
        if (!audio.paused) this.isPlay = !audio.paused
        // 如果没有触摸进度条，则更新进度条和播放时间
        if (!this.isTouch) {
          // 计算音频的百分比进度
          this.audioSchedule = PercentageOfProgress(audio.currentTime, audio.duration)
          // 更新当前时间
          this.currentTime = audio.currentTime
        }
        // 更新总时长
        if (this.duration != audio.duration && audio.duration) this.duration = audio.duration
        // 播放结束，处理下一首
        if (audio.ended) this.playNext(true)
        // 处理歌词索引
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
      // 先判断当前播放模式 如果是单曲循环就没必要查下一首或者上一首
      if (this.playMode == "SINGLE_LOOP") {
        this.setMusicInfo(this.currentMusic)
      }
      // 交给音乐工具处理
      else {
        const nextIndex = getNextSong(tempList, this.playMode, data)
        this.setMusicInfo(tempList[nextIndex])
      }
      // 得到的下一首歌曲索引交给播放函数处理
      // if (index == -1 && nextIndex == -1) this.setMusicInfo(this.currentMusic)
    },
    // 获取歌曲信息 准备播放
    async setMusicInfo (music, B = false) {
      if (!music) return
      let res, musicUrl, lyricList
      try {
        musicUrl = await getSongUrl(music.id)
        lyricList = await getSongLyric(music.id)
        res = await getSongDetails(music.id)
      } catch (error) {
        this.isPlay = false
        normalBack('warning', error)
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
    // 播放设置 前提是获取了歌曲主要信息并且本地缓存有音乐部分信息
    setPlay (B = false) {
      // 判断是否需要播放 如果b为true，则为播放状态下刷新页面接着播放
      if (B) {
        audio.currentTime = this.currentTime
        audio.play().catch(() => {
          this.setMusicInfo(this.currentMusic, true)
        })
      } else {
        // 点击歌曲播放或者播放与当前不同歌曲时重置设置
        audio.currentTime = 0
        this.currentTime = 0
        audio.play()
      }
    },
    // 重置搜索设置
    resetSearch () {
      this.searchSettngs = {
        limit: 30,
        offset: 0,
      }
    },
    // 搜索歌曲设置
    async setMusicList (keywords) {
      if (!keywords) return
      //重置搜索设置
      this.resetSearch()
      try {
        const res = await getMusicList(keywords, this.searchSettngs.limit, this.searchSettngs.offset)
        this.keywords = keywords
        this.playList = res
      } catch (error) {
        normalBack('warning', error)
      }
    },
    // 触底加载
    // 应该判断是否触底，而不是直接调用
    async loadMore () {
      this.searchSettngs.offset += 30
      try {
        const res = await getMusicList(this.keywords, this.searchSettngs.limit, this.searchSettngs.offset)
        this.playList = this.playList.concat(res)
      } catch (error) {
        this.resetSearch()
        normalBack('warning', error)
      }
    },
    // 播放控制
    async togglePlay () {
      // 如果为播放状态
      if (this.isPlay) {
        audio.pause()
        this.isPlay = false
      } else {
        // 暂停状态下
        // 判断是否获取歌曲url以及用于判断本地缓存失效
        if (this.currentMusicInfo.url)
          this.setPlay(true)
        // 新用户(数据不存在)
        else {
          normalBack('info', '暂无歌曲')
        }
      }
    },
    // 点击歌词跳转
    skipByLyric (time) {
      audio.currentTime = time
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
      }
    },
    // 返回百分比对应的时间
    percentTime (value) {
      if (audio.duration) return Math.floor((audio.duration * (value / 100)))
      else return Math.floor((this.duration * (value / 100)))
    },
    // 音量控制 关闭
    stepCloseVolume () {
      closeBeforeVolume.value = this.volume
      this.volume = 0
    },
    // 音量控制 打开
    stepOpenVolume () {
      if (closeBeforeVolume.value == 0) this.volume = 0.5
      else this.volume = closeBeforeVolume.value
    },
  },
  // 持久化存储
  persist: {
    storage: localStorage
  }
})