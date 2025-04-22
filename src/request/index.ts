import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import type { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'
import { useRouter } from 'vue-router'
import { 
  BASE_URL, 
  TIMEOUT, 
  DEFAULT_HEADERS, 
  SUCCESS_CODE, 
  UN_AUTHORIZED_CODE, 
  REFRESH_TOKEN_URL,
  REFRESH_TOKEN_HEADER_KEY,
  ENABLE_REFRESH_TOKEN
} from './config'
import type { RequestOptions, ResponseData, RequestInstance } from './types'

// 扩展 AxiosRequestConfig 类型
declare module 'axios' {
  export interface InternalAxiosRequestConfig extends AxiosRequestConfig {
    showLoading?: boolean
    showError?: boolean
    errorHandler?: (message: string) => void
    returnOriginal?: boolean
    _isRetry?: boolean
  }
  
  export interface AxiosRequestConfig {
    showLoading?: boolean
    showError?: boolean
    errorHandler?: (message: string) => void
    returnOriginal?: boolean
    _isRetry?: boolean
  }
}

// 创建请求类
class Request {
  // axios实例
  private axiosInstance: AxiosInstance
  // loading实例
  private loadingInstance: LoadingInstance | null = null
  // 是否正在刷新token
  private isRefreshing = false
  // 请求队列
  private requestQueue: Array<() => void> = []

  constructor(config: AxiosRequestConfig) {
    this.axiosInstance = axios.create(config)
    this.setupInterceptors()
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 是否显示loading
        const showLoading = config.showLoading !== false
        if (showLoading) {
          this.loadingInstance = ElLoading.service({
            lock: true,
            text: '加载中...',
            background: 'rgba(0, 0, 0, 0.7)'
          })
        }

        // 获取token并添加到请求头
        const token = localStorage.getItem('token')
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`
        }

        // 添加刷新token
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken && config.headers) {
          config.headers[REFRESH_TOKEN_HEADER_KEY] = refreshToken
        }

        return config
      },
      (error) => {
        // 对请求错误做些什么
        console.error('请求错误：', error)
        this.loadingInstance?.close()
        this.loadingInstance = null
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        this.closeLoading()
        
        const config = response.config
        const res = response.data
        const returnOriginal = config.returnOriginal || false

        // 如果需要返回原始响应
        if (returnOriginal) {
          return response
        }
        
        // 根据自定义错误码判断请求是否成功
        if (SUCCESS_CODE.includes(res.code)) {
          // 成功返回数据
          return res.data
        } else {
          // 处理业务错误
          const message = res.message || '操作失败'
          const showError = config.showError !== false
          
          if (showError) {
            if (config.errorHandler) {
              config.errorHandler(message)
            } else {
              ElMessage.error(message)
            }
          }
          
          return Promise.reject(new Error(message))
        }
      },
      async (error) => {
        this.closeLoading()
        
        // 如果响应错误是由取消请求引起的，则不做任何处理
        if (axios.isCancel(error)) {
          return Promise.reject(error)
        }
        
        const { response, config } = error
        // 默认显示错误信息
        const showError = config?.showError !== false

        // token过期或未授权
        if (ENABLE_REFRESH_TOKEN && response?.status === UN_AUTHORIZED_CODE && config && !config._isRetry) {
          return this.handleTokenRefresh(config)
        }

        // 处理 HTTP 错误状态码
        let message = this.getErrorMessage(error)

        if (showError) {
          if (config?.errorHandler) {
            config.errorHandler(message)
          } else {
            ElMessage.error(message)
          }
        }

        // 401错误，可能需要跳转到登录页
        if (response?.status === UN_AUTHORIZED_CODE) {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          
          // 使用延时，避免路由守卫还没注册完成
          setTimeout(() => {
            window.location.href = '/login'
          }, 1500)
        }

        return Promise.reject(error)
      }
    )
  }

  // 处理token刷新
  private async handleTokenRefresh(config: AxiosRequestConfig) {
    if (!this.isRefreshing) {
      this.isRefreshing = true

      try {
        // 尝试刷新token
        interface TokenResult {
          token: string;
          refreshToken: string;
        }

        const res = await this.axiosInstance.post<ResponseData<TokenResult>>(
          REFRESH_TOKEN_URL, 
          null, 
          {
            showLoading: false,
            showError: false,
            returnOriginal: true,
            _isRetry: true
          }
        )

        const responseData = res.data as unknown as ResponseData<TokenResult>;
        const { token, refreshToken } = responseData.data;
        
        // 更新本地存储的token
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)

        // 执行队列中的请求
        this.requestQueue.forEach(cb => cb())
        this.requestQueue = []

        // 重试当前请求
        return this.axiosInstance(Object.assign({}, config, { _isRetry: true }))
      } catch (err) {
        // 刷新token失败，清空token并跳转到登录页
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        this.isRefreshing = false
      }
    } else {
      // 将请求加入队列
      return new Promise(resolve => {
        this.requestQueue.push(() => {
          resolve(this.axiosInstance(Object.assign({}, config, { _isRetry: true })))
        })
      })
    }
  }

  // 关闭loading
  private closeLoading() {
    if (this.loadingInstance) {
      this.loadingInstance.close()
      this.loadingInstance = null
    }
  }

  // 获取错误信息
  private getErrorMessage(error: any): string {
    let message = ''
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `请求失败: ${status}`
      }

      // 尝试从响应数据中获取更具体的错误信息
      const data = error.response.data
      if (data && data.message) {
        message = data.message
      }
    } else if (error.request) {
      message = '服务器无响应'
    } else if (error.message) {
      if (error.message.includes('timeout')) {
        message = '请求超时'
      } else {
        message = error.message
      }
    } else {
      message = '网络连接异常,请检查您的网络!'
    }
    
    return message
  }

  // 通用请求方法
  request<T = any>(config: RequestOptions): Promise<T> {
    return this.axiosInstance.request(config)
  }

  // GET请求
  get<T = any>(url: string, params?: any, options?: RequestOptions): Promise<T> {
    return this.axiosInstance.get(url, { params, ...options })
  }

  // POST请求
  post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.axiosInstance.post(url, data, options)
  }

  // PUT请求
  put<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.axiosInstance.put(url, data, options)
  }

  // DELETE请求
  delete<T = any>(url: string, params?: any, options?: RequestOptions): Promise<T> {
    return this.axiosInstance.delete(url, { params, ...options })
  }
}

// 创建请求实例
const request = new Request({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: DEFAULT_HEADERS
})

export default request as RequestInstance

// 导出请求方法
export const get = <T = any>(url: string, params?: any, options?: RequestOptions): Promise<T> => 
  request.get<T>(url, params, options)

export const post = <T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> => 
  request.post<T>(url, data, options)

export const put = <T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> => 
  request.put<T>(url, data, options)

export const del = <T = any>(url: string, params?: any, options?: RequestOptions): Promise<T> => 
  request.delete<T>(url, params, options) 