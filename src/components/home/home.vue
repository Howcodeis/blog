<script setup>
import { defineComponent } from 'vue';

defineComponent({
  name: 'Home'
})
</script>

<template>
  <div class="container">
    <div class="header"></div>
    <div class="content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
    <div class="footer"></div>
  </div>
</template>
<style scoped></style>
