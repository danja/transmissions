[api.logger] log level: debug
Hello, logger!
process.cwd() = /home/danny/HKMS/treadmill
TransmissionBuilder reading RDF
about to build pipeline

*** Building ***
Transmission constructor

serviceName = http://hyperdata.it/treadmill/s1

serviceType = http://hyperdata.it/treadmill/FileReader
Create/register service <http://hyperdata.it/treadmill/s1> of type <http://hyperdata.it/treadmill/FileReader>
ServiceFactory.createService : http://hyperdata.it/treadmill/FileReader
TestServicesFactory.createService : http://hyperdata.it/treadmill/FileReader
ServiceFactory.createService : http://hyperdata.it/treadmill/FileReader
FsServicesFactory.createService : http://hyperdata.it/treadmill/FileReader

************* serviceConfig = http://hyperdata.it/treadmill/sourceFile
Registered service: http://hyperdata.it/treadmill/s1

serviceName = http://hyperdata.it/treadmill/s2

serviceType = http://hyperdata.it/treadmill/LineReader
Create/register service <http://hyperdata.it/treadmill/s2> of type <http://hyperdata.it/treadmill/LineReader>
ServiceFactory.createService : http://hyperdata.it/treadmill/LineReader
TestServicesFactory.createService : http://hyperdata.it/treadmill/LineReader
ServiceFactory.createService : http://hyperdata.it/treadmill/LineReader
FsServicesFactory.createService : http://hyperdata.it/treadmill/LineReader
MarkupServicesFactory.createService : http://hyperdata.it/treadmill/LineReader
TextServicesFactory.createService : http://hyperdata.it/treadmill/LineReader
Registered service: http://hyperdata.it/treadmill/s2
Connecting #1 [http://hyperdata.it/treadmill/s1] => [http://hyperdata.it/treadmill/s2]

serviceName = http://hyperdata.it/treadmill/s3

serviceType = http://hyperdata.it/treadmill/HttpGet
Create/register service <http://hyperdata.it/treadmill/s3> of type <http://hyperdata.it/treadmill/HttpGet>
ServiceFactory.createService : http://hyperdata.it/treadmill/HttpGet
TestServicesFactory.createService : http://hyperdata.it/treadmill/HttpGet
ServiceFactory.createService : http://hyperdata.it/treadmill/HttpGet
FsServicesFactory.createService : http://hyperdata.it/treadmill/HttpGet
MarkupServicesFactory.createService : http://hyperdata.it/treadmill/HttpGet
TextServicesFactory.createService : http://hyperdata.it/treadmill/HttpGet
ProtocolsServicesFactory.createService : http://hyperdata.it/treadmill/HttpGet
Registered service: http://hyperdata.it/treadmill/s3
Connecting #2 [http://hyperdata.it/treadmill/s2] => [http://hyperdata.it/treadmill/s3]

serviceName = http://hyperdata.it/treadmill/s4

serviceType = http://hyperdata.it/treadmill/LinkFinder
Create/register service <http://hyperdata.it/treadmill/s4> of type <http://hyperdata.it/treadmill/LinkFinder>
ServiceFactory.createService : http://hyperdata.it/treadmill/LinkFinder
TestServicesFactory.createService : http://hyperdata.it/treadmill/LinkFinder
ServiceFactory.createService : http://hyperdata.it/treadmill/LinkFinder
FsServicesFactory.createService : http://hyperdata.it/treadmill/LinkFinder
MarkupServicesFactory.createService : http://hyperdata.it/treadmill/LinkFinder
Registered service: http://hyperdata.it/treadmill/s4
Connecting #3 [http://hyperdata.it/treadmill/s3] => [http://hyperdata.it/treadmill/s4]

serviceName = http://hyperdata.it/treadmill/s5

serviceType = http://hyperdata.it/treadmill/StringMerger
Create/register service <http://hyperdata.it/treadmill/s5> of type <http://hyperdata.it/treadmill/StringMerger>
ServiceFactory.createService : http://hyperdata.it/treadmill/StringMerger
TestServicesFactory.createService : http://hyperdata.it/treadmill/StringMerger
ServiceFactory.createService : http://hyperdata.it/treadmill/StringMerger
FsServicesFactory.createService : http://hyperdata.it/treadmill/StringMerger
MarkupServicesFactory.createService : http://hyperdata.it/treadmill/StringMerger
TextServicesFactory.createService : http://hyperdata.it/treadmill/StringMerger
Registered service: http://hyperdata.it/treadmill/s5
Connecting #4 [http://hyperdata.it/treadmill/s4] => [http://hyperdata.it/treadmill/s5]

serviceName = http://hyperdata.it/treadmill/s6

serviceType = http://hyperdata.it/treadmill/FileWriter
Create/register service <http://hyperdata.it/treadmill/s6> of type <http://hyperdata.it/treadmill/FileWriter>
ServiceFactory.createService : http://hyperdata.it/treadmill/FileWriter
TestServicesFactory.createService : http://hyperdata.it/treadmill/FileWriter
ServiceFactory.createService : http://hyperdata.it/treadmill/FileWriter
FsServicesFactory.createService : http://hyperdata.it/treadmill/FileWriter

************* serviceConfig = http://hyperdata.it/treadmill/linkFile
Registered service: http://hyperdata.it/treadmill/s6
Connecting #5 [http://hyperdata.it/treadmill/s5] => [http://hyperdata.it/treadmill/s6]

serviceName = http://hyperdata.it/treadmill/s7

serviceType = http://hyperdata.it/treadmill/MarkdownToHTML
Create/register service <http://hyperdata.it/treadmill/s7> of type <http://hyperdata.it/treadmill/MarkdownToHTML>
ServiceFactory.createService : http://hyperdata.it/treadmill/MarkdownToHTML
TestServicesFactory.createService : http://hyperdata.it/treadmill/MarkdownToHTML
ServiceFactory.createService : http://hyperdata.it/treadmill/MarkdownToHTML
FsServicesFactory.createService : http://hyperdata.it/treadmill/MarkdownToHTML
MarkupServicesFactory.createService : http://hyperdata.it/treadmill/MarkdownToHTML
Registered service: http://hyperdata.it/treadmill/s7
Connecting #6 [http://hyperdata.it/treadmill/s6] => [http://hyperdata.it/treadmill/s7]

serviceName = http://hyperdata.it/treadmill/s8

serviceType = http://hyperdata.it/treadmill/FileWriter
Create/register service <http://hyperdata.it/treadmill/s8> of type <http://hyperdata.it/treadmill/FileWriter>
ServiceFactory.createService : http://hyperdata.it/treadmill/FileWriter
TestServicesFactory.createService : http://hyperdata.it/treadmill/FileWriter
ServiceFactory.createService : http://hyperdata.it/treadmill/FileWriter
FsServicesFactory.createService : http://hyperdata.it/treadmill/FileWriter

************* serviceConfig = http://hyperdata.it/treadmill/htmlFile
Registered service: http://hyperdata.it/treadmill/s8
Connecting #7 [http://hyperdata.it/treadmill/s7] => [http://hyperdata.it/treadmill/s8]

*** Execution ***

Transmission running service : http://hyperdata.it/treadmill/s1
dataDir = undefined
FileReader sourceFile = starter-links.md
f = /home/danny/HKMS/treadmill/src/transmissions/link-lister/data/starter-links.md
Line = [[[https://en.wikipedia.org/wiki/FOAF]]]
Line = [[[http://xmlns.com/foaf/spec/]]]
HG DONE*****************
LF DONE*****************
SMDATA*********************************
~~done~~
SM  DONE**********************************

Filewriter.targetFile = links.md
Filewriter.targetFile = links.html
SMDATA*********************************


# FOAF Vocabulary Specification 0.99

SMDATA*********************************


## Namespace Document 14 January 2014 - Paddington Edition

SMDATA*********************************

[http://xmlns.com/foaf/spec/20140114.html](http://xmlns.com/foaf/spec/20140114.html)
SMDATA*********************************

[rdf](http://xmlns.com/foaf/spec/20140114.rdf)
SMDATA*********************************

[http://xmlns.com/foaf/spec/](http://xmlns.com/foaf/spec/)
SMDATA*********************************

[rdf](http://xmlns.com/foaf/spec/index.rdf)
SMDATA*********************************

[http://xmlns.com/foaf/spec/20100809.html](http://xmlns.com/foaf/spec/20100809.html)
SMDATA*********************************

[rdf](http://xmlns.com/foaf/spec/20100809.rdf)
SMDATA*********************************

[Dan Brickley](mailto:danbri@danbri.org)
SMDATA*********************************

[Libby Miller](mailto:libby@nicecupoftea.org)
SMDATA*********************************

[foaf-dev@lists.foaf-project.org](http://lists.foaf-project.org/)
SMDATA*********************************

[RDF
    and Semantic Web developer community](http://www.w3.org/2001/sw/interest/)
SMDATA*********************************

[](http://creativecommons.org/licenses/by/1.0/)
SMDATA*********************************

[Creative Commons Attribution License](http://creativecommons.org/licenses/by/1.0/)
SMDATA*********************************

[RDF](http://www.w3.org/RDF/)
SMDATA*********************************


## Abstract

SMDATA*********************************


## Status of This Document

SMDATA*********************************

[FOAF project](http://www.foaf-project.org/)
SMDATA*********************************

[RDFS/OWL](http://xmlns.com/foaf/spec/index.rdf)
SMDATA*********************************

[per-term](http://xmlns.com/foaf/doc/)
SMDATA*********************************

[multilingual translations](http://svn.foaf-project.org/foaftown/foaf18n/)
SMDATA*********************************

[direct link](http://xmlns.com/foaf/spec/index.rdf)
SMDATA*********************************

[content negotiation](http://en.wikipedia.org/wiki/Content_negotiation)
SMDATA*********************************

[namespace URI](http://xmlns.com/foaf/0.1/)
SMDATA*********************************

[foaf-dev@lists.foaf-project.org](mailto:foaf-dev@lists.foaf-project.org)
SMDATA*********************************

[public archives](http://lists.foaf-project.org)
SMDATA*********************************

[FOAF mailing list](mailto:foaf-dev@lists.foaf-project.org)
SMDATA*********************************

[FOAF website](http://www.foaf-project.org/)
SMDATA*********************************


### Changes in version 0.99

SMDATA*********************************


## Table of Contents

SMDATA*********************************


## FOAF at a glance

SMDATA*********************************

[Dublin Core](http://www.dublincore.org/)
SMDATA*********************************

[SKOS](http://www.w3.org/2004/02/skos/)
SMDATA*********************************

[DOAP](http://trac.usefulinc.com/doap)
SMDATA*********************************

[SIOC](http://sioc-project.org/)
SMDATA*********************************

[Org vocabulary](http://www.epimorphics.com/public/vocabulary/org.html)
SMDATA*********************************

[Bio vocabulary](http://vocab.org/bio/0.1/.html)
SMDATA*********************************

[Portable Contacts](http://portablecontacts.net/)
SMDATA*********************************

[W3C Social Web group](http://www.w3.org/2005/Incubator/socialweb/)
SMDATA*********************************


### FOAF Core

SMDATA*********************************


### Social Web

SMDATA*********************************


### A-Z of FOAF terms (current and archaic)

SMDATA*********************************


## Example

SMDATA*********************************


## 1 Introduction: FOAF Basics

SMDATA*********************************


### The Semantic Web

SMDATA*********************************

[W3 future directions](http://www.w3.org/Talks/WWW94Tim/)
SMDATA*********************************

[Giant Global Graph](http://dig.csail.mit.edu/breadcrumbs/node/215)
SMDATA*********************************

[foaf](http://www.w3.org/People/Berners-Lee/card)
SMDATA*********************************


### FOAF and the Semantic Web

SMDATA*********************************

[Semantic Web](http://www.w3.org/2001/sw/)
SMDATA*********************************

[SPARQL](http://www.w3.org/TR/rdf-sparql-query/)
SMDATA*********************************

[SKOS](http://www.w3.org/2004/02/skos/)
SMDATA*********************************

[GRDDL](http://www.w3.org/2001/sw/grddl-wg/)
SMDATA*********************************

[RDFa](http://www.w3.org/TR/xhtml-rdfa-primer/)
SMDATA*********************************

[Linked 
  Data](http://www.w3.org/DesignIssues/LinkedData.html)
SMDATA*********************************


### The Basic Idea

SMDATA*********************************

[FOAF namespace
  document](http://xmlns.com/foaf/0.1/)
SMDATA*********************************


## What's FOAF for?

SMDATA*********************************

[XML
  Watch: Finding friends with XML and RDF](http://www-106.ibm.com/developerworks/xml/library/x-foaf.html)
SMDATA*********************************

[with image metadata](http://rdfweb.org/2002/01/photo/)
SMDATA*********************************

[co-depiction](http://rdfweb.org/2002/01/photo/)
SMDATA*********************************

[FOAF-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)
SMDATA*********************************

[FOAF project home page](http://www.foaf-project.org)
SMDATA*********************************


## Background

SMDATA*********************************

[alt.folklore.urban archive](http://www.urbanlegends.com/)
SMDATA*********************************

[snopes.com](http://www.snopes.com/)
SMDATA*********************************


## FOAF and Standards

SMDATA*********************************

[ISO
  Standardisation](http://www.iso.ch/iso/en/ISOOnline.openerpage)
SMDATA*********************************

[W3C](http://www.w3.org/)
SMDATA*********************************

[Process](http://www.w3.org/Consortium/Process/)
SMDATA*********************************

[Open Source](http://www.opensource.org/)
SMDATA*********************************

[Free Software](http://www.gnu.org/philosophy/free-sw.html)
SMDATA*********************************

[Jabber
  JEPs](http://www.jabber.org/jeps/jep-0001.html)
SMDATA*********************************

[Resource Description Framework](http://www.w3.org/RDF/)
SMDATA*********************************


## The FOAF Vocabulary Description

SMDATA*********************************

[RDF](http://www.w3.org/RDF/)
SMDATA*********************************

[Semantic Web](http://www.w3.org/2001/sw/)
SMDATA*********************************

[Semantic Web](http://www.w3.org/2001/sw/)
SMDATA*********************************


### Evolution and Extension of FOAF

SMDATA*********************************

[Dublin Core](http://dublincore.org/)
SMDATA*********************************


## FOAF Auto-Discovery: Publishing and Linking FOAF files

SMDATA*********************************

[foaf-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)
SMDATA*********************************

[FOAF
  autodiscovery](http://web.archive.org/web/20040416181630/rdfweb.org/mt/foaflog/archives/000041.html)
SMDATA*********************************


## FOAF cross-reference: Listing FOAF Classes and
  Properties

SMDATA*********************************

[RDF/XML](http://xmlns.com/foaf/spec/index.rdf)
SMDATA*********************************


### Classes and Properties (full detail)

SMDATA*********************************


## Classes

SMDATA*********************************


### Class: foaf:Agent

SMDATA*********************************


### Class: foaf:Document

SMDATA*********************************


### Class: foaf:Group

SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/IssueTracker)
SMDATA*********************************

[OWL](http://www.w3.org/2001/sw/WebOnt)
SMDATA*********************************


### Class: foaf:Image

SMDATA*********************************


### Class: foaf:Organization

SMDATA*********************************


### Class: foaf:Person

SMDATA*********************************


### Class: foaf:OnlineAccount

SMDATA*********************************


### Class: foaf:PersonalProfileDocument

SMDATA*********************************

[GRDDL](http://www.w3.org/2004/01/rdxh/spec)
SMDATA*********************************


### Class: foaf:Project

SMDATA*********************************


### Class: foaf:LabelProperty

SMDATA*********************************


### Class: foaf:OnlineChatAccount

SMDATA*********************************

[Jabber](http://www.jabber.org/)
SMDATA*********************************

[AIM](http://www.aim.com/)
SMDATA*********************************

[MSN](http://chat.msn.com/)
SMDATA*********************************

[ICQ](http://web.icq.com/icqchat/)
SMDATA*********************************

[Yahoo!](http://chat.yahoo.com/)
SMDATA*********************************

[MSN](http://chat.msn.com/)
SMDATA*********************************

[Freenode](http://www.freenode.net/)
SMDATA*********************************


### Class: foaf:OnlineEcommerceAccount

SMDATA*********************************

[Amazon](http://www.amazon.com/)
SMDATA*********************************

[eBay](http://www.ebay.com/)
SMDATA*********************************

[PayPal](http://www.paypal.com/)
SMDATA*********************************

[thinkgeek](http://www.thinkgeek.com/)
SMDATA*********************************


### Class: foaf:OnlineGamingAccount

SMDATA*********************************

[EverQuest](http://everquest.station.sony.com/)
SMDATA*********************************

[Xbox live](http://www.xbox.com/live/)
SMDATA*********************************

[Neverwinter Nights](http://nwn.bioware.com/)
SMDATA*********************************


## Properties

SMDATA*********************************


### Property: foaf:homepage

SMDATA*********************************


### Property: foaf:isPrimaryTopicOf

SMDATA*********************************


### Property: foaf:knows

SMDATA*********************************

[Relationship module](http://www.perceive.net/schemas/20021119/relationship/)
SMDATA*********************************

[scutters](http://wiki.foaf-project.org/w/ScutterSpec)
SMDATA*********************************


### Property: foaf:made

SMDATA*********************************


### Property: foaf:maker

SMDATA*********************************

[UsingDublinCoreCreator](http://wiki.foaf-project.org/w/UsingDublinCoreCreator)
SMDATA*********************************


### Property: foaf:mbox

SMDATA*********************************

[RFC 2368](http://ftp.ics.uci.edu/pub/ietf/uri/rfc2368.txt)
SMDATA*********************************


### Property: foaf:member

SMDATA*********************************


### Property: foaf:page

SMDATA*********************************


### Property: foaf:primaryTopic

SMDATA*********************************

[Wikipedia](http://www.wikipedia.org/)
SMDATA*********************************

[NNDB](http://www.nndb.com/)
SMDATA*********************************


### Property: foaf:weblog

SMDATA*********************************


### Property: foaf:account

SMDATA*********************************


### Property: foaf:accountName

SMDATA*********************************


### Property: foaf:accountServiceHomepage

SMDATA*********************************


### Property: foaf:aimChatID

SMDATA*********************************

[AIM](http://www.aim.com/)
SMDATA*********************************

[iChat](http://www.apple.com/macosx/what-is-macosx/ichat.html)
SMDATA*********************************

[Apple](http://www.apple.com/)
SMDATA*********************************


### Property: foaf:based_near

SMDATA*********************************

[geo-positioning vocabulary](http://www.w3.org/2003/01/geo/wgs84_pos#)
SMDATA*********************************

[GeoInfo](http://esw.w3.org/topic/GeoInfo)
SMDATA*********************************

[GeoOnion vocab](http://esw.w3.org/topic/GeoOnion)
SMDATA*********************************

[UsingContactNearestAirport](http://wiki.foaf-project.org/w/UsingContactNearestAirport)
SMDATA*********************************


### Property: foaf:currentProject

SMDATA*********************************


### Property: foaf:depiction

SMDATA*********************************

[Co-Depiction](http://rdfweb.org/2002/01/photo/)
SMDATA*********************************

['Annotating Images With SVG'](http://www.jibbering.com/svg/AnnotateImage.html)
SMDATA*********************************


### Property: foaf:depicts

SMDATA*********************************


### Property: foaf:familyName

SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
SMDATA*********************************


### Property: foaf:firstName

SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
SMDATA*********************************


### Property: foaf:focus

SMDATA*********************************

[SKOS](http://www.w3.org/2004/02/skos/)
SMDATA*********************************

[In SKOS](http://www.w3.org/TR/2005/WD-swbp-skos-core-guide-20050510/#secmodellingrdf)
SMDATA*********************************

[2005 discussion](http://www.w3.org/TR/2005/WD-swbp-skos-core-guide-20051102/#secopen)
SMDATA*********************************

[TDB URI scheme](http://larry.masinter.net/duri.html)
SMDATA*********************************

[original goals](http://www.foaf-project.org/original-intro)
SMDATA*********************************


### Property: foaf:gender

SMDATA*********************************

[foaf-dev](http://lists.foaf-project.org/mailman/listinfo/foaf-dev)
SMDATA*********************************


### Property: foaf:givenName

SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
SMDATA*********************************


### Property: foaf:icqChatID

SMDATA*********************************

[icq chat](http://web.icq.com/icqchat/)
SMDATA*********************************

[What is ICQ?](http://www.icq.com/products/whatisicq.html)
SMDATA*********************************

[About Us](http://company.icq.com/info/)
SMDATA*********************************


### Property: foaf:img

SMDATA*********************************


### Property: foaf:interest

SMDATA*********************************

[RDF](http://www.w3.org/RDF/)
SMDATA*********************************

[CPAN](http://www.cpan.org/)
SMDATA*********************************


### Property: foaf:jabberID

SMDATA*********************************

[Jabber](http://www.jabber.org/)
SMDATA*********************************

[Jabber](http://www.jabber.org/)
SMDATA*********************************


### Property: foaf:lastName

SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
SMDATA*********************************


### Property: foaf:logo

SMDATA*********************************


### Property: foaf:mbox_sha1sum

SMDATA*********************************

[Edd Dumbill's 
documentation](http://usefulinc.com/foaf/)
SMDATA*********************************

[FOAF-based whitelists](http://www.w3.org/2001/12/rubyrdf/util/foafwhite/intro.html)
SMDATA*********************************

[in Sam Ruby's 
weblog entry](http://www.intertwingly.net/blog/1545.html)
SMDATA*********************************


### Property: foaf:msnChatID

SMDATA*********************************

[Windows Live Messenger](http://en.wikipedia.org/wiki/Windows_Live_Messenger)
SMDATA*********************************

[Microsoft mesenger](http://download.live.com/messenger)
SMDATA*********************************

[Windows Live ID](http://en.wikipedia.org/wiki/Windows_Live_ID)
SMDATA*********************************


### Property: foaf:myersBriggs

SMDATA*********************************

[this article](http://www.teamtechnology.co.uk/tt/t-articl/mb-simpl.htm)
SMDATA*********************************

[Cory Caplinger's summary table](http://webspace.webring.com/people/cl/lifexplore/mbintro.htm)
SMDATA*********************************

[FOAF Myers Briggs addition](http://web.archive.org/web/20080802184922/http://rdfweb.org/mt/foaflog/archives/000004.html)
SMDATA*********************************


### Property: foaf:name

SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/IssueTracker)
SMDATA*********************************


### Property: foaf:nick

SMDATA*********************************


### Property: foaf:openid

SMDATA*********************************

[indirect identifier](http://www.w3.org/TR/webarch/#indirect-identification)
SMDATA*********************************

[OpenID](http://openid.net/specs/openid-authentication-1_1.html)
SMDATA*********************************

[delegation model](http://openid.net/specs/openid-authentication-1_1.html#delegating_authentication)
SMDATA*********************************

[technique](http://xmlns.com/foaf/spec/#sec-autodesc)
SMDATA*********************************


### Property: foaf:pastProject

SMDATA*********************************


### Property: foaf:phone

SMDATA*********************************


### Property: foaf:plan

SMDATA*********************************

[History of the 
Finger Protocol](http://www.rajivshah.com/Case_Studies/Finger/Finger.htm)
SMDATA*********************************


### Property: foaf:publications

SMDATA*********************************


### Property: foaf:schoolHomepage

SMDATA*********************************


### Property: foaf:skypeID

SMDATA*********************************


### Property: foaf:thumbnail

SMDATA*********************************


### Property: foaf:tipjar

SMDATA*********************************

[discussions](http://rdfweb.org/mt/foaflog/archives/2004/02/12/20.07.32/)
SMDATA*********************************

[PayPal](http://www.paypal.com/)
SMDATA*********************************


### Property: foaf:title

SMDATA*********************************

[FOAF Issue Tracker](http://wiki.foaf-project.org/w/IssueTracker)
SMDATA*********************************


### Property: foaf:topic

SMDATA*********************************


### Property: foaf:topic_interest

SMDATA*********************************


### Property: foaf:workInfoHomepage

SMDATA*********************************


### Property: foaf:workplaceHomepage

SMDATA*********************************


### Property: foaf:yahooChatID

SMDATA*********************************

[Yahoo! Chat](http://chat.yahoo.com/)
SMDATA*********************************

[Yahoo! Groups](http://www.yahoogroups.com/)
SMDATA*********************************


### Property: foaf:age

SMDATA*********************************


### Property: foaf:birthday

SMDATA*********************************

[BirthdayIssue](http://wiki.foaf-project.org/w/BirthdayIssue)
SMDATA*********************************


### Property: foaf:membershipClass

SMDATA*********************************


### Property: foaf:sha1

SMDATA*********************************


### Property: foaf:status

SMDATA*********************************


### Property: foaf:dnaChecksum

SMDATA*********************************


### Property: foaf:family_name

SMDATA*********************************


### Property: foaf:fundedBy

SMDATA*********************************


### Property: foaf:geekcode

SMDATA*********************************

[Wikipedia entry](http://en.wikipedia.org/wiki/Geek_Code)
SMDATA*********************************


### Property: foaf:givenname

SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
SMDATA*********************************


### Property: foaf:holdsAccount

SMDATA*********************************


### Property: foaf:surname

SMDATA*********************************

[issue 
tracker](http://wiki.foaf-project.org/w/IssueTracker)
SMDATA*********************************


### Property: foaf:theme

SMDATA*********************************


## External Vocabulary References

SMDATA*********************************


### Status Vocabulary

SMDATA*********************************

[SemWeb Vocab Status Ontology](http://www.w3.org/2003/06/sw-vocab-status/note)
SMDATA*********************************


### W3C Basic Geo (WGS84 lat/long) Vocabulary

SMDATA*********************************

[W3CBasic Geo Vocabulary](http://www.w3.org/2003/01/geo/)
SMDATA*********************************


### RDF Vocabulary Description - core concepts

SMDATA*********************************

[W3C's site](http://www.w3.org/2001/sw/)
SMDATA*********************************

[more background on URIs](http://www.w3.org/TR/webarch/#identification)
SMDATA*********************************

[linked data](http://www.w3.org/DesignIssues/LinkedData)
SMDATA*********************************

[SKOS](http://www.w3.org/2004/02/skos/)
SMDATA*********************************


### Dublin Core terms

SMDATA*********************************

[Dublin Core terms](http://dublincore.org/documents/dcmi-terms/)
SMDATA*********************************

[dct:Agent](http://dublincore.org/documents/dcmi-terms/#classes-Agent)
SMDATA*********************************

[dct:creator](http://dublincore.org/documents/dcmi-terms/#terms-creator)
SMDATA*********************************


### Wordnet terms

SMDATA*********************************

[recent](http://www.w3.org/TR/wordnet-rdf/)
SMDATA*********************************


### SIOC terms

SMDATA*********************************

[SIOC](http://rdfs.org/sioc/ns#)
SMDATA*********************************

[SIOC](http://www.sioc-project.org/)
SMDATA*********************************


### Acknowledgments

SMDATA*********************************

[rdfweb-dev](http://rdfweb.org/pipermail/rdfweb-dev/)
SMDATA*********************************

[#foaf](http://rdfweb.org/irc/)
SMDATA*********************************

[FoafExplorer](http://xml.mfd-consult.dk/foaf/explorer/)
SMDATA*********************************

[Web View](http://eikeon.com/foaf/)
SMDATA*********************************

[foaf-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)
SMDATA*********************************

[Ecademy](http://www.ecademy.com/)
SMDATA*********************************

[TypePad](http://www.typepad.com/)
SMDATA*********************************

[many](http://conferences.oreillynet.com/cs/et2003/view/e_sess/3633)
SMDATA*********************************

[explaining](http://hackdiary.com/)
SMDATA*********************************

[in Japanese](http://kanzaki.com/docs/sw/foaf.html)
SMDATA*********************************

[Spanish](http://f14web.com.ar/inkel/2003/01/27/foaf.html)
SMDATA*********************************

[Chris Schmidt](http://crschmidt.net/)
SMDATA*********************************

[spec generation](http://xmlns.com/foaf/0.1/specgen.py)
SMDATA*********************************

[cool hacks](http://crschmidt.net/semweb/)
SMDATA*********************************

[FOAF Logo](http://iandavis.com/2006/foaf-icons/)
SMDATA*********************************

[years ago](http://www.w3.org/History/1989/proposal.html)
SMDATA*********************************


## Recent Changes

SMDATA*********************************


### Changes in version 0.99 (2014-01-14)

SMDATA*********************************

[schema.org](http://schema.org/)
SMDATA*********************************

[Person](http://schema.org/Person)
SMDATA*********************************

[ImageObject](http://schema.org/ImageObject)
SMDATA*********************************

[CreativeWork](http://schema.org/CreativeWork)
SMDATA*********************************


### 2010-08-09

SMDATA*********************************

[Bio vocabulary](http://vocab.org/bio/0.1/.html)
SMDATA*********************************


### Changes from version 0.97 and 0.96

SMDATA*********************************

[0.97](http://xmlns.com/foaf/spec/20100101.html)
SMDATA*********************************

[0.96](http://xmlns.com/foaf/spec/20091215.html)
SMDATA*********************************

[Portable Contacts](http://portablecontacts.net/)
SMDATA*********************************


### 2009-12-15

SMDATA*********************************


### 2007-11-02

SMDATA*********************************


### 2007-05-24

SMDATA*********************************

[Main page](https://en.wikipedia.org/wiki/Main_Page)
SMDATA*********************************

[Contents](https://en.wikipedia.org/wiki/Wikipedia:Contents)
SMDATA*********************************

[Current events](https://en.wikipedia.org/wiki/Portal:Current_events)
SMDATA*********************************

[Random article](https://en.wikipedia.org/wiki/Special:Random)
SMDATA*********************************

[About Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:About)
SMDATA*********************************

[Contact us](https://en.wikipedia.org/wiki/Wikipedia:Contact_us)
SMDATA*********************************

[Donate](https://donate.wikimedia.org/wiki/Special:FundraiserRedirector?utm_source=donate&utm_medium=sidebar&utm_campaign=C13_en.wikipedia.org&uselang=en)
SMDATA*********************************

[Help](https://en.wikipedia.org/wiki/Help:Contents)
SMDATA*********************************

[Learn to edit](https://en.wikipedia.org/wiki/Help:Introduction)
SMDATA*********************************

[Community portal](https://en.wikipedia.org/wiki/Wikipedia:Community_portal)
SMDATA*********************************

[Recent changes](https://en.wikipedia.org/wiki/Special:RecentChanges)
SMDATA*********************************

[Upload file](https://en.wikipedia.org/wiki/Wikipedia:File_upload_wizard)
SMDATA*********************************

[
	
	
		
		
	
](https://en.wikipedia.org/wiki/Main_Page)
SMDATA*********************************

[

Search
	](https://en.wikipedia.org/wiki/Special:Search)
SMDATA*********************************

[Create account](https://en.wikipedia.org/w/index.php?title=Special:CreateAccount&returnto=FOAF)
SMDATA*********************************

[Log in](https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=FOAF)
SMDATA*********************************

[ Create account](https://en.wikipedia.org/w/index.php?title=Special:CreateAccount&returnto=FOAF)
SMDATA*********************************

[ Log in](https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=FOAF)
SMDATA*********************************

[learn more](https://en.wikipedia.org/wiki/Help:Introduction)
SMDATA*********************************

[Contributions](https://en.wikipedia.org/wiki/Special:MyContributions)
SMDATA*********************************

[Talk](https://en.wikipedia.org/wiki/Special:MyTalk)
SMDATA*********************************


## Contents

SMDATA*********************************


# FOAF

SMDATA*********************************

[Català](https://ca.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Deutsch](https://de.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Español](https://es.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[فارسی](https://fa.wikipedia.org/wiki/%D8%A7%D9%81%E2%80%8C%D8%A7%D9%88%D8%A7%DB%8C%E2%80%8C%D8%A7%D9%81_(%D9%87%D8%B3%D8%AA%DB%8C%E2%80%8C%D8%B4%D9%86%D8%A7%D8%B3%DB%8C))
SMDATA*********************************

[Français](https://fr.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Italiano](https://it.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Latviešu](https://lv.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Nederlands](https://nl.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[日本語](https://ja.wikipedia.org/wiki/Friend_of_a_Friend)
SMDATA*********************************

[Norsk bokmål](https://no.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Polski](https://pl.wikipedia.org/wiki/FOAF_(format))
SMDATA*********************************

[Português](https://pt.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Русский](https://ru.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Українська](https://uk.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Edit links](https://www.wikidata.org/wiki/Special:EntityPage/Q1389366#sitelinks-wikipedia)
SMDATA*********************************

[Article](https://en.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Talk](https://en.wikipedia.org/wiki/Talk:FOAF)
SMDATA*********************************

[Read](https://en.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit)
SMDATA*********************************

[View history](https://en.wikipedia.org/w/index.php?title=FOAF&action=history)
SMDATA*********************************

[Read](https://en.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit)
SMDATA*********************************

[View history](https://en.wikipedia.org/w/index.php?title=FOAF&action=history)
SMDATA*********************************

[What links here](https://en.wikipedia.org/wiki/Special:WhatLinksHere/FOAF)
SMDATA*********************************

[Related changes](https://en.wikipedia.org/wiki/Special:RecentChangesLinked/FOAF)
SMDATA*********************************

[Upload file](https://en.wikipedia.org/wiki/Wikipedia:File_Upload_Wizard)
SMDATA*********************************

[Special pages](https://en.wikipedia.org/wiki/Special:SpecialPages)
SMDATA*********************************

[Permanent link](https://en.wikipedia.org/w/index.php?title=FOAF&oldid=1165941964)
SMDATA*********************************

[Page information](https://en.wikipedia.org/w/index.php?title=FOAF&action=info)
SMDATA*********************************

[Cite this page](https://en.wikipedia.org/w/index.php?title=Special:CiteThisPage&page=FOAF&id=1165941964&wpFormIdentifier=titleform)
SMDATA*********************************

[Get shortened URL](https://en.wikipedia.org/w/index.php?title=Special:UrlShortener&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFOAF)
SMDATA*********************************

[Download QR code](https://en.wikipedia.org/w/index.php?title=Special:QrCode&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFOAF)
SMDATA*********************************

[Wikidata item](https://www.wikidata.org/wiki/Special:EntityPage/Q1389366)
SMDATA*********************************

[Download as PDF](https://en.wikipedia.org/w/index.php?title=Special:DownloadAsPdf&page=FOAF&action=show-download-screen)
SMDATA*********************************

[Printable version](https://en.wikipedia.org/w/index.php?title=FOAF&printable=yes)
SMDATA*********************************

[Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:FOAF)
SMDATA*********************************

[friend of a friend](https://en.wikipedia.org/wiki/Friend_of_a_friend)
SMDATA*********************************

[Friend of a Friend (disambiguation)](https://en.wikipedia.org/wiki/Friend_of_a_Friend_(disambiguation))
SMDATA*********************************

[](https://en.wikipedia.org/wiki/File:FoafLogo.svg)
SMDATA*********************************

[RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework)
SMDATA*********************************

[OWL](https://en.wikipedia.org/wiki/Web_Ontology_Language)
SMDATA*********************************

[Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web)
SMDATA*********************************

[CC BY 1.0](https://en.wikipedia.org/wiki/Creative_Commons_license)
SMDATA*********************************

[xmlns.com/foaf/spec/](http://xmlns.com/foaf/spec/)
SMDATA*********************************

[friend of a friend](https://en.wikipedia.org/wiki/Friend_of_a_friend)
SMDATA*********************************

[machine-readable](https://en.wikipedia.org/wiki/Machine-readable_data)
SMDATA*********************************

[ontology](https://en.wikipedia.org/wiki/Ontology_(information_science))
SMDATA*********************************

[persons](https://en.wikipedia.org/wiki/Person)
SMDATA*********************************

[social networks](https://en.wikipedia.org/wiki/Social_networks)
SMDATA*********************************

[Resource Description Framework](https://en.wikipedia.org/wiki/Resource_Description_Framework)
SMDATA*********************************

[Web Ontology Language](https://en.wikipedia.org/wiki/Web_Ontology_Language)
SMDATA*********************************

[e-mail addresses](https://en.wikipedia.org/wiki/E-mail_address)
SMDATA*********************************

[telephone number](https://en.wikipedia.org/wiki/Telephone_number)
SMDATA*********************************

[Facebook](https://en.wikipedia.org/wiki/Facebook)
SMDATA*********************************

[Jabber ID](https://en.wikipedia.org/wiki/Extensible_Messaging_and_Presence_Protocol)
SMDATA*********************************

[URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)
SMDATA*********************************

[Social Semantic Web](https://en.wikipedia.org/wiki/Social_Semantic_Web)
SMDATA*********************************

[citation needed](https://en.wikipedia.org/wiki/Wikipedia:Citation_needed)
SMDATA*********************************

[RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework)
SMDATA*********************************

[social web](https://en.wikipedia.org/wiki/Social_web)
SMDATA*********************************

[clarification needed](https://en.wikipedia.org/wiki/Wikipedia:Please_clarify)
SMDATA*********************************

[Tim Berners-Lee](https://en.wikipedia.org/wiki/Tim_Berners-Lee)
SMDATA*********************************

[semantic web](https://en.wikipedia.org/wiki/Semantic_web)
SMDATA*********************************

[Giant Global Graph](https://en.wikipedia.org/wiki/Giant_Global_Graph)
SMDATA*********************************

[Internet](https://en.wikipedia.org/wiki/Internet)
SMDATA*********************************

[World Wide Web](https://en.wikipedia.org/wiki/World_Wide_Web)
SMDATA*********************************


## WebID[edit]

SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=1)
SMDATA*********************************

[WebID](https://en.wikipedia.org/wiki/WebID)
SMDATA*********************************


## Deployment[edit]

SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=2)
SMDATA*********************************

[Live Journal](https://en.wikipedia.org/wiki/Live_Journal)
SMDATA*********************************

[DeadJournal](https://en.wikipedia.org/wiki/DeadJournal)
SMDATA*********************************

[My Opera](https://en.wikipedia.org/wiki/My_Opera)
SMDATA*********************************

[Identi.ca](https://en.wikipedia.org/wiki/Identi.ca)
SMDATA*********************************

[FriendFeed](https://en.wikipedia.org/wiki/FriendFeed)
SMDATA*********************************

[WordPress](https://en.wikipedia.org/wiki/WordPress)
SMDATA*********************************

[TypePad](https://en.wikipedia.org/wiki/TypePad)
SMDATA*********************************

[Yandex](https://en.wikipedia.org/wiki/Yandex)
SMDATA*********************************

[Safari](https://en.wikipedia.org/wiki/Safari_(web_browser))
SMDATA*********************************

[Firefox](https://en.wikipedia.org/wiki/Firefox_(web_browser))
SMDATA*********************************

[Semantic MediaWiki](https://en.wikipedia.org/wiki/Semantic_MediaWiki)
SMDATA*********************************

[semantic annotation](https://en.wikipedia.org/wiki/Semantic_annotation)
SMDATA*********************************

[linked data](https://en.wikipedia.org/wiki/Linked_data)
SMDATA*********************************

[MediaWiki](https://en.wikipedia.org/wiki/MediaWiki)
SMDATA*********************************

[content management systems](https://en.wikipedia.org/wiki/Content_management_systems)
SMDATA*********************************


## Example[edit]

SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=3)
SMDATA*********************************

[Turtle](https://en.wikipedia.org/wiki/Turtle_(syntax))
SMDATA*********************************

[web resources](https://en.wikipedia.org/wiki/Web_resource)
SMDATA*********************************


## History[edit]

SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=4)
SMDATA*********************************


### Versions[edit]

SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=5)
SMDATA*********************************

[http://xmlns.com/foaf/0.1/](http://xmlns.com/foaf/0.1/)
SMDATA*********************************

[http://xmlns.com/foaf/0.1/](http://xmlns.com/foaf/0.1/)
SMDATA*********************************


## See also[edit]

SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=6)
SMDATA*********************************

[Resource Description Framework](https://en.wikipedia.org/wiki/Resource_Description_Framework)
SMDATA*********************************

[Web Ontology Language](https://en.wikipedia.org/wiki/Web_Ontology_Language)
SMDATA*********************************

[Social web](https://en.wikipedia.org/wiki/Social_web)
SMDATA*********************************

[Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web)
SMDATA*********************************

[Description of a Career](https://en.wiktionary.org/wiki/DOAC)
SMDATA*********************************

[Description of a Project](https://en.wikipedia.org/wiki/DOAP)
SMDATA*********************************

[Semantically-Interlinked Online Communities](https://en.wikipedia.org/wiki/Semantically-Interlinked_Online_Communities)
SMDATA*********************************

[hCard](https://en.wikipedia.org/wiki/HCard)
SMDATA*********************************

[vCard](https://en.wikipedia.org/wiki/VCard)
SMDATA*********************************

[XHTML Friends Network](https://en.wikipedia.org/wiki/XHTML_Friends_Network)
SMDATA*********************************


## References[edit]

SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=7)
SMDATA*********************************

[XML Watch: Finding friends with XML and RDF](https://web.archive.org/web/20091223003446/http://www.ibm.com/developerworks/xml/library/x-foaf.html)
SMDATA*********************************

[IBM DeveloperWorks](https://en.wikipedia.org/wiki/IBM_DeveloperWorks)
SMDATA*********************************

[XML Watch: Support online communities with FOAF](https://web.archive.org/web/20100307223814/http://www.ibm.com/developerworks/xml/library/x-foaf2.html)
SMDATA*********************************

[IBM DeveloperWorks](https://en.wikipedia.org/wiki/IBM_DeveloperWorks)
SMDATA*********************************

["Giant Global Graph"](https://web.archive.org/web/20160713021037/http://dig.csail.mit.edu/breadcrumbs/node/215)
SMDATA*********************************

[the original](http://dig.csail.mit.edu/breadcrumbs/node/215)
SMDATA*********************************

["LiveJournal FOAF"](https://web.archive.org/web/20100118151037/http://community.livejournal.com/ljfoaf)
SMDATA*********************************

[the original](http://community.livejournal.com/ljfoaf)
SMDATA*********************************

["Known FOAF data providers"](https://web.archive.org/web/20100226072731/http://wiki.foaf-project.org/w/DataSources)
SMDATA*********************************

[the original](http://wiki.foaf-project.org/w/DataSources)
SMDATA*********************************

["press release on the social networking support"](http://company.yandex.com/press_center/press_releases/2008/2008-08-15.xml)
SMDATA*********************************

["FOAF Support in Safari RSS"](http://ejohn.org/blog/foaf-support-in-safari-rss/)
SMDATA*********************************

["Semantic Radar plugin for the Firefox browser"](https://web.archive.org/web/20140108014347/https://addons.mozilla.org/en-US/firefox/addon/semantic-radar/)
SMDATA*********************************

[the original](https://addons.mozilla.org/en-US/firefox/addon/semantic-radar/)
SMDATA*********************************

["FOAF support module for Perl"](https://metacpan.org/pod/XML::FOAF)
SMDATA*********************************

["FOAF+SSL authentication support for Perl"](https://metacpan.org/pod/Web::ID)
SMDATA*********************************

[http://drupal.org/project/foaf](https://drupal.org/project/foaf)
SMDATA*********************************

[Drupal](https://en.wikipedia.org/wiki/Drupal)
SMDATA*********************************

["FOAF Vocabulary Specification 0.99"](http://xmlns.com/foaf/spec/20140114.html)
SMDATA*********************************

[Archived](https://web.archive.org/web/20220303180551/http://xmlns.com/foaf/spec/20140114.html)
SMDATA*********************************


## External links[edit]

SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=8)
SMDATA*********************************

[Official website](http://www.foaf-project.org)
SMDATA*********************************

[Archived](https://web.archive.org/web/20211023122305/http://www.foaf-project.org/)
SMDATA*********************************

[Wayback Machine](https://en.wikipedia.org/wiki/Wayback_Machine)
SMDATA*********************************

[FOAF dataset](http://ebiquity.umbc.edu/resource/html/id/82/)
SMDATA*********************************

[FOAF-search - a search engine for FOAF data](https://web.archive.org/web/20181130195340/https://www.foaf-search.net/)
SMDATA*********************************

[Wayback Machine](https://en.wikipedia.org/wiki/Wayback_Machine)
SMDATA*********************************

[v](https://en.wikipedia.org/wiki/Template:Semantic_Web)
SMDATA*********************************

[t](https://en.wikipedia.org/wiki/Template_talk:Semantic_Web)
SMDATA*********************************

[e](https://en.wikipedia.org/wiki/Special:EditPage/Template:Semantic_Web)
SMDATA*********************************

[Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web)
SMDATA*********************************

[Databases](https://en.wikipedia.org/wiki/Database)
SMDATA*********************************

[Hypertext](https://en.wikipedia.org/wiki/Hypertext)
SMDATA*********************************

[Internet](https://en.wikipedia.org/wiki/Internet)
SMDATA*********************************

[Ontologies](https://en.wikipedia.org/wiki/Ontology_(computer_science))
SMDATA*********************************

[Semantics](https://en.wikipedia.org/wiki/Semantics_(computer_science))
SMDATA*********************************

[Semantic networks](https://en.wikipedia.org/wiki/Semantic_network)
SMDATA*********************************

[World Wide Web](https://en.wikipedia.org/wiki/World_Wide_Web)
SMDATA*********************************

[Dataspaces](https://en.wikipedia.org/wiki/Dataspaces)
SMDATA*********************************

[Hyperdata](https://en.wikipedia.org/wiki/Hyperdata)
SMDATA*********************************

[Linked data](https://en.wikipedia.org/wiki/Linked_data)
SMDATA*********************************

[Rule-based systems](https://en.wikipedia.org/wiki/Rule-based_system)
SMDATA*********************************

[Semantic analytics](https://en.wikipedia.org/wiki/Semantic_analytics)
SMDATA*********************************

[Semantic broker](https://en.wikipedia.org/wiki/Semantic_broker)
SMDATA*********************************

[Semantic computing](https://en.wikipedia.org/wiki/Semantic_computing)
SMDATA*********************************

[Semantic mapper](https://en.wikipedia.org/wiki/Semantic_mapper)
SMDATA*********************************

[Semantic matching](https://en.wikipedia.org/wiki/Semantic_matching)
SMDATA*********************************

[Semantic publishing](https://en.wikipedia.org/wiki/Semantic_publishing)
SMDATA*********************************

[Semantic reasoner](https://en.wikipedia.org/wiki/Semantic_reasoner)
SMDATA*********************************

[Semantic search](https://en.wikipedia.org/wiki/Semantic_search)
SMDATA*********************************

[Semantic service-oriented architecture](https://en.wikipedia.org/wiki/Semantic_service-oriented_architecture)
SMDATA*********************************

[Semantic wiki](https://en.wikipedia.org/wiki/Semantic_wiki)
SMDATA*********************************

[Solid](https://en.wikipedia.org/wiki/Solid_(web_decentralization_project))
SMDATA*********************************

[Collective intelligence](https://en.wikipedia.org/wiki/Collective_intelligence)
SMDATA*********************************

[Description logic](https://en.wikipedia.org/wiki/Description_logic)
SMDATA*********************************

[Folksonomy](https://en.wikipedia.org/wiki/Folksonomy)
SMDATA*********************************

[Geotagging](https://en.wikipedia.org/wiki/Geotagging)
SMDATA*********************************

[Information architecture](https://en.wikipedia.org/wiki/Information_architecture)
SMDATA*********************************

[Knowledge extraction](https://en.wikipedia.org/wiki/Knowledge_extraction)
SMDATA*********************************

[Knowledge management](https://en.wikipedia.org/wiki/Knowledge_management)
SMDATA*********************************

[Knowledge representation and reasoning](https://en.wikipedia.org/wiki/Knowledge_representation_and_reasoning)
SMDATA*********************************

[Library 2.0](https://en.wikipedia.org/wiki/Library_2.0)
SMDATA*********************************

[Digital library](https://en.wikipedia.org/wiki/Digital_library)
SMDATA*********************************

[Digital humanities](https://en.wikipedia.org/wiki/Digital_humanities)
SMDATA*********************************

[Metadata](https://en.wikipedia.org/wiki/Metadata)
SMDATA*********************************

[References](https://en.wikipedia.org/wiki/Reference_(computer_science))
SMDATA*********************************

[Topic map](https://en.wikipedia.org/wiki/Topic_map)
SMDATA*********************************

[Web 2.0](https://en.wikipedia.org/wiki/Web_2.0)
SMDATA*********************************

[Web engineering](https://en.wikipedia.org/wiki/Web_engineering)
SMDATA*********************************

[Web Science Trust](https://en.wikipedia.org/wiki/Web_Science_Trust)
SMDATA*********************************

[HTTP](https://en.wikipedia.org/wiki/HTTP)
SMDATA*********************************

[IRI](https://en.wikipedia.org/wiki/Internationalized_Resource_Identifier)
SMDATA*********************************

[URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)
SMDATA*********************************

[RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework)
SMDATA*********************************

[triples](https://en.wikipedia.org/wiki/Semantic_triple)
SMDATA*********************************

[RDF/XML](https://en.wikipedia.org/wiki/RDF/XML)
SMDATA*********************************

[JSON-LD](https://en.wikipedia.org/wiki/JSON-LD)
SMDATA*********************************

[Turtle](https://en.wikipedia.org/wiki/Turtle_(syntax))
SMDATA*********************************

[TriG](https://en.wikipedia.org/wiki/TriG_(syntax))
SMDATA*********************************

[Notation3](https://en.wikipedia.org/wiki/Notation3)
SMDATA*********************************

[N-Triples](https://en.wikipedia.org/wiki/N-Triples)
SMDATA*********************************

[TriX](https://en.wikipedia.org/wiki/TriX_(serialization_format))
SMDATA*********************************

[RRID](https://en.wikipedia.org/wiki/Research_Resource_Identifier)
SMDATA*********************************

[SPARQL](https://en.wikipedia.org/wiki/SPARQL)
SMDATA*********************************

[XML](https://en.wikipedia.org/wiki/XML)
SMDATA*********************************

[Semantic HTML](https://en.wikipedia.org/wiki/Semantic_HTML)
SMDATA*********************************

[Common Logic](https://en.wikipedia.org/wiki/Common_Logic)
SMDATA*********************************

[OWL](https://en.wikipedia.org/wiki/Web_Ontology_Language)
SMDATA*********************************

[RDFS](https://en.wikipedia.org/wiki/RDF_Schema)
SMDATA*********************************

[Rule Interchange Format](https://en.wikipedia.org/wiki/Rule_Interchange_Format)
SMDATA*********************************

[Semantic Web Rule Language](https://en.wikipedia.org/wiki/Semantic_Web_Rule_Language)
SMDATA*********************************

[ALPS](https://en.wikipedia.org/w/index.php?title=Application-Level_Profile_Semantics_(ALPS)&action=edit&redlink=1)
SMDATA*********************************

[SHACL](https://en.wikipedia.org/wiki/SHACL)
SMDATA*********************************

[eRDF](https://en.wikipedia.org/wiki/Embedded_RDF)
SMDATA*********************************

[GRDDL](https://en.wikipedia.org/wiki/GRDDL)
SMDATA*********************************

[Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML))
SMDATA*********************************

[Microformats](https://en.wikipedia.org/wiki/Microformat)
SMDATA*********************************

[RDFa](https://en.wikipedia.org/wiki/RDFa)
SMDATA*********************************

[SAWSDL](https://en.wikipedia.org/wiki/SAWSDL)
SMDATA*********************************

[Facebook Platform](https://en.wikipedia.org/wiki/Facebook_Platform)
SMDATA*********************************

[DOAP](https://en.wikipedia.org/wiki/DOAP)
SMDATA*********************************

[Dublin Core](https://en.wikipedia.org/wiki/Dublin_Core)
SMDATA*********************************

[Schema.org](https://en.wikipedia.org/wiki/Schema.org)
SMDATA*********************************

[SIOC](https://en.wikipedia.org/wiki/Semantically_Interlinked_Online_Communities)
SMDATA*********************************

[SKOS](https://en.wikipedia.org/wiki/Simple_Knowledge_Organization_System)
SMDATA*********************************

[hAtom](https://en.wikipedia.org/wiki/HAtom)
SMDATA*********************************

[hCalendar](https://en.wikipedia.org/wiki/HCalendar)
SMDATA*********************************

[hCard](https://en.wikipedia.org/wiki/HCard)
SMDATA*********************************

[hProduct](https://en.wikipedia.org/wiki/HProduct)
SMDATA*********************************

[hRecipe](https://en.wikipedia.org/wiki/HRecipe)
SMDATA*********************************

[hReview](https://en.wikipedia.org/wiki/HReview)
SMDATA*********************************

[v](https://en.wikipedia.org/wiki/Template:Social_networking)
SMDATA*********************************

[t](https://en.wikipedia.org/wiki/Template_talk:Social_networking)
SMDATA*********************************

[e](https://en.wikipedia.org/wiki/Special:EditPage/Template:Social_networking)
SMDATA*********************************

[Social networks](https://en.wikipedia.org/wiki/Social_network)
SMDATA*********************************

[social media](https://en.wikipedia.org/wiki/Social_media)
SMDATA*********************************

[Personal](https://en.wikipedia.org/wiki/Personal_network)
SMDATA*********************************

[Professional](https://en.wikipedia.org/wiki/Professional_network_service)
SMDATA*********************************

[Sexual](https://en.wikipedia.org/wiki/Sexual_network)
SMDATA*********************************

[Value](https://en.wikipedia.org/wiki/Value_network)
SMDATA*********************************

[Clique](https://en.wikipedia.org/wiki/Clique)
SMDATA*********************************

[Adolescent](https://en.wikipedia.org/wiki/Adolescent_clique)
SMDATA*********************************

[Corporate social media](https://en.wikipedia.org/wiki/Corporate_social_media)
SMDATA*********************************

[Distributed social network](https://en.wikipedia.org/wiki/Distributed_social_network)
SMDATA*********************************

[list](https://en.wikipedia.org/wiki/Comparison_of_software_and_protocols_for_distributed_social_networking)
SMDATA*********************************

[Enterprise social networking](https://en.wikipedia.org/wiki/Enterprise_social_networking)
SMDATA*********************************

[Enterprise social software](https://en.wikipedia.org/wiki/Enterprise_social_software)
SMDATA*********************************

[Mobile social network](https://en.wikipedia.org/wiki/Mobile_social_network)
SMDATA*********************************

[Personal knowledge networking](https://en.wikipedia.org/wiki/Personal_knowledge_networking)
SMDATA*********************************

[Services](https://en.wikipedia.org/wiki/Social_networking_service)
SMDATA*********************************

[List of social networking services](https://en.wikipedia.org/wiki/List_of_social_networking_services)
SMDATA*********************************

[List of virtual communities with more than 1 million users](https://en.wikipedia.org/wiki/List_of_virtual_communities_with_more_than_1_million_users)
SMDATA*********************************

[Ambient awareness](https://en.wikipedia.org/wiki/Ambient_awareness)
SMDATA*********************************

[Assortative mixing](https://en.wikipedia.org/wiki/Assortative_mixing)
SMDATA*********************************

[Attention inequality](https://en.wikipedia.org/wiki/Attention_inequality)
SMDATA*********************************

[Interpersonal bridge](https://en.wikipedia.org/wiki/Bridge_(interpersonal))
SMDATA*********************************

[Organizational network analysis](https://en.wikipedia.org/wiki/Organizational_network_analysis)
SMDATA*********************************

[Small-world experiment](https://en.wikipedia.org/wiki/Small-world_experiment)
SMDATA*********************************

[Social aspects of television](https://en.wikipedia.org/wiki/Social_aspects_of_television)
SMDATA*********************************

[Social capital](https://en.wikipedia.org/wiki/Social_capital)
SMDATA*********************************

[Social data revolution](https://en.wikipedia.org/wiki/Social_data_revolution)
SMDATA*********************************

[Social exchange theory](https://en.wikipedia.org/wiki/Social_exchange_theory)
SMDATA*********************************

[Social identity theory](https://en.wikipedia.org/wiki/Social_identity_theory)
SMDATA*********************************

[Social media and psychology](https://en.wikipedia.org/wiki/Social_media_and_psychology)
SMDATA*********************************

[Social media intelligence](https://en.wikipedia.org/wiki/Social_media_intelligence)
SMDATA*********************************

[Social media mining](https://en.wikipedia.org/wiki/Social_media_mining)
SMDATA*********************************

[Social media optimization](https://en.wikipedia.org/wiki/Social_media_optimization)
SMDATA*********************************

[Social network analysis](https://en.wikipedia.org/wiki/Social_network_analysis)
SMDATA*********************************

[Social web](https://en.wikipedia.org/wiki/Social_web)
SMDATA*********************************

[Structural endogamy](https://en.wikipedia.org/wiki/Structural_endogamy)
SMDATA*********************************

[Virtual collective consciousness](https://en.wikipedia.org/wiki/Virtual_collective_consciousness)
SMDATA*********************************

[Account verification](https://en.wikipedia.org/wiki/Account_verification)
SMDATA*********************************

[Aggregation](https://en.wikipedia.org/wiki/Social_network_aggregation)
SMDATA*********************************

[Change detection](https://en.wikipedia.org/wiki/Social_network_change_detection)
SMDATA*********************************

[Blockmodeling](https://en.wikipedia.org/wiki/Blockmodeling)
SMDATA*********************************

[Collaboration graph](https://en.wikipedia.org/wiki/Collaboration_graph)
SMDATA*********************************

[Collaborative consumption](https://en.wikipedia.org/wiki/Collaborative_consumption)
SMDATA*********************************

[Giant Global Graph](https://en.wikipedia.org/wiki/Giant_Global_Graph)
SMDATA*********************************

[Lateral communication](https://en.wikipedia.org/wiki/Lateral_communication)
SMDATA*********************************

[Reputation system](https://en.wikipedia.org/wiki/Reputation_system)
SMDATA*********************************

[Social bot](https://en.wikipedia.org/wiki/Social_bot)
SMDATA*********************************

[Social graph](https://en.wikipedia.org/wiki/Social_graph)
SMDATA*********************************

[Social media analytics](https://en.wikipedia.org/wiki/Social_media_analytics)
SMDATA*********************************

[Social network analysis software](https://en.wikipedia.org/wiki/Social_network_analysis_software)
SMDATA*********************************

[Social networking potential](https://en.wikipedia.org/wiki/Social_networking_potential)
SMDATA*********************************

[Social television](https://en.wikipedia.org/wiki/Social_television)
SMDATA*********************************

[Structural cohesion](https://en.wikipedia.org/wiki/Structural_cohesion)
SMDATA*********************************

[Affinity fraud](https://en.wikipedia.org/wiki/Affinity_fraud)
SMDATA*********************************

[Attention economy](https://en.wikipedia.org/wiki/Attention_economy)
SMDATA*********************************

[Collaborative finance](https://en.wikipedia.org/wiki/Collaborative_finance)
SMDATA*********************************

[Creator economy](https://en.wikipedia.org/wiki/Creator_economy)
SMDATA*********************************

[Influencer marketing](https://en.wikipedia.org/wiki/Influencer_marketing)
SMDATA*********************************

[Narrowcasting](https://en.wikipedia.org/wiki/Narrowcasting)
SMDATA*********************************

[Sharing economy](https://en.wikipedia.org/wiki/Sharing_economy)
SMDATA*********************************

[Social commerce](https://en.wikipedia.org/wiki/Social_commerce)
SMDATA*********************************

[Social sorting](https://en.wikipedia.org/wiki/Social_sorting)
SMDATA*********************************

[Viral marketing](https://en.wikipedia.org/wiki/Viral_marketing)
SMDATA*********************************

[Algorithmic radicalization](https://en.wikipedia.org/wiki/Algorithmic_radicalization)
SMDATA*********************************

[Community recognition](https://en.wikipedia.org/wiki/Community_recognition)
SMDATA*********************************

[Complex contagion](https://en.wikipedia.org/wiki/Complex_contagion)
SMDATA*********************************

[Computer addiction](https://en.wikipedia.org/wiki/Computer_addiction)
SMDATA*********************************

[Consequential strangers](https://en.wikipedia.org/wiki/Consequential_strangers)
SMDATA*********************************

[Friend of a friend](https://en.wikipedia.org/wiki/Friend_of_a_friend)
SMDATA*********************************

[Friending and following](https://en.wikipedia.org/wiki/Friending_and_following)
SMDATA*********************************

[Friendship paradox](https://en.wikipedia.org/wiki/Friendship_paradox)
SMDATA*********************************

[Influence-for-hire](https://en.wikipedia.org/wiki/Influence-for-hire)
SMDATA*********************************

[Internet addiction](https://en.wikipedia.org/wiki/Internet_addiction)
SMDATA*********************************

[Information overload](https://en.wikipedia.org/wiki/Information_overload)
SMDATA*********************************

[Overchoice](https://en.wikipedia.org/wiki/Overchoice)
SMDATA*********************************

[Six degrees of separation](https://en.wikipedia.org/wiki/Six_degrees_of_separation)
SMDATA*********************************

[Social media addiction](https://en.wikipedia.org/wiki/Social_media_addiction)
SMDATA*********************************

[Social media and suicide](https://en.wikipedia.org/wiki/Social_media_and_suicide)
SMDATA*********************************

[Social invisibility](https://en.wikipedia.org/wiki/Social_invisibility)
SMDATA*********************************

[Social network game](https://en.wikipedia.org/wiki/Social_network_game)
SMDATA*********************************

[Suicide and the Internet](https://en.wikipedia.org/wiki/Suicide_and_the_Internet)
SMDATA*********************************

[Tribe](https://en.wikipedia.org/wiki/Tribe_(internet))
SMDATA*********************************

[Viral phenomenon](https://en.wikipedia.org/wiki/Viral_phenomenon)
SMDATA*********************************

[Friendship recession](https://en.wikipedia.org/wiki/Friendship_recession)
SMDATA*********************************

[Peer pressure](https://en.wikipedia.org/wiki/Peer_pressure)
SMDATA*********************************

[Researchers](https://en.wikipedia.org/wiki/List_of_social_network_researchers)
SMDATA*********************************

[User profile](https://en.wikipedia.org/wiki/User_profile)
SMDATA*********************************

[Online identity](https://en.wikipedia.org/wiki/Online_identity)
SMDATA*********************************

[Persona](https://en.wikipedia.org/wiki/Persona_(user_experience))
SMDATA*********************************

[Social profiling](https://en.wikipedia.org/wiki/Social_profiling)
SMDATA*********************************

[Viral messages](https://en.wikipedia.org/wiki/Viral_messages)
SMDATA*********************************

[Virtual community](https://en.wikipedia.org/wiki/Virtual_community)
SMDATA*********************************

[https://en.wikipedia.org/w/index.php?title=FOAF&oldid=1165941964](https://en.wikipedia.org/w/index.php?title=FOAF&oldid=1165941964)
SMDATA*********************************

[Categories](https://en.wikipedia.org/wiki/Help:Category)
SMDATA*********************************

[Ontology (information science)](https://en.wikipedia.org/wiki/Category:Ontology_(information_science))
SMDATA*********************************

[Semantic Web](https://en.wikipedia.org/wiki/Category:Semantic_Web)
SMDATA*********************************

[2000 software](https://en.wikipedia.org/wiki/Category:2000_software)
SMDATA*********************************

[Articles with short description](https://en.wikipedia.org/wiki/Category:Articles_with_short_description)
SMDATA*********************************

[Short description matches Wikidata](https://en.wikipedia.org/wiki/Category:Short_description_matches_Wikidata)
SMDATA*********************************

[All articles with unsourced statements](https://en.wikipedia.org/wiki/Category:All_articles_with_unsourced_statements)
SMDATA*********************************

[Articles with unsourced statements from April 2017](https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_April_2017)
SMDATA*********************************

[Wikipedia articles needing clarification from April 2017](https://en.wikipedia.org/wiki/Category:Wikipedia_articles_needing_clarification_from_April_2017)
SMDATA*********************************

[Webarchive template wayback links](https://en.wikipedia.org/wiki/Category:Webarchive_template_wayback_links)
SMDATA*********************************

[Creative Commons Attribution-ShareAlike License 4.0](https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License)
SMDATA*********************************

[](https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License)
SMDATA*********************************

[Terms of Use](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Terms_of_Use)
SMDATA*********************************

[Privacy Policy](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy)
SMDATA*********************************

[Wikimedia Foundation, Inc.](https://www.wikimediafoundation.org/)
SMDATA*********************************

[Privacy policy](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy)
SMDATA*********************************

[About Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:About)
SMDATA*********************************

[Disclaimers](https://en.wikipedia.org/wiki/Wikipedia:General_disclaimer)
SMDATA*********************************

[Contact Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Contact_us)
SMDATA*********************************

[Code of Conduct](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Universal_Code_of_Conduct)
SMDATA*********************************

[Developers](https://developer.wikimedia.org)
SMDATA*********************************

[Statistics](https://stats.wikimedia.org/#/en.wikipedia.org)
SMDATA*********************************

[Cookie statement](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Cookie_statement)
SMDATA*********************************

[Mobile view](https://en.m.wikipedia.org/w/index.php?title=FOAF&mobileaction=toggle_view_mobile)
SMDATA*********************************

[](https://wikimediafoundation.org/)
SMDATA*********************************

[](https://www.mediawiki.org/)
