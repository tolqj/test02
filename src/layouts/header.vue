<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores'
import { ArrowDown, Expand, WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['toggleSidebar'])
const userStore = useUserStore()

const router = useRouter()
const username = computed(() => userStore.userInfo.nickname || userStore.userInfo.username || 'Admin')
const avatar = computed(() => userStore.userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
const showLogoutDialog = ref(false)

const handleCommand = (command: string) => {
  console.log('Command received:', command);
  
  if (command === 'profile') {
    // 处理个人中心
    router.push('/users/profile')
  } else if (command === 'settings') {
    // 处理设置
    router.push('/system/settings')
  } else if (command === 'logout') {
    // 显示退出登录对话框
    console.log('显示退出登录对话框');
    showLogoutDialog.value = true
  }
}

// 取消退出登录
const cancelLogout = () => {
  showLogoutDialog.value = false
}

// 确认退出登录
const confirmLogout = () => {
  try {
    // 执行登出逻辑
    userStore.logout()
    
    // 提示用户
    ElMessage.success('已安全退出系统')
    
    // 关闭对话框
    showLogoutDialog.value = false
    
    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    console.error('退出登录时发生错误:', error)
    ElMessage.error('退出失败，请重试')
  }
}

const toggleSidebar = () => {
  emit('toggleSidebar')
}
</script>

<template>
  <div class="navbar">
    <div class="left-area">
      <div class="logo">
        <span class="logo-text">后台管理系统</span>
      </div>
      <div class="hamburger" @click="toggleSidebar">
        <el-icon><Expand /></el-icon>
      </div>
    </div>
    <div class="center-area">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>仪表盘</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="right-menu">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <el-avatar :size="30" :src="avatar" />
          <span class="user-name">{{ username }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="settings">设置</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    
    <!-- 退出登录对话框 -->
    <el-dialog
      v-model="showLogoutDialog"
      title="退出登录"
      width="400px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="logout-content">
        <el-icon class="logout-icon"><WarningFilled /></el-icon>
        <p class="logout-message">确定要退出系统吗？</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelLogout">取消</el-button>
          <el-button type="primary" @click="confirmLogout">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  width: 100%;
}

.left-area {
  display: flex;
  align-items: center;
  padding-left: 15px;
  width: 220px;
}

.logo {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.hamburger {
  padding: 0 15px;
  cursor: pointer;
  font-size: 20px;
}

.center-area {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  padding-left: 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

:deep(.el-breadcrumb__item) {
  color: #666;
}

:deep(.el-breadcrumb__inner) {
  color: #666;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #303133;
  font-weight: normal;
}

.right-menu {
  display: flex;
  align-items: center;
  padding-right: 15px;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-name {
  margin: 0 5px;
}

.logout-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.logout-icon {
  font-size: 48px;
  color: #e6a23c;
  margin-bottom: 15px;
}

.logout-message {
  font-size: 16px;
  color: #303133;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 