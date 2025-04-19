
# Transmissions : how to create a new processor

## Overview

1. Plan Requirements

### Notes

* anticipate several iterations, first pass may be a rough hack
* balance support for edge cases against immediate need

## Plan Requirements

* review definition of a Processor
* express required functionality in any form
* review, check level of decomposition - reusability
* check existing processors for similar functionality
* determine target location
* determine Processor Signature

## Create Processor

* make a copy of `src/processors/example-group` if a new group is required, or `src/processors/example-group/ExampleProcessor.js` if an existing group is suitable. Place copy and rename as appropriate.

## Example

1. Plan Requirements

I need to escape literal content going into a SPARQL query. I may well need escaping for Turtle at some point, so might as well include a facility to choose format. This level of functionality seems good for a Processor. There isn't any existing processor near enough to reuse, but there is already a good target group : `src/processors/text/` (this is the kind of thing I want in the core set of processors). I'll call the new processor `:Escaper`, hence `src/processors/text/Escaper.js`.
