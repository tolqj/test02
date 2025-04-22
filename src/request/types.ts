// src/request/types.ts
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

// 接口响应通用格式
export interface ResponseData<T = any> {
  code: number
  data: T
  message: string
}

// 自定义扩展的AxiosRequestConfig
export interface RequestOptions extends AxiosRequestConfig {
  // 是否显示loading
  showLoading?: boolean
  // 是否显示错误信息
  showError?: boolean
  // 错误信息自定义处理
  errorHandler?: (message: string) => void
  // 是否返回原始响应数据
  returnOriginal?: boolean
}

// 分页请求参数
export interface PageParams {
  page: number
  pageSize: number
  [key: string]: any
}

// 分页响应数据
export interface PageResponseData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 自定义请求方法
export type RequestMethod = <T = any>(
  url: string, 
  params?: any, 
  options?: RequestOptions
) => Promise<T>

// 请求实例类型
export interface RequestInstance {
  get: RequestMethod
  post: RequestMethod
  put: RequestMethod
  delete: RequestMethod
  request: <T = any>(config: RequestOptions) => Promise<T>
} 