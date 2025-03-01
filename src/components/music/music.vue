<script setup>
import { computed, defineComponent, nextTick, onMounted, provide, ref, watch } from 'vue';
import controls from './components/controls.vue';
import musicDisplay from './components/musicDisplay/musicDisplay.vue'
import siderMenu from './components/musicDisplay/components/siderMenu.vue';
import soloPage from './components/lyricBoard/soloPage.vue';
import gsap from 'gsap';
import { musicStatus } from '@/store';
import { storeToRefs } from 'pinia';
import { normalBack } from '../../utils/MessageBack';
import { animatePanelShow, animatePanelHide } from '../../utils/gsapTools'

defineComponent({
  name: 'MusicPage'
})

const { isShowSPLyricsPanel, currentMusicInfo } = storeToRefs(musicStatus())
const isShowSiderMenu = ref(false)
const showSiderMenu = () => {
  isShowSiderMenu.value = !isShowSiderMenu.value
}
provide('showSiderMenu', showSiderMenu)

const musicBox = ref(null)
const listPage = ref(null)
const soloItem = ref(null)
// 歌词面板调用函数
const toggleLyricBoard = () => {
  if (currentMusicInfo.value.cover === '') {
    normalBack('info', '当前没有播放的歌曲')
    return
  }
  if (!isShowSPLyricsPanel.value) {
    animatePanelHide(listPage.value, 0, () => {
      isShowSPLyricsPanel.value = true
      nextTick(() => {
        animatePanelShow(soloItem.value, 1000, 0)
      })
    })
  } else {
    animatePanelHide(soloItem.value, 1000, () => {
      isShowSPLyricsPanel.value = false
      animatePanelShow(listPage.value, 0, 0)
    })
  }
}
// 封面路径
const musicCoverPath = computed(() => {
  return currentMusicInfo.value.cover || '/src/assets/image/Vadim-Sadovski-space-illustration.jpg'
})
// 函数挂载时处理函数
onMounted(() => {
  gsap.from(musicBox.value, {
    delay: 0.2,
    yPercent: 12,
    autoAlpha: 0,
  })
})
</script>

<template>
  <!-- 整个音乐界面 包括空白 -->
  <div ref="musicBox"
    class="flex box-border absolute w-full h-full min-h-[40rem] justify-center items-center max-md:items-end">
    <!-- 音乐展示界面 不包括空白-->
    <div ref="musicPanel"
      class="box-border border-[2px] border-gradient absolute min-h-[660px] duration-200 overflow-hidden w-[90%] h-2/3 flex max-md:w-full max-md:h-[80%] max-w-[1200px]">
      <!-- 背景样式 -->
      <img ref="bgImage" class="absolute scale-[1.8] brightness-50 blur-xl w-full h-full" :src="musicCoverPath">
      <!-- 列表页面 -->
      <div ref="listPage" v-show="!isShowSPLyricsPanel" class="w-full h-full">
        <!--列表展示侧栏部分 上半部分 -->
        <div class=" absolute w-full h-[85%] flex">
          <!-- 侧栏 -->
          <div class='relative text-white w-[10%] max-sm:hidden min-w-[100px]'>
            <siderMenu />
          </div>
          <!-- 音乐列表以及搜索 -->
          <div class="relative border-l-[1px] border-gradient-t-b w-[90%] flex flex-col max-md:w-full">
            <musicDisplay />
          </div>
        </div>
        <!--控件部分 下半部分 -->
        <div class="absolute w-full h-[15%] border-t-[1px] border-gradient text-[#000000] bottom-0 overflow-hidden">
          <!-- 控键 -->
          <div class="relative bottom-0 flex w-full h-full select-none ">
            <controls :toggleLyricBoard="toggleLyricBoard" />
          </div>
        </div>
      </div>
      <!-- 主奏页面 -->
      <div ref="soloItem" v-if="isShowSPLyricsPanel" class="box-border absolute w-full h-full">
        <!-- 切换按钮 -->
        <div @click="toggleLyricBoard"
          class='absolute top-0 left-0 w-9 h-9 text-center z-10 text-[#99CCFF] leading-8 hover:translate-y-2 duration-200'>
          <i class="iconfont icon-xiangxiajiantou " />
        </div>
        <soloPage></soloPage>
      </div>
    </div>
  </div>

</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}

.iconfont {
  @apply text-3xl cursor-pointer hover:text-[#0099FF] select-none
}

.sider {
  @apply text-white w-[30%] bg-[#333366] relative
}

.border-gradient {
  border-image: linear-gradient(to right, gray, white) 1;
}

.border-gradient-t-b {
  border-image: linear-gradient(to bottom, gray, white) 1;
}
</style>