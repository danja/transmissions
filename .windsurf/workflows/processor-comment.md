---
description: Creates a custom comments block for Transmissions Processors
---

Do not modify program code. Generate comments for the processor identified. These should follow jsdoc conventions and be concise, appearing only when the functionality isn't obvious from the code. Beware of syntax errors with escaped slashes. Favour purpose description over implementation details.
At the top of the file give the file name and relative path, then following the imports, immediately before the class definition, include a signature following the form of this example:

// src/services/fs/FileCopy.js
/**
 * @class FileCopy
 * @extends Service
 * @classdesc
 * **a Transmissions Service**
 *
 * Copies files or entire directories on the local filesystem.
 *
 ### Service Signature
 *
 * #### __*Settings*__
 * * **`ns.trm.source`** - The source path relative to `applicationRootDir`
 * * **`ns.trm.destination`** - The destination path relative to `applicationRootDir`
 *
 * #### __*Input*__
 * * **`message.applicationRootDir`** (optional) - The root directory of the application
 * * **`message.source`** (if no `configKey`) - The source path of the file or directory to copy
 * * **`message.destination`** (if no `configKey`) - The destination path for the copied file or directory
 *
 * #### __*Output*__
 * * **`message`** - unmodified
 *
 * #### __*Behavior*__
 * * Copies the specified file or directory to the destination
 * * Checks and creates target directories if they don't exist
 * * Copies individual files directly
 * * Recursively copies directories and their contents
 * * Logs detailed information about the copying process for debugging
 *
 * #### __*Side Effects*__
 * * File creation
 *
 * #### __*Tests*__
 * * **`./run file-copy-remove-test`**
 * * **`npm test -- tests/integration/file-copy-remove-test.spec.js`**
 *
 * * #### __*ToDo*__
 * test in other environments
 */

After inserting the comments, confirm that the program code has not been modified and double-check for any syntax errors.