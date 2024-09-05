# Griller

= GRDDL for markdown, JSON

https://web.archive.org/web/20081218184409/http://dannyayers.com/misc/grddl-reference

---

GRDDL (Gleaning Resource Descriptions from Dialects of Languages) is a W3C recommendation that provides a mechanism for extracting RDF data from XML documents and XHTML pages. Here's a summary of GRDDL:

1. Purpose:

   - Enables the automatic extraction of RDF triples from XML and XHTML documents.
   - Bridges the gap between XML-based formats and RDF-based Semantic Web applications.

2. Key Features:

   - Uses existing standards: XML, XHTML, RDF, and XSLT.
   - Allows documents to specify their own transformation mechanisms.
   - Can be applied to entire XML dialects or individual documents.

3. Mechanism:

   - GRDDL-aware agents look for references to transformations in XML documents.
   - These transformations (typically XSLT) convert the document into RDF.

4. Implementation:

   - For XHTML: Uses profile and link elements to point to GRDDL transformations.
   - For XML: Uses namespace documents or attributes to indicate GRDDL transformations.

5. Benefits:

   - Enables semantic enrichment of existing XML and XHTML content.
   - Facilitates the integration of diverse data sources into the Semantic Web.

6. Limitations:
   - Requires additional processing compared to native RDF formats.
   - Transformation quality depends on the XSLT (or other transformation) provided.

GRDDL is particularly useful for organizations with large amounts of existing XML data who want to make this data available in RDF format without completely overhauling their current systems.

Would you like more information on any specific aspect of GRDDL?
