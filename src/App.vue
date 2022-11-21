<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import Directory from "./Directory.vue";
import { BaseFile, deriveTree, TreeOptions } from "./tree";
import type { FileData } from "./types";
import fuzzysort from "fuzzysort";

const files: Array<FileData> = [
  { id: 1, relative: "foo/bar/merp.js", name: "merp.js", indexes: [] },
  { id: 2, relative: "foo/bar/baz.js", name: "baz.js", indexes: [] },
  {
    id: 3,
    relative: "foo/bar/baz/merp/lux/qux.js",
    name: "qux.js",
    indexes: [],
  },
  { id: 4, relative: "foo/foo.js", name: "foo.js", indexes: [] },
];

const options = reactive<TreeOptions<FileData>>({
  search: "",
  searchFn: (search, files): BaseFile[] => {
    const results = fuzzysort.go(search, files, {
      keys: ["relative"],
    });

    return results.map((x) => {
      // @ts-expect-error - private property.
      return { ...x.obj, indexes: x[0]._indexes };
    });
  },
});

// const files = [{ relative: "foo/bar.js", id: 4 }, { relative: "foo/a/b/c/d/qux.js", id :6 }];

const tree = computed(() => deriveTree(files, options));
</script>

<template>
  <input v-model="options.search" />
  <Directory v-for="directory of tree.dirs" :node="directory" />
</template>
