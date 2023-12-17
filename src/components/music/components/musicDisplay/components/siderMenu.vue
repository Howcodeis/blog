<script setup>
import { defineComponent, reactive, toRefs } from 'vue';
import routeComp from '@/layout/routeComp/routeComp.vue'

defineComponent({
  name: 'siderMenu'
})

const titles = reactive({
  playList: 'playList',
  foundMusic: 'foundMusic',
  home: 'home'
})
const { playList, foundMusic, home } = toRefs(titles)
</script>

<template>
  <ul class="flex flex-col items-center justify-start h-full text-center leading-10 overflow-scroll">
    <li class="li-style hover:bg-cyan-800 mt-8">
      <routeComp :title="playList" />
    </li>
    <li class="li-style hover:bg-cyan-800">
      <routeComp :title="foundMusic" />
    </li>
    <li class="li-style hover:bg-cyan-800">
      <routeComp :title="home" />
    </li>
    <li class="li-style hover:bg-cyan-800">
      <routeComp />
    </li>
    <li class="li-style hover:bg-cyan-800">
      <routeComp />
    </li>
  </ul>
</template>

<style scoped>
.li-style {
  @apply w-full mb-2
}
</style>