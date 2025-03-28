# Creating a Transmissions Application

This guide explains how to create an application within the Transmissions framework, which provides a pipeline-based approach to data processing.

## Application Structure

A basic Transmissions application consists of:

1. **Folder structure** - A directory under `src/applications/`
2. **Core files**:
   - `about.md` - Documentation
   - `config.ttl` - Configuration settings in Turtle format
   - `transmissions.ttl` - Pipeline definition in Turtle format
3. **Optional**:
   - `about.ttl` - Additional RDF metadata
   - `data/` - Application-specific data files

## Step 1: Create the Directory Structure

Create a directory for your application:

```
src/applications/my-application/
├── about.md
├── config.ttl
├── transmissions.ttl
└── data/
    ├── input/
    └── output/
```

## Step 2: Create the About Documentation

Write a Markdown document that describes your application:

```markdown
# My Application

## Runner

```sh
cd ~/path/to/transmissions
./trans my-application
```

## Description

This application does X, Y, and Z by processing data through a pipeline of processors.
```

## Step 3: Define Configuration (config.ttl)

Create a `config.ttl` file with settings for your processors:

```turtle
# src/applications/my-application/config.ttl

@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix : <http://purl.org/stuff/transmissions/> .

:mySettings1 a :ConfigSet ;
    :settingKey1 "setting value 1" ;
    :settingKey2 "setting value 2" .

:mySettings2 a :ConfigSet ;
    :settingKey3 "setting value 3" ;
    :settingKey4 "setting value 4" .
```

## Step 4: Define the Pipeline (transmissions.ttl)

Create a `transmissions.ttl` file to define your processing pipeline:

```turtle
# src/applications/my-application/transmissions.ttl

@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix : <http://purl.org/stuff/transmissions/> .

##################################################################
# Utility Processors : insert into pipe for debugging            #
#                                                                #
:SM a :ShowMessage . # verbose report, continues pipe            #
:SC a :ShowConfig . # verbose report, continues pipe             #
:DE a :DeadEnd . # ends the current pipe quietly                 #
:H  a :Halt . # kills everything                                 #
:N  a :NOP . # no operation (except for showing stage in pipe)   #
:UF a :Unfork . # collapses all pipes but one                    #
##################################################################

:my-application a :Transmission ;
    :pipe (:p10 :p20 :p30) .

:p10 a :ProcessorType1 ;
     :settings :mySettings1 .

:p20 a :ProcessorType2 ;
     :settings :mySettings2 .

:p30 a :ShowMessage .
```

## Step 5: Set Up Data Directories (Optional)

If your application works with files, create input/output directories:

```
src/applications/my-application/data/
├── input/
└── output/
```

## Step 6: Run Your Application

Run your application using the Transmissions CLI:

```sh
./trans my-application
```

For applications with message input:

```sh
./trans my-application -m '{"key": "value"}'
```

## Example: Simple Echo Application

### Directory Structure

```
src/applications/echo/
├── about.md
├── config.ttl
└── transmissions.ttl
```

### about.md

```markdown
# Echo Application

## Runner

```sh
cd ~/path/to/transmissions
./trans echo -m '{"message":"Hello, World!"}'
```

## Description

A simple application that echoes back the input message.
```

### config.ttl

```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix : <http://purl.org/stuff/transmissions/> .

# Empty config for this simple example
```

### transmissions.ttl

```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix : <http://purl.org/stuff/transmissions/> .

:echo a :Transmission ;
    :pipe (:p10 :p20) .

:p10 a :NOP .
:p20 a :ShowMessage .
```

## Common Processors to Use

Here are some useful processors available in the Transmissions framework:

- **File System**:
  - `:FileReader` - Reads files
  - `:FileWriter` - Writes files
  - `:DirWalker` - Recursively walks directories

- **Flow Control**:
  - `:NOP` - No operation
  - `:ForEach` - Iterates over arrays
  - `:Unfork` - Collapses parallel pipes

- **Text Processing**:
  - `:StringFilter` - Filters strings based on patterns
  - `:Templater` - Uses Nunjucks templates
  - `:MarkdownToHTML` - Converts markdown to HTML

- **Debugging**:
  - `:ShowMessage` - Displays message contents
  - `:ShowConfig` - Shows configuration

- **JSON Processing**:
  - `:Restructure` - Reorganizes JSON data

- **SPARQL Processing**:
  - `:SPARQLSelect` - Executes SPARQL SELECT queries
  - `:SPARQLUpdate` - Executes SPARQL UPDATE operations

## Creating a Complex Application

For more complex applications, you might include:

1. **Multiple pipelines** in your `transmissions.ttl`
2. **Custom processors** specific to your application
3. **Manifest files** for configuration overrides
4. **Testing components** for validation

Review existing applications like `md-to-sparqlstore`, `file-to-sparqlstore`, or `terrapack` for more complex examples.
