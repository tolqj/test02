<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 数据安全设置
const securityForm = reactive({
  // 密码策略
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpireDays: 90
  },
  
  // 登录安全
  loginSecurity: {
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 30,
    enableTwoFactor: false,
    allowMultipleLogin: false
  },
  
  // 数据备份
  dataBackup: {
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    backupLocation: '本地存储'
  }
})

// 验证码方式选项
const twoFactorOptions = [
  { label: '短信验证码', value: 'sms' },
  { label: '邮箱验证码', value: 'email' },
  { label: '谷歌验证器', value: 'google' }
]

// 备份频率选项
const backupFrequencyOptions = [
  { label: '每天', value: 'daily' },
  { label: '每周', value: 'weekly' },
  { label: '每月', value: 'monthly' }
]

// 存储位置选项
const backupLocationOptions = [
  { label: '本地存储', value: 'local' },
  { label: '云存储', value: 'cloud' },
  { label: 'FTP服务器', value: 'ftp' }
]

// 提交表单
const saveSettings = () => {
  // 模拟保存
  setTimeout(() => {
    ElMessage.success('安全设置保存成功')
  }, 500)
}

// 立即备份
const backupNow = () => {
  // 模拟备份操作
  ElMessage.info('正在执行数据备份...')
  
  setTimeout(() => {
    ElMessage.success('数据备份成功')
  }, 2000)
}
</script>

<template>
  <div class="security-container">
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>密码策略</span>
        </div>
      </template>
      
      <el-form :model="securityForm.passwordPolicy" label-width="180px">
        <el-form-item label="密码最小长度">
          <el-input-number 
            v-model="securityForm.passwordPolicy.minLength" 
            :min="6" 
            :max="24"
          />
        </el-form-item>
        
        <el-form-item label="密码要求包含大写字母">
          <el-switch v-model="securityForm.passwordPolicy.requireUppercase" />
        </el-form-item>
        
        <el-form-item label="密码要求包含小写字母">
          <el-switch v-model="securityForm.passwordPolicy.requireLowercase" />
        </el-form-item>
        
        <el-form-item label="密码要求包含数字">
          <el-switch v-model="securityForm.passwordPolicy.requireNumbers" />
        </el-form-item>
        
        <el-form-item label="密码要求包含特殊字符">
          <el-switch v-model="securityForm.passwordPolicy.requireSpecialChars" />
        </el-form-item>
        
        <el-form-item label="密码过期天数">
          <el-input-number 
            v-model="securityForm.passwordPolicy.passwordExpireDays" 
            :min="0" 
            :max="365"
          />
          <span class="form-tip">0 表示永不过期</span>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>登录安全</span>
        </div>
      </template>
      
      <el-form :model="securityForm.loginSecurity" label-width="180px">
        <el-form-item label="最大失败登录次数">
          <el-input-number 
            v-model="securityForm.loginSecurity.maxLoginAttempts" 
            :min="1" 
            :max="10"
          />
          <span class="form-tip">超过次数账户将被锁定</span>
        </el-form-item>
        
        <el-form-item label="账户锁定时间(分钟)">
          <el-input-number 
            v-model="securityForm.loginSecurity.lockoutDuration" 
            :min="5" 
            :max="1440"
          />
        </el-form-item>
        
        <el-form-item label="会话超时时间(分钟)">
          <el-input-number 
            v-model="securityForm.loginSecurity.sessionTimeout" 
            :min="5" 
            :max="180"
          />
          <span class="form-tip">用户无操作超过该时间将自动退出</span>
        </el-form-item>
        
        <el-form-item label="启用双因素认证">
          <el-switch v-model="securityForm.loginSecurity.enableTwoFactor" />
        </el-form-item>
        
        <el-form-item label="允许多处登录">
          <el-switch v-model="securityForm.loginSecurity.allowMultipleLogin" />
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>数据备份</span>
        </div>
      </template>
      
      <el-form :model="securityForm.dataBackup" label-width="180px">
        <el-form-item label="启用自动备份">
          <el-switch v-model="securityForm.dataBackup.autoBackup" />
        </el-form-item>
        
        <el-form-item label="备份频率">
          <el-select v-model="securityForm.dataBackup.backupFrequency">
            <el-option 
              v-for="item in backupFrequencyOptions" 
              :key="item.value" 
              :label="item.label" 
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="备份保留时间(天)">
          <el-input-number 
            v-model="securityForm.dataBackup.backupRetention" 
            :min="1" 
            :max="365"
          />
        </el-form-item>
        
        <el-form-item label="备份存储位置">
          <el-select v-model="securityForm.dataBackup.backupLocation">
            <el-option 
              v-for="item in backupLocationOptions" 
              :key="item.value" 
              :label="item.label" 
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="backupNow">立即备份</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <div class="action-buttons">
      <el-button type="primary" @click="saveSettings">保存所有设置</el-button>
    </div>
  </div>
</template>

<style scoped>
.security-container {
  padding: 20px;
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-tip {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}

.action-buttons {
  margin-top: 20px;
  text-align: center;
}
</style> 