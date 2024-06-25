<script setup>
import { musicStatus } from '@/store';
import { storeToRefs } from 'pinia';
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'

defineComponent({
  name: 'LyricPanel'
})

const props = defineProps({
  isShowSPLyricsPanel: {
    type: Boolean,
    default: false
  }
})
const { currentMusicInfo, getCurrentLyricIndex, getIsShowLyricsPanel } = storeToRefs(musicStatus())
// 歌词面板
const lyricBoard = ref(null)
//  歌词偏移量
const lyricMove = () => {
  let offsetTop = lyricBoard.value.children[getCurrentLyricIndex.value]?.offsetTop
  if (!offsetTop) return
  let offset = offsetTop - lyricBoard.value.offsetHeight * 0.7
  lyricBoard.value.scrollTo({ top: offset, behavior: 'smooth' })
}
// 监听鼠标滚动时间
let timer, isLyricMove = true
const handleMove = () => {
  isLyricMove = false
  clearTimeout(timer)
  timer = setTimeout(() => {
    isLyricMove = true
    lyricMove()
  }, 3000)
}
watch(getCurrentLyricIndex, () => {
  if (isLyricMove) lyricMove()
})
watch([getIsShowLyricsPanel, () => props.isShowSPLyricsPanel], () => {
  if (getIsShowLyricsPanel.value && props.isShowSPLyricsPanel) {
    setTimeout(() => {
      lyricMove()
    }, 500);
  }
})
// 跳到指定歌词
const skipLyric = (lyric) => {
  musicStatus().skipByLyric(lyric.time)
}

onUnmounted(() => {
  clearTimeout(timer)
})
onMounted(() => {
  if (getIsShowLyricsPanel.value && props.isShowSPLyricsPanel) {
    setTimeout(() => {
      lyricMove()
    }, 500);
  }
})
</script>

<template>
  <!-- 置顶部分 -->
  <div class="relative w-full h-[20%] md:w-[70%] flex justify-center">
    <div class="absolute bottom-0 w-[80%] h-[60%] min-h-[3.125rem] text-center">
      <span class="text-xl text-slate-300">{{ currentMusicInfo.name }}</span><br>
      <span class="text-sm text-slate-400">{{ currentMusicInfo.artist }}</span>
    </div>
  </div>
  <!-- 歌词部分 -->
  <div class="flex justify-center h-[80%] w-full md:w-[60%] overflow-hidden">
    <!-- 文字在模糊背景下滚动导致背景失真，出现块状问题 添加will-change-scroll 解决 -->
    <ul ref="lyricBoard" class="overflow-y-scroll pt-[10rem] pb-[12rem] w-[80%] h-full will-change-scroll"
      @wheel="handleMove" @touchmove="handleMove">
      <li class="cursor-pointer leading-2 my-4 text-center text-slate-400 duration-300 will-change-transform"
        :class="[index == getCurrentLyricIndex ? 'active' : '']" v-for="(lyric, index) in currentMusicInfo.lyric"
        :key="index" @click.stop="skipLyric(lyric)">
        {{ lyric.word }}</li>
    </ul>
  </div>
</template>

<style scoped>
.active {
  color: aliceblue;
  font-size: 1.1rem;
}
</style>