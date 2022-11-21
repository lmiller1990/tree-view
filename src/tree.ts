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
  files: BaseFile[];
}

interface BaseDirNode<T> {
  files: BaseFile[];
  dirs: T[];
  relative: string;
  name: string;
  depth: number;
  parent: T | null;
}

export type DirNode = BaseDirNode<DirNode>;

export type NoCirDepsDirNode = BaseDirNode<string>;

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
  curr: string[],
  dir: string[],
  target: BaseFile,
  knownDirs: Array<string[]>
): Entry {
  let longest: string[] = [];

  for (let i = 0; i < knownDirs.length; i++) {
    const curr = knownDirs[i];
    const next = longestCommonPath(curr, dir);
    if (next.length > longest.length) {
      longest = next;
    }
  }
  let parent = longest.join("/");
  parent === "" ? "/" : parent;
  const trun = curr.slice(longest.length);
  const relative = curr.slice(0, curr.length - 1).join("/");
  const name = trun.slice(0, trun.length - 1).join("/");
  const file = curr.slice(-1)[0];

  const e: Entry = {
    relative,
    name,
    parent,
    files: [{ ...target, relative: file }],
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
  target: BaseFile,
  files: BaseFile[],
  knownDirs: Array<string[]>,
  entries: Entry[]
): { best?: string[]; entry: Entry } {
  const knownSibling = entries.find((x) => x.relative === getPath(target.relative));

  if (knownSibling) {
    return {
      entry: {
        ...knownSibling,
        files: knownSibling.files.concat({
          ...target,
          relative: getFilename(target.relative)
        })
      },
    };
  }

  const others = files.filter((x) => x !== target).map((x) => x.relative.split(`/`));
  const curr = target.relative.split("/");

  let best: string[] = [];
  for (let i = 0; i < others.length; i++) {
    const next = longestCommonPath(curr, others[i]);
    if (next.length > best.length) {
      best = next;
    }
  }

  const entry = collapse(curr, best, target, knownDirs);
  return {
    best,
    entry,
  };
}

interface TreeOptions {
  noCircularDeps: boolean;
}

const defaults: TreeOptions = {
  noCircularDeps: false,
};

export type BaseFile = {
  relative: string;
};

export function deriveTree(files: BaseFile[], opts: Partial<TreeOptions> = {}) {
  const options = { ...defaults, ...opts };

  files.sort((x, y) => (x.relative.split("/").length < y.relative.split("/").length ? -1 : 1));

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
    relative: "/",
    name: "/",
    depth: 0,
    parent: null,
    files: [],
    dirs: [],
  };

  const dirmap = new Map<string, DirNode>();

  function getDepth(n: DirNode) {
    // We start at -1 since node.parent is always defined at least once,
    // since even the top level nodes have `root` as their parent.
    let i = -1;
    let node: DirNode | null = n;
    while ((node = node?.parent ?? null)) {
      i++;
    }
    return i;
  }

  for (const entry of entries) {
    const parent =
      entry.relative === entry.name ? root : dirmap.get(entry.parent)!;
    dirmap.set(entry.relative, {
      relative: entry.relative,
      depth: 0,
      name: entry.name,
      parent,
      files: entry.files.sort((x, y) =>
        y.relative.localeCompare(x.relative) > 0 ? 1 : -1
      ),
      dirs: [],
    });
  }

  for (const v of dirmap.values()) {
    v.parent!.dirs.push(v);
    v.depth = getDepth(v);
  }

  if (options.noCircularDeps) {
    for (const v of dirmap.values()) {
      (v as unknown as NoCirDepsDirNode).parent = v.parent?.relative ?? null;
      v.depth = getDepth(v);
    }
  }

  return root;
}
