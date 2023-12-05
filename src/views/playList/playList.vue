<script setup>
import { defineComponent, onMounted } from 'vue';
import { musicStatus } from '../../store/index.js';
import { storeToRefs } from 'pinia';
import { timeFormat } from '../../components/music/musicTools.js';

defineComponent({
  name: "playList"
})

const {getPlayList} = storeToRefs(musicStatus())

const playChoose = (row) => musicStatus().setMusicInfo(row)
</script>

<template>
  <el-table :data="getPlayList" stripe max-height="900" lazy style="width: 100%" @row-dblclick="playChoose">
    <!-- <el-table-column fixed width="20" label="#" /> -->
    <el-table-column label="歌曲" min-width="150">
      <template #default="scope">
        <div class="text-style text-[16px] text-black"><span>{{ scope.row.name }}</span></div>
        <div class="text-style text-[10px] text-gray-500"><span>{{ scope.row.artists[0].name }}</span></div>
      </template>
    </el-table-column>
    <el-table-column label="专辑" min-width="150">
      <template #default="scope">
        <div class="text-style text-[12px]">
          <span>{{ scope.row.album.name }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="时长">
      <template #default="scope">
        {{ timeFormat(scope.row.duration / 1000) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.text-style {
  @apply text-ellipsis whitespace-nowrap overflow-hidden
}
</style>