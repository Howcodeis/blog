<script setup>
import { defineComponent } from 'vue';

defineComponent({
  name: "routeComp"
})
const props = defineProps({
  title: {
    type: String,
    default: 'playList'
  }
})
</script>

<template>
  <router-link :to="{ name: props.title }">{{ props.title }}</router-link>
</template>

<style scoped></style>