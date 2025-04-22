# Vue3 后台管理系统模板

基于 Vue3 + TypeScript + Vite + Pinia + Vue Router + Element Plus 构建的后台管理系统前端模板。

## 技术栈

- **Vue3**：采用 Vue3 Composition API
- **TypeScript**：提供类型检查和更好的代码提示
- **Vite**：快速的前端构建工具
- **Element Plus**：基于 Vue 3 的组件库
- **Vue Router**：Vue.js 的官方路由管理器
- **Pinia**：状态管理
- **Axios**：HTTP 请求工具

## 项目结构

```
├── public              # 静态资源
│   └── assets           # 资源文件
│       ├── css          # CSS 文件
│       ├── font         # 字体文件
│       ├── images       # 图片资源
│       └── js           # JavaScript 文件
├── src                 # 源代码
│   ├── components      # 公共组件
│   ├── layouts         # 布局组件
│   │   ├── layout.vue   # 主布局
│   │   ├── header.vue   # 顶部导航
│   │   ├── left_menu.vue# 左侧菜单
│   │   └── contain.vue  # 内容区域
│   ├── request         # 请求封装
│   ├── router          # 路由配置
│   ├── stores          # 状态管理
│   ├── views           # 页面组件
│   │   ├── dashboard    # 仪表盘
│   │   ├── login        # 登录页面 
│   │   └── error        # 错误页面
│   ├── App.vue         # 根组件
│   └── main.ts         # 主入口
├── index.html          # HTML 模板
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 配置
└── package.json        # 项目依赖
```

## 功能特性

- 用户登录/登出
- 权限控制
- 响应式布局
- 侧边栏菜单（可折叠）
- 动态面包屑
- Axios 请求封装
- Pinia 状态管理

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 浏览器支持

- Chrome
- Firefox
- Safari
- Edge

## 许可证

[MIT](LICENSE)
