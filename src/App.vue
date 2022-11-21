<script setup lang="ts">
import { computed } from "vue";
import Directory from "./Directory.vue";
import { deriveTree } from "./tree";

// const files = [
//   "foo/bar/merp.js",
//   "foo/bar/baz.js",
//   "foo/bar/baz/merp/lux/qux.js",
//   "foo/foo.js",
// ];

const files = [{ relative: "foo/bar.js", id: 4 }, { relative: "foo/a/b/c/d/qux.js", id :6 }];

const tree = computed(() => deriveTree(files));
</script>

<template>
  <Directory v-for="directory of tree.dirs" :node="directory" />
</template>
