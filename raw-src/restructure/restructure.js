// restructure.js
import fs from 'fs/promises';
import path from 'path';

const getValueByPath = (obj, path) => {
    try {
        return path.split('.').reduce((acc, part) => acc[part], obj);
    } catch (e) {
        console.warn(`Warning: Path ${path} not found`);
        return undefined;
    }
};

const setValueByPath = (obj, path, value) => {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((acc, part) => {
        acc[part] = acc[part] || {};
        return acc[part];
    }, obj);
    target[last] = value;
};

export async function restructureJson(inputDir = './input', outputDir = './output') {
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

            if (!mappingData.mappings || !Array.isArray(mappingData.mappings)) {
                throw new Error(`Invalid mapping structure in ${mappingFile}`);
            }

            const result = {};
            mappingData.mappings.forEach(({ pre, post }) => {
                const value = getValueByPath(inputData, pre);
                if (value !== undefined) {
                    setValueByPath(result, post, value);
                }
            });

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