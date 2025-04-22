import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '../layouts/layout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: {
          title: '仪表盘',
          icon: 'el-icon-s-home'
        }
      },
      {
        path: 'users/list',
        name: 'UsersList',
        component: () => import('../views/users/list.vue'),
        meta: {
          title: '用户管理',
          icon: 'el-icon-user'
        }
      },
      {
        path: 'users/roles',
        name: 'UsersRoles',
        component: () => import('../views/users/roles.vue'),
        meta: {
          title: '角色管理',
          icon: 'el-icon-s-check'
        }
      },
      {
        path: 'users/profile',
        name: 'UserProfile',
        component: () => import('../views/users/profile.vue'),
        meta: {
          title: '个人中心',
          icon: 'el-icon-user',
          hidden: true // 在侧边栏菜单中隐藏
        }
      },
      {
        path: 'system/basic',
        name: 'SystemBasic',
        component: () => import('../views/system/basic.vue'),
        meta: {
          title: '基本信息',
          icon: 'el-icon-s-tools'
        }
      },
      {
        path: 'system/security',
        name: 'SystemSecurity',
        component: () => import('../views/system/security.vue'),
        meta: {
          title: '数据安全',
          icon: 'el-icon-lock'
        }
      },
      {
        path: 'system/maintenance',
        name: 'SystemMaintenance',
        component: () => import('../views/system/maintenance.vue'),
        meta: {
          title: '升级维护',
          icon: 'el-icon-refresh'
        }
      },
      {
        path: 'system/settings',
        name: 'SystemSettings',
        component: () => import('../views/system/settings.vue'),
        meta: {
          title: '系统设置',
          icon: 'el-icon-setting',
          hidden: true // 在侧边栏菜单中隐藏
        }
      },
      {
        path: 'logs/system',
        name: 'SystemLog',
        component: () => import('../logs/SystemLog.vue'),
        meta: {
          title: '系统日志',
          icon: 'el-icon-document'
        }
      },
      {
        path: 'logs/operation',
        name: 'OperationLog',
        component: () => import('../logs/OperationLog.vue'),
        meta: {
          title: '操作日志',
          icon: 'el-icon-s-operation'
        }
      },
      {
        path: 'logs/user',
        name: 'UserLog',
        component: () => import('../logs/UserLog.vue'),
        meta: {
          title: '用户日志',
          icon: 'el-icon-user-solid'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/error/404.vue'),
    meta: {
      title: '404',
      hidden: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title as string || '后台管理系统'
  
  // 获取token
  const token = localStorage.getItem('token')
  
  // 白名单路径，不需要登录就可以访问
  const whiteList = ['/login']
  
  if (token) {
    // 已登录状态访问登录页，重定向到首页
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 已登录，继续访问
      next()
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      // 访问白名单页面，直接通过
      next()
    } else {
      // 访问非白名单页面，重定向到登录页
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  }
})

export default router 