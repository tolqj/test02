<template>
  <div class="settings-container">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <h3>系统设置</h3>
        </div>
      </template>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本设置" name="basic">
          <el-form :model="basicSettings" label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="basicSettings.systemName" />
            </el-form-item>
            <el-form-item label="系统描述">
              <el-input type="textarea" v-model="basicSettings.description" rows="3" />
            </el-form-item>
            <el-form-item label="系统Logo">
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :limit="1"
              >
                <el-icon><el-icon-plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="系统颜色">
              <el-color-picker v-model="basicSettings.primaryColor" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="安全设置" name="security">
          <el-form :model="securitySettings" label-width="180px">
            <el-form-item label="密码最小长度">
              <el-input-number v-model="securitySettings.minPasswordLength" :min="6" :max="20" />
            </el-form-item>
            <el-form-item label="密码复杂度">
              <el-select v-model="securitySettings.passwordComplexity">
                <el-option label="低" value="low" />
                <el-option label="中" value="medium" />
                <el-option label="高" value="high" />
              </el-select>
            </el-form-item>
            <el-form-item label="登录失败最大尝试次数">
              <el-input-number v-model="securitySettings.maxLoginAttempts" :min="3" :max="10" />
            </el-form-item>
            <el-form-item label="启用两步验证">
              <el-switch v-model="securitySettings.twoFactorAuth" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="通知设置" name="notification">
          <el-form :model="notificationSettings" label-width="120px">
            <el-form-item label="邮件通知">
              <el-switch v-model="notificationSettings.emailNotifications" />
            </el-form-item>
            <el-form-item label="系统通知">
              <el-switch v-model="notificationSettings.systemNotifications" />
            </el-form-item>
            <el-form-item label="SMTP服务器">
              <el-input v-model="notificationSettings.smtpServer" />
            </el-form-item>
            <el-form-item label="SMTP端口">
              <el-input v-model="notificationSettings.smtpPort" />
            </el-form-item>
            <el-form-item label="发件人邮箱">
              <el-input v-model="notificationSettings.senderEmail" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      
      <div class="settings-footer">
        <el-button type="primary" @click="saveSettings">保存设置</el-button>
        <el-button @click="resetSettings">重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')

const basicSettings = ref({
  systemName: '后台管理系统',
  description: '基于Vue3+TypeScript+ElementPlus的后台管理系统',
  primaryColor: '#409EFF'
})

const securitySettings = ref({
  minPasswordLength: 8,
  passwordComplexity: 'medium',
  maxLoginAttempts: 5,
  twoFactorAuth: false
})

const notificationSettings = ref({
  emailNotifications: true,
  systemNotifications: true,
  smtpServer: 'smtp.example.com',
  smtpPort: '587',
  senderEmail: 'no-reply@example.com'
})

const saveSettings = () => {
  // 这里添加保存设置的逻辑
  ElMessage.success('设置已保存')
}

const resetSettings = () => {
  // 这里添加重置设置的逻辑
  ElMessage.info('设置已重置')
}
</script>

<style scoped>
.settings-container {
  padding: 20px;
}

.settings-card {
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-footer {
  margin-top: 20px;
  text-align: right;
}
</style> 