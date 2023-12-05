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
  <router-link :to="{ name: 'music' }">How beautiful the music is auh!</router-link>
  <router-view>

  </router-view>
</template>

<style scoped></style>
