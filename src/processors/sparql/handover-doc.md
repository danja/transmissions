# RDF Turtle Template System

## System Overview

A templating system for generating RDF Turtle syntax from JavaScript objects, with support for multilingual content, custom predicates, and configurable validation rules.

### System Architecture
The system follows a modular architecture with clear separation of concerns:

![System Architecture](system-architecture)

### Processing Flow
Message processing follows a strict validation and transformation pipeline:

![Message Processing Flow](message-processing-flow)

### Component Interactions
Components interact through well-defined interfaces:

![Component Interaction Sequence](component-interaction)

### Language Processing
Multilingual content follows a deterministic processing flow:

![Language Processing Flow](language-processing)

### Core Components

1. **Template Engine**: Nunjucks-based template for RDF generation
2. **TextUtils**: String manipulation and escaping utilities
3. **Validator**: Input validation and sanitization
4. **Configuration**: System-wide settings management
5. **Language Handling**: BCP47 language tag support

## Architecture

### Module Structure

```
src/
├── templates/
│   └── turtle.njk         # Main Nunjucks template
├── lib/
│   ├── TextUtils.js       # Text processing utilities
│   ├── Validator.js       # Validation logic
│   ├── Config.js          # Configuration management
│   └── CustomPredicates.js # Custom RDF predicate handling
└── config/
    └── languageConfig.js  # Language-specific settings
```

## Implementation Details

### Data Model

Input messages follow this structure:

```javascript
interface Message {
    slug: string;
    title: string | LocalizedString;
    content: string | LocalizedString;
    summary?: string | LocalizedString;
    datePublished?: string;  // ISO 8601
    dateModified?: string;   // ISO 8601
    author?: Author;
    translations?: Translations;
    customProperties?: CustomProperties;
}

interface LocalizedString {
    value: string;
    lang: string;  // BCP47 language tag
}

interface Author {
    name: string;
    homepage?: string;
    nick?: string;
}

interface Translations {
    [field: string]: {
        [lang: string]: string;
    };
}
```

### Usage Examples

#### Basic Usage

```javascript
import { MessageValidator } from './lib/Validator';
import { config } from './lib/Config';
import nunjucks from 'nunjucks';

const message = {
    slug: 'example-post',
    title: {
        value: 'Example Post',
        lang: 'en'
    },
    content: 'Post content',
    author: {
        name: 'John Doe',
        homepage: 'https://example.com/john'
    }
};

// Validate input
const validation = MessageValidator.validate(message);
if (!validation.isValid) {
    throw new Error(`Invalid message: ${validation.errors.join(', ')}`);
}

// Generate Turtle
const turtle = nunjucks.render('turtle.njk', { message });
```

#### Multilingual Content

```javascript
const multilingualMessage = {
    slug: 'multilingual-post',
    title: {
        value: 'Hello World',
        lang: 'en'
    },
    translations: {
        title: {
            'es': 'Hola Mundo',
            'fr': 'Bonjour le Monde'
        },
        content: {
            'es': 'Contenido del post',
            'fr': 'Contenu du post'
        }
    }
};
```

#### Custom Predicates

```javascript
// Adding custom predicates
import { customPredicates } from './lib/CustomPredicates';

customPredicates.category = {
    validate: value => typeof value === 'string' && value.length > 0,
    format: value => `schema:category "${value}"`
};

const messageWithCustom = {
    // ... basic fields ...
    customProperties: {
        category: 'Technology'
    }
};
```

## Validation Rules

### Required Fields
- slug
- title
- content

### Field-Specific Validation

```javascript
const validationRules = {
    slug: {
        pattern: /^[a-z0-9-]+$/,
        maxLength: 100
    },
    datePublished: {
        format: 'ISO8601',
        required: false
    },
    author: {
        type: 'object',
        properties: {
            name: { required: true },
            homepage: { type: 'url', required: false }
        }
    }
};
```

## Language Handling

### Configuration

```javascript
// languageConfig.js
export const languageConfig = {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es', 'fr', 'de'],
    languageFields: {
        title: ['en', 'es', 'fr', 'de'],
        content: ['en', 'es', 'fr']
    }
};
```

### BCP47 Validation

All language tags are validated against BCP47 specifications using the following regex:
```javascript
const LANGUAGE_TAG_REGEX = /^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$/;
```

## Output Format

The system generates Turtle RDF following W3C specifications. Example output:

```turtle
@prefix schema: <http://schema.org/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

<http://example.com/example-post> a schema:Article ;
    schema:headline "Example Post"@en ;
    schema:articleBody "Post content"@en ;
    schema:author [
        a schema:Person ;
        schema:name "John Doe" ;
        foaf:homepage <https://example.com/john>
    ] .
```

## Error Handling

Errors are handled through a structured validation system:

```javascript
interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}

// Example error handling
try {
    const validation = MessageValidator.validate(message);
    if (!validation.isValid) {
        logger.error('Validation failed:', validation.errors);
        throw new ValidationError(validation.errors);
    }
} catch (error) {
    if (error instanceof ValidationError) {
        // Handle validation errors
    } else {
        // Handle other errors
    }
}
```

## Testing

Tests are written using Jasmine. Run with:
```bash
npm test
```

Key test areas:
- Input validation
- RDF generation
- Language tag handling
- Custom predicate processing
- Error handling

## Configuration Options

System-wide settings are managed through the Config module:

```javascript
config.setBaseUrl('https://example.com');
config.setDefaultLanguage('en');
config.addRequiredField('category');
```

## Performance Considerations

- Template compilation is cached
- Language tag validation uses regex for speed
- String escaping is optimized for common cases
- Validation runs only once per message

## Known Limitations

1. No support for RDF lists
2. Limited datatype handling
3. No blank node reference support
4. Single-document processing only

## Future Enhancements

1. Graph merging support
2. Extended datatype handling
3. Streaming processing for large datasets
4. SHACL validation integration

## Maintenance Notes

1. Update language tags when adding new languages
2. Monitor template performance with large datasets
3. Regular validation of IRIs against service health
4. Review custom predicate implementations

## Dependencies

- nunjucks: ^3.2.0
- loglevel: ^1.8.0
- validator: ^13.7.0