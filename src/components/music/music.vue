<script setup>
import { defineComponent, inject, onMounted, provide, ref } from 'vue';
import controls from './components/controls.vue';
import musicDisplay from './components/musicDisplay/musicDisplay.vue'
import siderMenu from './components/musicDisplay/components/siderMenu.vue';
import soloPage from './components/lyricBoard/soloPage.vue';
import gsap from 'gsap';
import { musicStatus } from '../../store';
import { storeToRefs } from 'pinia';

const { isShowLyricBoard } = storeToRefs(musicStatus())

defineComponent({
  name: 'MusicPage'
})

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
const timeline = gsap.timeline()
const toggleLyricBoard = () => {
  if (!isShowLyricBoard.value) {
    timeline.to(musicBox.value, {
      duration: 0.5,
      autoAlpha: 0,
      y: 100,
      onComplete: () => {
        isShowLyricBoard.value = true
      }
    })
    timeline.set(soloItem.value, {
      autoAlpha: 0,
      y: 100,
    })
    timeline.to(soloItem.value, {
      duration: 0.5,
      autoAlpha: 1,
      y: 0,
    })
  } else {
    timeline.to(soloItem.value, {
      duration: 0.5,
      autoAlpha: 0,
      y: 100,
      onComplete: () => {
        isShowLyricBoard.value = false
      }
    })
    timeline.set(musicBox.value, {
      autoAlpha: 0,
      y: 100,
    })
    timeline.to(musicBox.value, {
      duration: 0.5,
      autoAlpha: 1,
      y: 0,
    })
  }
}
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
  <!-- 整个音乐界面 -->
  <div v-show="!isShowLyricBoard" ref="musicBox" class="flex box-border absolute w-full h-full bottom-0 right-0">
    <!-- 音乐展示界面 -->
    <div
      class='text-white relative rounded-l w-[10%] h-full max-md:hidden max-lg:w-[15%] bg-gradient-to-t from-slate-900 via-slate-800 to-cyan-800'>
      <siderMenu />
    </div>
    <div class="relative w-[90%] h-full rounded-r flex flex-col max-lg:w-[85%] max-md:w-full ">
      <!-- 音乐列表 -->
      <div class='relative rounded-lg w-full h-[90%] max-md:w-full'>
        <musicDisplay />
      </div>
      <!-- 控制栏 -->
      <div
        class="relative text-white bg-slate-900 z-20 select-none rounded-md h-[10%] flex justify-between min-h-[7.2rem] w-full max-md:h-[10%]">
        <controls :toggleLyricBoard="toggleLyricBoard" />
      </div>
    </div>
  </div>
  <!-- 这是小屏幕菜单显示 -->
  <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
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
  </transition>
  <!-- 主奏页面 -->
  <div ref="soloItem" class="absolute w-full h-full bottom-0" v-show="isShowLyricBoard">
    <!-- 切换按钮 -->
    <div @click="toggleLyricBoard"
      class='absolute top-0 left-0 w-9 h-9 text-center text-slate-300 leading-8 z-20 hover:translate-y-2 duration-500'>
      <i class="iconfont icon-xiangxiajiantou " />
    </div>
    <soloPage></soloPage>
  </div>
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