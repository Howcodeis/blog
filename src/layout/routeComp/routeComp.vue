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
  <router-link class="routerStyle" :to="{ name: title }">
    <p>
      {{ title }}
    </p>
  </router-link>
</template>

<style scoped>
.routerStyle p {
  position: relative;
  z-index: 1;
}

.routerStyle::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  bottom: 0;
  position: absolute;
  border-radius: 10px;
  transition: all .3s;
}

.routerStyle:hover::before {
  background: gray;
  filter: blur(2px) brightness(0.8);
}

.routerStyle.router-link-active::before {
  background: #7c98d0;
  filter: blur(2px) brightness(0.8);
}
</style>