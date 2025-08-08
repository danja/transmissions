import { EventEmitter } from 'events';

class MockAppHelper {
    constructor() {
        this.executionHistory = [];
        this.appBehaviors = new Map();
        this.defaultBehavior = {
            exitCode: 0,
            stdout: 'TEST_PASSED',
            stderr: '',
            delay: 100
        };
    }

    /**
     * Reset all execution history and behaviors
     */
    reset() {
        this.executionHistory = [];
        this.appBehaviors.clear();
    }

    /**
     * Configure behavior for a specific app
     */
    setAppBehavior(appName, behavior) {
        this.appBehaviors.set(appName, {
            ...this.defaultBehavior,
            ...behavior
        });
    }

    /**
     * Set multiple app behaviors at once
     */
    setAppBehaviors(behaviors) {
        for (const [appName, behavior] of Object.entries(behaviors)) {
            this.setAppBehavior(appName, behavior);
        }
    }

    /**
     * Configure an app to fail
     */
    setAppToFail(appName, exitCode = 1, stderr = 'App execution failed') {
        this.setAppBehavior(appName, {
            exitCode,
            stderr,
            stdout: ''
        });
    }

    /**
     * Configure an app to succeed with specific output
     */
    setAppToSucceed(appName, stdout = 'TEST_PASSED', delay = 100) {
        this.setAppBehavior(appName, {
            exitCode: 0,
            stdout,
            stderr: '',
            delay
        });
    }

    /**
     * Create a mock child process for spawn
     */
    createMockChildProcess(appName, targetDir) {
        const behavior = this.appBehaviors.get(appName) || this.defaultBehavior;
        
        // Record the execution
        this.executionHistory.push({
            app: appName,
            targetDir,
            timestamp: new Date().toISOString(),
            behavior: { ...behavior }
        });

        const mockProcess = new EventEmitter();
        
        // Add stdout and stderr as EventEmitters
        mockProcess.stdout = new EventEmitter();
        mockProcess.stderr = new EventEmitter();

        // Simulate the process execution asynchronously
        setTimeout(() => {
            if (behavior.stdout) {
                mockProcess.stdout.emit('data', Buffer.from(behavior.stdout));
            }
            if (behavior.stderr) {
                mockProcess.stderr.emit('data', Buffer.from(behavior.stderr));
            }
            
            setTimeout(() => {
                mockProcess.emit('close', behavior.exitCode);
            }, 10);
        }, behavior.delay);

        return mockProcess;
    }

    /**
     * Get a vi.fn() mock for child_process.spawn
     */
    getSpawnMock() {
        return (command, args, options) => {
            const appName = args[0];
            const targetDir = args[1];
            return this.createMockChildProcess(appName, targetDir);
        };
    }

    /**
     * Get execution history
     */
    getExecutionHistory() {
        return [...this.executionHistory];
    }

    /**
     * Get executions for a specific app
     */
    getExecutionsForApp(appName) {
        return this.executionHistory.filter(exec => exec.app === appName);
    }

    /**
     * Get executions for a specific target directory
     */
    getExecutionsForTarget(targetDir) {
        return this.executionHistory.filter(exec => exec.targetDir === targetDir);
    }

    /**
     * Check if an app was executed
     */
    wasAppExecuted(appName) {
        return this.executionHistory.some(exec => exec.app === appName);
    }

    /**
     * Check if an app was executed with specific target
     */
    wasAppExecutedWithTarget(appName, targetDir) {
        return this.executionHistory.some(
            exec => exec.app === appName && exec.targetDir === targetDir
        );
    }

    /**
     * Get the number of times an app was executed
     */
    getExecutionCount(appName) {
        return this.executionHistory.filter(exec => exec.app === appName).length;
    }

    /**
     * Get total number of executions
     */
    getTotalExecutionCount() {
        return this.executionHistory.length;
    }

    /**
     * Wait for a specific number of executions
     */
    async waitForExecutions(count, timeoutMs = 5000) {
        const startTime = Date.now();
        
        while (this.getTotalExecutionCount() < count && Date.now() - startTime < timeoutMs) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        return this.getTotalExecutionCount() >= count;
    }

    /**
     * Wait for an app to be executed
     */
    async waitForAppExecution(appName, timeoutMs = 5000) {
        const startTime = Date.now();
        
        while (!this.wasAppExecuted(appName) && Date.now() - startTime < timeoutMs) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        return this.wasAppExecuted(appName);
    }

    /**
     * Create a sequence of app behaviors (for testing sequential execution)
     */
    createSequence(appNames, behaviors = []) {
        appNames.forEach((appName, index) => {
            const behavior = behaviors[index] || this.defaultBehavior;
            this.setAppBehavior(appName, {
                ...behavior,
                delay: (index + 1) * 100 // Stagger the execution times
            });
        });
    }

    /**
     * Verify execution order
     */
    verifyExecutionOrder(expectedOrder) {
        const actualOrder = this.executionHistory.map(exec => exec.app);
        return JSON.stringify(actualOrder) === JSON.stringify(expectedOrder);
    }

    /**
     * Get execution times for performance testing
     */
    getExecutionTimes() {
        return this.executionHistory.map(exec => ({
            app: exec.app,
            timestamp: new Date(exec.timestamp).getTime()
        }));
    }

    /**
     * Generate summary of executions for debugging
     */
    getExecutionSummary() {
        const summary = {
            totalExecutions: this.getTotalExecutionCount(),
            appsExecuted: [...new Set(this.executionHistory.map(exec => exec.app))],
            targetsUsed: [...new Set(this.executionHistory.map(exec => exec.targetDir))],
            executionOrder: this.executionHistory.map(exec => `${exec.app} -> ${exec.targetDir}`),
            timeRange: this.executionHistory.length > 0 ? {
                first: this.executionHistory[0].timestamp,
                last: this.executionHistory[this.executionHistory.length - 1].timestamp
            } : null
        };
        
        return summary;
    }
}

export default MockAppHelper;