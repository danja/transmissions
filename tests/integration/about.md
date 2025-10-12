There are several layers of testing available. The full suite can be run with :

```sh
npm test
```

Or individually with eg. :

```sh
npm test -- tests/engine/TransmissionBuilder.spec.js
```

In addition to typical unit and integration tests, some additional low-level tests of processors are implemented using "_**simples**_". Here the classes implementing `Processor` are addressed in isolation, with local mock data in the _simples_ runner scripts.

TODO : re-set up simples

Also integration tests are provided using full application runners with :

```sh
npm test -- tests/integration/AppTester.spec.js
```

These tests are defined via `tests/integration/apps.json`.

```sh
cd ~/hyperdata/transmissions # my local dir

npm test -- tests/engine/TransmissionBuilder.spec.js

npm test -- tests/model/Transmission.spec.js

npm test -- tests/engine/WorkerPool.spec.js

npm test -- tests/utils/RDFUtils.spec.js

npm test -- tests/utils/BrowserUtils.spec.js
npm test -- tests/utils/GrapoiHelpers.spec.js
npm test -- tests/utils/RDFUtils.spec.js
npm test -- tests/utils/SysUtils.spec.js

npm test -- tests/model/Processor.spec.js

npm test -- tests/engine/TransmissionBuilder-2.spec.js
npm test -- tests/engine/ProcessorSettings.spec.js
npm test -- tests/engine/AppResolver.spec.js
```
