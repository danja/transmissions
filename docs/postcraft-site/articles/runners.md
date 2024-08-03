# Runners

Application :

./run postcraft /home/danny/github-danny/postcraft/danny.ayers.name

```
repopack --verbose -c /home/danny/github-danny/transmissions/repopack.config.json
```

repopack --verbose -c ./repopack.config.json

npm run test

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

npm test -- tests/unit/PostcraftPrep.spec.js

see docs/dev-process.md
