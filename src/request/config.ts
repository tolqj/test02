// src/request/config.ts

// 环境变量获取
const env = import.meta.env

// API基础路径
export const BASE_URL = env.VITE_API_BASE_URL || '/api'

// 响应的成功状态码
export const SUCCESS_CODE = [200, 0]

// 默认请求超时时间
export const TIMEOUT = 15000

// 默认请求头
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json;charset=utf-8'
}

// 在这个状态码时跳转到登录页
export const UN_AUTHORIZED_CODE = 401

// 刷新token的URL
export const REFRESH_TOKEN_URL = '/auth/refresh'

// 刷新token的header key
export const REFRESH_TOKEN_HEADER_KEY = 'x-refresh-token'

// 是否开启刷新token功能
export const ENABLE_REFRESH_TOKEN = true 