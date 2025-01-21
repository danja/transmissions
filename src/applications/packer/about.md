# Packer Application

_repopack/repomix equiv_

```sh
cd ~/github-danny/transmissions # my local dir

./trans packer path/to/repo

./trans packer ./

./trans packer ./src/applications/packer/data

./trans packer
```

from Claude

# Packer Application

_repopack/repomix equiv_

```sh
./trans packer path/to/repo

./trans packer ./

./trans packer
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
