import Mock from 'mockjs'
import { setupUserMock } from './modules/user'
import { setupRoleMock } from './modules/role'
import { setupSystemMock } from './modules/system'
import type { MockConfig } from './types'

// 设置全局延迟，模拟网络请求延迟
Mock.setup({
  timeout: '300-600'
})

// 关闭控制台输出
// @ts-ignore
Mock.XHR.prototype.withCredentials = true

// Mock配置
const mockConfig: MockConfig = {
  // 是否启用mock
  enable: true,
  // mock基础路径
  baseURL: '/api',
  // 是否启用本地存储(localStorage)模拟数据持久化
  enableLocalStorage: true
}

// 导出配置
export { mockConfig }

/**
 * 注册所有模块的mock服务
 */
export function setupMock(): void {
  if (!mockConfig.enable) {
    return
  }
  
  // 用户模块
  setupUserMock(mockConfig)
  
  // 角色模块
  setupRoleMock(mockConfig)
  
  // 系统模块
  setupSystemMock(mockConfig)
  
  console.log('Mock service is running...')
}

/**
 * 创建Mock数据
 * @param template Mock.js模板
 * @returns Mock数据
 */
export function createMockData<T>(template: object): T {
  return Mock.mock(template) as T
}

/**
 * 注册Mock接口
 * @param url 请求地址
 * @param method 请求方法
 * @param response 响应数据或响应函数
 */
export function mockRequest(
  url: string,
  method: 'get' | 'post' | 'put' | 'delete',
  response: any
): void {
  // 判断url是否包含baseURL
  if (!url.startsWith(mockConfig.baseURL)) {
    url = `${mockConfig.baseURL}${url.startsWith('/') ? url : `/${url}`}`
  }
  
  Mock.mock(new RegExp(url), method, response)
}

/**
 * 创建成功响应
 * @param data 响应数据
 * @param message 响应消息
 * @returns 标准响应对象
 */
export function successResponse<T = any>(data: T, message = '操作成功'): { code: number; data: T; message: string } {
  return {
    code: 200,
    data,
    message
  }
}

/**
 * 创建失败响应
 * @param message 错误消息
 * @param code 错误码
 * @returns 标准响应对象
 */
export function errorResponse(message = '操作失败', code = 500): { code: number; data: null; message: string } {
  return {
    code,
    data: null,
    message
  }
}

// 导出mock辅助函数
export * from './helper' 