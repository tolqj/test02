<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 系统基本信息数据
const formData = reactive({
  sysName: '后台管理系统',
  version: 'v1.0.0',
  adminEmail: 'admin@example.com',
  companyName: '示例科技有限公司',
  copyright: '© 2025 示例科技有限公司 版权所有',
  logo: '',
  description: '这是一个功能完善的后台管理系统'
})

// 提交表单
const submitForm = () => {
  // 模拟提交
  setTimeout(() => {
    ElMessage.success('系统基本信息保存成功')
  }, 500)
}

// 重置表单
const resetForm = () => {
  // 重置为初始值示例
  formData.sysName = '后台管理系统'
  formData.version = 'v1.0.0'
  formData.adminEmail = 'admin@example.com'
  formData.companyName = '示例科技有限公司'
  formData.copyright = '© 2025 示例科技有限公司 版权所有'
  formData.logo = ''
  formData.description = '这是一个功能完善的后台管理系统'
  
  ElMessage.info('表单已重置')
}
</script>

<template>
  <div class="basic-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>系统基本信息</span>
        </div>
      </template>
      
      <el-form :model="formData" label-width="120px" label-position="right">
        <el-form-item label="系统名称">
          <el-input v-model="formData.sysName" placeholder="请输入系统名称" />
        </el-form-item>
        
        <el-form-item label="系统版本">
          <el-input v-model="formData.version" placeholder="请输入系统版本" />
        </el-form-item>
        
        <el-form-item label="管理员邮箱">
          <el-input v-model="formData.adminEmail" placeholder="请输入管理员邮箱" />
        </el-form-item>
        
        <el-form-item label="公司名称">
          <el-input v-model="formData.companyName" placeholder="请输入公司名称" />
        </el-form-item>
        
        <el-form-item label="版权信息">
          <el-input v-model="formData.copyright" placeholder="请输入版权信息" />
        </el-form-item>
        
        <el-form-item label="系统LOGO">
          <el-upload
            class="avatar-uploader"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
          >
            <img v-if="formData.logo" :src="formData.logo" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">推荐尺寸: 200x200px, 支持jpg, png格式</div>
        </el-form-item>
        
        <el-form-item label="系统描述">
          <el-input 
            v-model="formData.description" 
            type="textarea" 
            :rows="4"
            placeholder="请输入系统描述"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存设置</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.basic-container {
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

.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style> 