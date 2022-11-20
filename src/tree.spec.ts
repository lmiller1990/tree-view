import { stringifyExpression } from "@vue/compiler-core";
import { describe, expect, it } from "vitest";
import { DirectoryNode, getParts } from "./tree";
// import {
//   getAllDirectories,
//   createDirectoryNodesMap,
//   DirectoryNode,
//   FileNode,
//   deriveTree,
//   Parts,
//   getParts,
//   getFileMetadata,
//   mergeSuperfluousDirectories,
// } from "./tree";

// describe("deriveTree", () => {
//   it("works", () => {
//     const actual = deriveTree(["foo/bar/qux.js", "foo/bar/baz/a/b/c/foo.js"]);
//     // console.log(actual);
//   });
// });

// describe("mergeSuperfluousDirectories", () => {
//   it.only("works", () => {
//     const fileNodes = getFileMetadata([
//       "foo/bar/qux.js",
//       "foo/bar/baz/a/b/c/foo.js",
//     ]);
//     const dirMap = createDirectoryNodesMap([
//       "/",
//       "foo",
//       "foo/bar",
//       "foo/bar/baz",
//       "foo/bar/baz/a",
//       "foo/bar/baz/a/b",
//       "foo/bar/baz/a/b/c",
//     ]);

//     const actual = mergeSuperfluousDirectories(fileNodes, dirMap);

//     console.log(actual)
//   });
// });

// describe("getAllDirectories", () => {
//   it.only("gets a list of unique directories", () => {
//     const actual = getAllDirectories([
//       "foo/bar.js",
//       "foo/bar/baz.js",
//       "qux.js",
//     ]);
//     expect(actual).to.eql(["/", "foo", "foo/bar"]);
//   });

//   it("works with nested", () => {
//     const actual = getAllDirectories([
//       "foo/bar/qux.js",
//       "foo/bar/baz/a/b/c/foo.js",
//     ]);
//     expect(actual).to.eql([
//       "/",
//       "foo",
//       "foo/bar",
//       "foo/bar/baz",
//       "foo/bar/baz/a",
//       "foo/bar/baz/a/b",
//       "foo/bar/baz/a/b/c",
//     ]);
//   });
// });

// describe("getFileMetadata", () => {
//   it("returns array with files and metadata", () => {
//     const actual = getFileMetadata(["foo/bar.js", "foo/bar/baz.js", "qux.js"]);

//     expect(actual).toMatchInlineSnapshot(`
//       [
//         {
//           "name": "bar.js",
//           "parent": "foo",
//           "relative": "foo/bar.js",
//           "type": "file",
//         },
//         {
//           "name": "baz.js",
//           "parent": "foo/bar",
//           "relative": "foo/bar/baz.js",
//           "type": "file",
//         },
//         {
//           "name": "qux.js",
//           "parent": "/",
//           "relative": "qux.js",
//           "type": "file",
//         },
//       ]
//     `);
//   });
// });

// describe("createDirectoryNodesMap", () => {
//   it("handles list including root directory", () => {
//     const actual = createDirectoryNodesMap([
//       "/",
//       "foo",
//       "foo/bar",
//       "foo/bar/baz",
//       "foo/bar/baz/a",
//       "foo/bar/baz/a/b",
//       "foo/bar/baz/a/b/c",
//     ]);

//     expect(actual).toMatchInlineSnapshot(`
//       Map {
//         "/" => {
//           "children": [
//             "foo",
//           ],
//           "name": "/",
//           "parent": null,
//           "relative": "/",
//           "type": "directory",
//         },
//         "foo" => {
//           "children": [
//             "foo/bar",
//           ],
//           "name": "foo",
//           "parent": "/",
//           "relative": "foo",
//           "type": "directory",
//         },
//         "foo/bar" => {
//           "children": [
//             "foo/bar/baz",
//           ],
//           "name": "bar",
//           "parent": "foo",
//           "relative": "foo/bar",
//           "type": "directory",
//         },
//         "foo/bar/baz" => {
//           "children": [
//             "foo/bar/baz/a",
//           ],
//           "name": "baz",
//           "parent": "foo/bar",
//           "relative": "foo/bar/baz",
//           "type": "directory",
//         },
//         "foo/bar/baz/a" => {
//           "children": [
//             "foo/bar/baz/a/b",
//           ],
//           "name": "a",
//           "parent": "foo/bar/baz",
//           "relative": "foo/bar/baz/a",
//           "type": "directory",
//         },
//         "foo/bar/baz/a/b" => {
//           "children": [
//             "foo/bar/baz/a/b/c",
//           ],
//           "name": "b",
//           "parent": "foo/bar/baz/a",
//           "relative": "foo/bar/baz/a/b",
//           "type": "directory",
//         },
//         "foo/bar/baz/a/b/c" => {
//           "children": [],
//           "name": "c",
//           "parent": "foo/bar/baz/a/b",
//           "relative": "foo/bar/baz/a/b/c",
//           "type": "directory",
//         },
//       }
//     `);
//   });
//   it("works with one nested directory", () => {
//     const actual = createDirectoryNodesMap(["foo", "foo/bar"]);
//     expect(actual).toMatchInlineSnapshot(`
//       Map {
//         "/" => {
//           "children": [
//             "foo",
//           ],
//           "name": "/",
//           "parent": null,
//           "relative": "/",
//           "type": "directory",
//         },
//         "foo" => {
//           "children": [
//             "foo/bar",
//           ],
//           "name": "foo",
//           "parent": "/",
//           "relative": "foo",
//           "type": "directory",
//         },
//         "foo/bar" => {
//           "children": [],
//           "name": "bar",
//           "parent": "foo",
//           "relative": "foo/bar",
//           "type": "directory",
//         },
//       }
//     `);
//   });

//   it("works with one directory", () => {
//     const actual = createDirectoryNodesMap(["foo"]);
//     expect(actual).toMatchInlineSnapshot(`
//       Map {
//         "/" => {
//           "children": [
//             "foo",
//           ],
//           "name": "/",
//           "parent": null,
//           "relative": "/",
//           "type": "directory",
//         },
//         "foo" => {
//           "children": [],
//           "name": "foo",
//           "parent": "/",
//           "relative": "foo",
//           "type": "directory",
//         },
//       }
//     `);
//   });

//   it("works with two deeply directories", () => {
//     const actual = createDirectoryNodesMap(["a/b/c/d", "a/b/e/f"]);
//     expect(actual).toMatchInlineSnapshot(`
//       Map {
//         "/" => {
//           "children": [
//             "a",
//           ],
//           "name": "/",
//           "parent": null,
//           "relative": "/",
//           "type": "directory",
//         },
//         "a" => {
//           "children": [
//             "a/b",
//           ],
//           "name": "a",
//           "parent": "/",
//           "relative": "a",
//           "type": "directory",
//         },
//         "a/b" => {
//           "children": [
//             "a/b/e",
//             "a/b/c",
//           ],
//           "name": "b",
//           "parent": "a",
//           "relative": "a/b",
//           "type": "directory",
//         },
//         "a/b/e" => {
//           "children": [
//             "a/b/e/f",
//           ],
//           "name": "e",
//           "parent": "a/b",
//           "relative": "a/b/e",
//           "type": "directory",
//         },
//         "a/b/e/f" => {
//           "children": [],
//           "name": "f",
//           "parent": "a/b/e",
//           "relative": "a/b/e/f",
//           "type": "directory",
//         },
//         "a/b/c" => {
//           "children": [
//             "a/b/c/d",
//           ],
//           "name": "c",
//           "parent": "a/b",
//           "relative": "a/b/c",
//           "type": "directory",
//         },
//         "a/b/c/d" => {
//           "children": [],
//           "name": "d",
//           "parent": "a/b/c",
//           "relative": "a/b/c/d",
//           "type": "directory",
//         },
//       }
//     `);
//   });
// });

// describe("getParts", () => {
//   it("works on a root level dir", () => {
//     const actual = getParts("foo");
//     expect(actual).toEqual<Parts>({
//       path: "/",
//       name: "foo",
//     });
//   });

//   it("works for nested dir", () => {
//     const actual = getParts("foo/bar/baz");
//     expect(actual).toEqual<Parts>({
//       path: "foo/bar",
//       name: "baz",
//     });
//   });
// });

function deriveTree(files: string[]) {
  files.sort((x, y) => {
    return x.split("/").length > y.split("/").length ? 1 : -1;
  });

  const root: DirectoryNode = {
    type: "directory",
    name: "/",
    relative: "/",
    parentNode: null,
    parent: null,
    directories: [],
    files: [],
  };

  const dirMap = new Map<string, DirectoryNode>();
  for (const file of files) {
    const { path } = getParts(file);
    const split = path.split("/");
    const acc: string[] = [];

    for (const s of split) {
      const relative = [...acc, s].join("/");
      if (dirMap.has(relative)) {
        if (relative === path) {
          // add file
          dirMap.get(relative)!.files.push(file);
        }
      } else {
        const parentPath = acc.length ? acc.join("/") : "/"
        const dir: DirectoryNode = {
          type: "directory",
          name: s,
          relative,
          parent: parentPath,
          parentNode: dirMap.get(parentPath) ?? root,
          directories: [],
          files: [],
        };
        if (relative === path) {
          // add file
          dir.files.push(file);
        }
        dirMap.set(relative, dir);
      }
      acc.push(s);
    }
  }
  // console.log(dirMap)

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

  for (const file of [files[0]]) {
    console.log(file)
    const { path } = getParts(file)
    const node = dirMap.get(path)!
    let parentNode = node.parentNode
    const superfluous: string[] = []
    while (parentNode) {
      const hasOtherFiles = parentNode.files.length
      // console.log(parentNode)
      console.log(`parent is ${parentNode.relative}. Other files: ${hasOtherFiles}`)
      if (parentNode?.relative === '/') {
        // done
        break
      }
      if (hasOtherFiles) {
        superfluous.push(parentNode.relative)
        break
      } else {
        if (!superfluous.length) {
          superfluous.push(node.relative)
        }
        console.log(`superfluous ${parentNode.relative}`)
        superfluous.push(parentNode.relative)
      }
      parentNode = parentNode.parentNode
    }
    // console.log(superfluous)
    const common = superfluous.at(-1)!.split('/')
    // console.log({common})
    const updated = superfluous.slice(0, superfluous.length - 1).map((x) => {
      const s = x.split("/");
      return s.slice(common.length).join('/');
    });
    const newName = updated[0]
    const newParent = common.join('/')
    // console.log({ updated })
    const k = [common.join('/'), updated[0]].join('/')
    // console.log(k)
    const n = dirMap.get(k)!
    const nd: DirectoryNode = {
      ...n,
      type: "directory",
      name: newName,
      parent: newParent,
      parentNode: dirMap.get(newParent)!,
    };
    // console.log({newName})
    console.log({common, superfluous, updated})
    superfluous.slice(0, superfluous.length - 1).forEach(x => {
    console.log(`del`, x)
      dirMap.delete(x)
    })
    dirMap.delete(k)
    dirMap.set(newName, nd)
    // console.log(updated, n, newName)
    // const { path, name } = getParts(file)
    // while ()
    // const parent = 
  }

  // assign files
  console.log(dirMap);
}

it("works", () => {
  const actual = deriveTree(["foo/bar/qux.js"]) // , "foo/bar/baz/a/b/c/foo.js"]);
});
