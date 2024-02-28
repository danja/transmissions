
import fs from 'fs';
import path from 'path';

const testFiles = fs.readdirSync(__dirname).filter(file => file.startsWith('test_'));

testFiles.forEach(testFile => {
    console.log(`Running ${testFile}`);
    require(path.join(__dirname, testFile));
});
