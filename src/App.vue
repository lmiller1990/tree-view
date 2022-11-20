<script setup lang="ts">
import { computed } from 'vue';
import Directory from './Directory.vue';
import { derive } from './exp.spec';

const files = [
  "foo/bar/merp.js",
  "foo/bar/baz.js",
  "foo/bar/baz/merp/lux/qux.js",
  "foo/foo.js",
];

const tree = computed(() => derive())
console.log(tree.value)
</script>

<template>
  <Directory v-for="directory of tree.dirs" :node="directory" />
</template>