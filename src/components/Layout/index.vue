<template>
  <el-container>
    <el-header class="header"> hello~ </el-header>
    <el-container class="container">
      <el-aside width="260px" class="menu">
        <Menu />
      </el-aside>
      <el-main class="content">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import Menu from "./Menu/index.vue";
</script>
<style lang="scss" scoped>
.header {
  // background: pink;
  border-bottom: 1px solid var(--el-menu-border-color);
}
.container {
  height: calc(100vh - 60px);
}
.menu {
  // background: skyblue;
}
</style>
