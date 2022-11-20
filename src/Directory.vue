<script setup lang="ts">
import { PropsExpression } from "@vue/compiler-core";
import nodeTest from "node:test";
import { computed } from "vue";
import { DirNode } from "./exp.spec";
import File from './File.vue'

const props = defineProps<{
  node: DirNode;
}>();

const depth = computed(() => {
  let i = 0
  let node: DirNode | null = props.node.parent
  while (node = node!.parent) {
    i++
  }
  return i
})
</script>

<template>
  <div :style="`margin-left: ${depth * 20}px`">{{ props.node.name }}</div>
  <Directory v-for="directory of props.node.dirs" :node="directory" :key="props.node.relative" />
  <File v-for="file of props.node.files" :file="file" :depth="depth" :key="file" />
</template>
