<script setup>
import { defineComponent, onMounted } from 'vue';
import { musicStatus } from './store';

defineComponent({
  name: "app"
})

onMounted(() => {
  musicStatus().initAudio()
})
</script>

<template>
  <div class="absolute">
    <router-link :to="{ name: 'music' }">How beautiful the music is auh!</router-link>
  </div>
  <router-view>

  </router-view>
</template>

<style scoped></style>
