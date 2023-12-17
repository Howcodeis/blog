
<script setup>
import { storeToRefs } from 'pinia';
import { musicStatus } from '../../../../store';
import gsap from "gsap";
import { gsapTimeline } from '../../../../utils/gsapTools'
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { PLAYMODEL } from '../../musicTools';
import lyricPanel from './components/lyricPanel.vue'

const { currentMusicInfo, getCurrentLyricIndex, getIsplay, volume, playMode } = storeToRefs(musicStatus())
// 获取下个歌词出现时间
const nextLyricTime = () => currentMusicInfo.value.lyric[getCurrentLyricIndex?.value + 1]?.time
// 获取当前歌词以及出现时间
const lyric = () => currentMusicInfo.value.lyric[getCurrentLyricIndex?.value]
// 上下歌词时间差 保留小数点后两位
const disTime = () => Math.floor((nextLyricTime() - lyric()?.time) * 100) / 100
// 监听歌词淡入淡出动画
const lyricItem = ref(null)
const timeline = gsap.timeline()
// 监听歌词状态暂停播放gsap动画
watch(getCurrentLyricIndex, () => {
  if (!getIsplay.value) {
    timeline.pause()
  } else {
    timeline.clear()
    gsapTimeline(timeline, lyricItem.value, disTime())
  }
})
// 监听播放状态暂停播放gsap动画
watch(getIsplay, () => {
  if (!getIsplay.value) timeline.pause()
  else timeline.play()
})
// 切换动画
const isShowLyricPanel = ref(false)
const pic = ref(null)
const lyc = ref(null)
const toggleLyricBoardStyle = () => {
  if (!isShowLyricPanel.value) {
    gsap.to(pic.value, {
      duration: 0.5,
      opacity: 0,
      ease: 'power1.out',
      onComplete: () => {
        isShowLyricPanel.value = !isShowLyricPanel.value
        gsap.set(lyc.value, {
          opacity: 0,
        })
        gsap.to(lyc.value, {
          duration: 0.5,
          opacity: 1,
          ease: 'power1.out',
        })
      }
    })
  } else {
    gsap.to(lyc.value, {
      duration: 0.5,
      opacity: 0,
      ease: 'power1.out',
      onComplete: () => {
        isShowLyricPanel.value = !isShowLyricPanel.value
        gsap.set(pic.value, {
          opacity: 0,
        })
        gsap.to(pic.value, {
          duration: 0.5,
          opacity: 1,
          ease: 'power1.out'
        })
      }
    })
  }
}
const container = ref(null)
onMounted(() => {
  gsap.from(container.value.children, {
    duration: 0.5,
    stagger: 0.2,
    autoAlpha: 0,
    scale: 0,
  })
})
onUnmounted(() => {
  timeline.clear()
})
</script>

<template>
  <!-- 背景隔离 -->
  <div class="box bg-slate-900 overflow-hidden min-h-[44rem] max-md:min-h-[40rem] duration-300">
    <!-- 图片模糊衬底 -->
    <div class="absolute w-full h-full overflow-hidden">
      <img class="blur-3xl scale-125 brightness-[0.5] w-full h-full object-cover"
        :src="currentMusicInfo.cover || '默认图片路劲'">
    </div>
    <div ref="container" class="box overflow-scroll flex flex-col">
      <!-- 图片和歌词 -->
      <div ref="pic" class="relative w-full h-[85%] flex-col flex-center" v-show="!isShowLyricPanel">
        <!-- 图片 -->
        <div class="relative pt-6 w-full h-[80%] flex-center">
          <div
            class="w-[80%] max-w-[30rem] max-md:max-h-[24rem] max-h-[30rem] h-auto m-auto select-none duration-300 border-2 border-gray-600 overflow-hidden rounded-xl flex-center"
            @click="toggleLyricBoardStyle">
            <img class="w-full h-auto cursor-pointer" :src="currentMusicInfo.cover || '默认图片路劲'">
          </div>
        </div>
        <!-- 歌词 -->
        <div class="relative w-full h-[20%] flex-center">
          <div class="absolute w-full h-[60%] flex-center">
            <span ref="lyricItem" class="max-md:text-base w-[80%] text-xl text-center text-slate-300 lyric">{{
              lyric()?.word
            }}</span>
          </div>
        </div>
      </div>
      <!-- 歌词轮播 -->
      <div ref="lyc" class="select-none relative w-full h-[85%] flex-center flex-col pb-4" v-show="isShowLyricPanel"
        @click="toggleLyricBoardStyle">
        <lyricPanel :isShowLyricPanel="isShowLyricPanel"></lyricPanel>
      </div>
      <!-- 进度条 -->
      <div class="relative w-full h-[1%] overflow-hidden flex items-center">
        <el-slider class="absolute" v-model="musicStatus().audioSchedule" size="small" :show-tooltip="false"
          @change="musicStatus().setProgressDone" @input="musicStatus().setProgress" />
      </div>
      <!-- 控件 -->
      <div class="relative w-full h-[14%] select-none">
        <div class="absolute w-full h-[50%] top-6 flex-center text-slate-300">
          <i class="iconfont icon-zuobofang btn-controls" @click="musicStatus().playNext(false)" title="上一首"> </i>
          <div class="bg-gray-900 bg-opacity-50 w-10 h-10 flex-center border-2 rounded-full">
            <i class="iconfont icon-tingzhi btn-controls" @click="musicStatus().togglePlay" v-show="getIsplay"
              title="暂停"></i>
            <i class="iconfont icon-bofang btn-controls pl-[5px]" @click="musicStatus().togglePlay" v-show="!getIsplay"
              title="播放"></i>
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
  background: rgb(60, 141, 121);
}

:deep(.el-slider__button) {
  border: none;
  width: 0;
  height: 0;
}

:deep(.el-slider):hover .el-slider__button {
  border: 1px;
  width: .425rem;
  height: .425rem;
}

.iconfont {
  @apply text-2xl hover:text-green-500 duration-500 hover:scale-125 md:text-3xl
}

.btn-controls {
  @apply mx-4 md:mx-8
}

.btn-style {
  @apply mx-2
}

.lyric {
  font-weight: 550;
  font-style: oblique;
  text-shadow: white 2px 0 10px;
}

.volume-set {
  writing-mode: sideways-rl
}

.flex-center {
  @apply flex justify-center items-center
}
</style>