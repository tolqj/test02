<template>
  <div>
    <el-dialog
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      title="退出登录"
      width="400px"
      :before-close="handleCancel"
      :show-close="false"
      class="custom-dialog"
      destroy-on-close
    >
      <div class="logout-content">
        <div class="icon-container">
          <el-icon class="logout-icon"><WarningFilled /></el-icon>
        </div>
        <p class="logout-title">确定要退出系统吗？</p>
        <p class="logout-message">您的登录状态将会被清除</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button 
            @click="handleCancel" 
            class="cancel-button"
            :plain="true"
            round
          >
            取消
          </el-button>
          <el-button 
            type="primary" 
            @click="handleConfirm"
            class="confirm-button"
            round
          >
            确定退出
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'logout'])

const router = useRouter()
const userStore = useUserStore()

const handleCancel = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  // 执行登出逻辑
  userStore.logout()
  
  // 发出登出事件
  emit('logout')
  
  // 关闭对话框
  emit('update:visible', false)
  
  // 提示用户
  ElMessage.success('已安全退出系统')
  
  // 跳转到登录页
  router.push('/login')
}
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #1976d2, #2196f3);
  color: white;
  padding: 16px 20px;
  margin-right: 0;
  text-align: center;
  position: relative;
}

:deep(.el-dialog__title) {
  color: white;
  font-weight: 500;
  font-size: 18px;
}

:deep(.el-dialog__body) {
  padding: 30px 20px;
}

:deep(.el-dialog__footer) {
  padding: 10px 20px 20px;
}

.logout-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 20px;
}

.icon-container {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #ff9800, #f57c00);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.logout-icon {
  font-size: 40px;
  color: white;
}

.logout-title {
  font-size: 18px;
  color: #303133;
  font-weight: 600;
  margin-bottom: 10px;
}

.logout-message {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.cancel-button {
  width: 100px;
}

.confirm-button {
  width: 120px;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  border: none;
  transition: all 0.3s;
}

.confirm-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}
</style> 