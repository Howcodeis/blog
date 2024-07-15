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
  <router-link :to="{ name: title }">
    <p>
      {{ title }}
    </p>
  </router-link>

</template>

<style scoped></style>