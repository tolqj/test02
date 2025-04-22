<template>
  <div>
    <el-dropdown-item divided @click="showLogoutDialog = true">
      <el-icon><SwitchButton /></el-icon>
      <span>退出登录</span>
    </el-dropdown-item>

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

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores'
import { WarningFilled, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const showLogoutDialog = ref(false)

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
</script>

<style scoped>
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