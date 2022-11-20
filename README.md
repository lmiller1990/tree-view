foo/bar/qux.js
foo/bar/baz/foo.js
foo/bar/baz/merp/buz.js

foo/bar
  quz.js
  baz
    foo.js
    merp
      buz.js

{
  name: 'foo/bar',
  parent: null,
  relative: 'foo/bar',
  files: [qux.js],
  dirs: ['foo/bar/baz'],
}

{
  name: 'baz'
  parent: 'foo/bar'
  relative: 'foo/bar/baz',
  files: [foo.js],
  dirs: ['foo/bar/baz/merp/lux']
}

{
  name: 'merp/lux'
  parent: 'foo/bar/baz'
  relative: 'foo/bar/baz/merp/lux',
  files: [buz.js],
  dirs: []
}

foo
foo/bar
foo/bar/baz
foo/bar/baz/merp
foo/bar/baz/merp/lux


foo/bar
foo/bar/baz
foo/bar/baz/merp/lux