# Runners

Application :

./run postcraft /home/danny/HKMS/postcraft/danny.ayers.name

```
repopack --verbose -c ./repopack.config.json
```

Individual test:

`$npx jasmine --reporter=tests/helpers/reporter.js tests/unit/NOP.spec.js`

```
npm run <script>

  "scripts": {
    "test": "jasmine --config=jasmine.json --reporter=tests/helpers/reporter.js",
    "docs": "jsdoc -c jsdoc.json",
    "build": "webpack --mode=production --node-env=production",
    "build:dev": "webpack --mode=development",
    "build:prod": "webpack --mode=production --node-env=production",
    "watch": "webpack --watch",
    "serve": "webpack serve"
  },
```

// npm test -- tests/integration/file-copy-remove-test.spec.js

see docs/dev-process.md
