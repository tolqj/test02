import type { MockConfig, MockSystemSetting, MockSystemStats } from '../types'
import { mockRequest, successResponse, errorResponse, createMockData } from '../index'
import { getLocalData, saveLocalData, parseRequestBody, formatDate } from '../helper'

// 系统设置数据存储键
const SYSTEM_SETTING_KEY = 'system_setting'

// 默认系统设置
const defaultSystemSetting: MockSystemSetting = {
  id: 1,
  siteName: '后台管理系统',
  siteUrl: 'http://example.com',
  logo: '/logo.png',
  description: '一个现代化的后台管理系统',
  keywords: '后台管理,Vue3,Element Plus',
  notice: '欢迎使用本系统，本系统使用Vue3+TS+Vite+Element Plus开发',
  recordNumber: '粤ICP备XXXXXXXX号',
  version: '1.0.0'
}

/**
 * 生成模拟系统统计数据
 * @returns 系统统计数据
 */
function createMockSystemStats(): MockSystemStats {
  return createMockData<MockSystemStats>({
    userCount: '@integer(100, 1000)',
    roleCount: '@integer(5, 20)',
    onlineCount: '@integer(10, 100)',
    todayVisits: '@integer(50, 500)',
    'cpu|1-100.1-2': 1,
    'memory|1-100.1-2': 1,
    'disk|1-100.1-2': 1,
    uptime: '@datetime'
  })
}

/**
 * 设置系统模块的mock服务
 * @param config Mock配置
 */
export function setupSystemMock(config: MockConfig): void {
  // 系统设置数据
  const systemSetting = getLocalData<MockSystemSetting>(SYSTEM_SETTING_KEY, defaultSystemSetting, config)
  
  // 获取系统设置
  mockRequest('/system/setting', 'get', () => {
    return successResponse(systemSetting)
  })
  
  // 更新系统设置
  mockRequest('/system/setting', 'post', (options: any) => {
    const { body } = options
    const settingData = parseRequestBody<Partial<MockSystemSetting>>(body)
    
    // 更新系统设置
    Object.assign(systemSetting, settingData)
    
    // 保存数据
    saveLocalData(SYSTEM_SETTING_KEY, systemSetting, config)
    
    return successResponse(systemSetting, '更新成功')
  })
  
  // 获取系统统计数据
  mockRequest('/system/stats', 'get', () => {
    return successResponse(createMockSystemStats())
  })
  
  // 清除系统缓存
  mockRequest('/system/clear-cache', 'post', () => {
    return successResponse(true, '缓存清除成功')
  })
  
  // 系统设置类型
  mockRequest('/system/settings/types', 'get', () => {
    return successResponse([
      { label: '基本设置', value: 'basic' },
      { label: '安全设置', value: 'security' },
      { label: '邮件设置', value: 'mail' },
      { label: '存储设置', value: 'storage' }
    ])
  })
  
  // 获取系统日志类型
  mockRequest('/system/log/types', 'get', () => {
    return successResponse([
      { label: '操作日志', value: 'operation' },
      { label: '登录日志', value: 'login' },
      { label: '系统日志', value: 'system' },
      { label: '错误日志', value: 'error' }
    ])
  })
  
  // 获取系统信息
  mockRequest('/system/info', 'get', () => {
    return successResponse({
      serverInfo: {
        os: 'Linux 5.11.0-43-generic x86_64',
        node: 'v16.14.0',
        npm: '8.3.1',
        cpu: 'Intel(R) Core(TM) i7-10700K CPU @ 3.80GHz',
        memory: '32GB',
        uptime: formatDate(new Date(Date.now() - Math.random() * 86400000 * 30))
      },
      appInfo: {
        name: 'Vue3AdminTemplate',
        version: '1.0.0',
        framework: 'Vue 3.2.37',
        language: 'TypeScript 4.7.4',
        bundler: 'Vite 3.0.2',
        uiFramework: 'Element Plus 2.2.16',
        router: 'Vue Router 4.1.3',
        stateManager: 'Pinia 2.0.18',
        httpClient: 'Axios 0.27.2',
        cssPreprocessor: 'SCSS'
      }
    })
  })
  
  // 检查更新
  mockRequest('/system/check-update', 'get', () => {
    // 随机决定是否有更新
    const hasUpdate = Math.random() > 0.7
    
    if (hasUpdate) {
      return successResponse({
        hasUpdate: true,
        version: '1.1.0',
        releaseDate: formatDate(new Date(Date.now() + 86400000 * 10)),
        description: '1. 修复已知问题\n2. 优化用户体验\n3. 新增功能模块',
        downloadUrl: 'https://example.com/download/v1.1.0'
      })
    } else {
      return successResponse({
        hasUpdate: false,
        currentVersion: '1.0.0'
      })
    }
  })
} 