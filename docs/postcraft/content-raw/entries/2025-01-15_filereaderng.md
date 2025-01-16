# FileReaderNG

#:todo move to prompts

Attached is `src/processors/fs/FileReader.js`. I'd like you to extend this to capture file metadata and added as a field in the message object. The target field will be obtained with `message[this.getProperty(ns.trn.metaField)]`. So with a target field of `meta` you might have something like eg.

message
```json
{
  "meta" : {
    "filename" : "example.txt"
    ...
  }
  ...
}
```
Please create an artifact with the complete source code.


`src/processors/example-group/ExampleProcessor.js`

I need a smarter FileReader to pull out file metadata





1. state the problem
2. write the requirements
3. provide the contextual knowledge
4. provide any conventions

highlight unknowns




read text file

```javascript
// src/processors/fs/FileRemove.js
/**
 * FileRemove Processor
 *
 * Removes files or directory contents on the local filesystem.
 * @extends Processor
 *
 * #### __*Input*__
 * * message.applicationRootDir (optional) - The root directory of the application
 * * message.target (if no settings) - The path of the file or directory to remove
 *
 * #### __*Configuration*__
 * If a settings is provided in the transmission:
 * * ns.trn.target - The target path relative to applicationRootDir
 *
 * #### __*Output*__
 * * Removes the specified file or directory contents
 * * message (unmodified) - The input message is passed through
 *
 * #### __*Behavior*__
 * * Removes individual files directly
 * * Recursively removes directory contents
 * * Logs debug information about the removal process
 *
 * #### __Tests__
 * `./run file-copy-remove-test`
 * `npm test -- tests/integration/file-copy-remove-test.spec.js`
 *
 */
 ```
