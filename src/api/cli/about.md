# About : CLI

`src/api/cli/*`

The CLI entry point `./trans` calls `src/api/cli/run.js` which uses [yargs](https://yargs.js.org/) - _tee hee_, they say it best :

> Yargs be a node.js library fer hearties tryin' ter parse optstrings.

`src/api/cli/run.js` then calls `src/api/common/CommandUtils.js`. That does a little bit of path-splitting and simple logic, calling on `src/core/ApplicationManager.js` to get things going.
