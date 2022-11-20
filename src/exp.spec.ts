// import { it } from "vitest";

const files = [
  "foo/bar/merp.js",
  "foo/bar/baz.js",
  "foo/bar/baz/merp/lux/qux.js",
  "foo/foo.js",
];
/**
 *
 * rel: foo
 * name: foo
 * parent: null
 *
 * rel: foo/bar
 * name: bar
 * parent: foo
 *
 * rel: foo/bar/baz/merp/lux
 * name: baz/merp/lux
 * parent: foo/bar
 *
 * unique dirs:
 * foo
 * (foo)/bar
 * (foo/bar)/baz/merp/lux
 *
 */

interface Entry {
  name: string;
  relative: string;
  parent: string;
  files: string[];
}

export interface DirNode {
  files: string[];
  dirs: DirNode[];
  relative: string;
  name: string;
  parent: DirNode | null;
}

function longestCommonPath(a: string[], b: string[]): string[] {
  let cand: string[] = [];
  for (let j = 0; j < b.length; j++) {
    if (!a[j] || !b[j]) {
      return cand;
    }
    if (a[j] === b[j]) {
      cand.push(a[j]);
    }
  }
  return cand;
}

function collapse(
  target: string[],
  dir: string[],
  knownDirs: Array<string[]>
): Entry {
  let longest: string[] = [];
  // let cand: string[] = [];

  for (let i = 0; i < knownDirs.length; i++) {
    const curr = knownDirs[i];
    const next = longestCommonPath(curr, dir);
    if (next.length > longest.length) {
      longest = next;
    }
  }
  let parent = longest.join("/");
  parent === "" ? "/" : parent;
  const trun = target.slice(longest.length);
  const relative = target.slice(0, target.length - 1).join("/");
  const name = trun.slice(0, trun.length - 1).join("/");
  const file = target.slice(-1)[0];

  const e: Entry = {
    relative,
    name,
    parent,
    files: [file],
  };

  return e;
}

function getPath(file: string) {
  const s = file.split("/");
  return s.slice(0, s.length - 1).join("/");
}

function getFilename(file: string) {
  const s = file.split("/");
  return s.slice(s.length - 1)[0];
}

function makeEntry(
  target: string,
  files: string[],
  knownDirs: Array<string[]>,
  entries: Entry[]
): { best?: string[]; entry: Entry } {
  console.log(`Make entry for ${target}`);
  const knownSibling = entries.find((x) => {
    // console.log('compare', x.relative, getPath(target))
    return x.relative === getPath(target);
  });
  // console.log(knownSibling, getFilename(target))
  if (knownSibling) {
    console.log("yes");
    return {
      entry: {
        ...knownSibling,
        files: knownSibling.files.concat(getFilename(target)),
      },
    };
  }
  const others = files.filter((x) => x !== target).map((x) => x.split(`/`));
  const curr = target.split("/");

  let best: string[] = [];
  for (let i = 0; i < others.length; i++) {
    const next = longestCommonPath(curr, others[i]);
    if (next.length > best.length) {
      best = next;
    }
  }
  const entry = collapse(curr, best, knownDirs);
  return {
    best,
    entry,
  };
}

export function derive() {
  files.sort((x, y) => (x.split("/").length < y.split("/").length ? -1 : 1));
  const entries: Entry[] = [];
  const dirs: Array<string[]> = [];
  const map = new Map<string, Entry>();
  for (const file of files) {
    const { entry, best } = makeEntry(file, files, dirs, entries);
    entries.push(entry);
    if (best) {
      dirs.push(best);
    }
    map.set(entry.relative, entry);
  }

  const root: DirNode = {
    relative: "",
    name: "/",
    parent: null,
    files: [],
    dirs: [],
  };
  const dirmap = new Map<string, DirNode>();

  for (const entry of entries) {
    dirmap.set(entry.relative, {
      relative: entry.relative,
      name: entry.name,
      parent: entry.relative === entry.name ? root : dirmap.get(entry.parent)!,
      files: entry.files.sort(),
      dirs: [],
    });
  }

  for (const v of dirmap.values()) {
    v.parent!.dirs.push(v);
  }

  return root
}
