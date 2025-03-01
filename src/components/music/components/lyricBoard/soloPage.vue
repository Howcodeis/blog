<script setup>
import { storeToRefs } from 'pinia';
import { musicStatus } from '@/store';
import gsap from "gsap";
import { lyricsTimeline, animateToHidden, animateToVisible } from '@/utils/gsapTools'
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { PLAYMODEL, getRandomComment } from '../../musicTools';
import lyricPanel from './components/lyricPanel.vue'
import { normalBack } from '../../../../utils/MessageBack';

// 将store值响应化
const { currentMusicInfo, getCurrentLyricIndex, getIsplay, getCurrentTime, volume, playMode, isShowLyricsPanel } = storeToRefs(musicStatus())
// 获取下个歌词出现时间
const nextLyricTime = () => currentMusicInfo.value.lyric[getCurrentLyricIndex?.value + 1]?.time
// 获取当前歌词
const lyric = () => currentMusicInfo.value.lyric[getCurrentLyricIndex?.value]

// 上下歌词时间差 保留小数点后两位
const disTime = () => Math.floor((nextLyricTime() - Math.floor(getCurrentTime.value)) * 10) / 10

// 监听歌词淡入淡出动画
const lyricItem = ref(null)
const lyricAnimation = gsap.timeline()
// 监听歌词状态暂停播放gsap动画
watch(getCurrentLyricIndex, () => {
  // console.log(disTime());
  if (!getIsplay.value) {
    lyricAnimation.pause()
  }
  else {
    lyricAnimation.clear()
    lyricsTimeline(lyricAnimation, lyricItem.value, disTime())
  }
})
// const commentItem = ref(null)
// let commentIndex = ref(getRandomComment()),
//   timer

// 监听播放状态暂停播放gsap动画
watch(getIsplay, () => {
  if (getIsplay.value) {
    lyricAnimation.play()
    // timer = setInterval(() => {
    //   commentIndex = ref(getRandomComment())
    // }, 15000)
  }
  else {
    lyricAnimation.pause()
    // clearInterval(timer)
  }
}, { immediate: true })

// watch(commentIndex, (newValue, oldValue) => {
//   console.log("111", newValue, oldValue);

// }, { immediate: true })

// 切换动画
const PicAndLyrics = ref(null)
const lyc = ref(null)
const toggleLyricBoardStyle = () => {
  // 检查边界条件
  if (!PicAndLyrics.value || !lyc.value) {
    console.error("Toggle Lyric Board: Essential values are undefined.");
    return normalBack('warn', "歌词面板切换失败,请检查资源获取是否正常!");
  }
  // 使用闭包来避免潜在的竞态条件
  // (function () {
  const shouldShow = !isShowLyricsPanel.value;
  if (shouldShow) {
    animateToHidden(PicAndLyrics.value, 1.2, () => {
      isShowLyricsPanel.value = shouldShow;
      animateToVisible(lyc.value, 0.5)
    })
  } else {
    animateToHidden(lyc.value, 0.5, () => {
      isShowLyricsPanel.value = shouldShow;
      animateToVisible(PicAndLyrics.value, 1.2)
    })
  }
  // })()
}
const container = ref(null)
onMounted(() => {
  gsap.from(container.value.children, {
    duration: 0.75,
    stagger: 0.25,
    autoAlpha: 0,
    y: 30,
  })
})
onUnmounted(() => {
  lyricAnimation.clear()
})
</script>

<template>
  <!-- 背景隔离 -->
  <div class="box overflow-hidden bg-transparent">
    <!-- 图片模糊衬底 -->
    <div class="absolute w-full h-full overflow-hidden">
    </div>
    <div ref="container" class="box overflow-scroll flex flex-col">
      <!-- 歌词特殊界面 -->
      <div ref="PicAndLyrics" class="relative w-full h-[85%] max-md:flex-col flex-row flex-center"
        v-show="!isShowLyricsPanel">
        <!-- 图片 -->
        <div class="pt-6 w-full h-[80%] flex-center">
          <div @click="toggleLyricBoardStyle"
            class="w-[65%] max-w-[22rem] overflow-hidden select-none duration-300 border-2 border-gray-600 rounded-[25px]">
            <img class="cursor-pointer object-cover" :src="currentMusicInfo.cover || '默认图片路劲'">
          </div>
        </div>
        <!-- 歌手以及歌词 -->
        <div class="w-full h-[60%] flex justify-around flex-col">
          <!-- 歌手 -->
          <div class="w-full h-[30%] flex-center">
            <div class="w-full h-[60%] text-center">
              <span class=" text-slate-300 text-xl block">{{ currentMusicInfo.name || '暂无歌曲' }}</span>
              <span class="text-slate-300 text-sm" v-for="(item, index) in currentMusicInfo.artists">{{ index === 0 ?
                item.name :
                "/" + item.name || '暂无歌手'
                }}</span>
            </div>
          </div>
          <!-- 歌词 -->
          <div class="w-full h-[40%] flex-center">
            <div class="w-full h-[80%] flex-center">
              <span ref="lyricItem"
                class="text-center max-md:text-base w-full bg-white text-transparent bg-clip-text text-xl select-none lyric">{{
                  lyric()?.word }}
              </span>
            </div>
          </div>
          <!-- 评论 -->
          <!-- <div class=" w-full h-[30%] relative bottom-4 flex items-center justify-center overflow-hidden">
            <div class="w-full h-[100%]">
              <span ref="commentItem" class="text-white text-[0.8rem] text-center block leading-6">
                {{ currentMusicInfo.comments[commentIndex]?.content }}
                <span class="block">- {{ currentMusicInfo.comments[commentIndex]?.user.nickname }} -</span></span>
            </div>
          </div> -->
        </div>

      </div>
      <!-- 歌词轮播 -->
      <div ref="lyc" class="select-none relative w-full h-[85%] flex-center flex-col pb-4" v-show="isShowLyricsPanel"
        @click="toggleLyricBoardStyle">
        <lyricPanel :isShowLyricsPanel="isShowLyricsPanel"></lyricPanel>
      </div>
      <!-- 进度条 -->
      <div id="audioSchedule" class="relative w-full h-[1%] overflow-visible flex items-center">
        <el-slider class="absolute" v-model="currentMusicInfo.audioSchedule" size="small" :show-tooltip="false"
          @change="musicStatus().setProgressDone" @input="musicStatus().setProgress" />
      </div>
      <!-- 控件 -->
      <div class="relative w-full h-[14%] select-none">
        <div class="absolute w-full h-[50%] top-6 flex-center text-slate-300">
          <i class="iconfont icon-zuobofang btn-controls" @click="musicStatus().playNext()" title="上一首"> </i>
          <div class="bg-gray-900 bg-opacity-50 w-10 h-10 flex-center border-2 rounded-full">
            <i class="iconfont icon-tingzhi btn-controls" @click="musicStatus().togglePlay()" v-show="getIsplay"
              title="暂停"></i>
            <i class="iconfont icon-bofang btn-controls pl-[5px]" @click="musicStatus().togglePlay()"
              v-show="!getIsplay" title="播放"></i>
          </div>
          <i class="iconfont icon-youbofang btn-controls" @click="musicStatus().playNext(true)" title="下一首"> </i>
        </div>
        <!-- 音量条 -->
        <div class="absolute bottom-[.1875rem] right-2 max-md:hidden">
          <el-slider class="volume-set w-[6rem] cursor-pointer" :max="1" :step="0.01" :show-tooltip="false"
            v-model="musicStatus().volume" />
        </div>
        <div class="absolute bottom-0 right-[6.2rem] text-slate-300 max-md:right-1" title="音量">
          <i class="iconfont icon-suijibofang btn-style" v-show="playMode == PLAYMODEL[1]"
            @click="playMode = PLAYMODEL[0]" title="随机播放"> </i>
          <i class="iconfont icon-danquxunhuan btn-style" v-show="playMode == PLAYMODEL[2]"
            @click="playMode = PLAYMODEL[1]" title="单曲循环"> </i>
          <i class="iconfont icon-liebiaoxunhuan btn-style" v-show="playMode == PLAYMODEL[0]"
            @click="playMode = PLAYMODEL[2]" title="列表循环"> </i>
          <i class="iconfont icon-yinliang max-md:hidden btn-style" v-show="volume != 0"
            @click="musicStatus().stepCloseVolume"></i>
          <i class="iconfont icon-guanbiyinliang max-md:hidden btn-style" v-show="volume == 0"
            @click="musicStatus().stepOpenVolume"></i>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.box {
  @apply absolute w-full h-full
}

.box::-webkit-scrollbar {
  display: none;
}

:deep(.el-slider__bar) {
  background: #6699FF;
}

:deep(#audioSchedule .el-slider__runway) {
  background: transparent;
}

:deep(.el-progress--line) {
  width: 100%;
}

:deep(.el-slider__button) {
  width: 6px;
  height: 6px;
  border: 0px;
  background: #0099FF;
}

:deep(.el-slider):hover .el-slider__button {
  width: 10px;
  height: 10px;
  background: #0099FF;
}

.iconfont {
  @apply text-2xl duration-500 md:text-3xl
}

.btn-controls {
  @apply mx-4 md:mx-8
}

.btn-style {
  @apply mx-2
}

.lyric {
  font-weight: 550;
}

.volume-set {
  writing-mode: sideways-rl
}

.flex-center {
  @apply flex justify-center items-center
}
</style>