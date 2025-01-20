# Packer Application Source Files

## Core Processing

```
src/api/cli/run.js                          # Entry point, command line processing
src/api/common/CommandUtils.js              # Command parsing and routing
src/core/ApplicationManager.js              # Application lifecycle management
src/core/TransmissionBuilder.js             # Pipeline construction from configs
src/core/ModuleLoader.js                    # Dynamic processor loading
src/core/ModuleLoaderFactory.js             # Processor module instantiation
```

## Pipeline Processors

```
src/processors/fs/DirWalker.js              # Directory traversal
src/processors/text/StringFilter.js         # File pattern matching
src/processors/fs/FileReader.js             # File content loading
src/processors/packer/FileContainer.js      # Content aggregation
src/processors/util/CaptureAll.js           # Message capture
src/processors/util/WhiteboardToMessage.js  # Message transformation
src/processors/flow/Unfork.js               # Pipeline convergence
src/processors/fs/FileWriter.js             # Output generation
```

## Configuration

```
src/applications/packer/transmissions.ttl   # Pipeline definition
src/applications/packer/config.ttl          # Processor configuration
src/applications/packer/about.md            # Application documentation
```

## Base Classes & Support

```
src/engine/Transmission.js                  # Pipeline execution engine
src/processors/base/Processor.js            # Base processor functionality
src/processors/base/ProcessorSettings.js    # Configuration management
```

## Factories

```
src/processors/fs/FsProcessorsFactory.js           # File system processors
src/processors/text/TextProcessorsFactory.js       # Text processing
src/processors/packer/PackerProcessorsFactory.js   # Packer-specific processors
src/processors/util/UtilProcessorsFactory.js       # Utility processors
src/processors/flow/FlowProcessorsFactory.js       # Flow control processors
```

## Utilities

```
src/utils/ns.js                            # RDF namespace management
src/utils/Logger.js                        # Logging infrastructure
src/utils/footpath.js                      # Path resolution
src/utils/GrapoiHelpers.js                 # RDF graph utilities
```
