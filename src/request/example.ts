// src/request/example.ts
import { ref, reactive } from 'vue'
import api from './api'
import { ElMessage } from 'element-plus'
import type { PageParams, PageResponseData } from './types'
import type { UserData, LoginParams, RoleData } from './api'

/**
 * 登录示例
 */
export function useLogin() {
  const loginForm = reactive<LoginParams>({
    username: '',
    password: ''
  })
  
  const loading = ref(false)
  
  const handleLogin = async () => {
    try {
      loading.value = true
      const result = await api.user.login(loginForm)
      // 存储 token
      localStorage.setItem('token', result.token)
      localStorage.setItem('refreshToken', result.refreshToken)
      ElMessage.success('登录成功')
      return result
    } catch (error) {
      console.error('登录失败', error)
      return null
    } finally {
      loading.value = false
    }
  }
  
  return {
    loginForm,
    loading,
    handleLogin
  }
}

/**
 * 用户列表示例
 */
export function useUserList() {
  const userList = ref<UserData[]>([])
  const total = ref(0)
  const loading = ref(false)
  const queryParams = reactive<PageParams>({
    page: 1,
    pageSize: 10,
    keyword: ''
  })
  
  // 获取用户列表
  const getUserList = async () => {
    try {
      loading.value = true
      const res = await api.user.getUserList(queryParams)
      userList.value = res.list
      total.value = res.total
    } catch (error) {
      console.error('获取用户列表失败', error)
    } finally {
      loading.value = false
    }
  }
  
  // 删除用户
  const deleteUser = async (id: number) => {
    try {
      await api.user.deleteUser(id)
      ElMessage.success('删除成功')
      // 刷新列表
      getUserList()
    } catch (error) {
      console.error('删除用户失败', error)
    }
  }
  
  // 页码改变
  const handlePageChange = (page: number) => {
    queryParams.page = page
    getUserList()
  }
  
  // 每页条数改变
  const handleSizeChange = (size: number) => {
    queryParams.pageSize = size
    queryParams.page = 1
    getUserList()
  }
  
  return {
    userList,
    total,
    loading,
    queryParams,
    getUserList,
    deleteUser,
    handlePageChange,
    handleSizeChange
  }
}

/**
 * 角色管理示例
 */
export function useRoleManagement() {
  const roleList = ref<RoleData[]>([])
  const currentRole = ref<RoleData | null>(null)
  const loading = ref(false)
  const dialogVisible = ref(false)
  const dialogType = ref<'add' | 'edit'>('add')
  
  // 查询角色列表
  const getRoleList = async () => {
    try {
      loading.value = true
      const res = await api.role.getRoleList({ page: 1, pageSize: 999 })
      roleList.value = res.list
    } catch (error) {
      console.error('获取角色列表失败', error)
    } finally {
      loading.value = false
    }
  }
  
  // 添加角色
  const addRole = async (form: Partial<RoleData>) => {
    try {
      loading.value = true
      await api.role.createRole(form)
      ElMessage.success('添加成功')
      dialogVisible.value = false
      getRoleList()
    } catch (error) {
      console.error('添加角色失败', error)
    } finally {
      loading.value = false
    }
  }
  
  // 编辑角色
  const editRole = async (id: number, form: Partial<RoleData>) => {
    try {
      loading.value = true
      await api.role.updateRole(id, form)
      ElMessage.success('更新成功')
      dialogVisible.value = false
      getRoleList()
    } catch (error) {
      console.error('编辑角色失败', error)
    } finally {
      loading.value = false
    }
  }
  
  // 删除角色
  const deleteRole = async (id: number) => {
    try {
      await api.role.deleteRole(id)
      ElMessage.success('删除成功')
      getRoleList()
    } catch (error) {
      console.error('删除角色失败', error)
    }
  }
  
  // 打开添加对话框
  const openAddDialog = () => {
    dialogType.value = 'add'
    currentRole.value = null
    dialogVisible.value = true
  }
  
  // 打开编辑对话框
  const openEditDialog = async (id: number) => {
    try {
      dialogType.value = 'edit'
      loading.value = true
      const role = await api.role.getRoleDetail(id)
      currentRole.value = role
      dialogVisible.value = true
    } catch (error) {
      console.error('获取角色详情失败', error)
    } finally {
      loading.value = false
    }
  }
  
  return {
    roleList,
    currentRole,
    loading,
    dialogVisible,
    dialogType,
    getRoleList,
    addRole,
    editRole,
    deleteRole,
    openAddDialog,
    openEditDialog
  }
}

/**
 * 系统设置示例
 */
export function useSystemSettings() {
  const loading = ref(false)
  const settings = ref<any>(null)
  
  // 获取系统设置
  const getSettings = async () => {
    try {
      loading.value = true
      const res = await api.system.getSystemSetting()
      settings.value = res
    } catch (error) {
      console.error('获取系统设置失败', error)
    } finally {
      loading.value = false
    }
  }
  
  // 保存系统设置
  const saveSettings = async (form: any) => {
    try {
      loading.value = true
      await api.system.updateSystemSetting(form)
      ElMessage.success('保存成功')
      getSettings()
    } catch (error) {
      console.error('保存系统设置失败', error)
    } finally {
      loading.value = false
    }
  }
  
  // 清除系统缓存
  const clearCache = async () => {
    try {
      loading.value = true
      await api.system.clearCache()
      ElMessage.success('缓存清除成功')
    } catch (error) {
      console.error('清除缓存失败', error)
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    settings,
    getSettings,
    saveSettings,
    clearCache
  }
} 