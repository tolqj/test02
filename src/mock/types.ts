// mock配置类型
export interface MockConfig {
  // 是否启用mock
  enable: boolean
  // mock基础路径
  baseURL: string
  // 是否启用本地存储(localStorage)模拟数据持久化
  enableLocalStorage: boolean
}

// 标准响应类型
export interface MockResponse<T = any> {
  code: number
  data: T
  message: string
}

// 分页请求参数
export interface MockPaginationParams {
  page: number
  pageSize: number
  [key: string]: any
}

// 分页响应数据
export interface MockPaginationData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 用户数据类型
export interface MockUserData {
  id: string
  username: string
  nickname: string
  email: string
  avatar?: string
  role: string
  status: number
  createTime: string
  remark?: string
}

// 角色数据类型
export interface MockRoleData {
  id: number
  name: string
  code: string
  status: number
  description: string
  createTime: string
  menuIds?: number[]
}

// 系统设置数据类型
export interface MockSystemSetting {
  id: number
  siteName: string
  siteUrl: string
  logo: string
  description: string
  keywords: string
  notice: string
  recordNumber: string
  version: string
}

// 系统统计数据类型
export interface MockSystemStats {
  userCount: number
  roleCount: number
  onlineCount: number
  todayVisits: number
  cpu: number
  memory: number
  disk: number
  uptime: string
}

// 登录参数类型
export interface MockLoginParams {
  username: string
  password: string
}

// 登录返回数据类型
export interface MockLoginResult {
  token: string
  refreshToken: string
  userInfo: MockUserData
} 