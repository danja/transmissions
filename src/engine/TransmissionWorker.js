import { parentPort } from 'worker_threads'

// Listen for messages from the main thread
parentPort.on('message', async (data) => {
  try {
    // Extract the actual message from the processor context
    const { message, processorContext, messageId } = data
    
    // Simulate the processor's work
    // For now, just pass through the message (like the default ProcessorImpl.process)
    const processedMessage = { ...message }
    
    // Add worker processing metadata
    if (!processedMessage.workerProcessingHistory) {
      processedMessage.workerProcessingHistory = []
    }
    processedMessage.workerProcessingHistory.push({
      processorClass: processorContext.className,
      processedAt: new Date().toISOString(),
      workerId: process.pid
    })
    
    const result = {
      success: true,
      processedMessage: processedMessage,
      processorContext: processorContext,
      messageId: messageId
    }
    
    // Send the result back to the main thread
    parentPort.postMessage(result)
  } catch (error) {
    // Send any errors back to the main thread
    parentPort.postMessage({
      success: false,
      error: error.message,
      messageId: data.messageId || 'unknown'
    })
  }
})