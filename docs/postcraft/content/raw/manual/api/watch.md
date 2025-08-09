# File Watching API

The Transmissions file watching system provides automatic processing of content changes through continuous monitoring of specified directories.

## Overview


The watch system monitors multiple directory sets and executes sequences of Transmissions apps when files change. This enables automated content processing workflows, particularly useful for blog generation and content management systems.

## Configuration

### Watch Configuration File

The watch system uses a JSON configuration file (`src/api/watch/watch-config.json`) that defines watch sets:

```json
[
    {
        "name": "postcraft-render",
        "dirs": [
            "~/sites/danny.ayers.name/postcraft",
            "~/hyperdata/hyperdata/docs/postcraft",
            "~/hyperdata/transmissions/docs/postcraft",
            "~/hyperdata/semem/docs/postcraft"
        ],
        "apps": [
            "md-to-sparqlstore",
            "sparqlstore-to-html",
            "sparqlstore-to-site-indexes ~/sites/danny.ayers.name/postcraft"
        ]
    }
]
```

### Configuration Structure

Each watch set contains:

- **`name`** - Unique identifier for the watch set
- **`dirs`** - Array of directories to monitor (supports `~/` expansion)
- **`apps`** - Array of Transmissions apps to execute in sequence
- **`watchEvents`** - Array of file system events to watch for (optional, defaults to `["change", "rename"]`)

### App Configuration Options

App entries in the `apps` array support two formats:

#### Simple Format
```json
"apps": ["md-to-sparqlstore"]
```
Uses default behavior: passes change information via `-m` flag plus the watch directory as target.

#### With Arguments Format
```json  
"apps": ["sparqlstore-to-site-indexes ~/sites/danny.ayers.name/postcraft"]
```
When arguments follow the app name, they **override** the default behavior:
- No change information (`-m` flag) is passed
- No watch directory is passed as target
- Only the specified arguments are used
- Tilde paths (`~/`) are automatically expanded to absolute paths

This allows precise control over how each app is invoked.

### Event Filtering Options

The `watchEvents` array allows you to control which file system events trigger app execution:

#### Supported Events

- **`change`** - File content modification (save operations)
- **`rename`** - File creation, deletion, or rename operations

#### Examples

```json
{
    "name": "content-only",
    "dirs": ["~/content"],
    "apps": ["process-content"],
    "watchEvents": ["change"]
}
```
Only triggers on file saves/modifications, ignoring file creation or deletion.

```json
{
    "name": "creation-only", 
    "dirs": ["~/uploads"],
    "apps": ["process-new-files"],
    "watchEvents": ["rename"]
}
```
Only triggers on file creation, deletion, or rename operations.

```json
{
    "name": "all-events",
    "dirs": ["~/docs"],
    "apps": ["sync-docs"]
}
```
Triggers on both change and rename events (default behavior when `watchEvents` is omitted).

## Command Line Interface

### Basic Usage

```bash
# Start watching with default configuration
./trans watch

# Use custom configuration file
./trans watch /path/to/custom-config.json

# Show help
./trans watch --help
```

### Options

- `--debounce=<ms>` - Debounce delay in milliseconds (default: 1000)
- `--trans-path=<path>` - Path to trans executable (auto-detected by default)

## How It Works

### File Monitoring

1. **Recursive Watching** - Monitors all files and subdirectories within specified paths
2. **Change Detection** - Detects file modifications, creations, and deletions
3. **Debouncing** - Groups rapid changes to prevent excessive processing
4. **Filtering** - Excludes common non-content files (`.git/`, `node_modules/`, etc.)

### App Execution

When a file change is detected:

1. **Debounce Timer** - Waits for the configured delay to group related changes
2. **Change Info Collection** - Gathers details about the changed file (path, timestamp, event type)
3. **Sequential Execution** - Runs each app in the specified order for all directories
4. **File Context Passing** - Sends change information to apps via `-m` flag as JSON
5. **Process Monitoring** - Captures stdout/stderr and reports success/failure
6. **Error Handling** - Logs failures but continues processing other apps

### Example Execution Flow

For a change to `content/raw/manual/api/watch.md`, the system executes:

```bash
# Apps without arguments receive change info and watch directory
./trans md-to-sparqlstore -m '{"eventType":"change","path":"content/raw/manual/api/watch.md","fullPath":"/home/danny/sites/danny.ayers.name/postcraft/content/raw/manual/api/watch.md","watchDir":"/home/danny/sites/danny.ayers.name/postcraft","timestamp":"2025-08-09T12:00:00.000Z"}' ~/sites/danny.ayers.name/postcraft
./trans sparqlstore-to-html -m '{"eventType":"change","path":"content/raw/manual/api/watch.md","fullPath":"/home/danny/sites/danny.ayers.name/postcraft/content/raw/manual/api/watch.md","watchDir":"/home/danny/sites/danny.ayers.name/postcraft","timestamp":"2025-08-09T12:00:00.000Z"}' ~/sites/danny.ayers.name/postcraft  

# Apps with arguments use only those arguments (no change info, no default target)  
./trans sparqlstore-to-site-indexes ~/sites/danny.ayers.name/postcraft
# ... continues for all directories in the watch set
```

### Change Information Format

The JSON message passed via `-m` flag contains:

- **`eventType`** - Type of file system event (`change`, `rename`, etc.)
- **`path`** - Relative path from the watch directory to the changed file
- **`fullPath`** - Complete absolute path to the changed file
- **`watchDir`** - The watch directory that detected the change
- **`timestamp`** - ISO timestamp of when the change was detected

## Programming Interface

### Watch Class

```javascript
import Watch from './src/api/watch/Watch.js'

const watcher = new Watch(configPath, options)
await watcher.start()
```

#### Constructor Options

- `configPath` - Path to watch configuration file (optional)
- `options.debounceMs` - Debounce delay in milliseconds
- `options.transPath` - Path to trans executable
- `options.excludePatterns` - Additional file patterns to exclude

#### Methods

- `start()` - Initialize watching and begin monitoring
- `stop()` - Clean shutdown of all watchers

### WatchConfig Class

```javascript
import WatchConfig from './src/api/watch/WatchConfig.js'

const config = new WatchConfig(configPath)
await config.load()
const watchSets = config.getWatchSets()
```

## Use Cases

### Content Management

- **Blog Publishing** - Automatically process markdown files into HTML
- **Documentation** - Update generated docs when source files change
- **Asset Processing** - Compile and optimize media files

### Development Workflows

- **Live Reload** - Automatically rebuild during development
- **Testing** - Run tests when source code changes
- **Deployment** - Trigger builds and deployments

## Best Practices

### Configuration

- **Specific Directories** - Watch only necessary directories to minimize overhead
- **Appropriate Debouncing** - Balance responsiveness with system load
- **Error Recovery** - Design apps to handle partial failures gracefully

### Performance

- **Exclude Patterns** - Add patterns for large binary files or build directories
- **Resource Monitoring** - Monitor system resources during heavy file activity
- **Logging Levels** - Use appropriate verbosity for production vs. development

## Logging

The watch system provides comprehensive logging to help monitor activity and troubleshoot issues.

### Log Files

All watch system activity is logged to:
```
logs/watch.log
```

### Log Format

Each log entry includes:
- **Timestamp** - ISO 8601 format
- **Component** - [WATCH] identifier
- **Level** - INFO, DEBUG, WARN, ERROR
- **Message** - Detailed event information

Example log entries:
```
[2025-08-08T10:52:15.123Z] [WATCH] [INFO] Starting Transmissions file watcher...
[2025-08-08T10:52:15.124Z] [WATCH] [INFO] Setting up watch set: postcraft-render
[2025-08-08T10:52:15.130Z] [WATCH] [INFO] File changed in watch set "postcraft-render": content/raw/manual/api/watch.md
[2025-08-08T10:52:15.131Z] [WATCH] [INFO] Executing: ./trans md-to-sparqlstore /home/danny/sites/danny.ayers.name/postcraft
[2025-08-08T10:52:16.205Z] [WATCH] [INFO] ✓ md-to-sparqlstore completed successfully for /home/danny/sites/danny.ayers.name/postcraft
```

### Monitoring Logs

Watch log activity in real-time:
```bash
# Follow the watch log
tail -f logs/watch.log

# Filter by log level
grep "ERROR" logs/watch.log
grep "WARN" logs/watch.log

# Monitor specific events
grep "File changed" logs/watch.log
grep "Executing:" logs/watch.log
grep "completed successfully" logs/watch.log
```

### Log Levels

- **INFO** - Normal operations (startup, file changes, app executions)
- **DEBUG** - Detailed information (directory watching, app output)
- **WARN** - Non-critical issues (missing directories, failed watchers)
- **ERROR** - Critical failures (app execution errors, configuration issues)

## Troubleshooting

### Common Issues

**Watch not starting:**
- Check directory permissions
- Verify configuration file syntax
- Ensure trans executable is found
- **Review logs:** `tail logs/watch.log`

**Apps not executing:**
- Verify app names exist in `src/apps/`
- Check trans executable permissions
- **Review logs:** `grep "ERROR" logs/watch.log`

**High system load:**
- Increase debounce delay
- Add exclude patterns for irrelevant files
- Monitor watched directory sizes
- **Review logs:** `grep "File changed" logs/watch.log`

### Debugging

Monitor watch system activity:
```bash
# Real-time log monitoring
tail -f logs/watch.log

# Enable verbose console output
./trans watch --verbose

# Check recent errors
tail -50 logs/watch.log | grep "ERROR"
```

Check configuration loading:
```javascript
const config = new WatchConfig()
await config.load()
console.log(config.getWatchSets())
```

## Testing

The watch system includes comprehensive automated tests to ensure reliability and proper functionality.

### Running Tests

Execute the complete watch system test suite:

```bash
# Run all watch system tests (unit + integration)
npm test -- tests/api/watch/ tests/integration/watch/

# Run only unit tests (faster, focused on individual components)
npm test -- tests/api/watch/

# Run only integration tests (comprehensive real-world scenarios)
npm test -- tests/integration/watch/
```

The test suite includes:

- **Unit tests** (45 tests) - Test individual components like WatchConfig and Watch classes
- **Integration tests** (14 tests) - Test complete workflows including file watching, app execution, and error handling
- **Mock helpers** - Simulate file changes, app execution, and timing scenarios

All tests run in isolation with temporary directories and mocked system calls to ensure no impact on your development environment.

## Related Documentation

- [Transmissions CLI Reference](../cli.md)
- [App Development Guide](../apps.md)
- [Configuration Management](../config.md)