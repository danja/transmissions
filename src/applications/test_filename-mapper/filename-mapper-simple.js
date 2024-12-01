import FilenameMapper from '../../processors/fs/FilenameMapper.js';
import FileReader from '../../processors/fs/FileReader.js';
import FileWriter from '../../processors/fs/FileWriter.js';

const config = {
    "simples": true,
    "sourceFile": "input/input-01.txt",
    "destinationFile": "output/output-01.txt",
    "extensions": {
        "html": ".mm.html",
        "svg": ".mm.svg"
    }
};

async function runPipeline() {
    var message = {
        "dataDir": "src/applications/test_filename-mapper/data",
        "format": "html"
    };

    // Read input file
    const reader = new FileReader(config);
    message = await reader.process(message);

    // Map filename
    const mapper = new FilenameMapper(config);
    message = await mapper.process(message);

    // Write output file
    const writer = new FileWriter(config);
    message = await writer.process(message);

    return message;
}

runPipeline().catch(console.error);
