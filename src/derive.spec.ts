import { it } from "vitest";

interface DirNode {
  path: string;
  children: string[];
}

interface Data {
  file: string;
  mergeIdx: number;
}

function getPath(s: string) {
  const spl = s.split("/");
  return spl.slice(0, spl.length - 1);
}

function getBest(curr: string[], p: string[]): number {
  for (let i = 0; i < Math.max(p.length, curr.length); i++) {
    if (i > curr.length || i > p.length) {
      return i;
    }

    if (curr[i] !== p[i]) {
      return i;
    }
  }
  return curr.length;
}

function hasMatch(curr: string[], paths: Array<string[]>) {
  let best = 0;
  for (const p of paths) {
    if (p.join("/") === curr.join("/")) {
      continue;
    }
    const cand = getBest(curr, p);
    if (cand > best) {
      best = cand;
    }
  }
  return best;
}

function splitDirAndFile(f: string) {
  const spl = f.split("/");
  if (spl.length === 1) {
    return {
      dirs: null,
      file: f,
    };
  } else {
    const d = spl.slice(0, spl.length - 1);
    return {
      dirs: d.length > 0 ? d.join("/") : d[0],
      file: spl[spl.length - 1],
    };
  }
}

function identifyCommonPrefix (files: string[]) {
  const paths = files.map(getPath)
  const data: Data[] = [];
  for (const f of files) {
    const m = hasMatch(getPath(f), paths);
    data.push({
      file: f,
      mergeIdx: m,
    });
  }
  return data
}

function normalize (files: string[]) {
  const data = identifyCommonPrefix(files)
  for (const d of data) {
    const s = d.file.split('/')
    const dir =
      d.mergeIdx === 0
        ? s.slice(0, s.length - 1).join("/")
        : s.slice(0, d.mergeIdx).join("/");
    console.log({dir})
  }

}

function deriveTree(files: string[]) {
  const data = identifyCommonPrefix(files)
  for (const d of data) {
    const s = d.file.split('/')
    const dir =
      d.mergeIdx === 0
        ? s.slice(0, s.length - 1).join("/")
        : s.slice(0, d.mergeIdx).join("/");
    console.log({dir})
  }

  const dirMap = new Map<string, DirNode>();

  // console.log(data);

  for (const d of data) {
    const s = d.file.split("/");
    if (d.mergeIdx === 0) {
      const dir = s.slice(0, s.length - 1).join("/");
      dirMap.set(dir, {
        path: dir,
        children: [],
      });
      continue;
    }
    const dir = s.slice(0, d.mergeIdx).join("/");
    const rem = d.file.slice(dir.length + 1);

    let { dirs, file } = splitDirAndFile(rem);
    const toAdd = [dir];
    if (dirs) {
      toAdd.push(dirs);
    }

    for (const add of toAdd) {
      // console.log('adding', add, dir, dirs, file, rem)
      let n = dirMap.get(add);
      if (!n) {
        n = {
          path: add === dir ? "" : dir,
          children: [],
        };
        dirMap.set(add, n);
      }
    }
  }

  for (const [k, { path }] of dirMap.entries()) {
    for (const f of files) {
      const filename = f.split("/").at(-1)!;
      let acc = [k, filename];
      const check = acc.join("/");
      if (check === f) {
        dirMap.get(k)!.children.push(filename);
      }
    }
  }

  console.log(dirMap, files);
}

it("", () => {
  const actual = deriveTree([
    "foo/bar/qux.js",
    "foo/bar/baz/a/b/c/foo.js",
    "a/b/c/d/baz/a/merp.js",
    "foo/bar/baz/a/lerp/buz.js",
  ]);
});
