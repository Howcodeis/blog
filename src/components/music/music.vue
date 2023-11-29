<script setup>
import { defineComponent, onMounted, ref, toRef } from 'vue';
import { musicStatus } from '../../store';
import controls from './components/controls.vue';
import musicDisplay from './components/musicDisplay/musicDisplay.vue'
import siderMenu from './components/musicDisplay/components/siderMenu.vue';
import gsap from 'gsap';

defineComponent({
  name: 'MusicPage'
})

const musicBox = ref(null)
const isShowSiderMenu = ref(false)
const showSiderMenu = () => {
  isShowSiderMenu.value = !isShowSiderMenu.value
}

onMounted(() => {
  musicStatus().initAudio()
  gsap.from(musicBox.value.children, {
    delay: 0.5,
    duration: 1,
    y: 100,
    autoAlpha: 0,
    stagger: 0.25,
    ease: 'back.out(1)'
  })

})
</script>

<template>
  <div ref="musicBox" class="music-box box-border absolute w-full h-5/6 bottom-0 right-0">
    <!-- 音乐展示界面 -->
    <div class='text-white absolute rounded-l w-[10%] h-full max-md:hidden max-lg:w-[15%] bg-gradient-to-t from-slate-900 via-slate-800 to-cyan-800'>
      <siderMenu />
    </div>
    <div class="absolute w-[90%] h-full top-0 right-0 rounded-r flex flex-col max-lg:w-[85%] max-md:w-full bg-gradient-to-t from-slate-900 via-slate-800 to-cyan-900">
      <!-- 音乐列表 -->
      <div class='absolute rounded-lg right-0 w-full h-[90%] max-md:w-full max-md:h-[90%]'>
        <div class="md:hidden absolute top-[1.25rem] w-9 h-9 z-20">
          <i class="iconfont icon-caidan1" @click="showSiderMenu" v-show="!isShowSiderMenu"></i>
        </div>
        <musicDisplay />
      </div>
      <!-- 控制栏 -->
      <div
        class="text-white bg-slate-900 z-20 select-none rounded-md absolute right-0 bottom-0 h-[10%] flex justify-between min-h-[5.5rem] w-full max-md:h-[10%]">
        <controls />
      </div>
    </div>
  </div>
  <div class="md:hidden absolute bottom-0 left-0 z-30 w-[30%] h-5/6" v-show="isShowSiderMenu">
    <i class="iconfont icon-caidan1 block my-[1.25rem]" @click="showSiderMenu" />
    <siderMenu />
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}

.iconfont {
  @apply text-3xl cursor-pointer
}
</style>