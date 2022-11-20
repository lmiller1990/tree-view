import { describe, expect, it } from "vitest";
import { deriveTree as derive } from "./tree";

const files = [
  "foo/bar/merp.js",
  "foo/bar/baz.js",
  "foo/bar/baz/merp/lux/qux.js",
  "foo/foo.js",
];

const deriveTree: typeof derive = (files, opts) => {
  return derive(files, { ...opts, noCircularDeps: true });
};

describe("deriveTree", () => {
  it("works for a single directory with file", () => {
    const files = ["foo/bar.js"];
    const actual = deriveTree(files, { noCircularDeps: true });
    expect(actual).toMatchInlineSnapshot(`
      {
        "depth": 0,
        "dirs": [
          {
            "depth": 0,
            "dirs": [],
            "files": [
              "bar.js",
            ],
            "name": "foo",
            "parent": "/",
            "relative": "foo",
          },
        ],
        "files": [],
        "name": "/",
        "parent": null,
        "relative": "/",
      }
    `);
  });

  it("works for case of two nested directories with files", () => {
    const files = ["foo/bar.js", "foo/qux.js"];
    const actual = deriveTree(files, { noCircularDeps: true });
    expect(actual).toMatchInlineSnapshot(`
      {
        "depth": 0,
        "dirs": [
          {
            "depth": 0,
            "dirs": [],
            "files": [
              "bar.js",
              "qux.js",
            ],
            "name": "foo",
            "parent": "/",
            "relative": "foo",
          },
        ],
        "files": [],
        "name": "/",
        "parent": null,
        "relative": "/",
      }
    `);
  });

  it("works for deeply nested file", () => {
    const files = ["foo/bar.js", "foo/a/b/c/d/qux.js"];
    const actual = deriveTree(files, { noCircularDeps: true });
    console.log(actual)
    expect(actual).toMatchInlineSnapshot(`
      {
        "depth": 0,
        "dirs": [
          {
            "depth": 0,
            "dirs": [
              {
                "depth": 0,
                "dirs": [],
                "files": [
                  "qux.js",
                ],
                "name": "a/b/c/d",
                "parent": "foo",
                "relative": "foo/a/b/c/d",
              },
            ],
            "files": [
              "bar.js",
            ],
            "name": "foo",
            "parent": "/",
            "relative": "foo",
          },
        ],
        "files": [],
        "name": "/",
        "parent": null,
        "relative": "/",
      }
    `);
  });
});
