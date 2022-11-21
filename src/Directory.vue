<script setup lang="ts">
import type { BaseDirNode } from "./tree";
import File from "./File.vue";
import { FileData } from "./types";

const props = defineProps<{
  node: BaseDirNode<FileData>;
}>();

</script>

<template>
  <div :style="`margin-left: ${props.node.depth * 20}px`">
    {{ props.node.name }}
  </div>
  <Directory
    v-for="directory of props.node.dirs"
    :node="directory"
    :key="props.node.relative"
  />
  <File
    v-for="file of props.node.files"
    :file="file"
    :depth="props.node.depth"
    :key="file.relative"
  />
</template>
