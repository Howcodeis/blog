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
  if (currentMusicInfo.value.cover == '') {
    normalBack('info', '当前没有播放的歌曲')
    return
  }
  if (!isShowSPLyricsPanel.value) {
    gsap.to(listPage.value, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        isShowSPLyricsPanel.value = true
        nextTick(() => {
          gsap.fromTo(soloItem.value, {
            y: 1000
          }, {
            duration: 0.5,
            y: 0
          })
        })
      },
    })
  } else {
    gsap.to(soloItem.value, {
      duration: 0.2,
      y: 1000,
      onComplete: () => {
        isShowSPLyricsPanel.value = false
        nextTick(() => {
          gsap.fromTo(listPage.value, {
            opacity: 0
          }, {
            duration: 0.5,
            opacity: 1
          })
        })
      }
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
    duration: 1,
    y: 100,
    autoAlpha: 0,
    ease: 'back.out(1)'
  })

})
</script>

<template>
  <!-- 整个音乐界面 包括空白 -->
  <div ref="musicBox"
    class="flex box-border absolute w-full h-full min-h-[40rem] justify-center items-center max-md:items-end">
    <!-- 音乐展示界面 不包括空白-->
    <div ref="musicPanel"
      class="box-border border-[2px] border-[#99CCFF] absolute min-h-[660px] duration-300 overflow-hidden rounded-[20px] w-2/3 h-2/3 flex max-md:w-full max-md:h-[80%] max-xl:w-[80%] max-w-[1200px]">
      <!-- 背景样式 -->
      <img ref="bgImage" class="absolute scale-[1.8] brightness-50 blur-xl w-full h-full" :src="musicCoverPath">
      <!-- 列表页面 -->
      <div ref="listPage" class="w-full h-full" v-if="!isShowSPLyricsPanel">
        <!--列表展示侧栏部分 上半部分 -->
        <div class=" absolute w-full h-[90%] flex">
          <!-- 侧栏 -->
          <div class='relative text-white w-[10%] max-sm:hidden max-lg:w-[15%]'>
            <siderMenu />
          </div>
          <!-- 音乐列表以及搜索 -->
          <div class="relative border-l-2 border-[#99CCFF] w-[90%] flex flex-col max-lg:w-[85%] max-md:w-full">
            <musicDisplay />
          </div>
        </div>
        <!--控件部分 下半部分 -->
        <div class="absolute w-full h-[10%] border-t-2 border-[#99CCFF] text-[#000000] bottom-0 overflow-hidden">
          <!-- 控键 -->
          <div class="relative bottom-0 flex w-full h-full select-none ">
            <controls :toggleLyricBoard="toggleLyricBoard" />
          </div>
        </div>
      </div>
      <!-- 主奏页面 -->
      <div ref="soloItem" v-if="isShowSPLyricsPanel" class="box-border absolute w-full h-full z-10">
        <!-- 切换按钮 -->
        <div @click="toggleLyricBoard"
          class='absolute top-0 left-0 w-9 h-9 text-center z-10 text-[#99CCFF] leading-8 hover:translate-y-2 duration-500'>
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
  @apply text-3xl cursor-pointer hover:text-[#0099FF] duration-300
}

.sider {
  @apply text-white w-[30%] bg-[#333366] relative
}
</style>