# Flow Processors

Control flow processors for managing pipeline execution and message routing in Transmissions.

## Core Processors

**Accumulate.js** - Collects values from messages into a whiteboard accumulator, supporting string concatenation or array building across multiple messages.

**Choice.js** - Conditional branching processor (template implementation for decision logic).

**DeadEnd.js** - Terminates the current pipeline branch quietly without error or further processing.

**Fork.js** - Splits a single message into multiple parallel processing paths, creating cloned messages with fork numbering.

**ForEach.js** - Iterates over arrays or object collections in messages, emitting individual items for downstream processing.

**Halt.js** - Emergency stop processor that terminates the entire transmission system and exits the process.

**NOP.js** - No-operation processor that passes messages through unchanged, useful for debugging and pipeline visualization.

**Ping.js** - Generates periodic ping messages using worker threads, supports configurable intervals and payloads.

**Unfork.js** - Merges multiple parallel pipeline branches back into a single flow, passing only completion signals.

## Factory

**FlowProcessorsFactory.js** - Creates instances of flow processors based on RDF type specifications.

## Usage Pattern

Flow processors typically appear at pipeline junctions to control execution patterns:
- Use Fork/Unfork for parallel processing
- Use ForEach for batch operations  
- Use Accumulate to collect distributed results
- Use DeadEnd/Halt for controlled termination
- Use NOP for debugging insertion points