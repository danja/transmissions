# Packer Pipeline Flow

## Command Processing
1. `./trans packer ./src` initiates with:
   - application = "packer" 
   - target = "./src"
   - Command utils resolves target to absolute path
   - Sets targetPath in message object

## Pipeline Components

### 1. DirWalker (p10)
- Input: message with targetPath = resolved "./src" path
- Config: 
  ```turtle
  trn:dirWalker a trn:ConfigSet ;
    trn:sourceDir "." ;
    trn:includeExtensions "['.md','.js','.ttl']"
  ```
- Process:
  - Walks target directory recursively
  - Filters files by includeExtensions
  - For each matching file emits message with:
    ```javascript
    {
      filepath: relative path,
      fullPath: absolute path,
      filename: basename,
      content: undefined // filled by FileReader
    }
    ```

### 2. StringFilter (p20)
- Input: individual file messages from DirWalker
- Config:
  ```turtle
  trn:filterConfig a trn:ConfigSet ;
    trn:includePatterns "*.txt,*.md,*.js..." ;
    trn:excludePatterns "node_modules/*,dist/*..."
  ```
- Process:
  - Filters files based on include/exclude patterns
  - Passes matching files downstream
  - Drops non-matching files

### 3. FileReader (p30)
- Input: filtered file messages
- Config:
  ```turtle
  trn:readConfig a trn:ConfigSet ;
    trn:mediaType "text/plain"
  ```
- Process:
  - Reads file content
  - Adds content to message.content
  - Preserves file metadata

### 4. FileContainer (p40)
- Input: messages with file content
- Config: 
  ```turtle
  trn:containerConfig a trn:ConfigSet ;
    trn:destination "repomix.json"
  ```
- Process:
  - Accumulates files and metadata
  - Builds container structure:
    ```javascript
    {
      files: {
        [relativePath]: {
          content: string,
          type: string,
          timestamp: string
        }
      },
      summary: {
        totalFiles: number,
        fileTypes: Record<string, number>
      }
    }
    ```

### 5. CaptureAll (p50)
- Stores all messages in whiteboard array
- Preserves message flow

### 6. WhiteboardToMessage (p60)
- Transforms whiteboard array into structured message
- Groups similar properties

### 7. Unfork (p70)
- Collapses forked message paths
- Ensures single output path

### 8. FileWriter (p80)
- Input: final container message
- Config:
  ```turtle
  trn:writeConfig a trn:ConfigSet ;
    trn:destinationFile "repomix-output.txt"
  ```
- Process:
  - Writes formatted container to output file
  - Returns success message

## Expected Output
- repomix-output.txt containing:
  - Directory structure of src/
  - File contents
  - File metadata
  - Summary statistics

## Key Message Properties Throughout Pipeline
```javascript
{
  targetPath: "/absolute/path/to/src",
  rootDir: "/path/to/packer/app",
  filepath: "relative/path/to/file",
  content: "file contents",
  done: boolean // indicates completion
}
```

## Error Handling
1. DirWalker handles missing/invalid directories
2. StringFilter validates patterns before use
3. FileReader checks file accessibility
4. FileContainer validates content structure 
5. FileWriter ensures directory exists

## Debug Points
- Check message.targetPath in DirWalker
- Verify pattern loading in StringFilter
- Monitor content preservation in FileReader
- Validate container structure before write