export interface DirectoryNode {
  type: "directory";
  /** relative path from root, which is defined as '/' */
  relative: string;
  /** name of directory */
  name: string;
  /** points to parent relative path. */
  parent: string | null;
  parentNode: DirectoryNode | null
  /** array of relative directories that are children */
  directories: string[];
  /** array of relative files that are children */
  files: string[];
}

export interface FileNode {
  type: "file";
  relative: string;
  name: string;
  parent: string;
}

/**
 * foo/bar => { name: "bar", path: "foo"}
 * foo => { name: "foo", path: null }
 */
export interface Parts {
  name: string;
  path: string;
}

/**
 *
 * Assumes a top level / directory.
 */
export function getAllDirectories(files: string[]): string[] {
  const set = new Set<string>(["/"]);
  for (const file of files) {
    const { path } = getParts(file);
    if (path === "/") {
      // spec at root level
      // we've already added a default `/`
      continue;
    }
    const split = path.split("/");
    const acc: string[] = [];
    for (const s of split) {
      acc.push(s);
      set.add(acc.join("/"));
    }
  }
  console.log(files, set)
  // for (const file of files) {

  // }
  return [...set];
}

export function getParts(p: string): Parts {
  const s = p.split("/");
  const path = s.slice(0, s.length - 1);
  const name = s.at(-1) ?? null;
  if (!name) {
    throw Error(`Did not get name for ${p}. Should be impossible`);
  }
  return {
    path: s.length > 1 ? path.join("/") : "/",
    name,
  };
}

/**
 * Takes an array of directories and creates `DirectoryNode`,
 * associating each directory with it's parent.
 * Additionally, creates a root node, which is at the
 * top of the tree.
 * It returns a Map { relative => DirectoryNode } for convinient lookup.
 */
export function createDirectoryNodesMap(
  directories: string[]
): Map<string, DirectoryNode> {
  // `sort` mutates in place
  directories.sort((x, y) => {
    return x.split("/").length < y.split("/").length ? 1 : -1;
  });

  const root: DirectoryNode = {
    type: "directory",
    name: "/",
    relative: "/",
    parent: null,
    children: [],
  };

  const map = new Map<string, DirectoryNode>([["/", root]]);

  // build map of directories
  for (const path of directories) {
    let arr: string[] = [];
    let split = path.split("/");
    for (let i = 0; i < split.length; i++) {
      const relative = [...arr, split[i]].join("/");
      if (relative === "/" || split[i] === "") {
        // already have this
        // continue
        continue
      }
      const node: DirectoryNode = {
        type: "directory",
        relative,
        name: split[i],
        parent: arr.length ? arr.join("/") : "/",
        children: [],
      };
      arr.push(split[i]);
      map.set(relative, node);
    }
  }

  // populate directory children
  for (const [relative, node] of map.entries()) {
    const parent = node.parent && map.get(node.parent);
    if (!parent) {
      // should be the root node, only one without a parent
      if (node.name !== "/") {
        throw Error("Node parent was not found - should be impossible");
      } else {
        continue;
      }
    }
    parent.children.push(relative);
    continue;
  }

  return map;
}

export function addFilesToDirectoryMap (files: string[], directories: Map<string, DirectoryNode>): Map<string, DirectoryNode> {

}

/**
 * Recurse up from a file's parent (a) or hit the root, directory by directory,
 * until we find a directory (b) that contains any other file.
 * Once we do, all directories from (b) -> (a) are consider superflous
 * and can be collapsed into a single directory.
 *
 * Example:
 *
 * - foo
 *    - bar
 *      - qux.js
 *      - baz
 *         - a
 *           - b
 *             - c
 *               - foo.js
 * start with `foo.js`
 * foo/bar/baz/a/b/c/foo.js
 * c -> no files
 * b -> no files
 * a -> no files
 * baz -> no files
 * bar  -> bar contains `qux.js`
 * this means from `baz` downwards is superfluous and can be collapsed
 * - foo
 *   - bar
 *     - baz/a/b/c
 *     - `foo.js`
 *   - qux.js
 *
 * next, `qux.js`
 * foo/bar/qux.js
 * bar -> no files
 * foo -> no files
 * arrive at /
 * this means from `foo` downwards is superfluous and can be collapsed
 *
 * - foo/bar
 *   - baz/a/b/c
 *   - `foo.js`
 * - qux.js
 */
export function mergeSuperfluousDirectories(
  files: FileNode[],
  directories: Map<string, DirectoryNode>
) {
  // console.log(directories)
  // for (const file of files) {
  //   let { name, path } = getParts(file.relative);
  //   console.log(name, path)
  // }
}

export function getFileMetadata(files: string[]): FileNode[] {
  const fileArr: FileNode[] = [];

  for (const file of files) {
    const { path, name } = getParts(file);
    fileArr.push({
      type: "file",
      relative: file,
      parent: path,
      name,
    });
  }
  return fileArr;
}

export function deriveTree(files: string[]) {
  const directories = getAllDirectories(files);
  const dirMap = createDirectoryNodesMap(directories);
  const fileArr = getFileMetadata(files)
  console.log(fileArr)

  // return fileArr;
}
