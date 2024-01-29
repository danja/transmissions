
import { ServiceContainer } from '../'../di/ServiceContainer';

// Test for ServiceContainer
console.log('Testing ServiceContainer...';

try {
    const instance = new ServiceContainer();
    console.log('ServiceContainer Test Passed';
} catch (error) {
    console.error('ServiceContainer Test Failed:', error.message);
}
