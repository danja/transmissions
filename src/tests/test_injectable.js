
import { Injectable } from '../'../di/Injectable';

// Test for Injectable
console.log('Testing Injectable...';

try {
    const instance = new Injectable();
    console.log('Injectable Test Passed';
} catch (error) {
    console.error('Injectable Test Failed:', error.message);
}
