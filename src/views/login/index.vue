<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, Key } from '@element-plus/icons-vue'
import api from '../../request/api'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 从本地存储中获取记住的用户名和密码
const rememberedUsername = localStorage.getItem('rememberedUsername') || 'admin'
const rememberedPassword = localStorage.getItem('rememberedUsername') ? localStorage.getItem('rememberedPassword') || '' : '123456'
const rememberedStatus = !!localStorage.getItem('rememberedUsername')

const loginForm = reactive({
  username: rememberedUsername,
  password: rememberedPassword,
  remember: rememberedStatus
})

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const capsLockOn = ref(false)

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})

const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      
      try {
        // 使用Mock服务进行登录
        const result = await api.user.login({
          username: loginForm.username,
          password: loginForm.password
        })
        
        // 保存token和用户信息
        userStore.setToken(result.token)
        userStore.setUserInfo(result.userInfo)
        
        // 处理记住密码
        if (loginForm.remember) {
          localStorage.setItem('rememberedUsername', loginForm.username)
          localStorage.setItem('rememberedPassword', loginForm.password)
        } else {
          localStorage.removeItem('rememberedUsername')
          localStorage.removeItem('rememberedPassword')
        }
        
        ElMessage.success('登录成功')
        
        // 处理重定向
        const redirect = route.query.redirect as string
        router.push(redirect || '/')
      } catch (error: any) {
        ElMessage.error(error.message || '登录失败')
      } finally {
        loading.value = false
      }
    } else {
      console.error('表单验证失败', fields)
    }
  })
}

// 检测大写锁定
const checkCapsLock = (e: KeyboardEvent) => {
  capsLockOn.value = e.getModifierState && e.getModifierState('CapsLock')
}

// 确保填满整个视口的处理函数
const setFullHeight = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

// 添加动画效果
onMounted(() => {
  // 设置100vh变量
  setFullHeight()
  window.addEventListener('resize', setFullHeight)
  
  // 应用动画效果
  setTimeout(() => {
    document.querySelector('.login-box')?.classList.add('show')
    document.querySelector('.login-form')?.classList.add('show')
  }, 200)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setFullHeight)
})
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-box">
        <!-- 左侧内容区 -->
        <div class="login-left">
          <div class="left-content">
            <div class="logo-area">
              <div class="logo-circle">
                <div class="logo-icon">A</div>
              </div>
            </div>
            <h2 class="system-title">后台管理系统</h2>
            <p class="system-desc">专业、高效、安全的企业级管理平台</p>
            <div class="decoration-line"></div>
            <div class="feature-points">
              <div class="feature-item">
                <div class="feature-icon">
                  <el-icon><User /></el-icon>
                </div>
                <div class="feature-text">统一用户管理</div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <el-icon><Lock /></el-icon>
                </div>
                <div class="feature-text">安全权限控制</div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <el-icon><Key /></el-icon>
                </div>
                <div class="feature-text">多维数据分析</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧登录区 -->
        <div class="login-right">
          <div class="login-form">
            <h3 class="welcome-text">欢迎使用</h3>
            <h2 class="login-title">用户登录</h2>
            
            <el-form
              ref="loginFormRef"
              :model="loginForm"
              :rules="rules"
              class="form-container"
              @keyup.enter="handleLogin(loginFormRef)"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                  :prefix-icon="User"
                  type="text"
                  tabindex="1"
                  autocomplete="off"
                  size="large"
                  class="custom-input"
                />
              </el-form-item>
              
              <el-form-item prop="password" class="password-item">
                <el-input
                  v-model="loginForm.password"
                  placeholder="请输入密码"
                  :prefix-icon="Lock"
                  type="password"
                  tabindex="2"
                  autocomplete="off"
                  show-password
                  size="large"
                  class="custom-input"
                  @keyup="checkCapsLock"
                />
                <div v-if="capsLockOn" class="caps-lock-warning">
                  <el-icon><Key /></el-icon>
                  <span>大写锁定已开启</span>
                </div>
              </el-form-item>
              
              <div class="login-options">
                <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
                <a href="javascript:void(0)" class="forgot-password">忘记密码?</a>
              </div>
              
              <el-button
                type="primary"
                :loading="loading"
                class="login-button"
                @click="handleLogin(loginFormRef)"
                size="large"
              >
                立即登录
              </el-button>
            </el-form>
            
            <div class="login-tips">
              <div class="tip-header">测试账号</div>
              <div class="tip-content">
                <div class="tip-item">
                  <span class="tip-label">用户名:</span>
                  <span class="tip-value">admin</span>
                </div>
                <div class="tip-item">
                  <span class="tip-label">密码:</span>
                  <span class="tip-value">123456</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="floating-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>
    
    <div class="copyright">
      © {{ new Date().getFullYear() }} 管理系统 - All Rights Reserved
    </div>
  </div>
</template>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  height: calc(var(--vh, 1vh) * 100);
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a237e, #283593, #303f9f, #3949ab, #3f51b5);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.login-content {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
  flex: 1;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 粒子效果 */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
}

/* 浮动形状 */
.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  animation: floatAnimation 10s infinite linear;
}

.shape-1 {
  width: 150px;
  height: 150px;
  top: 20%;
  left: 10%;
  animation-duration: 22s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  left: 15%;
  animation-duration: 18s;
  animation-delay: 1s;
}

.shape-3 {
  width: 200px;
  height: 200px;
  bottom: 10%;
  right: 20%;
  animation-duration: 25s;
  animation-delay: 2s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 10%;
  animation-duration: 20s;
  animation-delay: 3s;
}

@keyframes floatAnimation {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(5%, 5%) rotate(90deg) scale(0.9);
  }
  50% {
    transform: translate(0%, 10%) rotate(180deg) scale(1.1);
  }
  75% {
    transform: translate(-5%, 5%) rotate(270deg) scale(0.9);
  }
  100% {
    transform: translate(0, 0) rotate(360deg) scale(1);
  }
}

.login-box {
  display: flex;
  width: 1000px;
  height: 580px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  max-width: 90%;
  max-height: 90%;
}

.login-box.show {
  opacity: 1;
  transform: translateY(0);
}

/* 左侧样式 */
.login-left {
  flex: 5;
  background: linear-gradient(135deg, #1976d2, #2196f3, #42a5f5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
  transform: rotate(30deg);
}

.left-content {
  text-align: center;
  position: relative;
  z-index: 2;
  max-width: 400px;
}

.logo-area {
  margin-bottom: 30px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.logo-icon {
  font-size: 40px;
  font-weight: bold;
  color: #1976d2;
}

.system-title {
  font-size: 2.8rem;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.system-desc {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 30px;
  letter-spacing: 1px;
}

.decoration-line {
  width: 60px;
  height: 4px;
  background-color: white;
  margin: 0 auto;
  border-radius: 2px;
  margin-bottom: 40px;
}

.feature-points {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  margin-top: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  text-align: left;
  gap: 15px;
}

.feature-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.feature-text {
  font-size: 16px;
  font-weight: 500;
}

/* 右侧样式 */
.login-right {
  flex: 5;
  background: linear-gradient(135deg, #2196f3, #0d47a1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 60px;
  position: relative;
}

.login-right::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
}

.login-form {
  width: 100%;
  max-width: 380px;
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.6s ease 0.2s;
  position: relative;
  z-index: 2;
}

.login-form.show {
  opacity: 1;
  transform: translateX(0);
}

.welcome-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-bottom: 8px;
  font-weight: normal;
}

.login-title {
  font-size: 2rem;
  color: white;
  margin-top: 0;
  margin-bottom: 30px;
  font-weight: 600;
}

.form-container {
  margin-bottom: 25px;
}

.custom-input {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.el-input__inner) {
  color: white;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

:deep(.el-input__prefix) {
  color: rgba(255, 255, 255, 0.8);
}

.password-item {
  position: relative;
}

.caps-lock-warning {
  position: absolute;
  bottom: -22px;
  left: 0;
  color: #ff9800;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #42a5f5;
  border-color: #42a5f5;
}

:deep(.el-checkbox__label) {
  color: white;
}

.forgot-password {
  color: #90caf9;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password:hover {
  color: white;
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.25);
  border: none;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.35);
}

.login-tips {
  margin-top: 30px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border-left: 4px solid #90caf9;
}

.tip-header {
  color: #90caf9;
  font-weight: 500;
  margin-bottom: 10px;
  font-size: 14px;
}

.tip-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.tip-item {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.tip-label {
  color: rgba(255, 255, 255, 0.8);
  margin-right: 5px;
  width: 50px;
}

.tip-value {
  color: white;
  font-family: 'Courier New', Courier, monospace;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 1px 5px;
  border-radius: 3px;
}

.copyright {
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  text-align: center;
  position: relative;
  z-index: 3;
  padding-bottom: 10px;
}

/* 响应式调整 */
@media (max-width: 1100px) {
  .login-box {
    width: 90%;
    max-width: 900px;
  }
}

@media (max-width: 992px) {
  .login-box {
    width: 90%;
    max-width: 700px;
    flex-direction: column;
    height: auto;
  }
  
  .login-left {
    padding: 40px 30px;
  }
  
  .left-content {
    max-width: 100%;
  }
  
  .feature-points {
    flex-direction: row;
    justify-content: center;
    gap: 30px;
    margin-bottom: 20px;
  }
  
  .feature-item {
    flex-direction: column;
    text-align: center;
  }
  
  .system-title {
    font-size: 2.2rem;
  }
  
  .login-right {
    padding: 40px 30px;
  }
  
  .login-form {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .feature-points {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .feature-item {
    flex-direction: row;
    text-align: left;
  }
}

@media (max-width: 576px) {
  .login-box {
    width: 95%;
    height: auto;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .system-title {
    font-size: 1.8rem;
  }
  
  .login-left {
    padding: 30px 20px;
  }
  
  .login-right {
    padding: 30px 20px;
  }
  
  .feature-points {
    gap: 10px;
  }
}

/* 处理iPhoneX等有安全区域的设备 */
@supports (padding: max(0px)) {
  .login-container {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
    padding-top: max(0px, env(safe-area-inset-top));
    padding-bottom: max(0px, env(safe-area-inset-bottom));
  }
}
</style> 