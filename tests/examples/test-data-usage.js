import TestDataGenerator from '../helpers/TestDataGenerator.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateTestData() {
    // Create generator instance
    const generator = new TestDataGenerator(
        path.join(__dirname, '../../src/apps/test_markmap/data')
    );

    try {
        // Initialize directories
        await generator.init();

        // Generate basic test files
        const files = await generator.generateMarkdownFiles(3);
        console.log('Generated basic test files:', files);

        // Generate nested structure
        await generator.generateNestedStructure();
        console.log('Generated nested structure');

        // Generate edge cases
        await generator.generateEdgeCases();
        console.log('Generated edge cases');

        // Generate required outputs
        await generator.generateRequiredOutputs(
            path.join(generator.baseDir, 'input')
        );
        console.log('Generated required outputs');

    } catch (error) {
        console.error('Error generating test data:', error);
    }
}

// Run generator
generateTestData().catch(console.error);
