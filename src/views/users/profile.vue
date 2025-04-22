<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <h3>个人中心</h3>
        </div>
      </template>
      <div class="profile-content">
        <div class="avatar-section">
          <el-avatar :size="100" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          <el-button type="primary" size="small" class="upload-btn">更换头像</el-button>
        </div>
        
        <el-divider />
        
        <div class="info-section">
          <el-form :model="userInfo" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="userInfo.username" disabled />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="userInfo.name" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userInfo.email" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="userInfo.phone" />
            </el-form-item>
            <el-form-item label="职位">
              <el-input v-model="userInfo.position" />
            </el-form-item>
            <el-form-item label="部门">
              <el-input v-model="userInfo.department" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveProfile">保存修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const userInfo = ref({
  username: 'admin',
  name: 'Admin User',
  email: 'admin@example.com',
  phone: '13800138000',
  position: '系统管理员',
  department: '技术部'
})

const saveProfile = () => {
  // 这里添加保存个人信息的逻辑
  ElMessage.success('个人信息已更新')
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.upload-btn {
  margin-top: 10px;
}

.info-section {
  max-width: 600px;
  margin: 0 auto;
}
</style> 