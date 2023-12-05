<script setup>
import { defineComponent } from 'vue';
import searchBar from './components/searchBar.vue';

defineComponent({
  name: "musicDisplay"
})

defineProps({
  showSiderMenu: Function
})

</script>

<template>
  <div class='absolute w-full flex items-center h-[10%] right-0 min-h-[3.125rem] z-10 bg-slate-900'>
    <searchBar :showSiderMenu="showSiderMenu"></searchBar>
  </div>
  <div class='relative top-[10%] h-[90%] w-full right-0 overflow-hidden'>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>