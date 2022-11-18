<template>
  <split>
    <template #splitPane>
      <split-pane size="200px">
        <div class="pane-content">
          <h2>Top</h2>
          <div>height: 200px</div>
        </div>
      </split-pane>
      <split-pane>
        <div class="pane-content">
          <h2>Center</h2>
          <div>height: auto</div>
        </div>
      </split-pane>
      <split-pane size="150px">
        <div class="pane-content">
          <h2>Bottom</h2>
          <div>height: 150px, resizable: false</div>
        </div>
      </split-pane>
    </template>
  </split>
</template>
<script setup lang="ts">
import split from "./split";
import splitPane from "./splitPane";
</script>
<style lang="scss">
@import "./index.scss";
</style>
