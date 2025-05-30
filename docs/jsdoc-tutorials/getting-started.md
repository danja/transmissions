# Getting Started with Transmissions

## Overview

Transmissions is a dataflow processing framework that allows you to create pipelines of data processors. Each processor performs a specific task, and data flows through these processors in a defined sequence.

## Basic Concepts

### Processors
Processors are the building blocks of a transmission. Each processor performs a specific operation on the data it receives.

### Transmissions
A transmission is a sequence of processors that data flows through. It defines the order in which processors are executed.

### Messages
Data is passed between processors in the form of messages. Each message contains the data being processed and optional metadata.

## Example: File Processing Pipeline

Here's a simple example of a file processing pipeline:

```turtle
@prefix : <#> .
@prefix trn: <http://hyperdata.it/transmissions/> .

:myPipeline a trn:Transmission ;
    trn:pipe (
        :fileReader
        :textProcessor
        :fileWriter
    ) .

:fileReader a trn:FileReader ;
    trn:settings [
        trn:sourceFile "input.txt"
    ] .

:textProcessor a trn:StringReplace ;
    trn:settings [
        trn:find "old" ;
        trn:replace "new"
    ] .

:fileWriter a trn:FileWriter ;
    trn:settings [
        trn:targetFile "output.txt"
    ] .
```

This pipeline reads a file, replaces all occurrences of "old" with "new", and writes the result to a new file.

## Next Steps

- Explore the available [processors](module-Transmissions.Processors.html)
- Learn how to [create custom processors](tutorial-creating-processors.html)
- Check out the [API reference](module-Transmissions.html)
