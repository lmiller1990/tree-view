<script setup lang="ts">
import type { BaseFile } from './tree'

const props = defineProps<{
  file: BaseFile;
  depth: number;
}>();

console.log(props.file)
</script>

<template>
  <div :style="`margin-left: ${(props.depth + 1) * 20}px`">
    {{ file.relative }}
  </div>
</template>
