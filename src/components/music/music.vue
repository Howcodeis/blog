<script setup>
import { defineComponent, nextTick, onMounted, provide, ref, watch } from 'vue';
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

const { isShowLyricsPanel, currentMusicInfo } = storeToRefs(musicStatus())
const isShowSiderMenu = ref(false)
const showSiderMenu = () => {
  isShowSiderMenu.value = !isShowSiderMenu.value
}
provide('showSiderMenu', showSiderMenu)

const musicBox = ref(null)
const beforeEnter = (el) => {
  gsap.set(el, {
    autoAlpha: 0,
    x: -100,
  })
}
const enter = (el, done) => {
  gsap.to(el, {
    duration: 0.5,
    autoAlpha: 1,
    x: 0,
    onComplete: done
  })
}
const leave = (el, done) => {
  gsap.to(el, {
    duration: 0.5,
    x: -100,
    autoAlpha: 0,
    onComplete: done
  })
}

const soloItem = ref(null)
// 歌词面板调用函数
const toggleLyricBoard = () => {
  if (currentMusicInfo.value.cover == null) {
    normalBack('info', '当前没有播放的歌曲')
    return
  }
  if (!isShowLyricsPanel.value) {
    isShowLyricsPanel.value = true
    nextTick(() => {
      gsap.set(soloItem.value, {
        y: 1000,
      })
      gsap.to(soloItem.value, {
        duration: 0.75,
        y: 0,
      })
    })
  } else {
    gsap.to(soloItem.value, {
      duration: 0.75,
      y: 1000,
      onComplete: () => {
        isShowLyricsPanel.value = false
      }
    })
  }
}

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
      class="box-border absolute min-h-[660px] duration-300 overflow-hidden rounded-[20px] w-2/3 h-2/3 flex max-md:w-full max-md:h-[80%] max-xl:w-[80%] max-w-[1200px]">
      <!--列表展示侧栏部分 上半部分 -->
      <div class="absolute w-full h-[90%] bg-white flex">
        <!-- 侧栏 -->
        <div
          class='text-white relative w-[10%] max-sm:hidden max-lg:w-[15%] bg-gradient-to-t from-slate-900 via-slate-800 to-cyan-800'>
          <siderMenu />
        </div>
        <!-- 音乐列表以及搜索 -->
        <div class="relative w-[90%] flex flex-col max-lg:w-[85%] max-md:w-full ">
          <musicDisplay />
        </div>
      </div>
      <!--控件部分 下半部分 -->
      <div class="absolute w-full h-[10%] bottom-0 flex">
        <!-- 控键 -->
        <div class="relative bottom-0 flex w-full h-full text-white bg-slate-900 select-none ">
          <controls :toggleLyricBoard="toggleLyricBoard" />
        </div>
      </div>
      <!-- 主奏页面 -->
      <div ref="soloItem" v-if="isShowLyricsPanel" class="box-border absolute w-full h-full z-10 bg-cyan-300">
        <!-- 切换按钮 -->
        <div @click="toggleLyricBoard"
          class='absolute top-0 left-0 w-9 h-9 text-center z-10 text-slate-300 leading-8 hover:translate-y-2 duration-500'>
          <i class="iconfont icon-xiangxiajiantou " />
        </div>
        <soloPage></soloPage>
      </div>
    </div>
  </div>

  <!-- 这是小屏幕菜单显示 -->
  <!-- <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <div
      class="md:hidden box-border absolute w-full h-full bottom-0 right-0 before:h-full before:absolute before:w-full before:content-[''] before:backdrop-blur-[1px] before:left-0 before:top-0 overflow-hidden"
      v-show="isShowSiderMenu">
      <div class="sider h-[4rem]">
        <i class="iconfont icon-caidan1 absolute top-[1.25rem]" @click="showSiderMenu" />
      </div>
      <div class="sider h-full">
        <siderMenu />
      </div>
      <div class="absolute right-0 top-0 w-[70%] h-full" @click="showSiderMenu"></div>
    </div>
  </transition> -->
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}

.iconfont {
  @apply text-3xl cursor-pointer hover:text-blue-600 duration-300
}

.sider {
  @apply text-white w-[30%] bg-slate-900 relative
}
</style>