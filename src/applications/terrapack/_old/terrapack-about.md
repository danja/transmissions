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
