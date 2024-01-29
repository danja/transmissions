
// Function to run all tests
const runTests = async () => {
    const testFiles = [
        'test_injectable.js',
        'test_simplepipe.js',
        'test_servicecontainer.js',
        'test_dependencyinjector.js',
        'test_connector.js',
        'test_source.js',
        'test_sink.js',
        'test_process.js',
        'test_stringsource.js',
        'test_stringsink.js',
        'test_appendprocess.js'
    ];

    for (let file of testFiles) {
        console.log(`Running ${file}...`);
        await import('./' + file);
    }
}

runTests().then(() => console.log('All tests completed.'));
