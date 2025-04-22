import { defineStore } from 'pinia'

// 用户信息store
export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
  }),
  
  getters: {
    isLogin: (state) => !!state.token,
    username: (state) => state.userInfo.username || '',
    avatar: (state) => state.userInfo.avatar || ''
  },
  
  actions: {
    // 设置token
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    // 设置用户信息
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    
    // 登出
    logout() {
      this.token = ''
      this.userInfo = {}
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
})

// 应用设置store
export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: localStorage.getItem('sidebarStatus') ? 
        !!+localStorage.getItem('sidebarStatus')! : true
    },
    theme: localStorage.getItem('theme') || 'light'
  }),
  
  actions: {
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened
      localStorage.setItem('sidebarStatus', this.sidebar.opened ? '1' : '0')
    },
    
    setTheme(theme: string) {
      this.theme = theme
      localStorage.setItem('theme', theme)
    }
  }
})

// 导出所有store
export default {
  useUserStore,
  useAppStore
} 