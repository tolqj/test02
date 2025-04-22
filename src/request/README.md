# 请求模块

这是一个基于 Axios 封装的请求模块，提供了完整的请求功能，包括请求拦截、响应拦截、错误处理、Token 刷新等。

## 目录结构

```
request/
│
├── index.ts           # 主入口，封装了请求实例和方法
├── config.ts          # 配置文件，包含各种请求配置
├── types.ts           # 类型定义文件
├── api.ts             # API 接口定义和服务
├── example.ts         # 使用示例
└── README.md          # 使用说明
```

## 基本使用

### 直接使用封装的请求方法

```typescript
import { get, post, put, del } from '@/request'

// GET 请求
const getData = async () => {
  try {
    const result = await get('/api/data')
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}

// POST 请求
const postData = async () => {
  try {
    const result = await post('/api/data', { name: 'test' })
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}
```

### 使用预定义的 API 服务

```typescript
import api from '@/request/api'

// 登录
const login = async () => {
  try {
    const result = await api.user.login({
      username: 'admin',
      password: '123456'
    })
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}

// 获取用户列表
const getUserList = async () => {
  try {
    const result = await api.user.getUserList({
      page: 1, 
      pageSize: 10
    })
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}
```

### 使用提供的 Composition API

```typescript
// 在 Vue 组件中
<script setup>
import { useUserList } from '@/request/example'

const {
  userList,
  total,
  loading,
  queryParams,
  getUserList,
  deleteUser,
  handlePageChange,
  handleSizeChange
} = useUserList()

// 初始加载
getUserList()
</script>

<template>
  <div>
    <el-table :data="userList" v-loading="loading">
      <!-- 表格列 -->
    </el-table>
    
    <el-pagination
      :total="total"
      :current-page="queryParams.page"
      :page-size="queryParams.pageSize"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>
```

## 高级用法

### 自定义请求配置

```typescript
import { get, post } from '@/request'

// 不显示 loading
const getData = async () => {
  const result = await get('/api/data', null, { showLoading: false })
  return result
}

// 不显示错误提示
const postData = async () => {
  const result = await post('/api/data', { name: 'test' }, { showError: false })
  return result
}

// 自定义错误处理
const customErrorHandler = async () => {
  const result = await get('/api/data', null, {
    errorHandler: (message) => {
      console.log('自定义错误处理:', message)
    }
  })
  return result
}

// 获取原始响应数据
const getOriginalResponse = async () => {
  const response = await get('/api/data', null, { returnOriginal: true })
  console.log(response.status) // HTTP 状态码
  console.log(response.headers) // HTTP 响应头
  console.log(response.data) // 响应数据
  return response
}
```

### 请求取消

```typescript
import axios from 'axios'
import { get } from '@/request'

// 创建一个可取消的 token
const cancelTokenSource = axios.CancelToken.source()

// 发送可取消的请求
const sendRequest = async () => {
  try {
    const result = await get('/api/data', null, {
      cancelToken: cancelTokenSource.token
    })
    return result
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('请求已取消', error.message)
    } else {
      console.error('请求失败', error)
    }
    return null
  }
}

// 取消请求
const cancelRequest = () => {
  cancelTokenSource.cancel('用户取消了请求')
}
```

## 自定义配置

你可以在 `config.ts` 文件中修改各种配置：

- `BASE_URL`: API 基础路径
- `TIMEOUT`: 请求超时时间
- `SUCCESS_CODE`: 响应成功的状态码
- `DEFAULT_HEADERS`: 默认请求头
- `UN_AUTHORIZED_CODE`: 未授权状态码
- `REFRESH_TOKEN_URL`: 刷新 token 的 URL
- `REFRESH_TOKEN_HEADER_KEY`: 刷新 token 的请求头 key
- `ENABLE_REFRESH_TOKEN`: 是否启用 token 刷新功能 