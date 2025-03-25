# terrapack Application

**Packs sets of text/code content into a single file to provide grounding for AI**

_repopack/repomix equiv_

```sh
cd ~/hyperdata/transmissions # my local dir

./trans terrapack ./src/applications/terrapack/data

./trans terrapack ./src/applications/terrapack/data

./trans terrapack path/to/repo

./trans terrapack ./


./trans terrapack
```

from Claude

# terrapack Application

_repopack/repomix equiv_

```sh
./trans terrapack path/to/repo

./trans terrapack ./

./trans terrapack
```

Walks repository directory according to configured patterns, combines files into single AI-friendly document with:

- Directory structure outline
- File content with metadata
- Comment stripping option
- Configurable include/exclude patterns
- Output format optimized for LLMs

## Flow

1. DirWalker scans repository with filters
2. FileReader loads content and metadata
3. FileContainer accumulates and formats data
4. FileWriter generates single combined output
