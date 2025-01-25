// validator.js
import { config } from './config.js';
import { TextUtils } from './TextUtils.js';
import { customPredicates } from './customPredicates.js';

export class MessageValidator {
    static validate(message) {
        const errors = [];
        
        // Check required fields
        for (const field of config.requiredFields) {
            if (!message[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        }
        
        // Validate dates
        if (message.datePublished && !TextUtils.isValidDateTime(message.datePublished)) {
            errors.push('Invalid datePublished format');
        }
        
        if (message.dateModified && !TextUtils.isValidDateTime(message.dateModified)) {
            errors.push('Invalid dateModified format');
        }
        
        // Validate URLs
        if (message.author?.homepage && !TextUtils.isValidURL(message.author.homepage)) {
            errors.push('Invalid author homepage URL');
        }
        
        // Validate custom properties
        if (message.customProperties) {
            for (const [prop, value] of Object.entries(message.customProperties)) {
                try {
                    if (!customPredicates.validate(prop, value)) {
                        errors.push(`Invalid value for custom predicate: ${prop}`);
                    }
                } catch (e) {
                    errors.push(e.message);
                }
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}