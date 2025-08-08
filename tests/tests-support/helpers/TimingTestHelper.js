class TimingTestHelper {
    constructor() {
        this.timers = new Map();
        this.intervals = new Map();
        this.originalSetTimeout = globalThis.setTimeout;
        this.originalClearTimeout = globalThis.clearTimeout;
        this.originalSetInterval = globalThis.setInterval;
        this.originalClearInterval = globalThis.clearInterval;
        this.mockTime = 0;
        this.isTimeMocked = false;
        this.scheduledCallbacks = [];
    }

    /**
     * Mock timers for controlled timing tests
     */
    mockTimers() {
        this.isTimeMocked = true;
        this.mockTime = 0;
        this.scheduledCallbacks = [];

        globalThis.setTimeout = (callback, delay) => {
            const id = Math.random().toString(36);
            this.scheduledCallbacks.push({
                id,
                callback,
                executeAt: this.mockTime + delay,
                type: 'timeout'
            });
            return id;
        };

        globalThis.clearTimeout = (id) => {
            const index = this.scheduledCallbacks.findIndex(cb => cb.id === id);
            if (index !== -1) {
                this.scheduledCallbacks.splice(index, 1);
            }
        };

        globalThis.setInterval = (callback, delay) => {
            const id = Math.random().toString(36);
            this.scheduledCallbacks.push({
                id,
                callback,
                executeAt: this.mockTime + delay,
                interval: delay,
                type: 'interval'
            });
            return id;
        };

        globalThis.clearInterval = (id) => {
            const index = this.scheduledCallbacks.findIndex(cb => cb.id === id);
            if (index !== -1) {
                this.scheduledCallbacks.splice(index, 1);
            }
        };
    }

    /**
     * Restore original timers
     */
    restoreTimers() {
        if (this.isTimeMocked) {
            globalThis.setTimeout = this.originalSetTimeout;
            globalThis.clearTimeout = this.originalClearTimeout;
            globalThis.setInterval = this.originalSetInterval;
            globalThis.clearInterval = this.originalClearInterval;
            this.isTimeMocked = false;
            this.scheduledCallbacks = [];
        }
    }

    /**
     * Advance mock time and execute due callbacks
     */
    advanceTime(ms) {
        if (!this.isTimeMocked) {
            throw new Error('Timers must be mocked before advancing time');
        }

        const targetTime = this.mockTime + ms;
        
        while (this.scheduledCallbacks.length > 0) {
            // Find callbacks that should execute
            const readyCallbacks = this.scheduledCallbacks.filter(cb => cb.executeAt <= targetTime);
            
            if (readyCallbacks.length === 0) {
                break;
            }

            // Sort by execution time
            readyCallbacks.sort((a, b) => a.executeAt - b.executeAt);
            
            for (const callback of readyCallbacks) {
                this.mockTime = callback.executeAt;
                
                try {
                    callback.callback();
                } catch (error) {
                    console.error('Error in mocked timer callback:', error);
                }

                // Remove timeout callbacks or reschedule interval callbacks
                const index = this.scheduledCallbacks.findIndex(cb => cb.id === callback.id);
                if (index !== -1) {
                    if (callback.type === 'timeout') {
                        this.scheduledCallbacks.splice(index, 1);
                    } else if (callback.type === 'interval') {
                        // Reschedule interval
                        this.scheduledCallbacks[index].executeAt = this.mockTime + callback.interval;
                    }
                }
            }
        }

        this.mockTime = targetTime;
    }

    /**
     * Run all pending timers
     */
    runAllTimers() {
        if (!this.isTimeMocked) {
            throw new Error('Timers must be mocked before running all timers');
        }

        while (this.scheduledCallbacks.some(cb => cb.type === 'timeout')) {
            const nextCallback = this.scheduledCallbacks
                .filter(cb => cb.type === 'timeout')
                .sort((a, b) => a.executeAt - b.executeAt)[0];
            
            if (nextCallback) {
                this.advanceTime(nextCallback.executeAt - this.mockTime);
            }
        }
    }

    /**
     * Wait for real time (for integration tests)
     */
    async wait(ms) {
        return new Promise(resolve => this.originalSetTimeout(resolve, ms));
    }

    /**
     * Wait for a condition to be true with timeout
     */
    async waitFor(condition, timeoutMs = 5000, intervalMs = 50) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeoutMs) {
            if (await condition()) {
                return true;
            }
            await this.wait(intervalMs);
        }
        
        return false;
    }

    /**
     * Measure execution time of a function
     */
    async measureTime(fn) {
        const start = Date.now();
        const result = await fn();
        const end = Date.now();
        return {
            result,
            duration: end - start
        };
    }

    /**
     * Create a debounce test scenario
     */
    createDebounceScenario(debounceMs = 1000) {
        const calls = [];
        let debounceTimer = null;
        
        const debouncedFunction = (data) => {
            calls.push({ data, timestamp: this.isTimeMocked ? this.mockTime : Date.now() });
            
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
            
            debounceTimer = setTimeout(() => {
                calls.push({ 
                    type: 'executed', 
                    timestamp: this.isTimeMocked ? this.mockTime : Date.now() 
                });
            }, debounceMs);
        };
        
        return {
            fn: debouncedFunction,
            getCalls: () => [...calls],
            getExecutionCount: () => calls.filter(call => call.type === 'executed').length,
            reset: () => {
                calls.length = 0;
                if (debounceTimer) {
                    clearTimeout(debounceTimer);
                    debounceTimer = null;
                }
            }
        };
    }

    /**
     * Simulate rapid file changes for debounce testing
     */
    simulateRapidChanges(callback, changes, intervalMs = 100) {
        return new Promise((resolve) => {
            let index = 0;
            
            const executeNext = () => {
                if (index < changes.length) {
                    callback(changes[index]);
                    index++;
                    setTimeout(executeNext, intervalMs);
                } else {
                    resolve();
                }
            };
            
            executeNext();
        });
    }

    /**
     * Create a timing assertion helper
     */
    createTimingAssertion(expectedDuration, tolerance = 50) {
        return {
            assert: (actualDuration) => {
                const diff = Math.abs(actualDuration - expectedDuration);
                return diff <= tolerance;
            },
            getMessage: (actualDuration) => {
                return `Expected duration ~${expectedDuration}ms (±${tolerance}ms), but got ${actualDuration}ms`;
            }
        };
    }

    /**
     * Get current mock time or real time
     */
    now() {
        return this.isTimeMocked ? this.mockTime : Date.now();
    }

    /**
     * Check if there are pending timers
     */
    hasPendingTimers() {
        return this.scheduledCallbacks.length > 0;
    }

    /**
     * Get count of pending timers by type
     */
    getPendingTimersCount() {
        const timeouts = this.scheduledCallbacks.filter(cb => cb.type === 'timeout').length;
        const intervals = this.scheduledCallbacks.filter(cb => cb.type === 'interval').length;
        return { timeouts, intervals, total: this.scheduledCallbacks.length };
    }

    /**
     * Cleanup all timers and restore state
     */
    cleanup() {
        this.restoreTimers();
        this.timers.clear();
        this.intervals.clear();
        this.scheduledCallbacks = [];
        this.mockTime = 0;
    }
}

export default TimingTestHelper;