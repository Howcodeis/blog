<script setup>
import { musicStatus } from '../../../store';
import { storeToRefs } from 'pinia';
import { timeFormat } from '../musicTools';
import { defineComponent, ref } from 'vue';
import { PLAYMODEL } from '../musicTools';
import { isString } from 'lodash';

const { getIsplay, isShowLyricBoard, volume, currentMusicInfo, playMode, currentMusic, currentLyricIndex, currentTime, duration } = storeToRefs(musicStatus())
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
  <div class="relative flex flex-[2] max-md:flex-[1] max-md:min-w-[12rem]">
    <!-- 图片 -->
    <div class="relative h-full min-w-[6.5rem] max-w-[6.5rem]" @click="toggleLyricBoard">
      <img class="rounded min-w-full min-h-full cursor-pointer" :src="currentMusicInfo.cover || '默认图片路劲'">
    </div>
    <!-- 歌手 -->
    <div class="relative overflow-hidden pt-2 pl-5 max-md:text-[0.8rem] duration-300 max-md:pl-1">
      <div class="name-space text-ellipsis whitespace-nowrap overflow-x-hidden" :title="currentMusicInfo.name">
        <span>{{ currentMusic.name || '暂无歌曲' }}</span>
      </div>
      <div class="artist-space text-ellipsis whitespace-nowrap overflow-x-hidden" :title="currentMusicInfo.artist">
        <span>{{ currentMusicInfo.artist || '暂无歌手' }}</span>
      </div>
    </div>
  </div>
  <!-- 控制栏 -->
  <div class="w-3/5 flex justify-center flex-col flex-[3]">
    <!-- 播放顺序 和音量-->
    <div class="flex flex-[2] justify-center max-md:flex-[3]">
      <div class="flex items-center relative">
        <i class="iconfont icon-suijibofang" v-show="playMode == PLAYMODEL[1]" @click="playMode = PLAYMODEL[0]"
          title="随机播放"> </i>
        <i class="iconfont icon-danquxunhuan" v-show="playMode == PLAYMODEL[2]" @click="playMode = PLAYMODEL[1]"
          title="单曲循环"> </i>
        <i class="iconfont icon-liebiaoxunhuan" v-show="playMode == PLAYMODEL[0]" @click="playMode = PLAYMODEL[2]"
          title="列表循环"> </i>
        <i class="iconfont icon-zuobofang" @click="musicStatus().playNext(false)" title="上一首"> </i>
        <i class="iconfont icon-tingzhi" @click="musicStatus().togglePlay" v-show="getIsplay" title="暂停"></i>
        <i class="iconfont icon-bofang" @click="musicStatus().togglePlay" v-show="!getIsplay" title="播放"></i>
        <i class="iconfont icon-youbofang" @click="musicStatus().playNext(true)" title="下一首"> </i>
      </div>

      <!-- 音量 -->
      <div class="flex items-center relative max-md:hidden" @mouseenter="isShowVolume = true"
        @mouseleave="isShowVolume = false" title="音量">
        <i class="iconfont icon-yinliang" v-show="volume != 0" @click="musicStatus().stepCloseVolume"></i>
        <i class="iconfont icon-guanbiyinliang" v-show="volume == 0" @click="musicStatus().stepOpenVolume"></i>
        <div class="left-9 absolute w-[6rem]">
          <el-slider v-show="isShowVolume" :max="1" :step="0.01" :show-tooltip="false" v-model="volume"></el-slider>
        </div>
      </div>
    </div>
    <!-- 进度条 盒子-->
    <div class="flex justify-center items-center flex-1 max-md:flex-[1]">
      <!-- 进度条 -->
      <div class="w-full flex justify-center items-center">
        <div class="max-md:text-xs duration-300 flex-1 text-right"><span>{{ timeFormat(currentTime) }}</span></div>
        <el-slider class="mx-2 flex-[5]" v-model="musicStatus().audioSchedule" size="small" :show-tooltip="false"
          @change="musicStatus().setProgressDone" @input="musicStatus().setProgress" />
        <div class="max-md:text-xs flex-1 duration-300"><span>{{ isString(timeFormat(duration)) ? timeFormat(duration) :
          "00:00" }}</span></div>
      </div>
    </div>
    <!-- 迷你歌词 -->
    <div class="flex-[2] max-md:flex-[2] flex justify-center items-start">
      <div ref="maxWidth"
        class="h-full leading-4 w-full text-center max-md:leading-5 max-md:h-full text-ellipsis whitespace-nowrap overflow-hidden">
        <span class="word text-[0.8rem] duration-300 max-md:text-[0.6rem]">
          {{ lyric()?.word ? lyric()?.word : '\xa0' }}
        </span>
      </div>
    </div>
  </div>
  <div class="w-1/5 flex-[2] max-lg:hidden max-lg:flex-none">
  </div>
</template>

<style scoped>
:deep(.el-slider__bar) {
  background: linear-gradient(to right, rgb(65, 61, 61), rgb(0, 170, 255));
}

:deep(.el-slider__button) {
  width: 1px;
  height: 6px;
}

:deep(.el-slider):hover .el-slider__button {
  border: 1px;
  width: .45rem;
  height: .45rem;
}

.iconfont {
  @apply text-2xl h-10 duration-300 ease-in-out cursor-pointer mx-[0.4rem] pt-[4px] hover:text-blue-600
}

.iconfont:hover {
  @apply scale-[1.1]
}

@media not all and (min-width: 768px) {
  .iconfont {
    @apply text-base h-4 flex items-center justify-center
  }
}
</style>