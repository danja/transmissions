import path from 'path';
import { fileURLToPath } from 'url';
import WorkerPool from '../../src/engine/WorkerPool.js';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the worker script
const workerPath = path.join(__dirname, 'exampleWorker.js');

async function runExample() {
  console.log('Starting WorkerPool example');
  
  // Create a worker pool with 4 workers
  const pool = new WorkerPool(workerPath, 4);
  
  console.log('Worker pool created with 4 workers');
  
  try {
    // Create an array of 10 jobs with different iteration counts
    const jobs = Array.from({ length: 10 }, (_, i) => ({
      jobId: i + 1,
      iterations: 1000000 + (i * 500000)
    }));
    
    console.log(`Submitting ${jobs.length} jobs to the worker pool`);
    
    // Submit all jobs to the pool and wait for them to complete
    const startTime = Date.now();
    
    const results = await Promise.all(
      jobs.map(job => {
        console.log(`Enqueueing job ${job.jobId}`);
        return pool.enqueue(job);
      })
    );
    
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    
    console.log(`\nAll jobs completed in ${totalTime.toFixed(2)} seconds`);
    console.log('\nResults summary:');
    
    // Log a summary of the results
    results.forEach((result, index) => {
      console.log(`Job ${jobs[index].jobId}: ${result.success ? 'Success' : 'Failed'}`);
    });
    
    // Log pool metrics
    console.log('\nFinal pool metrics:', pool.getMetrics());
    
    // Shutdown the pool
    console.log('\nShutting down worker pool...');
    await pool.shutdown();
    console.log('Worker pool shutdown complete');
    
  } catch (error) {
    console.error('Error in worker pool example:', error);
  }
}

// Run the example
runExample().catch(console.error);
