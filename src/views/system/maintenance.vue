<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 系统状态信息
const systemInfo = reactive({
  currentVersion: 'v1.0.0',
  lastCheckTime: '2025-04-20 08:30:45',
  latestVersion: 'v1.0.1',
  hasUpdate: true,
  serverStatus: '正常',
  cpuUsage: 45,
  memoryUsage: 62,
  diskUsage: 38,
  runningTime: '27天12小时35分钟',
  updateLog: '- 修复已知bug\n- 优化系统性能\n- 新增数据导出功能\n- 提升安全性'
})

// 缓存信息
const cacheInfo = reactive({
  totalSize: '128MB',
  lastCleanTime: '2025-04-15 15:20:30',
  systemCache: '78MB',
  userCache: '32MB',
  tempFiles: '18MB'
})

// 维护模式相关
const maintenanceMode = ref(false)
const maintenanceReason = ref('系统例行维护')
const estimatedTime = ref(60)

// 系统日志
const systemLogs = ref([
  { time: '2025-04-20 10:30:45', level: 'info', message: '系统自动备份完成' },
  { time: '2025-04-19 18:45:12', level: 'warning', message: '磁盘空间低于20%警告' },
  { time: '2025-04-18 09:12:36', level: 'error', message: '数据库连接异常，已自动恢复' },
  { time: '2025-04-17 14:25:57', level: 'info', message: '用户admin执行了系统参数配置修改' },
  { time: '2025-04-16 08:30:22', level: 'info', message: '系统自动更新检查完成' }
])

// 检查更新
const checkForUpdates = () => {
  ElMessage.info('正在检查系统更新...')
  
  // 模拟检查更新
  setTimeout(() => {
    systemInfo.lastCheckTime = new Date().toLocaleString()
    ElMessage.success('检查完成，发现新版本')
  }, 1500)
}

// 系统升级
const upgradeSystem = () => {
  ElMessageBox.confirm(
    `确定要升级到最新版本 ${systemInfo.latestVersion} 吗？升级过程中系统将暂时无法使用。`,
    '系统升级确认',
    {
      confirmButtonText: '确定升级',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.info('系统升级中，请勿关闭浏览器...')
    
    // 模拟升级过程
    setTimeout(() => {
      systemInfo.currentVersion = systemInfo.latestVersion
      systemInfo.hasUpdate = false
      ElMessage.success('系统升级成功，即将刷新页面')
      
      // 模拟页面刷新
      setTimeout(() => {
        ElMessage.success('系统已更新到最新版本')
      }, 1000)
    }, 3000)
  }).catch(() => {
    ElMessage.info('已取消升级')
  })
}

// 清理缓存
const cleanCache = () => {
  ElMessage.info('正在清理系统缓存...')
  
  // 模拟清理过程
  setTimeout(() => {
    cacheInfo.lastCleanTime = new Date().toLocaleString()
    cacheInfo.systemCache = '0MB'
    cacheInfo.userCache = '0MB'
    cacheInfo.tempFiles = '0MB'
    cacheInfo.totalSize = '0MB'
    
    ElMessage.success('缓存清理完成')
  }, 2000)
}

// 启用/禁用维护模式
const toggleMaintenanceMode = () => {
  if (!maintenanceMode.value) {
    ElMessageBox.confirm(
      '启用维护模式后，除管理员外的所有用户将无法访问系统。确定要继续吗？',
      '启用维护模式',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      maintenanceMode.value = true
      ElMessage.success('维护模式已启用')
    }).catch(() => {
      ElMessage.info('已取消操作')
    })
  } else {
    maintenanceMode.value = false
    ElMessage.success('维护模式已关闭，系统恢复正常访问')
  }
}

// 重启系统
const restartSystem = () => {
  ElMessageBox.confirm(
    '重启系统将导致所有用户断开连接，确定要继续吗？',
    '重启系统',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.info('系统正在重启，请稍候...')
    
    // 模拟重启过程
    setTimeout(() => {
      ElMessage.success('系统已重启完成')
    }, 3000)
  }).catch(() => {
    ElMessage.info('已取消重启')
  })
}
</script>

<template>
  <div class="maintenance-container">
    <!-- 系统状态卡片 -->
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>系统状态</span>
          <el-button type="primary" size="small" @click="checkForUpdates">检查更新</el-button>
        </div>
      </template>
      
      <div class="system-info">
        <div class="info-row">
          <div class="info-item">
            <div class="info-label">当前版本</div>
            <div class="info-value">{{ systemInfo.currentVersion }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">最新版本</div>
            <div class="info-value">{{ systemInfo.latestVersion }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">上次检查</div>
            <div class="info-value">{{ systemInfo.lastCheckTime }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">服务器状态</div>
            <div class="info-value">{{ systemInfo.serverStatus }}</div>
          </div>
        </div>
        
        <div class="info-row">
          <div class="info-item">
            <div class="info-label">CPU使用率</div>
            <el-progress :percentage="systemInfo.cpuUsage"></el-progress>
          </div>
          <div class="info-item">
            <div class="info-label">内存使用率</div>
            <el-progress :percentage="systemInfo.memoryUsage" color="#f56c6c"></el-progress>
          </div>
          <div class="info-item">
            <div class="info-label">磁盘使用率</div>
            <el-progress :percentage="systemInfo.diskUsage" color="#67c23a"></el-progress>
          </div>
        </div>
        
        <div class="button-row" v-if="systemInfo.hasUpdate">
          <el-button type="danger" @click="upgradeSystem">立即升级到 {{ systemInfo.latestVersion }}</el-button>
        </div>
        
        <el-collapse v-if="systemInfo.hasUpdate">
          <el-collapse-item title="更新日志">
            <pre class="update-log">{{ systemInfo.updateLog }}</pre>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
    
    <!-- 缓存管理卡片 -->
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>缓存管理</span>
          <el-button type="primary" size="small" @click="cleanCache">清理所有缓存</el-button>
        </div>
      </template>
      
      <div class="cache-info">
        <div class="info-row">
          <div class="info-item">
            <div class="info-label">总缓存大小</div>
            <div class="info-value">{{ cacheInfo.totalSize }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">上次清理时间</div>
            <div class="info-value">{{ cacheInfo.lastCleanTime }}</div>
          </div>
        </div>
        
        <el-divider content-position="left">缓存占用详情</el-divider>
        
        <div class="info-row cache-details">
          <div class="info-item">
            <div class="info-label">系统缓存</div>
            <div class="info-value">{{ cacheInfo.systemCache }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">用户缓存</div>
            <div class="info-value">{{ cacheInfo.userCache }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">临时文件</div>
            <div class="info-value">{{ cacheInfo.tempFiles }}</div>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 系统维护卡片 -->
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>系统维护</span>
          <el-tag :type="maintenanceMode ? 'danger' : 'success'">
            {{ maintenanceMode ? '维护模式已启用' : '系统正常运行中' }}
          </el-tag>
        </div>
      </template>
      
      <div class="maintenance-content">
        <el-form label-width="150px">
          <el-form-item label="维护原因">
            <el-input v-model="maintenanceReason" :disabled="maintenanceMode" />
          </el-form-item>
          
          <el-form-item label="预计维护时长(分钟)">
            <el-input-number v-model="estimatedTime" :min="1" :max="1440" :disabled="maintenanceMode" />
          </el-form-item>
          
          <el-form-item>
            <el-button :type="maintenanceMode ? 'success' : 'danger'" @click="toggleMaintenanceMode">
              {{ maintenanceMode ? '关闭维护模式' : '启用维护模式' }}
            </el-button>
            <el-button type="warning" @click="restartSystem">重启系统</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    
    <!-- 系统日志卡片 -->
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>系统日志</span>
          <el-button type="primary" size="small" link>查看更多</el-button>
        </div>
      </template>
      
      <div class="system-logs">
        <el-table :data="systemLogs" style="width: 100%">
          <el-table-column prop="time" label="时间" width="180" />
          <el-table-column prop="level" label="级别" width="100">
            <template #default="scope">
              <el-tag
                :type="scope.row.level === 'error' ? 'danger' : scope.row.level === 'warning' ? 'warning' : 'info'"
                size="small"
              >
                {{ scope.row.level }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="message" label="内容" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.maintenance-container {
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

.info-row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.info-item {
  flex: 1;
  min-width: 200px;
  margin-right: 20px;
  margin-bottom: 10px;
}

.info-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.info-value {
  font-size: 16px;
  font-weight: bold;
}

.button-row {
  margin: 15px 0;
  text-align: center;
}

.update-log {
  background-color: #f7f7f7;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
}

.cache-details {
  margin-top: 10px;
}

.maintenance-content {
  padding: 10px 0;
}

.system-logs {
  max-height: 300px;
  overflow-y: auto;
}
</style> 