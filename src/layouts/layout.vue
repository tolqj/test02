<script setup lang="ts">
import { ref } from 'vue'
import LeftMenu from './left_menu.vue'
import Header from './header.vue'
import Contain from './contain.vue'

const isCollapse = ref(false)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<template>
  <div class="app-wrapper">
    <!-- 顶部导航 -->
    <header class="top-header">
      <Header @toggle-sidebar="toggleSidebar" />
    </header>
    
    <div class="content-wrapper">
      <!-- 侧边栏 -->
      <aside class="sidebar-container" :class="{ 'is-collapse': isCollapse }">
        <LeftMenu :is-collapse="isCollapse" />
      </aside>
      
      <!-- 内容区域 -->
      <section class="content-container">
        <Contain />
      </section>
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.top-header {
  width: 100%;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 11;
  position: relative;
  padding: 0;
  margin: 0;
}

.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
  padding: 0;
  margin: 0;
}

.sidebar-container {
  width: 210px;
  height: calc(100vh - 60px);
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
  position: relative;
  z-index: 10;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.1);
  margin: 0;
  padding: 0;
  flex-shrink: 0;
}

.sidebar-container.is-collapse {
  width: 64px;
}

.content-container {
  flex: 1;
  height: calc(100vh - 60px);
  overflow: hidden;
  background-color: #f0f2f5;
  min-width: 0; /* 防止内容溢出 */
  position: relative;
  padding: 0;
  margin: 0;
}
</style> 