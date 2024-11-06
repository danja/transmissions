// verify.js
import fs from 'fs/promises';
import path from 'path';

const findDifferences = (obj1, obj2, path = '') => {
    const differences = [];
    
    // Handle different types or null/undefined
    if (typeof obj1 !== typeof obj2) {
        return [`${path}: Type mismatch - ${typeof obj1} vs ${typeof obj2}`];
    }
    if (obj1 === null || obj2 === null) {
        if (obj1 !== obj2) {
            return [`${path}: Null mismatch`];
        }
        return [];
    }
    
    // Handle arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
            return [`${path}: Array length mismatch - ${obj1.length} vs ${obj2.length}`];
        }
        obj1.forEach((item, idx) => {
            differences.push(...findDifferences(item, obj2[idx], `${path}[${idx}]`));
        });
        return differences;
    }
    
    // Handle objects
    if (typeof obj1 === 'object') {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        
        // Check for missing keys
        keys1.forEach(key => {
            if (!keys2.includes(key)) {
                differences.push(`${path ? path + '.' : ''}${key}: Missing in required`);
            }
        });
        
        keys2.forEach(key => {
            if (!keys1.includes(key)) {
                differences.push(`${path ? path + '.' : ''}${key}: Missing in output`);
            }
        });
        
        // Check values for common keys
        keys1.filter(key => keys2.includes(key)).forEach(key => {
            differences.push(...findDifferences(
                obj1[key], 
                obj2[key], 
                path ? `${path}.${key}` : key
            ));
        });
        
        return differences;
    }
    
    // Handle primitives
    if (obj1 !== obj2) {
        return [`${path}: Value mismatch - ${obj1} vs ${obj2}`];
    }
    
    return [];
};

export async function verifyOutputs(dir = './output') {
    const results = {};
    try {
        const files = await fs.readdir(dir);
        const outputFiles = files.filter(f => f.startsWith('output_'));
        
        for (const outputFile of outputFiles) {
            const index = outputFile.match(/\d+/)[0];
            const requiredFile = `required_${index}.json`;
            
            if (!files.includes(requiredFile)) {
                console.warn(`No required file found for ${outputFile}`);
                continue;
            }
            
            const output = JSON.parse(
                await fs.readFile(path.join(dir, outputFile), 'utf8')
            );
            const required = JSON.parse(
                await fs.readFile(path.join(dir, requiredFile), 'utf8')
            );
            
            const differences = findDifferences(output, required);
            results[index] = {
                matches: differences.length === 0,
                differences
            };
        }
        
        return results;
    } catch (error) {
        console.error('Error verifying outputs:', error);
        throw error;
    }
}

// Example usage:
const results = await verifyOutputs();
console.log(JSON.stringify(results, null, 2));