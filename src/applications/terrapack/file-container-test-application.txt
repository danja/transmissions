import fs from 'fs/promises';
import path from 'path';
import FileContainer from '../../processors/terrapack/FileContainer.js';

const config = {
    whiteboard: [],
    destination: "container-output.json"
};

async function testFileContainer() {
    const container = new FileContainer(config);

    // Test with multiple files
    const message1 = {
        filepath: "/test/file1.js",
        content: "console.log('test1')",
        rootDir: "/test"
    };

    const message2 = {
        filepath: "/test/dir/file2.js",
        content: "console.log('test2')",
        rootDir: "/test"
    };

    await container.process(message1);
    await container.process(message2);

    // Send done message to get output
    const finalMessage = { done: true };
    await container.process(finalMessage);

    console.log('Container test complete');
}

testFileContainer().catch(console.error);