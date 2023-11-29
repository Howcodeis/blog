<script setup>
import gsap from 'gsap'
import { defineComponent, onMounted, ref } from 'vue';
import music from '../music/music.vue';

defineComponent({
  name: 'Home'
})
</script>

<template>
  <div class="container">
    <div class="header"></div>
    <div class="content">
      <router-link :to="{ name: 'music' }">How beautiful the music is auh!</router-link>
      <!-- <music></music> -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <div class="footer"></div>
  </div>
</template>
<style scoped></style>
