
import Source from '../services/Source.js';

// Test for Source.js
async function testSource() {
    const source = new Source();
    const content = await source.read('/mnt/data/pipeline_project/test.txt');

    if (content) {
        console.log('Source Test Passed: Content read successfully.');
    } else {
        console.log('Source Test Failed: No content read.');
    }
}

testSource();
