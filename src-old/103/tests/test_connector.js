
import { Connector } from '../'../services/Connector';

// Test for Connector
console.log('Testing Connector...';

try {
    const instance = new Connector();
    console.log('Connector Test Passed';
} catch (error) {
    console.error('Connector Test Failed:', error.message);
}
