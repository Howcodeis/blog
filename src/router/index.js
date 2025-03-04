/*
 * @Author: Matbin
 * @Date: 2023-11-21 13:51:04
 * @Description: 路由配置
 */

import { musicStatus } from '../store'
import { storeToRefs } from 'pinia'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      menu: '主页'
    },
    component: () => import('../components/home/home.vue')
  },
  {
    path: '/music',
    name: 'music',
    redirect: "/music/playList",
    meta: {
      menu: '音乐'
    },
    component: () => import('../components/music/music.vue'),
    children: [
      {
        path: 'playList',
        name: 'playList',
        meta: {
          menu: '列表'
        },
        component: () => import('../views/playList/playList.vue')
      },
      {
        path: 'foundMusic',
        name: 'foundMusic',
        meta: {
          menu: '发现更多音乐'
        },
        component: () => import('../views/foundMusic/foundMusic.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
// 防止列表渲染数据过多导致性能问题
router.beforeEach((to, from) => {
  if (to.name == "playList") {
    // 列表数据大于60条，那么重新进入列表就会重新搜索并重置偏移量
    if (musicStatus().playList.length > 60) {
      nextTick(() => {
        const { keywords } = storeToRefs(musicStatus())
        musicStatus().setMusicList(keywords.value)
      })
    }
  }
  return true
})


router.afterEach((to, from) => {
  return true
})
export default router