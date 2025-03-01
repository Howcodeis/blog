<script setup>
import { defineComponent, reactive, toRefs } from 'vue';
import routeComp from '@/layout/routeComp/routeComp.vue'

defineComponent({
  name: 'siderMenu'
})

const titles = reactive({
  playList: 'playList',
  foundMusic: 'foundMusic',
  home: 'home',
  collection: 'collection'
})
const { playList, foundMusic, home, collection } = toRefs(titles)
</script>

<template>
  <ul class="flex flex-col items-center justify-center h-full text-center leading-10 overflow-scroll">
    <li class="li-style">
      <routeComp :title="playList" />
    </li>
    <li class="li-style">
      <routeComp :title="foundMusic" />
    </li>
    <li class="li-style">
      <routeComp :title="home" />
    </li>
    <!-- <li class="li-style">
      <routeComp :title="collection" />
    </li> -->
  </ul>
</template>

<style scoped>
.li-style {
  @apply relative w-full mb-2 select-none
}
</style>