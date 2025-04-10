Please refer to project knowledge. We are in the process of creating a visual editor for `transmission.ttl` pipeline descriptions using the nodeflow library. A lot of code is in place under `src/tools/nodeflow` which is addressed by means of `index.html`. Transmissions is a node-based project, some of the libs (eg. RDF-Ext) aren't natively browser-friendly. So compatibility is achieved by packaging with WebPack, see `webpack.config.js` and `package.json`. ES modules are used throughout.
A faulty part of the code right now is `src/tools/nodeflow/components/TransmissionsLoader.js`. It features an ad hoc and buggy approach to parsing the dataset model. The system already contains a properly functioning parsing subsystem in `src/engine/TransmissionBuilder.js`. Please use this existing class as a guide for revising `src/tools/nodeflow/components/TransmissionsLoader.js` such that it works correctly. Later we will look at refactoring to remove any function duplication. But for now please just copy the techniques used in `src/engine/TransmissionBuilder.js` to `src/tools/nodeflow/components/TransmissionsLoader.js` to make it work. Think deeply to solve this problem, then think a second time to ensure the code will be fully functional. Please render the any source code as complete, individual full artifacts.

Take another look how things are done in `src/engine/TransmissionBuilder.js` which works. This code is now giving :

cError parsing dataset: ptr.dataset.match is not a function or its return value is not iterable
...
loadFromFile @ TransmissionEditor.js:187
...
Logger.js:184 %cStack trace: TypeError: ptr.dataset.match is not a function or its return value is not iterable
