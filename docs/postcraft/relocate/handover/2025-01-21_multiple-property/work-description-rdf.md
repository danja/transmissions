@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix prj: <http://purl.org/stuff/project/> .
@prefix code: <http://purl.org/stuff/code/> .
@prefix trn: <http://purl.org/stuff/transmissions/> .

# Project Definition
trn:MultiPropertySupport 
    a prj:Feature ;
    dcterms:title "Multiple Property Values Support" ;
    dcterms:created "2025-01-21"^^xsd:date ;
    prj:status "Implemented" ;
    prj:version "1.0.0" ;
    prj:maintainer <http://danny.ayers.name> ;
    prj:documentation trn:MultiPropertyDocs .

# Component Documentation
trn:MultiPropertyDocs 
    a prj:Documentation ;
    prj:hasSection trn:ProcessorSettingsDoc, trn:RDFPatternsDoc .

trn:ProcessorSettingsDoc 
    a prj:DocumentationSection ;
    dcterms:title "ProcessorSettings Implementation" ;
    prj:covers trn:ProcessorSettings, trn:Processor ;
    prj:location "/src/processors/base/" .

# Components
trn:ProcessorSettings 
    a code:Component ;
    dcterms:title "ProcessorSettings Class" ;
    code:implements trn:PropertyManagement ;
    code:dependsOn trn:RDFDataset ;
    code:hasTest trn:ProcessorSettingsTests ;
    code:api [
        a code:Method ;
        code:name "getValues" ;
        code:parameters (
            [code:name "property" ; code:type "RDF.Term"]
            [code:name "fallback" ; code:type "any"]
        ) ;
        code:returns "Array<string>"
    ], [
        a code:Method ;
        code:name "getValue" ;
        code:parameters (
            [code:name "property" ; code:type "RDF.Term"]
            [code:name "fallback" ; code:type "any"]
        ) ;
        code:returns "string"
    ] .

# Test Coverage
trn:ProcessorSettingsTests 
    a code:TestSuite ;
    dcterms:title "ProcessorSettings Tests" ;
    code:location "tests/unit/ProcessorSettings.spec.js" ;
    code:testCases [
        a code:TestCase ;
        code:name "should return array with single value" ;
        code:tests trn:SingleValueRetrieval
    ], [
        a code:TestCase ;
        code:name "should return array with multiple values" ;
        code:tests trn:MultiValueRetrieval
    ], [
        a code:TestCase ;
        code:name "should handle referenced settings" ;
        code:tests trn:SettingsReferenceHandling
    ] .

# Implementation Details
trn:PropertyManagement 
    a code:Interface ;
    code:feature [
        a code:Feature ;
        code:name "Multiple Property Values" ;
        code:description "Support for both single and multiple property value patterns" ;
        code:example """
:config :excludePatterns "pattern1,pattern2,pattern3" .
# or
:config :excludePattern "pattern1" ;
        :excludePattern "pattern2" ;
        :excludePattern "pattern3" .""" ;
        code:status "Implemented"
    ] .

# Technical Dependencies
trn:RDFDataset 
    a code:Dependency ;
    dcterms:title "RDF Dataset Operations" ;
    code:implementation [
        a code:Pattern ;
        code:name "Direct Dataset Access" ;
        code:example """
for (const quad of dataset.match(subject, property)) {
    values.push(quad.object.value);
}"""
    ] .

# Data Patterns
trn:ConfigurationPattern 
    a code:Pattern ;
    code:hasVariant trn:SinglePropertyMultiValue, trn:MultiplePropertySingleValue .

trn:SinglePropertyMultiValue 
    a code:Pattern ;
    code:example """
:filterConfig a :ConfigSet ;
    :excludePatterns "pattern1,pattern2" .""" .

trn:MultiplePropertySingleValue 
    a code:Pattern ;
    code:example """
:filterConfig a :ConfigSet ;
    :excludePattern "pattern1" ;
    :excludePattern "pattern2" .""" .

# Known Issues
trn:Issues 
    a prj:IssueList ;
    prj:hasIssue [
        a prj:TODO ;
        dcterms:title "StringFilter Update" ;
        prj:priority "High"
    ], [
        a prj:TODO ;
        dcterms:title "Integration Tests" ;
        prj:priority "High"
    ], [
        a prj:TODO ;
        dcterms:title "TypeScript Definitions" ;
        prj:priority "Medium"
    ] .

# Provenance
trn:MultiPropertySupport 
    prov:wasGeneratedBy [
        a prov:Activity ;
        prov:used trn:ProcessorSettings, trn:RDFDataset ;
        prov:startedAtTime "2025-01-21T09:00:00Z"^^xsd:dateTime ;
        prov:endedAtTime "2025-01-21T17:00:00Z"^^xsd:dateTime ;
        prov:wasAssociatedWith <http://danny.ayers.name>
    ] .
