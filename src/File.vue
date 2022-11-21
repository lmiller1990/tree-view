<script setup lang="ts">
import { FileData } from './types';

const props = defineProps<{
  file: FileData;
  depth: number;
}>();
</script>

<template>
  <div :style="`margin-left: ${(props.depth + 1) * 20}px`">
    {{ file.relative }}
  </div>
</template>
