// customPredicates.js
export const customPredicates = {
    validate(predicate, value) {
        if (!this[predicate]) {
            throw new Error(`Unknown predicate: ${predicate}`);
        }
        return this[predicate].validate(value);
    },
    
    format(predicate, value) {
        return this[predicate].format(value);
    },
    
    category: {
        validate: value => typeof value === 'string' && value.length > 0,
        format: value => `schema:category "${value}"`
    },
    
    keywords: {
        validate: value => Array.isArray(value) && value.every(v => typeof v === 'string'),
        format: value => value.map(keyword => `schema:keywords "${keyword}"`).join(' ; ')
    },
    
    license: {
        validate: value => typeof value === 'string' && value.startsWith('http'),
        format: value => `schema:license <${value}>`
    }
}