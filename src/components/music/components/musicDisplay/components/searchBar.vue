<script setup>
import { defineComponent, inject, ref } from 'vue';
import { musicStatus } from '@/store';
import { storeToRefs } from 'pinia';

defineComponent({
  name: "searchBar"
})

// 搜索关键字(pinia存储)
const { keywords } = storeToRefs(musicStatus())
// 搜索关键字
const keyword = ref(null)
// 注入
const showSiderMenu = inject('showSiderMenu')
</script>

<template>
  <div class="sm:hidden absolute w-12 h-[80%] z-20 text-white flex items-center justify-center scale-x-[-1]">
    <i class="iconfont icon-caidan1  hover:rotate-180" @click="showSiderMenu"></i>
  </div>
  <div
    class="put absolute md:left-5 max-md:right-3 w-[30%] max-w-[14.375rem] max-md:w-[45%] border-[#999999] flex items-center rounded border-[.125rem]">
    <div class="relative w-[84%] h-full">
      <input type="text" class="border-0 w-full outline-none text-[#FFFFFF] bg-opacity-50 p-1 text-sm bg-transparent"
        v-model="keyword" :placeholder="[keywords.length ? keywords : '搜索歌曲']"
        @keydown.native.enter="musicStatus().setMusicList(keyword)">
    </div>
    <div class="absolute right-0 w-[16%] flex justify-center">
      <button @click="musicStatus().setMusicList(keyword)">
        <i class="iconfont icon-sousuo select-none"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.iconfont {
  @apply text-2xl hover:text-[#0099FF] duration-500 text-[#999999];
}

.put:has(input:focus) {
  transition: 2s all;
}
</style>