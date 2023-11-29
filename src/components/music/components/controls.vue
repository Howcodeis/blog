<script setup>
import { musicStatus } from '../../../store';
import { storeToRefs } from 'pinia';
import { timeFormat } from '../musicTools';
import { defineComponent, ref } from 'vue';
import { PLAYMODEL } from '../musicTools';
import { isString } from 'lodash';
const { getIsplay, isShowLyricBoard, volume, currentMusicInfo, playMode, currentMusic, currentTime, duration } = storeToRefs(musicStatus())

defineComponent({
  name: 'MusicControl'
})

const isShowVolume = ref(false)

const showLyricBoard = () => {
  isShowLyricBoard.value = !isShowLyricBoard.value
}
</script>

<template>
  <!-- 控制栏 -->
  <div class="song-img relative flex w-48 flex-[2]">
    <div class="img-set relative" @click="showLyricBoard">
      <img class="rounded max-w-full max-h-full min-w-[5.5rem]" :src="currentMusicInfo.cover || '默认图片路劲'">
      <div class="up-img absolute left-0 top-0 w-full h-full flex justify-center items-center scale-0">
        <i class="iconfont icon-xiangshangjiantou" v-show="!isShowLyricBoard"></i>
        <i class="iconfont icon-xiangxiajiantou" v-show="isShowLyricBoard"></i>
      </div>
    </div>
    <div class="song-name overflow-hidden mt-2 pl-5 max-md:text-[0.8rem] max-md:pl-1">
      <div class="name-space text-ellipsis whitespace-nowrap overflow-x-hidden" :title="currentMusicInfo.name">
        <span>{{ currentMusic.name || '暂无歌曲' }}</span>
      </div>
      <div class="artist-space text-ellipsis whitespace-nowrap overflow-x-hidden" :title="currentMusicInfo.artist">
        <span>{{ currentMusicInfo.artist || '暂无歌手' }}</span>
      </div>
    </div>
  </div>
  <div class="progress-control w-3/5 flex justify-center flex-col flex-[3] max-md:flex-[3]">
    <!-- 播放顺序 -->
    <div class="song-control flex flex-[2] justify-center max-md:flex-[3]">
      <div class="normal-set">
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
      <div class="normal-set" @mouseenter="isShowVolume = true" @mouseleave="isShowVolume = false" title="音量">
        <i class="iconfont icon-yinliang" v-show="volume != 0" @click="musicStatus().stepCloseVolume"></i>
        <i class="iconfont icon-guanbiyinliang" v-show="volume == 0" @click="musicStatus().stepOpenVolume"></i>
        <input class="volume-set w-[6rem] absolute left-[2.4rem] top-[1.125rem] h-[0.4rem] cursor-pointer" type="range"
          min="0" max="1" step="0.01" v-show="isShowVolume" v-model="volume">
      </div>
    </div>


    <!-- 进度条 盒子-->
    <div class="progress-bar flex justify-center items-center flex-1 max-md:flex-[1]">
      <!-- 进度条 -->
      <div class="music-bar w-full  flex justify-center items-center">
        <div class="max-md:text-xs flex-1 text-right"><span>{{ timeFormat(currentTime) }}</span></div>
        <!-- <input type="range" class="show-bar w-4/5 mx-1 h-1" @change="musicStatus().setProgressDone"
                                                                                    @input="musicStatus().setProgress" min="0" max="100" v-model="musicStatus().audioSchedule" step="0.5"> -->
        <el-slider class="mx-2 flex-[5]" v-model="musicStatus().audioSchedule" size="small" :show-tooltip="false"
          @change="musicStatus().setProgressDone" @input="musicStatus().setProgress" />
        <div class="max-md:text-xs flex-1 "><span>{{ isString(timeFormat(duration)) ? timeFormat(duration) :
          "00:00" }}</span></div>
      </div>
    </div>


    <!-- 迷你歌词 -->
    <div :class="[isShowLyricBoard ? 'small-lrc-change' : 'small-lrc']"
      class="flex-[2] max-md:flex-[2] flex justify-center items-start overflow-hidden">
      <ul class="lrc-ul h-full leading-4 w-full text-center max-md:leading-5 max-md:h-full" ref="smallLrcUl">
        <li class=" h-full" v-for="(item, index) in  currentMusicInfo.lyric " :key="index">
          <span class="text-[0.8rem] max-md:text-[0.6rem]">
            {{ item.word ? item.word : '\xa0' }}
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="collect w-1/5 flex-[2] max-lg:hidden max-lg:flex-none">

  </div>
</template>

<style scoped>
.img-set:hover .up-img {
  transform: scale(1.2);
  color: aliceblue;
}


.iconfont {
  @apply text-2xl h-10 transition duration-300 ease-in-out cursor-pointer
}

.iconfont:hover {
  @apply scale-[1.1]
}

.normal-set {
  @apply flex items-center relative
}


.normal-set i {
  @apply mx-[0.4rem] pt-[4px]
}


@media not all and (min-width: 768px) {
  .volume-set {
    width: 0.3rem;
    height: 4rem;
    left: 0.6rem;
    top: -3.8rem;
    writing-mode: vertical-lr
  }

  .iconfont {
    @apply text-base h-4 flex items-center justify-center
  }

  .normal-set i {
    @apply mx-[0.3rem]
  }
}
</style>