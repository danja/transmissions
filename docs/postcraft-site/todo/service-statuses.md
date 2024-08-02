C : commented
UT : unit tested
IT : integration tested

src/services
├── base
│   ├── ProcessService.js
│   ├── Service.js
│   ├── SinkService.js
│   └── SourceService.js
├── fs
│   ├── DirWalker.js
│   ├── FileCopy.js | C IT
│   ├── FileReader.js
│   ├── FileRemove.js
│   ├── FileWriter.js
│   └── FsServicesFactory.js
├── markup
│   ├── LinkFinder.js
│   ├── MarkdownToHTML.js
│   ├── MarkupServicesFactory.js
│   └── MetadataExtractor.js
├── postcraft
│   ├── EntryContentToPagePrep.js
│   ├── FrontPagePrep.js
│   ├── PostcraftDispatcher.js
│   ├── PostcraftPrep.js
│   └── PostcraftServicesFactory.js
├── protocols
│   ├── HttpGet.js
│   └── ProtocolsServicesFactory.js
├── rdf
│   ├── ConfigMap.js
│   ├── ContextReader.js | C
│   └── RDFServicesFactory.js
├── ServiceExample.js
├── test
│   ├── AppendProcess.js
│   ├── FileSink.js
│   ├── FileSource.js
│   ├── StringSink.js
│   ├── StringSource.js
│   └── TestServicesFactory.js
├── text
│   ├── LineReader.js
│   ├── StringFilter.js
│   ├── StringMerger.js
│   ├── Templater copy.js
│   ├── Templater.js
│   └── TextServicesFactory.js
├── unsafe
│   └── chatgpt.md
└── util
├── DeadEnd.js
├── Fork.js
├── Halt.js
├── NOP.js
├── RemapContext.js
├── ShowMessage.js
├── ShowTransmission.js
├── Stash.js
├── Unfork.js
└── UtilServicesFactory.js

11 directories, 48 files
