
<script setup>
import { storeToRefs } from 'pinia';
import { musicStatus } from '../../../store';
import gsap from "gsap";
import { gsapTimeline } from '../../../utils/gsapTools'
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { PLAYMODEL } from '../musicTools';

const { currentMusicInfo, currentLyricIndex, isPlay, volume, playMode } = storeToRefs(musicStatus())
// 获取下个歌词出现时间
const nextLyricTime = () => currentMusicInfo.value.lyric[currentLyricIndex?.value + 1]?.time
// 获取当前歌词以及出现时间
const lyric = () => currentMusicInfo.value.lyric[currentLyricIndex?.value]
// 上下歌词时间差 保留小数点后两位
const disTime = () => Math.floor((nextLyricTime() - lyric()?.time) * 100) / 100
//  歌词偏移量
const isShowLyricDetails = ref(false)
const pic = ref(null)
const lyc = ref(null)
const toggleLyricBoardStyle = () => {
  if (!isShowLyricDetails.value) {
    gsap.to(pic.value, {
      duration: 0.5,
      opacity: 0,
      ease: 'power1.out',
      onComplete: () => {
        isShowLyricDetails.value = !isShowLyricDetails.value
        setTimeout(() => {
          lyricMove()
        }, 100)
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
        isShowLyricDetails.value = !isShowLyricDetails.value
        gsap.to(pic.value, {
          duration: 0.5,
          opacity: 1,
          ease: 'power1.out'
        })
      }
    })
  }
}
const lyricBoard = ref(null)
const lyricMove = () => {
  let offsetTop = lyricBoard.value.children[currentLyricIndex.value]?.offsetTop
  if (!offsetTop) return
  let offset = offsetTop - lyricBoard.value.offsetHeight * 0.6
  lyricBoard.value.scrollTo({ top: offset, behavior: 'smooth' })
}
// 监听歌词淡入淡出动画
const lyricItem = ref(null)
const timeline = gsap.timeline()
watch(currentLyricIndex, () => {
  if (!isPlay.value) {
    timeline.pause()
  } else {
    timeline.clear()
    gsapTimeline(timeline, lyricItem.value, disTime())
  }
  lyricMove()
})
watch(isPlay, () => {
  if (!isPlay.value) {
    timeline.pause()
    console.log("pause");
  }
  else {
    timeline.play()
    console.log("play");
  }
})

const container = ref(null)
onMounted(() => {
  gsap.from(container.value.children, {
    duration: 0.5,
    stagger: 0.2,
    autoAlpha: 0,
    scale: 0,
    onComplete: () => {
      console.log("mounted");
    }
  })
})

onUnmounted(() => {
  console.log("onUnmounted");
  timeline.clear()
})
</script>

<template>
  <!-- 背景隔离 -->
  <div class="box bg-slate-900 overflow-hidden">
    <!-- 图片模糊衬底 -->
    <img class="absolute blur-lg brightness-[0.5] scale-150 min-w-full min-h-full"
      :src="currentMusicInfo.cover || '默认图片路劲'">
    <div ref="container" class="box overflow-scroll">
      <!-- 图片和歌词 -->
      <div ref="pic" class="relative w-full h-4/5 min-h-[35rem]" v-show="!isShowLyricDetails">
        <!-- 图片 -->
        <div @click="toggleLyricBoardStyle"
          class="relative border-2 h-[72%] max-md:w-[22rem] max-md:h-[21rem] max-md:top-[6rem] max-md:mb-[14rem] top-8 mb-16 rounded-xl overflow-hidden flex justify-center items-center max-w-[31.25rem] max-h-[31.25rem] m-auto">
          <img class=" min-w-full min-h-full scale-125" :src="currentMusicInfo.cover || '默认图片路劲'">
          <div class="absolute top-[30%] text-center">
            <span class="text-2xl text-slate-200 span">{{ currentMusicInfo.name }}</span><br>
            <span class="text-slate-300 span">{{ currentMusicInfo.artist }}</span>
          </div>
        </div>
        <!-- 歌词 -->
        <div class="relative w-full h-[15%] flex justify-center items-center">
          <div class="absolute w-full h-[60%] text-center">
            <span ref="lyricItem" class="max-md:text-base text-xl text-slate-300 lyric">{{ lyric()?.word }}</span>
          </div>
        </div>
      </div>
      <!-- 歌词轮播 -->
      <div ref="lyc" class=" select-none relative w-full h-4/5 min-h-[35rem] flex items-center flex-col"
        v-show="isShowLyricDetails">
        <div class="relative overflow-scroll w-full h-[20%] md:w-[70%] flex justify-center">
          <div class="absolute bottom-0 w-[80%] h-[60%] text-center">
            <span class="text-xl text-slate-300">{{ currentMusicInfo.name }}</span><br>
            <span class="text-sm text-slate-800">{{ currentMusicInfo.artist }}</span>
          </div>
        </div>
        <ul ref="lyricBoard" class="overflow-y-scroll w-[85%] h-[80%] md:w-[70%] pt-[10rem]"
          @click="toggleLyricBoardStyle">
          <li class="leading-2 my-4 text-center text-slate-400 duration-300 w-full"
            :class="[index == currentLyricIndex ? 'active' : '']" v-for="(lyric, index) in currentMusicInfo.lyric"
            :key="index">
            {{ lyric.word }}</li>
        </ul>
      </div>
      <!-- 进度条 -->
      <div class="relative w-full h-[8px] overflow-hidden flex items-center">
        <el-slider class="absolute" v-model="musicStatus().audioSchedule" size="small" :show-tooltip="false"
          @change="musicStatus().setProgressDone" @input="musicStatus().setProgress" />
      </div>
      <!-- 控件 -->
      <div class="relative bottom-[-3rem] w-full h-[14%] select-none">
        <div class="absolute w-full h-[50%] top-6 flex justify-center items-center text-slate-300">
          <i class="iconfont icon-zuobofang" @click="musicStatus().playNext(false)" title="上一首"> </i>
          <div class="bg-green-900 bg-opacity-50 w-10 h-10 flex justify-center items-center border-2 rounded-full">
            <i class="iconfont icon-tingzhi" @click="musicStatus().togglePlay" v-show="isPlay" title="暂停"></i>
            <i class="iconfont icon-bofang" @click="musicStatus().togglePlay" v-show="!isPlay" title="播放"></i>
          </div>
          <i class="iconfont icon-youbofang" @click="musicStatus().playNext(true)" title="下一首"> </i>
        </div>
        <!-- 音量 -->
        <div class="absolute bottom-0 right-2 max-md:hidden">
          <el-slider class="volume-set w-[6rem] cursor-pointer" :max="1" :step="0.01" :show-tooltip="false"
            v-model="musicStatus().volume" />
        </div>
        <div class="absolute bottom-0 right-[6.2rem] text-slate-300 max-md:right-1" title="音量">
          <i class="iconfont icon-suijibofang" v-show="playMode == PLAYMODEL[1]" @click="playMode = PLAYMODEL[0]"
            title="随机播放"> </i>
          <i class="iconfont icon-danquxunhuan" v-show="playMode == PLAYMODEL[2]" @click="playMode = PLAYMODEL[1]"
            title="单曲循环"> </i>
          <i class="iconfont icon-liebiaoxunhuan" v-show="playMode == PLAYMODEL[0]" @click="playMode = PLAYMODEL[2]"
            title="列表循环"> </i>
          <i class="iconfont icon-yinliang max-md:hidden" v-show="volume != 0" @click="musicStatus().stepCloseVolume"></i>
          <i class="iconfont icon-guanbiyinliang max-md:hidden" v-show="volume == 0"
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
  @apply mx-2 text-2xl hover:text-green-500 duration-500 hover:scale-125 md:mx-4 md:text-3xl
}

.span {
  text-shadow: rgb(62, 58, 58) 4px 3px 4px;
  font-weight: 600;
  font-style: italic;
}

.lyric {
  font-weight: 550;
  font-style: oblique;
  text-shadow: white 2px 0 10px;
}

.volume-set {
  writing-mode: sideways-rl
}

.active {
  color: aliceblue;
  font-size: 1.1rem;
}
</style>