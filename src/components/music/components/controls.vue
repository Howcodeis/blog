<script setup>
import { musicStatus } from '@/store';
import { storeToRefs } from 'pinia';
import { timeFormat } from '../musicTools';
import { defineComponent, ref, computed } from 'vue';
import { PLAYMODEL } from '../musicTools';
import { isString } from 'lodash';

const { getIsplay, volume, currentMusicInfo, playMode, currentMusic, getCurrentLyricIndex } = storeToRefs(musicStatus())
// 获取当前歌词以及出现时间
const lyric = () => currentMusicInfo.value.lyric[getCurrentLyricIndex?.value]
defineComponent({
  name: 'MusicControl'
})
const isShowVolume = ref(false)
defineProps({
  toggleLyricBoard: Function
})

const smallMusicCover = computed(() => {
  return currentMusicInfo.value.cover || '/src/assets/image/Vadim-Sadovski-space-illustration.jpg'
})
</script>

<template>
  <!-- 歌曲图片信息 -->
  <div class="flex justify-evenly items-center max-md:w-[40%] w-[30%]">
    <!-- 图片 -->
    <div class="relative overflow-hidden left-1 rounded-2xl border-[1px] border-gray-500 w-[4rem] h-[4rem]"
      @click="toggleLyricBoard">
      <img class="object-cover cursor-pointer" :src="smallMusicCover">
    </div>
    <!-- 歌曲歌手 -->
    <div class="relative w-[55%] max-md:left-[8px] left-1 max-md:text-[0.8rem] text-[#ffffff]">
      <div class="text-ellipsis whitespace-nowrap overflow-x-hidden" :title="currentMusicInfo.name">
        <span>{{ currentMusic.name || '暂无歌曲' }}</span>
      </div>
      <div class="text-ellipsis whitespace-nowrap overflow-x-hidden" :title="currentMusicInfo.artist">
        <span v-for="(item, index) in currentMusicInfo.artists" class="cursor-pointer">{{ index === 0 ? item.name : "/"
          + item.name || '暂无歌手' }}</span>
      </div>
    </div>
  </div>
  <!-- 控制栏 -->
  <div class="flex justify-around flex-col w-[60%] min-w-[60%]">
    <!-- 播放顺序 和音量-->
    <div class="flex justify-center">
      <div class="flex items-center relative">
        <i class="iconfont icon-suijibofang" v-show="playMode == PLAYMODEL[1]" @click="playMode = PLAYMODEL[0]"
          title="随机播放"> </i>
        <i class="iconfont icon-danquxunhuan" v-show="playMode == PLAYMODEL[2]" @click="playMode = PLAYMODEL[1]"
          title="单曲循环"> </i>
        <i class="iconfont icon-liebiaoxunhuan" v-show="playMode == PLAYMODEL[0]" @click="playMode = PLAYMODEL[2]"
          title="列表循环"> </i>
        <i class="iconfont icon-zuobofang" @click="musicStatus().playNext()" @touchend="musicStatus().playNext()"
          title="上一首"> </i>
        <i class="iconfont icon-tingzhi" @click="musicStatus().togglePlay()" @touchend="musicStatus().togglePlay()"
          v-show="getIsplay" title="暂停"></i>
        <i class="iconfont icon-bofang" @click="musicStatus().togglePlay()" @touchend="musicStatus().togglePlay()"
          v-show="!getIsplay" title="播放"></i>
        <i class="iconfont icon-youbofang" @click="musicStatus().playNext(true)"
          @touchend="musicStatus().playNext(true)" title="下一首"> </i>
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
    <div class="flex justify-center">
      <!-- 进度条 -->
      <div class="w-full flex justify-center items-center">
        <div class="max-md:text-xs text-white flex-1 text-right"><span>{{ timeFormat(currentMusicInfo.currentTime)
            }}</span></div>
        <el-slider class="mx-2 flex-[5]" v-model="currentMusicInfo.audioSchedule" size="small" :show-tooltip="false"
          @change="musicStatus().setProgressDone" @input="musicStatus().setProgress" />
        <div class="max-md:text-xs text-white flex-1 "><span>{{ isNaN(currentMusicInfo.duration) ?
          "00:00" : timeFormat(currentMusicInfo.duration)
            }}</span></div>
      </div>
    </div>
    <!-- 迷你歌词 -->
    <!-- <div class="flex-[2] max-md:flex-[2] flex justify-center items-start">
      <div ref="maxWidth"
        class="h-full leading-4 w-full text-center max-md:leading-5 max-md:h-full text-ellipsis whitespace-nowrap overflow-hidden">
        <span class="word text-[0.8rem] text-white max-md:text-[0.6rem]">
          {{ lyric()?.word ? lyric()?.word : '\xa0' }}
        </span>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
:deep(.el-slider__bar) {
  background: #0099FF;
}

:deep(.el-slider__button) {
  width: 6px;
  height: 6px;
  border: 0;
  background: #6699FF;
}

:deep(.el-slider):hover .el-slider__button {
  background: #0099FF;
}

.iconfont {
  @apply text-xl text-[#ffffff] h-6 duration-300 ease-in-out cursor-pointer mx-[0.4rem]
}

/* .iconfont:hover, */
.iconfont:active {
  @apply scale-[1.1]
}
</style>