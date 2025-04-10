We are in the process of creating a visual editor for `transmission.ttl` pipeline descriptions using the nodeflow library. A lot of code is in place under `src/tools/nodeflow` which is addressed by means of `index.html`. However since the bridging between transmissions and nodeflow will use the relatively heavyweight nodeflow material alongside RDF-Ext and rdfjs libs it seems time to make use of WebPack as a bundler (and for convenience, a dev server).
Please review the project knowledge and think very deeply on how nodeflow can be used, with minimal impact on the existing codebase. First double-check any new code adds functionality without breaking anything, providing Jasmine tests as appropriate (under `tests/api`) then give any code as individual, full source code artifacts, clearly labeled as to where they should be located.

Please refer to project knowledge. We are in the process of creating a visual editor for `transmission.ttl` pipeline descriptions using the nodeflow library. A lot of code is in place under `src/tools/nodeflow` which is addressed by means of `index.html`. Transmissions is a node-based project, some of the libs (eg. RDF-Ext) aren't natively browser-friendly. So compatibility is acheived by packaging with WebPack, see `webpack.config.js` and `package.json`. Right now most of the code is in place but there are many bugs to fix. I'd like you to help me fix them. The procedure will be that you familiarise yourself with the relevant parts of the codebase - the `index.html` in the root of the project and `src/tools/nodeflow/editor.html` are probably good starting points. When you are ready I will show you the first error.

I want to use modern ES modules wherever possible. Right now I get the error :

npm run start

> transmissions@1.0.0 start
> webpack serve --config webpack.config.js --mode=development

[webpack-cli] Failed to load '/home/danny/hyperdata/transmissions/webpack.config.js' config
[webpack-cli] ReferenceError: require is not defined

[webpack-cli] Failed to load '/home/danny/hyperdata/transmissions/webpack.config.js' config
[webpack-cli] ReferenceError: require is not defined

---

After running `npm run start`, when I try to load a Turtle file in the browser I get the error below. You may find relevant examples of using rdf-ext in `src/utils/RDFUtils.js`. It would be good if the system initialized by loading a sample file, call it `src/applications/intro/transmissions.ttl` and I can use that for quick start documentation.

Error: rdf_ext**WEBPACK_IMPORTED_MODULE_0**.default.TurtleParser is not a constructor

---

Please refer to project knowledge. We are in the process of creating a visual editor for `transmission.ttl` pipeline descriptions using the nodeflow library. A lot of code is in place under `src/tools/nodeflow` which is addressed by means of `index.html`. Transmissions is a node-based project, some of the libs (eg. RDF-Ext) aren't natively browser-friendly. So compatibility is acheived by packaging with WebPack, see `webpack.config.js` and `package.json`. Right now most of the code is in place but there are many bugs to fix. I'd like you to help me fix them. The procedure will be that you familiarise yourself with the relevant parts of the codebase - the `index.html` in the root of the project and `src/tools/nodeflow/editor.html` are probably good starting points.

After running `npm run start`, when I try to load a Turtle file in the browser I get the error below. You may find relevant examples of using rdf-ext in `src/utils/RDFUtils.js`.

Error loading sample: dataset.import(...).on is not a function

---

Please refer to project knowledge. We are in the process of creating a visual editor for `transmission.ttl` pipeline descriptions using the nodeflow library. A lot of code is in place under `src/tools/nodeflow` which is addressed by means of `index.html`. Transmissions is a node-based project, some of the libs (eg. RDF-Ext) aren't natively browser-friendly. So compatibility is acheived by packaging with WebPack, see `webpack.config.js` and `package.json`. ES modules are used throughout. Right now most of the code is in place but there are many bugs to fix. I'd like you to help me fix them. The procedure will be that you familiarise yourself with the relevant parts of the codebase and then we fix the bugs one-by-one. The `index.html` in the root of the project and `src/tools/nodeflow/editor.html` are probably good starting points.

After running `npm run start` the following error is shown :
ERROR in ./src/utils/browser-rdf-ext.js 136:2-12
export 'DatasetExt' (imported as 'DatasetExt') was not found in 'rdf-ext' (possible exports: DataFactory, DatasetFactory, Environment, FetchFactory, FormatsFactory, GrapoiFactory, NamespaceFactory, PrefixMapFactory, ScoreFactory, TermMapFactory, TermSetFactory, TraverserFactory, default)

please give me the complete source of src/utils/browser-rdf-ext.js as an artifact
