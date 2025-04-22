<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-message">页面不存在</h2>
      <p class="error-description">抱歉，您访问的页面不存在或已被删除</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #f0f2f5;
}

.not-found-content {
  padding: 20px;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #409EFF;
  margin: 0;
  text-shadow: 4px 4px 0 #e0e0e0;
}

.error-message {
  font-size: 32px;
  color: #303133;
  margin: 20px 0;
}

.error-description {
  font-size: 16px;
  color: #909399;
  margin-bottom: 30px;
}
</style> 