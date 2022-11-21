import { describe, expect, it } from "vitest";
import { BaseFile, deriveTree as derive } from "./tree";

const files: BaseFile[] = [
  { relative: "foo/bar/merp.js" },
  { relative: "foo/bar/baz.js" },
  { relative: "foo/bar/baz/merp/lux/qux.js" },
  { relative: "foo/foo.js" },
];

const deriveTree: typeof derive = (files, opts) => {
  return derive(files, { ...opts, noCircularDeps: true });
};

describe("deriveTree", () => {
  it("works for a single directory with file", () => {
    const files: BaseFile[] = [{ relative: "foo/bar.js" }];
    const actual = deriveTree(files, { noCircularDeps: true });
    expect(actual).toMatchInlineSnapshot(`
      {
        "depth": 0,
        "dirs": [
          {
            "depth": 0,
            "dirs": [],
            "files": [
              {
                "relative": "bar.js",
              },
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
    const files = [{ relative: "foo/bar.js" }, { relative: "foo/qux.js" }];
    const actual = deriveTree(files, { noCircularDeps: true });
    expect(actual).toMatchInlineSnapshot(`
      {
        "depth": 0,
        "dirs": [
          {
            "depth": 0,
            "dirs": [],
            "files": [
              {
                "relative": "qux.js",
              },
              {
                "relative": "bar.js",
              },
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
    const files = [
      { relative: "foo/bar.js" },
      { relative: "foo/a/b/c/d/qux.js" },
    ];

    const actual = deriveTree(files, { noCircularDeps: true });

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
                  {
                    "relative": "qux.js",
                  },
                ],
                "name": "a/b/c/d",
                "parent": "foo",
                "relative": "foo/a/b/c/d",
              },
            ],
            "files": [
              {
                "relative": "bar.js",
              },
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
