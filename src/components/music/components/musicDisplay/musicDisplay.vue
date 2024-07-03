<script setup>
import { defineComponent } from 'vue';
import searchBar from './components/searchBar.vue';

defineComponent({
  name: "musicDisplay"
})

</script>

<template>
  <div class='relative border-b-2 w-full flex items-center h-[10%] right-0 min-h-[3.125rem] z-10'>
    <searchBar></searchBar>
  </div>
  <div class='relative h-[90%] bg-[#CCCCCC]'>
    <!-- 播放列表路由 -->
    <router-view></router-view>
  </div>
</template>

<style scoped></style>