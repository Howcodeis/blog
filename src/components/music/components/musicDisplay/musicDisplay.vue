<script setup>
import { defineComponent } from 'vue';
import searchBar from './components/searchBar.vue';

defineComponent({
  name: "musicDisplay"
})

</script>

<template>
  <div class='absolute w-full flex items-center h-[10%] right-0'>
    <searchBar></searchBar>
  </div>
  <div class='relative top-[10%] h-[90%] w-full right-0'>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>