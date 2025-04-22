<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const route = useRoute()

const routes = computed(() => {
  return router.options.routes.filter(route => !route.meta?.hidden)
})

const activeMenu = computed(() => {
  return route.path
})

// 自定义菜单数据
const customMenus = [
  {
    title: '仪表盘',
    path: '/dashboard',
    icon: 'Odometer'
  },
  {
    title: '用户管理',
    path: '/users',
    icon: 'User',
    children: [
      {
        title: '用户管理',
        path: '/users/list'
      },
      {
        title: '角色管理',
        path: '/users/roles'
      }
    ]
  },
  {
    title: '系统设置',
    path: '/system',
    icon: 'Setting',
    children: [
      {
        title: '基本信息',
        path: '/system/basic'
      },
      {
        title: '数据安全',
        path: '/system/security'
      },
      {
        title: '升级维护',
        path: '/system/maintenance'
      }
    ]
  },
  {
    title: '日志管理',
    path: '/logs',
    icon: 'Document',
    children: [
      {
        title: '系统日志',
        path: '/logs/system'
      },
      {
        title: '操作日志',
        path: '/logs/operation'
      },
      {
        title: '用户日志',
        path: '/logs/user'
      }
    ]
  }
]
</script>

<template>
  <div class="menu-container">
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :unique-opened="true"
      router
    >
      <!-- 自定义菜单 -->
      <template v-for="(menu, index) in customMenus" :key="index">
        <!-- 有子菜单的情况 -->
        <el-sub-menu v-if="menu.children && menu.children.length" :index="menu.path">
          <template #title>
            <el-icon class="menu-icon"><component :is="menu.icon" /></el-icon>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item 
            v-for="(subMenu, subIndex) in menu.children" 
            :key="subIndex"
            :index="subMenu.path"
          >
            <span class="menu-item-title">{{ subMenu.title }}</span>
          </el-menu-item>
        </el-sub-menu>
        
        <!-- 没有子菜单的情况 -->
        <el-menu-item v-else :index="menu.path">
          <el-icon class="menu-icon"><component :is="menu.icon" /></el-icon>
          <template #title>{{ menu.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.menu-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
  min-height: calc(100vh - 60px);
  border-right: solid 1px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-menu-vertical.el-menu--collapse {
  width: 64px;
  min-height: calc(100vh - 60px);
}

.menu-icon {
  margin-right: 10px;
  font-size: 18px;
  vertical-align: middle;
}

.menu-item-title {
  display: inline-block;
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-sub-menu__title) {
  padding-left: 20px !important;
  height: 50px;
  line-height: 50px;
  transition: all 0.3s;
  user-select: none;
}

:deep(.el-menu-item) {
  padding-left: 40px !important;
  height: 44px;
  line-height: 44px;
  transition: all 0.3s;
  font-size: 14px;
}

:deep(.el-menu--inline) {
  background-color: #263445 !important;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #263445 !important;
}

:deep(.el-menu-item:hover) {
  background-color: #263445 !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #1890ff !important;
  color: #ffffff !important;
}

:deep(.el-submenu.is-active .el-submenu__title) {
  color: #409EFF !important;
}

:deep(.el-menu--collapse .el-sub-menu__icon-arrow) {
  display: none;
}

:deep(.el-submenu__title .el-icon-arrow-right) {
  transition: transform 0.3s;
}

:deep(.el-submenu.is-opened > .el-submenu__title .el-icon-arrow-right) {
  transform: rotate(90deg);
}

:deep(.el-menu-item.is-active) {
  position: relative;
}

:deep(.el-menu-item.is-active::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #409EFF;
}
</style> 