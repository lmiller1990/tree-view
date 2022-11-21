<script setup lang="ts">
const props = defineProps<{
  file: string;
  depth: number;
}>();
</script>

<template>
  <div :style="`margin-left: ${(props.depth + 1) * 20}px`">
    {{ file }}
  </div>
</template>
