<script setup>
import { ref, computed, unref } from "vue";

const props = defineProps({
  model: Object,
});

const propsCopy = ref(unref(props.model));
const isOpen = ref(false);
const isFolder = computed(() => {
  return propsCopy.value.children && propsCopy.value.children.length;
});

function toggle() {
  isOpen.value = !isOpen.value;
}

function changeType() {
  if (!isFolder.value) {
    propsCopy.value.children = [];
    addChild();
    isOpen.value = true;
  }
}

function addChild() {
  propsCopy.value.children.push({ name: "new stuff" });
}
</script>

<template>
  <li>
    <div :class="{ bold: isFolder }" @click="toggle" @dblclick="changeType">
      {{ model.name }}
      <span v-if="isFolder">[{{ isOpen ? "-" : "+" }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <!--
        一个可以通过其“name”选项递归渲染自己的组件，
        (如果使用单文件组件，则从文件名推断)
      -->
      <TreeItem
        class="item"
        v-for="model in model.children"
        :model="model"
        :key="model"
      >
      </TreeItem>
      <li class="add" @click="addChild">+</li>
    </ul>
  </li>
</template>
