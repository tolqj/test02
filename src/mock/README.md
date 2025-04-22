# Mock数据服务

这是一个基于 mockjs 封装的 Mock 数据服务，用于模拟后端 API 接口，支持数据持久化、接口请求延迟等功能。

## 目录结构

```
mock/
│
├── index.ts           # 入口文件，包含主要配置和公共函数
├── helper.ts          # 辅助函数库
├── types.ts           # 类型定义
├── modules/           # 模块化的模拟数据
│   ├── user.ts        # 用户模块
│   ├── role.ts        # 角色模块
│   └── system.ts      # 系统模块
└── README.md          # 使用说明
```

## 基本使用

### 1. 启用 Mock 服务

在 `main.ts` 中导入并调用 `setupMock` 函数：

```typescript
import { setupMock } from './mock'

// 启动Mock服务
setupMock()
```

### 2. 配置 Mock 服务

可以在 `src/mock/index.ts` 中修改 `mockConfig` 配置：

```typescript
const mockConfig: MockConfig = {
  // 是否启用mock
  enable: true,
  // mock基础路径
  baseURL: '/api',
  // 是否启用本地存储(localStorage)模拟数据持久化
  enableLocalStorage: true
}
```

### 3. 创建新的 Mock 模块

如果需要为新功能模块添加 Mock 数据，可以按照以下步骤：

1. 在 `src/mock/modules/` 目录下创建新的模块文件（如 `product.ts`）
2. 在该文件中实现 `setupProductMock` 函数
3. 在 `src/mock/index.ts` 中导入并注册该模块

```typescript
// src/mock/modules/product.ts
import type { MockConfig } from '../types'
import { mockRequest, successResponse } from '../index'

export function setupProductMock(config: MockConfig): void {
  // 获取产品列表
  mockRequest('/product/list', 'get', () => {
    return successResponse([
      { id: 1, name: '产品一', price: 100 },
      { id: 2, name: '产品二', price: 200 }
    ])
  })
}

// 在 src/mock/index.ts 中注册
import { setupProductMock } from './modules/product'

export function setupMock(): void {
  if (!mockConfig.enable) {
    return
  }
  
  // ... 其他模块
  
  // 产品模块
  setupProductMock(mockConfig)
}
```

## 高级功能

### 自定义响应数据

使用 `successResponse` 和 `errorResponse` 函数创建标准响应：

```typescript
// 成功响应
mockRequest('/api/success', 'get', () => {
  return successResponse({ name: '测试数据' }, '操作成功')
})

// 错误响应
mockRequest('/api/error', 'get', () => {
  return errorResponse('权限不足', 403)
})
```

### 模拟数据生成

使用 `createMockData` 函数和 Mock.js 语法生成模拟数据：

```typescript
const userData = createMockData({
  'id|+1': 1,
  'name': '@cname',
  'email': '@email',
  'avatar': '@image(200x200)',
  'description': '@cparagraph(1, 3)',
  'createTime': '@datetime'
})
```

### 持久化数据

使用 `getLocalData` 和 `saveLocalData` 函数实现数据持久化：

```typescript
// 获取数据
const users = getLocalData('users', defaultUsers, config)

// 保存数据
saveLocalData('users', users, config)
```

### 分页查询

实现分页查询接口：

```typescript
mockRequest('/user/list', 'get', (options) => {
  const { url } = options
  const params = parseUrlParams(url)
  
  // 获取分页参数
  const page = parseInt(params.page || '1')
  const pageSize = parseInt(params.pageSize || '10')
  
  // 筛选、分页等逻辑...
  
  // 返回分页数据
  return successResponse({
    list: paginatedData,
    total: totalCount,
    page,
    pageSize
  })
})
```

## Mock.js 常用语法参考

```typescript
// 生成随机数据的 Mock.js 语法
const template = {
  // 基本类型
  'boolean': '@boolean',                     // 随机布尔值
  'natural': '@natural(1, 100)',             // 随机自然数
  'integer': '@integer(1, 100)',             // 随机整数
  'float': '@float(0, 100, 2, 2)',           // 随机浮点数
  'character': '@character("lower")',        // 随机字符
  'string': '@string("lower", 5, 10)',       // 随机字符串
  
  // 日期和时间
  'date': '@date("yyyy-MM-dd")',             // 随机日期
  'time': '@time("HH:mm:ss")',               // 随机时间
  'datetime': '@datetime("yyyy-MM-dd HH:mm:ss")', // 随机日期和时间
  'now': '@now("yyyy-MM-dd HH:mm:ss")',      // 当前日期和时间
  
  // 图片和颜色
  'image': '@image("200x200", "#50B347", "#FFF", "Mock.js")', // 随机图片URL
  'color': '@color',                         // 随机颜色
  
  // 文本和名字
  'paragraph': '@paragraph(1, 3)',           // 随机段落
  'sentence': '@sentence(3, 5)',             // 随机句子
  'word': '@word(3, 5)',                     // 随机单词
  'title': '@title(3, 5)',                   // 随机标题
  'name': '@name',                           // 随机英文名
  'cname': '@cname',                         // 随机中文名
  
  // 网络相关
  'url': '@url',                             // 随机URL
  'domain': '@domain',                       // 随机域名
  'email': '@email',                         // 随机邮箱
  'ip': '@ip',                               // 随机IP
  
  // 地址
  'region': '@region',                       // 随机地区
  'province': '@province',                   // 随机省份
  'city': '@city',                           // 随机城市
  'county': '@county',                       // 随机县
  'zip': '@zip',                             // 随机邮编
  
  // 占位符
  'placeholder': '@placeholder(200, 200)'    // 占位图片
}
``` 