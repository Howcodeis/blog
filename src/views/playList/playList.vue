<script setup>
import { defineComponent, onMounted, watch } from 'vue';
import { musicStatus } from '@/store/index.js';
import { storeToRefs } from 'pinia';
import { timeFormat } from '@/components/music/musicTools.js';
import { normalBack } from '@/utils/MessageBack';

defineComponent({
  name: "playList"
})
// 表格样式
function headerRowStyle ({ row, rowIndex }) {
  return {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'white'
  }
}
function headerCellStyle ({ row, column, rowIndex, columnIndex }) {
  return {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: '5px',
    borderBottom: '1px solid black',
  }
}
function rowStyle ({ row, rowIndex }) {
  return {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'white'
  }
}
function cellStyle ({ row, column, rowIndex, columnIndex }) {
  return {
    // padding: '1px',
    border: 'none'
  }
}
// 双击播放
const { getPlayList, playList } = storeToRefs(musicStatus())
const playChoose = (row) => {
  musicStatus().setMusicInfo(row)
}
// 控制触底加载过于频繁
let lastTime
const loadMoreData = () => {
  // 数据不够时不执行
  if (musicStatus().playList.length < musicStatus().searchSettngs.limit) return
  let nowTime = new Date().getTime()
  // 刷新时间间隔4秒/次
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
  <div class="box-border absolute h-full w-full overflow-hidden">
    <el-table :data="getPlayList" row-key="id" v-el-table-infinite-scroll="loadMoreData"
      :style="{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0)' }" @row-click="playChoose"
      :header-cell-style="headerCellStyle" :header-row-style="headerRowStyle" :row-style="rowStyle"
      :cell-style="cellStyle">
      <el-table-column fixed width="60" label="#">
        <template #default="scope">
          <div class="text-gray-200 text-[16px] select-none">
            <span>
              {{ (scope.$index + 1) < 10 ? "0" + (scope.$index + 1) : (scope.$index + 1) }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="歌曲" min-width="100">
        <template #default="scope">
          <!-- 歌曲名称 -->
          <div class="text-style text-[16px] text-white"><span>{{ scope.row.name }}</span></div>
          <!-- 艺人名称 -->
          <div class="cursor-pointer inline whitespace-nowrap text-ellipsis text-[10px] text-gray-300"
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

::v-deep(.el-table__body .el-table__row.hover-row td) {
  background-color: #6699FF;
}

::v-deep(.el-table__inner-wrapper::before) {
  height: 0px;
}
</style>