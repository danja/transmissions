import { parentPort } from 'worker_threads';

// Listen for messages from the main thread
parentPort.on('message', (data) => {
  try {
    // Simulate some CPU-intensive work
    const result = processData(data);
    
    // Send the result back to the main thread
    parentPort.postMessage({
      success: true,
      result: result,
      originalData: data
    });
  } catch (error) {
    // Send any errors back to the main thread
    parentPort.postMessage({
      success: false,
      error: error.message
    });
  }
});

// Example processing function
function processData(data) {
  // Simulate CPU-intensive operation
  let result = 0;
  const iterations = data.iterations || 1000000;
  
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i);
  }
  
  return {
    processedValue: result,
    processingTime: new Date().toISOString()
  };
}
