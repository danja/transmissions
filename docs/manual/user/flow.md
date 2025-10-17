# Flow Control in Transmissions

Flow control processors enable dynamic routing, conditional logic, and nested execution within transmission pipelines. These processors allow transmissions to make decisions about their execution path based on message content or configuration.

## Overview

The Transmissions framework provides several flow control mechanisms:

- **GOTO**: Dynamic execution of other transmissions
- **Choice**: Conditional logic and branching
- **EntryTransmission**: Control over automatic execution

## GOTO Processor

The GOTO processor enables dynamic transmission execution, allowing one transmission to trigger another based on configuration or message properties.

### Key Features
- Dynamic target selection from config or message
- Nested transmission execution
- Message passing between transmissions
- Flexible targeting via URI resolution

### Use Cases
- Workflow orchestration
- Dynamic routing based on content
- Modular transmission composition
- Multi-stage processing pipelines

## Choice Processor

The Choice processor provides conditional logic within transmission pipelines, enabling branching behavior based on message properties.

### Key Features
- Multiple comparison operators (equals, contains, greater, less, exists)
- Property-based conditions
- Configurable true/false actions
- Message property modification

### Use Cases
- Content-based routing
- Feature flags and toggles
- Data validation and filtering
- User type discrimination

## EntryTransmission System

The EntryTransmission type controls which transmissions execute automatically when an app starts.

### Key Features
- Explicit entry point declaration
- Backward compatibility with existing apps
- Prevention of unintended execution
- Support for callable-only transmissions

### Use Cases
- Apps with multiple transmission definitions
- Library-style transmissions for reuse
- Complex workflow definitions
- Conditional app behavior

## Design Principles

### Modularity
Flow control processors are designed as discrete, composable units that can be combined to create complex behaviors.

### Message-Driven
All flow control decisions are based on message content, configuration, or both, ensuring predictable and testable behavior.

### Backward Compatibility
New flow control features maintain compatibility with existing transmission definitions and execution patterns.

### Extensibility
The flow control architecture supports adding new processors and control mechanisms without breaking existing functionality.

## Best Practices

### Clear Naming
Use descriptive transmission and processor names that indicate their role in the flow.

### Minimal Nesting
Avoid deep nesting of GOTOs to maintain readability and debuggability.

### Property Conventions
Establish consistent property naming patterns for flow control decisions.

### Error Handling
Design flow control with failure modes in mind, including fallback paths and error conditions.

### Testing
Create focused test cases for each flow control scenario, including edge cases and error conditions.