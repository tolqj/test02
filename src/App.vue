<script setup lang="ts">
// App.vue 是应用的根组件
</script>

<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;


  
}

html, body {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body {
  overflow: hidden;
}

#app {
  height: 100vh;
  width: 100vw;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* 覆盖element-plus默认样式 */
.el-menu {
  border-right: none !important;
}

.el-header, .el-main, .el-aside {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
