<script setup>
import { defineComponent } from 'vue';
import searchBar from './components/searchBar.vue';

defineComponent({
  name: "musicDisplay"
})

</script>

<template>
  <div class='relative border-b-[1px] border-gradient w-full flex items-center h-[10%] right-0 min-h-[3.125rem] z-10'>
    <searchBar></searchBar>
  </div>
  <div class='relative h-[90%]'>
    <!-- 播放列表路由 -->
    <router-view></router-view>
  </div>
</template>

<style scoped>
.border-gradient {
  border-image: linear-gradient(to right, gray, white) 1;
}
</style>