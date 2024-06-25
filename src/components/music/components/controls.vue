<script setup>
import { musicStatus } from '@/store';
import { storeToRefs } from 'pinia';
import { timeFormat } from '../musicTools';
import { defineComponent, ref } from 'vue';
import { PLAYMODEL } from '../musicTools';
import { isString } from 'lodash';

const { getIsplay, volume, currentMusicInfo, playMode, currentMusic, currentLyricIndex, currentTime, duration } = storeToRefs(musicStatus())
// 获取当前歌词以及出现时间
const lyric = () => currentMusicInfo.value.lyric[currentLyricIndex?.value]
defineComponent({
  name: 'MusicControl'
})
const isShowVolume = ref(false)
defineProps({
  toggleLyricBoard: Function
})
</script>

<template>
  <!-- 歌曲图片信息 -->
  <div class="flex justify-evenly items-center min-w-[12rem]">
    <!-- 图片 -->
    <div
      class="relative left-1 rounded-full overflow-hidden flex h-[3.6rem] w-[3.6rem] max-sm:h-[3.5rem] max-sm:w-[3.5rem]"
      @click="toggleLyricBoard">
      <img class=" min-w-full min-h-full cursor-pointer" :src="currentMusicInfo.cover || '默认图片路劲'">
    </div>
    <!-- 歌手 -->
    <div class="relative left-3 overflow-hidden max-md:text-[0.8rem]">
      <div class="text-ellipsis whitespace-nowrap overflow-x-hidden" :title="currentMusicInfo.name">
        <span>{{ currentMusic.name || '暂无歌曲' }}</span>
      </div>
      <div class="text-ellipsis whitespace-nowrap overflow-x-hidden" :title="currentMusicInfo.artist">
        <span>{{ currentMusicInfo.artist || '暂无歌手' }}</span>
      </div>
    </div>
  </div>
  <!-- 控制栏 -->
  <div class="flex justify-center flex-col w-full">
    <!-- 播放顺序 和音量-->
    <div class="flex flex-[1] justify-center max-md:flex-[3]">
      <div class="flex items-center relative">
        <i class="iconfont icon-suijibofang" v-show="playMode == PLAYMODEL[1]" @click="playMode = PLAYMODEL[0]"
          title="随机播放"> </i>
        <i class="iconfont icon-danquxunhuan" v-show="playMode == PLAYMODEL[2]" @click="playMode = PLAYMODEL[1]"
          title="单曲循环"> </i>
        <i class="iconfont icon-liebiaoxunhuan" v-show="playMode == PLAYMODEL[0]" @click="playMode = PLAYMODEL[2]"
          title="列表循环"> </i>
        <i class="iconfont icon-zuobofang" @click="musicStatus().playNext(false)"
          @touchend="musicStatus().playNext(false)" title="上一首"> </i>
        <i class="iconfont icon-tingzhi" @click="musicStatus().togglePlay" @touchend="musicStatus().playNext(false)"
          v-show="getIsplay" title="暂停"></i>
        <i class="iconfont icon-bofang" @click="musicStatus().togglePlay" @touchend="musicStatus().playNext(false)"
          v-show="!getIsplay" title="播放"></i>
        <i class="iconfont icon-youbofang" @click="musicStatus().playNext(true)"
          @touchend="musicStatus().playNext(false)" title="下一首"> </i>
      </div>

      <!-- 音量 -->
      <div class="flex items-center relative max-md:hidden" @mouseenter="isShowVolume = true"
        @mouseleave="isShowVolume = false" title="音量">
        <i class="iconfont icon-yinliang" v-show="volume != 0" @click="musicStatus().stepCloseVolume"></i>
        <i class="iconfont icon-guanbiyinliang" v-show="volume == 0" @click="musicStatus().stepOpenVolume"></i>
        <div class="left-8 -top-0.5 flex items-center absolute max-lg:w-[4rem] w-[6rem]">
          <el-slider v-show="isShowVolume" :max="1" :step="0.01" :show-tooltip="false" v-model="volume"></el-slider>
        </div>
      </div>
    </div>
    <!-- 进度条 盒子-->
    <div class="flex justify-center items-center flex-1">
      <!-- 进度条 -->
      <div class="w-full flex justify-center items-center">
        <div class="max-md:text-xs  flex-1 text-right"><span>{{ timeFormat(currentTime) }}</span></div>
        <el-slider class="mx-2 flex-[5]" v-model="musicStatus().audioSchedule" size="small" :show-tooltip="false"
          @change="musicStatus().setProgressDone" @input="musicStatus().setProgress" />
        <div class="max-md:text-xs flex-1 "><span>{{ isString(timeFormat(duration)) ? timeFormat(duration) :
          "00:00" }}</span></div>
      </div>
    </div>
    <!-- 迷你歌词 -->
    <div class="flex-[2] max-md:flex-[2] flex justify-center items-start">
      <div ref="maxWidth"
        class="h-full leading-4 w-full text-center max-md:leading-5 max-md:h-full text-ellipsis whitespace-nowrap overflow-hidden">
        <span class="word text-[0.8rem]  max-md:text-[0.6rem]">
          {{ lyric()?.word ? lyric()?.word : '\xa0' }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-slider__bar) {
  background: rgb(92, 230, 92);
}

:deep(.el-slider__button) {
  width: 6px;
  height: 6px;
  border: 0;
  background: rgb(38, 62, 0);
}

:deep(.el-slider):hover .el-slider__button {
  background: green;
}

.iconfont {
  @apply text-xl h-6 duration-300 ease-in-out cursor-pointer mx-[0.4rem]
}

/* .iconfont:hover, */
.iconfont:active {
  @apply scale-[1.1]
}

/* @media not all and (min-width: 768px) {
  .iconfont {
    @apply text-base h-4 flex items-center justify-center
  }
} */
</style>