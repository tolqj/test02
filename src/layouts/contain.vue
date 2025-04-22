<script setup lang="ts">
// 内容区域组件
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface TabItem {
  name: string;
  title: string;
  path: string;
  closable: boolean;
}

const activeTab = ref('')
const tabs = ref<TabItem[]>([])

// 根据路由获取标题
const getRouteTitle = (route: RouteLocationNormalizedLoaded): string => {
  return route.meta?.title as string || '未命名页面'
}

// 添加标签页
const addTab = (route: RouteLocationNormalizedLoaded) => {
  const isExist = tabs.value.some(item => item.path === route.path)
  if (!isExist) {
    tabs.value.push({
      name: route.name as string,
      title: getRouteTitle(route),
      path: route.path,
      closable: route.path !== '/dashboard' // 首页不可关闭
    })
  }
  activeTab.value = route.path
}

// 关闭标签页
const handleTabRemove = (targetPath: string) => {
  const index = tabs.value.findIndex(item => item.path === targetPath)
  if (index !== -1) {
    // 如果关闭的是当前激活的标签页，则需要跳转到其他标签页
    if (targetPath === activeTab.value) {
      // 优先选择右侧标签页，没有则选择左侧标签页
      const nextTab = tabs.value[index + 1] || tabs.value[index - 1]
      if (nextTab) {
        router.push(nextTab.path)
      }
    }
    tabs.value.splice(index, 1)
  }
}

// 点击标签页
const handleTabClick = (tab: any) => {
  router.push(tab.props.name)
}

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    if (newPath && !route.meta.hidden) {
      addTab(route)
    }
  },
  { immediate: true }
)

// 初始化时添加当前路由对应的标签页
onMounted(() => {
  if (route.path && !route.meta.hidden) {
    addTab(route)
  }
})
</script>

<template>
  <el-tabs
    v-model="activeTab"
    type="card"
    class="demo-tabs"
    @tab-click="handleTabClick"
    @tab-remove="handleTabRemove"
  >
    <el-tab-pane
      v-for="item in tabs"
      :key="item.path"
      :label="item.title"
      :name="item.path"
      :closable="item.closable"
    />
  </el-tabs>
  <div class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.demo-tabs {
  margin-bottom: 20px;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-right: 20px;
  background-color: #f0f2f5;
  height: 100%;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 