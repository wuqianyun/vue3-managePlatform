<template>
  <el-menu
    default-active="2"
    class="menu"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>Vue Demo</span>
      </template>
      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <router-link :to="`/markdownEditor`">Markdown 编辑器</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <el-icon><document /></el-icon>
        <router-link :to="`/getData`">获取数据</router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <router-link :to="`/grid`">带有排序和过滤器的网格</router-link>
      </el-menu-item>
      <el-menu-item index="5">
        <el-icon><setting /></el-icon>
        <router-link :to="`/treeView`">树状视图</router-link>
      </el-menu-item>
      <el-menu-item index="6">
        <el-icon><setting /></el-icon>
        <router-link :to="`/svg`">SVG 图像</router-link>
      </el-menu-item>
      <el-menu-item index="7">
        <el-icon><setting /></el-icon>
        <router-link :to="`/transitionModal`">带过渡动效的模态框</router-link>
      </el-menu-item>
      <el-menu-item index="8">
        <el-icon><setting /></el-icon>
        <router-link :to="`/transitionList`">带过渡动效的列表</router-link>
      </el-menu-item>
      <el-menu-item index="9">
        <el-icon><setting /></el-icon>
        <router-link :to="`/TodoMVC`">TodoMVC</router-link>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><location /></el-icon>
        <span>Common Demo</span>
      </template>
      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <router-link :to="`/chunkFile`">文件分片上传</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <router-link :to="`/split`">分割拖动</router-link>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>
<style lang="scss" scoped>
.menu {
  height: 100%;
}
.el-menu-item > a {
  color: unset;
  text-decoration: unset;
}
</style>
