<script setup>
import { defineComponent, onMounted } from 'vue';
import { musicStatus } from '@/store/index.js';
import { storeToRefs } from 'pinia';
import { timeFormat } from '@/components/music/musicTools.js';
import { normalBack } from '@/utils/MessageBack';

defineComponent({
  name: "playList"
})
// 双击播放
const { getPlayList } = storeToRefs(musicStatus())
const playChoose = (row) => {
  musicStatus().setMusicInfo(row)
}
// 控制触底加载过于频繁
let lastTime
const loadMoreData = () => {
  if (musicStatus().playList.length < musicStatus().searchSettngs.limit) return
  let nowTime = new Date().getTime()
  if (nowTime - lastTime > 4000) {
    musicStatus().loadMore()
    lastTime = nowTime
  } else {
    normalBack("warning", "加载过于频繁!")
  }
}
// 钩子函数
onMounted(() => {
  // 初始化时间
  lastTime = new Date().getTime()
})
</script>

<template>
  <div class="absolute h-full w-full overflow-hidden">
    <el-table :data="getPlayList" row-key="id" stripe v-el-table-infinite-scroll="loadMoreData"
      style="width: 100%; height:100%" @row-click="playChoose">
      <el-table-column fixed width="60" label="#">
        <template #default="scope">
          <div class="text-gray-500 text-[16px] select-none">
            <span>
              {{ (scope.$index + 1) < 10 ? "0" + (scope.$index + 1) : (scope.$index + 1) }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="歌曲" min-width="100">
        <template #default="scope">
          <!-- 歌曲名称 -->
          <div class="text-style text-[16px] text-black"><span>{{ scope.row.name }}</span></div>
          <!-- 艺人名称 -->
          <div class="cursor-pointer inline whitespace-nowrap text-ellipsis text-[10px] text-gray-500"
            v-for="(item, index) in scope.row.artists" :key="index">
            <span :title="item.name">{{ index === 0 ? item.name : "/" + item.name }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 专辑名称 -->
      <el-table-column label="专辑" min-width="100">
        <template #default="scope">
          <div class="text-style text-[12px]" :title="scope.row.album.name">
            <span>{{ scope.row.album.name }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 歌曲时长 -->
      <el-table-column label="时长">
        <template #default="scope">
          {{ timeFormat(scope.row.duration / 1000) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style scoped>
.text-style {
  @apply text-ellipsis whitespace-nowrap overflow-hidden cursor-pointer
}
</style>