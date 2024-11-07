// fileHandler.js
import fs from 'fs/promises';
import path from 'path';
import { JsonRestructurer } from './JsonRestructurer.js';

export async function processFiles(inputDir = './input', outputDir = './output') {
    try {
        await fs.mkdir(outputDir, { recursive: true });
        const files = await fs.readdir(inputDir);
        
        const inputFiles = files.filter(f => f.startsWith('input_'));
        const mappingFiles = files.filter(f => f.startsWith('mapping_'));

        for (const inputFile of inputFiles) {
            const index = inputFile.match(/\d+/)[0];
            const mappingFile = mappingFiles.find(f => f.includes(index));
            
            if (!mappingFile) {
                console.warn(`No mapping file found for ${inputFile}`);
                continue;
            }

            const inputData = JSON.parse(
                await fs.readFile(path.join(inputDir, inputFile), 'utf8')
            );
            const mappingData = JSON.parse(
                await fs.readFile(path.join(inputDir, mappingFile), 'utf8')
            );

            const restructurer = new JsonRestructurer(mappingData);
            const result = restructurer.restructure(inputData);

            await fs.writeFile(
                path.join(outputDir, `output_${index}.json`),
                JSON.stringify(result, null, 2)
            );
        }
    } catch (error) {
        console.error('Error processing files:', error);
        throw error;
    }
}