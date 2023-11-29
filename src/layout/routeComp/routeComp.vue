<script setup>
import { defineComponent } from 'vue';

defineComponent({
  name: "routeComp"
})
const { title } = defineProps({
  title: {
    type: String,
    default: 'playList'
  }
})
</script>

<template>
  <router-link :to="{ name: title }">{{ title }}</router-link>
</template>

<style scoped></style>