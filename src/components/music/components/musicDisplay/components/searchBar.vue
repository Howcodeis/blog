<script setup>
import { defineComponent, ref } from 'vue';
import { musicStatus } from '../../../../../store';

const keyword = ref(null)

defineComponent({
  name: "searchBar"
})

defineProps({
  showSiderMenu: Function
})
</script>

<template>
  <div class="md:hidden absolute w-12 h-[80%] z-20 text-white flex items-center justify-center scale-x-[-1] hover:rotate-180 duration-500">
    <i class="iconfont icon-caidan1" @click="showSiderMenu"></i>
  </div>
  <div class="absolute md:left-5 max-md:right-3 flex items-center">
    <input type="text"
      class="border-[.0625rem] pr-8 text-white border-gray-400 bg-transparent rounded w-[15rem] max-md:w-[12rem] focus:outline-none p-1 text-sm"
      v-model="keyword" placeholder="发现音乐" @keydown.native.enter="musicStatus().setMusicList(keyword)">
    <div class="absolute right-2">
      <button @click="musicStatus().setMusicList(keyword)">
        <i class="iconfont icon-sousuo text-gray-500"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.iconfont {
  @apply text-2xl;
}
</style>