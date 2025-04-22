// src/request/api.ts
import request, { get, post, put, del } from './index'
import type { PageParams, PageResponseData } from './types'

// 用户相关接口
export interface UserData {
  id: string
  username: string
  nickname: string
  email: string
  avatar: string
  role: string
  status: number
  createTime: string
  remark?: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  refreshToken: string
  userInfo: UserData
}

export interface CreateUserParams {
  username: string
  nickname: string
  password: string
  email: string
  role: string
  status: number
  avatar?: string
  remark?: string
}

// 用户服务
export const userApi = {
  // 登录
  login(data: LoginParams) {
    return post<LoginResult>('/user/login', data)
  },
  
  // 登出
  logout() {
    return post<boolean>('/user/logout')
  },
  
  // 获取用户信息
  getUserInfo() {
    return get<UserData>('/user/info')
  },
  
  // 更新用户信息
  updateUserInfo(data: Partial<UserData>) {
    return put<boolean>('/user/info', data)
  },
  
  // 获取用户列表
  getUserList(params: PageParams) {
    return get<PageResponseData<UserData>>('/user/list', params)
  },
  
  // 删除用户
  deleteUser(id: string) {
    return del<boolean>(`/user/${id}`)
  },
  
  // 创建用户
  createUser(data: CreateUserParams) {
    return post<boolean>('/user/create', data)
  }
}

// 角色相关接口
export interface RoleData {
  id: string
  name: string
  code: string
  status: number
  description: string
  createTime: string
}

// 角色服务
export const roleApi = {
  // 获取角色列表
  getRoleList(params: PageParams) {
    return get<PageResponseData<RoleData>>('/role/list', params)
  },
  
  // 获取角色详情
  getRoleDetail(id: string) {
    return get<RoleData>(`/role/${id}`)
  },
  
  // 创建角色
  createRole(data: Partial<RoleData>) {
    return post<boolean>('/role', data)
  },
  
  // 更新角色
  updateRole(id: string, data: Partial<RoleData>) {
    return put<boolean>(`/role/${id}`, data)
  },
  
  // 删除角色
  deleteRole(id: string) {
    return del<boolean>(`/role/${id}`)
  }
}

// 系统设置相关接口
export interface SystemSetting {
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

// 系统服务
export const systemApi = {
  // 获取系统设置
  getSystemSetting() {
    return get<SystemSetting>('/system/setting')
  },
  
  // 更新系统设置
  updateSystemSetting(data: Partial<SystemSetting>) {
    return post<boolean>('/system/setting', data)
  },
  
  // 获取系统统计数据
  getSystemStats() {
    return get('/system/stats')
  },
  
  // 清除系统缓存
  clearCache() {
    return post<boolean>('/system/clear-cache')
  }
}

// 统一导出所有API
export default {
  user: userApi,
  role: roleApi,
  system: systemApi
} 