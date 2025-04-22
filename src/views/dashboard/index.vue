<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const username = ref(userStore.username || '用户')

const cardData = ref([
  { title: '总用户数', count: '1,234', icon: 'el-icon-user', color: '#40c9c6' },
  { title: '今日访问量', count: '3,485', icon: 'el-icon-view', color: '#36a3f7' },
  { title: '总销售额', count: '¥126,560', icon: 'el-icon-money', color: '#f4516c' },
  { title: '订单总数', count: '9,320', icon: 'el-icon-shopping-cart', color: '#34bfa3' }
])

// 测试退出功能
const testLogout = () => {
  try {
    // 清除登录状态
    userStore.logout()
    ElMessage.success('已成功退出系统')
    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    console.error('退出失败:', error)
    ElMessage.error('退出失败，请重试')
  }
}

onMounted(() => {
  // 这里可以获取数据
})
</script>

<template>
  <div class="dashboard-container">
    <div class="welcome-section">
      <h2>欢迎回来，{{ username }}</h2>
      <p>今天是 {{ new Date().toLocaleDateString() }}，祝您工作愉快！</p>
    </div>

    <div class="data-overview">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in cardData" :key="index">
          <el-card shadow="hover" class="data-card" :style="{ borderLeft: `5px solid ${item.color}` }">
            <div class="card-content">
              <div class="card-value">{{ item.count }}</div>
              <div class="card-title">{{ item.title }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="dashboard-main">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>访问统计</span>
              </div>
            </template>
            <div class="chart-container" style="height: 300px;">
              <div class="empty-chart">
                <el-empty description="暂无数据"></el-empty>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="task-card">
            <template #header>
              <div class="card-header">
                <span>待办事项</span>
              </div>
            </template>
            <div class="task-list">
              <el-empty description="暂无待办事项"></el-empty>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.welcome-section {
  margin-bottom: 30px;
}

.welcome-section h2 {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 10px;
}

.welcome-section p {
  color: #909399;
  margin-bottom: 20px;
}

.data-overview {
  margin-bottom: 30px;
}

.data-card {
  height: 100px;
  margin-bottom: 20px;
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.card-title {
  color: #909399;
  font-size: 14px;
}

.dashboard-main {
  margin-bottom: 20px;
}

.chart-card,
.task-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.task-list {
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style> 