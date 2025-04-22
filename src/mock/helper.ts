import type { MockConfig } from './types'

// 本地存储前缀
const STORAGE_PREFIX = 'mock_data_'

/**
 * 从localStorage读取mock数据
 * @param key 存储键名
 * @param defaultValue 默认值
 * @param config Mock配置
 * @returns 存储的数据或默认值
 */
export function getLocalData<T>(key: string, defaultValue: T, config: MockConfig): T {
  if (!config.enableLocalStorage) {
    return defaultValue
  }
  
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    if (data) {
      return JSON.parse(data) as T
    }
  } catch (error) {
    console.error('Failed to get mock data from localStorage:', error)
  }
  
  return defaultValue
}

/**
 * 将mock数据保存到localStorage
 * @param key 存储键名
 * @param value 存储的数据
 * @param config Mock配置
 */
export function saveLocalData<T>(key: string, value: T, config: MockConfig): void {
  if (!config.enableLocalStorage) {
    return
  }
  
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save mock data to localStorage:', error)
  }
}

/**
 * 从localStorage删除mock数据
 * @param key 存储键名
 * @param config Mock配置
 */
export function removeLocalData(key: string, config: MockConfig): void {
  if (!config.enableLocalStorage) {
    return
  }
  
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`)
  } catch (error) {
    console.error('Failed to remove mock data from localStorage:', error)
  }
}

/**
 * 生成UUID
 * @returns UUID字符串
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 生成唯一ID
 * @returns 数字ID
 */
export function generateId(): number {
  return Math.floor(Math.random() * 10000) + new Date().getTime()
}

/**
 * 将对象转换为查询字符串
 * @param obj 对象
 * @returns 查询字符串
 */
export function toQueryString(obj: Record<string, any>): string {
  return Object.keys(obj)
    .filter(key => obj[key] !== undefined && obj[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

/**
 * 从URL中解析查询参数
 * @param url URL字符串
 * @returns 解析后的参数对象
 */
export function parseUrlParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  const queryString = url.split('?')[1]
  
  if (!queryString) {
    return params
  }
  
  const searchParams = new URLSearchParams(queryString)
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return params
}

/**
 * 从请求体解析JSON
 * @param body 请求体
 * @returns 解析后的对象
 */
export function parseRequestBody<T = any>(body: string): T {
  try {
    return JSON.parse(body) as T
  } catch (error) {
    console.error('Failed to parse request body:', error)
    return {} as T
  }
}

/**
 * 延迟执行函数
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number, format = 'yyyy-MM-dd HH:mm:ss'): string {
  const d = new Date(date)
  
  const formatMap: Record<string, number> = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'H+': d.getHours(),
    'h+': d.getHours() > 12 ? d.getHours() - 12 : d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    'S': d.getMilliseconds()
  }
  
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  
  for (const k in formatMap) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1, 
        RegExp.$1.length === 1 
          ? formatMap[k].toString() 
          : ('00' + formatMap[k]).substr(('' + formatMap[k]).length)
      )
    }
  }
  
  return format
} 