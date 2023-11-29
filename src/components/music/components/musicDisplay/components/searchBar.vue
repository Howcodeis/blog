<script setup>
import { defineComponent, ref } from 'vue';
import { musicStatus } from '../../../../../store';
import { storeToRefs } from 'pinia';

const store = storeToRefs(musicStatus())
const keyword = ref(null)


defineComponent({
  name: "searchBar"
})
</script>

<template>
  <div class="absolute md:left-5 max-md:right-3 flex items-center">
    <input type="text" class="border-[.0625rem] border-gray-400 bg-transparent rounded w-[15rem] max-md:w-[18rem] focus:outline-none p-1 text-sm" v-model="keyword" placeholder="发现音乐"
      @keydown.native.enter="musicStatus().setMusicList(keyword)">
    <div class="absolute right-2">
      <button @click="musicStatus().setMusicList(keyword)">
        <i class="iconfont icon-sousuo text-gray-500"></i>
      </button>
    </div>
  </div>
</template>

<style scoped></style>