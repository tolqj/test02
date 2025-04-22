import type { MockConfig, MockRoleData, MockPaginationData } from '../types'
import { mockRequest, successResponse, errorResponse, createMockData } from '../index'
import { getLocalData, saveLocalData, generateId, parseUrlParams, parseRequestBody, formatDate } from '../helper'

// 角色数据存储键
const ROLE_DATA_KEY = 'roles'

// 默认角色数据
const defaultRoles: MockRoleData[] = [
  {
    id: 1,
    name: '超级管理员',
    code: 'admin',
    status: 1,
    description: '拥有所有权限的超级管理员角色',
    createTime: formatDate(new Date(2022, 0, 1)),
    menuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: 2,
    name: '普通用户',
    code: 'user',
    status: 1,
    description: '普通用户角色，拥有基础权限',
    createTime: formatDate(new Date(2022, 1, 15)),
    menuIds: [1, 2, 3]
  },
  {
    id: 3,
    name: '访客',
    code: 'visitor',
    status: 1,
    description: '访客角色，仅有查看权限',
    createTime: formatDate(new Date(2022, 2, 20)),
    menuIds: [1]
  }
]

/**
 * 创建模拟角色数据
 * @param count 角色数量
 * @returns 角色数据数组
 */
function createMockRoles(count: number): MockRoleData[] {
  const roles: MockRoleData[] = []
  
  for (let i = 0; i < count; i++) {
    roles.push(createMockData<MockRoleData>({
      id: generateId(),
      'name': '@ctitle(2,5)',
      'code': '@word(4,8)',
      'status|1': [0, 1],
      'description': '@csentence(10,20)',
      'createTime': '@datetime',
      'menuIds|1-10': [() => Math.floor(Math.random() * 20) + 1]
    }))
  }
  
  return roles
}

/**
 * 设置角色模块的mock服务
 * @param config Mock配置
 */
export function setupRoleMock(config: MockConfig): void {
  // 角色数据
  const roles = getLocalData<MockRoleData[]>(ROLE_DATA_KEY, defaultRoles, config)
  
  // 获取角色列表（分页）
  mockRequest('/role/list', 'get', (options: any) => {
    const { url } = options
    const params = parseUrlParams(url)
    
    // 获取分页参数
    const page = parseInt(params.page || '1')
    const pageSize = parseInt(params.pageSize || '10')
    const keyword = params.keyword || ''
    
    // 筛选
    let filteredRoles = [...roles]
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase()
      filteredRoles = filteredRoles.filter(role => 
        role.name.toLowerCase().includes(lowerKeyword) || 
        role.code.toLowerCase().includes(lowerKeyword) ||
        role.description.toLowerCase().includes(lowerKeyword)
      )
    }
    
    // 排序（按创建时间倒序）
    filteredRoles.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
    
    // 分页
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedRoles = filteredRoles.slice(startIndex, endIndex)
    
    // 组装分页数据
    const result: MockPaginationData<MockRoleData> = {
      list: paginatedRoles,
      total: filteredRoles.length,
      page,
      pageSize
    }
    
    return successResponse(result)
  })
  
  // 获取角色详情
  mockRequest('/role/:id', 'get', (options: any) => {
    const url = options.url
    const roleId = parseInt(url.match(/\/role\/(\d+)/)[1])
    
    const role = roles.find(r => r.id === roleId)
    
    if (role) {
      return successResponse(role)
    } else {
      return errorResponse('角色不存在', 404)
    }
  })
  
  // 创建角色
  mockRequest('/role', 'post', (options: any) => {
    const { body } = options
    const roleData = parseRequestBody<Partial<MockRoleData>>(body)
    
    if (!roleData.name || !roleData.code) {
      return errorResponse('角色名称和角色编码不能为空', 400)
    }
    
    // 检查角色编码是否已存在
    if (roles.some(r => r.code === roleData.code)) {
      return errorResponse('角色编码已存在', 400)
    }
    
    const newRole: MockRoleData = {
      id: generateId(),
      name: roleData.name,
      code: roleData.code,
      status: roleData.status || 1,
      description: roleData.description || '',
      createTime: formatDate(new Date()),
      menuIds: roleData.menuIds || []
    }
    
    roles.push(newRole)
    
    // 保存数据
    saveLocalData(ROLE_DATA_KEY, roles, config)
    
    return successResponse(newRole, '创建成功')
  })
  
  // 更新角色
  mockRequest('/role/:id', 'put', (options: any) => {
    const url = options.url
    const roleId = parseInt(url.match(/\/role\/(\d+)/)[1])
    const { body } = options
    const roleData = parseRequestBody<Partial<MockRoleData>>(body)
    
    const roleIndex = roles.findIndex(r => r.id === roleId)
    
    if (roleIndex === -1) {
      return errorResponse('角色不存在', 404)
    }
    
    // 检查角色编码是否已存在（排除自身）
    if (roleData.code && roleData.code !== roles[roleIndex].code && 
        roles.some(r => r.code === roleData.code)) {
      return errorResponse('角色编码已存在', 400)
    }
    
    // 不能修改系统角色的状态
    if (roles[roleIndex].code === 'admin' && roleData.status === 0) {
      return errorResponse('不能禁用超级管理员角色', 403)
    }
    
    // 更新角色
    roles[roleIndex] = {
      ...roles[roleIndex],
      ...roleData,
      // 不允许修改的字段
      id: roles[roleIndex].id,
      createTime: roles[roleIndex].createTime
    }
    
    // 保存数据
    saveLocalData(ROLE_DATA_KEY, roles, config)
    
    return successResponse(roles[roleIndex], '更新成功')
  })
  
  // 删除角色
  mockRequest('/role/:id', 'delete', (options: any) => {
    const url = options.url
    const roleId = parseInt(url.match(/\/role\/(\d+)/)[1])
    
    const roleIndex = roles.findIndex(r => r.id === roleId)
    
    if (roleIndex === -1) {
      return errorResponse('角色不存在', 404)
    }
    
    // 不能删除系统角色
    if (['admin', 'user'].includes(roles[roleIndex].code)) {
      return errorResponse('不能删除系统角色', 403)
    }
    
    // 删除角色
    roles.splice(roleIndex, 1)
    
    // 保存数据
    saveLocalData(ROLE_DATA_KEY, roles, config)
    
    return successResponse(true, '删除成功')
  })
  
  // 初始化更多测试数据
  if (roles.length <= 3) {
    const mockRoles = createMockRoles(10)
    roles.push(...mockRoles)
    saveLocalData(ROLE_DATA_KEY, roles, config)
  }
} 