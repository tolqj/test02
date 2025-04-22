import type { MockConfig, MockUserData, MockLoginParams, MockLoginResult, MockPaginationData } from '../types'
import { mockRequest, successResponse, errorResponse, createMockData } from '../index'
import { getLocalData, saveLocalData, generateId, parseUrlParams, parseRequestBody, formatDate } from '../helper'

// 用户数据存储键
const USER_DATA_KEY = 'users'

// 默认用户数据
const defaultUsers: MockUserData[] = [
  {
    id: '1',
    username: 'admin',
    nickname: '管理员',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'admin',
    status: 1,
    createTime: formatDate(new Date(2022, 0, 1))
  },
  {
    id: '2',
    username: 'test',
    nickname: '测试用户',
    email: 'test@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    role: 'user',
    status: 1,
    createTime: formatDate(new Date(2022, 1, 15))
  }
]

/**
 * 创建模拟用户数据
 * @param count 用户数量
 * @returns 用户数据数组
 */
function createMockUsers(count: number): MockUserData[] {
  const users: MockUserData[] = []
  
  for (let i = 0; i < count; i++) {
    users.push(createMockData<MockUserData>({
      id: generateId().toString(),
      'username': '@word(5, 10)',
      'nickname': '@cname',
      'email': '@email',
      'avatar': 'https://i.pravatar.cc/150?img=@integer(1, 50)',
      'role|1': ['admin', 'user', 'editor', 'visitor'],
      'status|1': [0, 1],
      'createTime': '@datetime'
    }))
  }
  
  return users
}

/**
 * 设置用户模块的mock服务
 * @param config Mock配置
 */
export function setupUserMock(config: MockConfig): void {
  // 用户数据
  const users = getLocalData<MockUserData[]>(USER_DATA_KEY, defaultUsers, config)
  
  // 登录
  mockRequest('/user/login', 'post', (options: any) => {
    const { body } = options
    const loginParams = parseRequestBody<MockLoginParams>(body)
    const { username, password } = loginParams
    
    // 简单验证
    if (!username || !password) {
      return errorResponse('用户名和密码不能为空', 400)
    }
    
    // 查找用户
    const user = users.find(u => u.username === username)
    
    // 用户不存在
    if (!user) {
      return errorResponse('用户不存在', 400)
    }
    
    // 密码验证（实际环境不应该这样验证）
    if (username === 'admin' && password !== '123456') {
      return errorResponse('密码错误', 400)
    }
    
    // 生成token
    const token = `token-${username}-${Date.now()}`
    const refreshToken = `refresh-token-${username}-${Date.now()}`
    
    // 返回结果
    const result: MockLoginResult = {
      token,
      refreshToken,
      userInfo: { ...user }
    }
    
    return successResponse(result, '登录成功')
  })
  
  // 登出
  mockRequest('/user/logout', 'post', () => {
    return successResponse(true, '登出成功')
  })
  
  // 获取用户信息
  mockRequest('/user/info', 'get', () => {
    // 实际应用中应该从token解析用户ID
    const user = users.find(u => u.username === 'admin')
    
    if (user) {
      return successResponse(user)
    } else {
      return errorResponse('获取用户信息失败', 401)
    }
  })
  
  // 更新用户信息
  mockRequest('/user/info', 'put', (options: any) => {
    const { body } = options
    const userData = parseRequestBody<Partial<MockUserData>>(body)
    
    // 实际应用中应该从token解析用户ID
    const userIndex = users.findIndex(u => u.username === 'admin')
    
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...userData,
        // 不允许修改的字段
        id: users[userIndex].id,
        username: users[userIndex].username,
        role: users[userIndex].role
      }
      
      // 保存数据
      saveLocalData(USER_DATA_KEY, users, config)
      
      return successResponse(true, '更新成功')
    } else {
      return errorResponse('用户不存在', 404)
    }
  })
  
  // 用户列表（分页）
  mockRequest('/user/list', 'get', (options: any) => {
    const { url } = options
    const params = parseUrlParams(url)
    
    // 获取分页参数
    const page = parseInt(params.page || '1')
    const pageSize = parseInt(params.pageSize || '10')
    const keyword = params.keyword || ''
    
    // 筛选
    let filteredUsers = [...users]
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase()
      filteredUsers = filteredUsers.filter(user => 
        user.username.toLowerCase().includes(lowerKeyword) || 
        user.nickname.toLowerCase().includes(lowerKeyword) ||
        user.email.toLowerCase().includes(lowerKeyword)
      )
    }
    
    // 状态筛选
    if (params.status !== undefined && params.status !== '') {
      const status = parseInt(params.status)
      filteredUsers = filteredUsers.filter(user => user.status === status)
    }
    
    // 排序（按创建时间倒序）
    filteredUsers.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
    
    // 分页
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
    
    // 组装分页数据
    const result: MockPaginationData<MockUserData> = {
      list: paginatedUsers,
      total: filteredUsers.length,
      page,
      pageSize
    }
    
    return successResponse(result)
  })
  
  // 删除用户
  mockRequest('/user/:id', 'delete', (options: any) => {
    const url = options.url
    // 从URL中提取用户ID
    const match = url.match(/\/user\/(.+)/)
    if (!match) {
      return errorResponse('无效的用户ID', 400)
    }
    
    const userId = match[1]
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex !== -1) {
      // 不能删除管理员
      if (users[userIndex].username === 'admin') {
        return errorResponse('不能删除管理员账号', 403)
      }
      
      // 删除用户
      users.splice(userIndex, 1)
      
      // 保存数据
      saveLocalData(USER_DATA_KEY, users, config)
      
      return successResponse(true, '删除成功')
    } else {
      return errorResponse('用户不存在', 404)
    }
  })

  // 创建用户
  mockRequest('/user/create', 'post', (options: any) => {
    const { body } = options
    const userData = parseRequestBody(body)
    
    // 检查必填字段
    const requiredFields = ['username', 'password', 'email', 'nickname', 'role']
    for (const field of requiredFields) {
      if (!userData[field]) {
        return errorResponse(`${field} 是必填字段`, 400)
      }
    }
    
    // 检查用户名是否已存在
    const existingUser = users.find(u => u.username === userData.username)
    if (existingUser) {
      return errorResponse('用户名已存在', 409)
    }
    
    // 创建新用户
    const newUser: MockUserData = {
      id: generateId().toString(),
      username: userData.username,
      nickname: userData.nickname,
      email: userData.email,
      avatar: userData.avatar || 'https://i.pravatar.cc/150?img=3',
      role: userData.role,
      status: userData.status !== undefined ? userData.status : 1,
      createTime: formatDate(new Date()),
      remark: userData.remark || ''
    }
    
    // 添加到用户列表
    users.push(newUser)
    
    // 保存数据
    saveLocalData(USER_DATA_KEY, users, config)
    
    return successResponse(newUser, '创建成功')
  })
  
  // 初始化更多测试数据
  if (users.length <= 2) {
    const mockUsers = createMockUsers(20)
    users.push(...mockUsers)
    saveLocalData(USER_DATA_KEY, users, config)
  }
} 