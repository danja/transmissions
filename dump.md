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
LF**********************************
~~done~~
smhdfgh**********************************
~~done~~
**fghdfgh**********************************

Filewriter.targetFile = links.md
Filewriter.targetFile = links.html
smhdfgh**********************************


# FOAF Vocabulary Specification 0.99

smhdfgh**********************************


## Namespace Document 14 January 2014 - Paddington Edition

smhdfgh**********************************

[http://xmlns.com/foaf/spec/20140114.html](http://xmlns.com/foaf/spec/20140114.html)
smhdfgh**********************************

[rdf](http://xmlns.com/foaf/spec/20140114.rdf)
smhdfgh**********************************

[http://xmlns.com/foaf/spec/](http://xmlns.com/foaf/spec/)
smhdfgh**********************************

[rdf](http://xmlns.com/foaf/spec/index.rdf)
smhdfgh**********************************

[http://xmlns.com/foaf/spec/20100809.html](http://xmlns.com/foaf/spec/20100809.html)
smhdfgh**********************************

[rdf](http://xmlns.com/foaf/spec/20100809.rdf)
smhdfgh**********************************

[Dan Brickley](mailto:danbri@danbri.org)
smhdfgh**********************************

[Libby Miller](mailto:libby@nicecupoftea.org)
smhdfgh**********************************

[foaf-dev@lists.foaf-project.org](http://lists.foaf-project.org/)
smhdfgh**********************************

[RDF
    and Semantic Web developer community](http://www.w3.org/2001/sw/interest/)
smhdfgh**********************************

[](http://creativecommons.org/licenses/by/1.0/)
smhdfgh**********************************

[Creative Commons Attribution License](http://creativecommons.org/licenses/by/1.0/)
smhdfgh**********************************

[RDF](http://www.w3.org/RDF/)
smhdfgh**********************************


## Abstract

smhdfgh**********************************


## Status of This Document

smhdfgh**********************************

[FOAF project](http://www.foaf-project.org/)
smhdfgh**********************************

[RDFS/OWL](http://xmlns.com/foaf/spec/index.rdf)
smhdfgh**********************************

[per-term](http://xmlns.com/foaf/doc/)
smhdfgh**********************************

[multilingual translations](http://svn.foaf-project.org/foaftown/foaf18n/)
smhdfgh**********************************

[direct link](http://xmlns.com/foaf/spec/index.rdf)
smhdfgh**********************************

[content negotiation](http://en.wikipedia.org/wiki/Content_negotiation)
smhdfgh**********************************

[namespace URI](http://xmlns.com/foaf/0.1/)
smhdfgh**********************************

[foaf-dev@lists.foaf-project.org](mailto:foaf-dev@lists.foaf-project.org)
smhdfgh**********************************

[public archives](http://lists.foaf-project.org)
smhdfgh**********************************

[FOAF mailing list](mailto:foaf-dev@lists.foaf-project.org)
smhdfgh**********************************

[FOAF website](http://www.foaf-project.org/)
smhdfgh**********************************


### Changes in version 0.99

smhdfgh**********************************


## Table of Contents

smhdfgh**********************************


## FOAF at a glance

smhdfgh**********************************

[Dublin Core](http://www.dublincore.org/)
smhdfgh**********************************

[SKOS](http://www.w3.org/2004/02/skos/)
smhdfgh**********************************

[DOAP](http://trac.usefulinc.com/doap)
smhdfgh**********************************

[SIOC](http://sioc-project.org/)
smhdfgh**********************************

[Org vocabulary](http://www.epimorphics.com/public/vocabulary/org.html)
smhdfgh**********************************

[Bio vocabulary](http://vocab.org/bio/0.1/.html)
smhdfgh**********************************

[Portable Contacts](http://portablecontacts.net/)
smhdfgh**********************************

[W3C Social Web group](http://www.w3.org/2005/Incubator/socialweb/)
smhdfgh**********************************


### FOAF Core

smhdfgh**********************************


### Social Web

smhdfgh**********************************


### A-Z of FOAF terms (current and archaic)

smhdfgh**********************************


## Example

smhdfgh**********************************


## 1 Introduction: FOAF Basics

smhdfgh**********************************


### The Semantic Web

smhdfgh**********************************

[W3 future directions](http://www.w3.org/Talks/WWW94Tim/)
smhdfgh**********************************

[Giant Global Graph](http://dig.csail.mit.edu/breadcrumbs/node/215)
smhdfgh**********************************

[foaf](http://www.w3.org/People/Berners-Lee/card)
smhdfgh**********************************


### FOAF and the Semantic Web

smhdfgh**********************************

[Semantic Web](http://www.w3.org/2001/sw/)
smhdfgh**********************************

[SPARQL](http://www.w3.org/TR/rdf-sparql-query/)
smhdfgh**********************************

[SKOS](http://www.w3.org/2004/02/skos/)
smhdfgh**********************************

[GRDDL](http://www.w3.org/2001/sw/grddl-wg/)
smhdfgh**********************************

[RDFa](http://www.w3.org/TR/xhtml-rdfa-primer/)
smhdfgh**********************************

[Linked 
  Data](http://www.w3.org/DesignIssues/LinkedData.html)
smhdfgh**********************************


### The Basic Idea

smhdfgh**********************************

[FOAF namespace
  document](http://xmlns.com/foaf/0.1/)
smhdfgh**********************************


## What's FOAF for?

smhdfgh**********************************

[XML
  Watch: Finding friends with XML and RDF](http://www-106.ibm.com/developerworks/xml/library/x-foaf.html)
smhdfgh**********************************

[with image metadata](http://rdfweb.org/2002/01/photo/)
smhdfgh**********************************

[co-depiction](http://rdfweb.org/2002/01/photo/)
smhdfgh**********************************

[FOAF-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)
smhdfgh**********************************

[FOAF project home page](http://www.foaf-project.org)
smhdfgh**********************************


## Background

smhdfgh**********************************

[alt.folklore.urban archive](http://www.urbanlegends.com/)
smhdfgh**********************************

[snopes.com](http://www.snopes.com/)
smhdfgh**********************************


## FOAF and Standards

smhdfgh**********************************

[ISO
  Standardisation](http://www.iso.ch/iso/en/ISOOnline.openerpage)
smhdfgh**********************************

[W3C](http://www.w3.org/)
smhdfgh**********************************

[Process](http://www.w3.org/Consortium/Process/)
smhdfgh**********************************

[Open Source](http://www.opensource.org/)
smhdfgh**********************************

[Free Software](http://www.gnu.org/philosophy/free-sw.html)
smhdfgh**********************************

[Jabber
  JEPs](http://www.jabber.org/jeps/jep-0001.html)
smhdfgh**********************************

[Resource Description Framework](http://www.w3.org/RDF/)
smhdfgh**********************************


## The FOAF Vocabulary Description

smhdfgh**********************************

[RDF](http://www.w3.org/RDF/)
smhdfgh**********************************

[Semantic Web](http://www.w3.org/2001/sw/)
smhdfgh**********************************

[Semantic Web](http://www.w3.org/2001/sw/)
smhdfgh**********************************


### Evolution and Extension of FOAF

smhdfgh**********************************

[Dublin Core](http://dublincore.org/)
smhdfgh**********************************


## FOAF Auto-Discovery: Publishing and Linking FOAF files

smhdfgh**********************************

[foaf-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)
smhdfgh**********************************

[FOAF
  autodiscovery](http://web.archive.org/web/20040416181630/rdfweb.org/mt/foaflog/archives/000041.html)
smhdfgh**********************************


## FOAF cross-reference: Listing FOAF Classes and
  Properties

smhdfgh**********************************

[RDF/XML](http://xmlns.com/foaf/spec/index.rdf)
smhdfgh**********************************


### Classes and Properties (full detail)

smhdfgh**********************************


## Classes

smhdfgh**********************************


### Class: foaf:Agent

smhdfgh**********************************


### Class: foaf:Document

smhdfgh**********************************


### Class: foaf:Group

smhdfgh**********************************

[issue tracker](http://wiki.foaf-project.org/w/IssueTracker)
smhdfgh**********************************

[OWL](http://www.w3.org/2001/sw/WebOnt)
smhdfgh**********************************


### Class: foaf:Image

smhdfgh**********************************


### Class: foaf:Organization

smhdfgh**********************************


### Class: foaf:Person

smhdfgh**********************************


### Class: foaf:OnlineAccount

smhdfgh**********************************


### Class: foaf:PersonalProfileDocument

smhdfgh**********************************

[GRDDL](http://www.w3.org/2004/01/rdxh/spec)
smhdfgh**********************************


### Class: foaf:Project

smhdfgh**********************************


### Class: foaf:LabelProperty

smhdfgh**********************************


### Class: foaf:OnlineChatAccount

smhdfgh**********************************

[Jabber](http://www.jabber.org/)
smhdfgh**********************************

[AIM](http://www.aim.com/)
smhdfgh**********************************

[MSN](http://chat.msn.com/)
smhdfgh**********************************

[ICQ](http://web.icq.com/icqchat/)
smhdfgh**********************************

[Yahoo!](http://chat.yahoo.com/)
smhdfgh**********************************

[MSN](http://chat.msn.com/)
smhdfgh**********************************

[Freenode](http://www.freenode.net/)
smhdfgh**********************************


### Class: foaf:OnlineEcommerceAccount

smhdfgh**********************************

[Amazon](http://www.amazon.com/)
smhdfgh**********************************

[eBay](http://www.ebay.com/)
smhdfgh**********************************

[PayPal](http://www.paypal.com/)
smhdfgh**********************************

[thinkgeek](http://www.thinkgeek.com/)
smhdfgh**********************************


### Class: foaf:OnlineGamingAccount

smhdfgh**********************************

[EverQuest](http://everquest.station.sony.com/)
smhdfgh**********************************

[Xbox live](http://www.xbox.com/live/)
smhdfgh**********************************

[Neverwinter Nights](http://nwn.bioware.com/)
smhdfgh**********************************


## Properties

smhdfgh**********************************


### Property: foaf:homepage

smhdfgh**********************************


### Property: foaf:isPrimaryTopicOf

smhdfgh**********************************


### Property: foaf:knows

smhdfgh**********************************

[Relationship module](http://www.perceive.net/schemas/20021119/relationship/)
smhdfgh**********************************

[scutters](http://wiki.foaf-project.org/w/ScutterSpec)
smhdfgh**********************************


### Property: foaf:made

smhdfgh**********************************


### Property: foaf:maker

smhdfgh**********************************

[UsingDublinCoreCreator](http://wiki.foaf-project.org/w/UsingDublinCoreCreator)
smhdfgh**********************************


### Property: foaf:mbox

smhdfgh**********************************

[RFC 2368](http://ftp.ics.uci.edu/pub/ietf/uri/rfc2368.txt)
smhdfgh**********************************


### Property: foaf:member

smhdfgh**********************************


### Property: foaf:page

smhdfgh**********************************


### Property: foaf:primaryTopic

smhdfgh**********************************

[Wikipedia](http://www.wikipedia.org/)
smhdfgh**********************************

[NNDB](http://www.nndb.com/)
smhdfgh**********************************


### Property: foaf:weblog

smhdfgh**********************************


### Property: foaf:account

smhdfgh**********************************


### Property: foaf:accountName

smhdfgh**********************************


### Property: foaf:accountServiceHomepage

smhdfgh**********************************


### Property: foaf:aimChatID

smhdfgh**********************************

[AIM](http://www.aim.com/)
smhdfgh**********************************

[iChat](http://www.apple.com/macosx/what-is-macosx/ichat.html)
smhdfgh**********************************

[Apple](http://www.apple.com/)
smhdfgh**********************************


### Property: foaf:based_near

smhdfgh**********************************

[geo-positioning vocabulary](http://www.w3.org/2003/01/geo/wgs84_pos#)
smhdfgh**********************************

[GeoInfo](http://esw.w3.org/topic/GeoInfo)
smhdfgh**********************************

[GeoOnion vocab](http://esw.w3.org/topic/GeoOnion)
smhdfgh**********************************

[UsingContactNearestAirport](http://wiki.foaf-project.org/w/UsingContactNearestAirport)
smhdfgh**********************************


### Property: foaf:currentProject

smhdfgh**********************************


### Property: foaf:depiction

smhdfgh**********************************

[Co-Depiction](http://rdfweb.org/2002/01/photo/)
smhdfgh**********************************

['Annotating Images With SVG'](http://www.jibbering.com/svg/AnnotateImage.html)
smhdfgh**********************************


### Property: foaf:depicts

smhdfgh**********************************


### Property: foaf:familyName

smhdfgh**********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
smhdfgh**********************************


### Property: foaf:firstName

smhdfgh**********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
smhdfgh**********************************


### Property: foaf:focus

smhdfgh**********************************

[SKOS](http://www.w3.org/2004/02/skos/)
smhdfgh**********************************

[In SKOS](http://www.w3.org/TR/2005/WD-swbp-skos-core-guide-20050510/#secmodellingrdf)
smhdfgh**********************************

[2005 discussion](http://www.w3.org/TR/2005/WD-swbp-skos-core-guide-20051102/#secopen)
smhdfgh**********************************

[TDB URI scheme](http://larry.masinter.net/duri.html)
smhdfgh**********************************

[original goals](http://www.foaf-project.org/original-intro)
smhdfgh**********************************


### Property: foaf:gender

smhdfgh**********************************

[foaf-dev](http://lists.foaf-project.org/mailman/listinfo/foaf-dev)
smhdfgh**********************************


### Property: foaf:givenName

smhdfgh**********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
smhdfgh**********************************


### Property: foaf:icqChatID

smhdfgh**********************************

[icq chat](http://web.icq.com/icqchat/)
smhdfgh**********************************

[What is ICQ?](http://www.icq.com/products/whatisicq.html)
smhdfgh**********************************

[About Us](http://company.icq.com/info/)
smhdfgh**********************************


### Property: foaf:img

smhdfgh**********************************


### Property: foaf:interest

smhdfgh**********************************

[RDF](http://www.w3.org/RDF/)
smhdfgh**********************************

[CPAN](http://www.cpan.org/)
smhdfgh**********************************


### Property: foaf:jabberID

smhdfgh**********************************

[Jabber](http://www.jabber.org/)
smhdfgh**********************************

[Jabber](http://www.jabber.org/)
smhdfgh**********************************


### Property: foaf:lastName

smhdfgh**********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
smhdfgh**********************************


### Property: foaf:logo

smhdfgh**********************************


### Property: foaf:mbox_sha1sum

smhdfgh**********************************

[Edd Dumbill's 
documentation](http://usefulinc.com/foaf/)
smhdfgh**********************************

[FOAF-based whitelists](http://www.w3.org/2001/12/rubyrdf/util/foafwhite/intro.html)
smhdfgh**********************************

[in Sam Ruby's 
weblog entry](http://www.intertwingly.net/blog/1545.html)
smhdfgh**********************************


### Property: foaf:msnChatID

smhdfgh**********************************

[Windows Live Messenger](http://en.wikipedia.org/wiki/Windows_Live_Messenger)
smhdfgh**********************************

[Microsoft mesenger](http://download.live.com/messenger)
smhdfgh**********************************

[Windows Live ID](http://en.wikipedia.org/wiki/Windows_Live_ID)
smhdfgh**********************************


### Property: foaf:myersBriggs

smhdfgh**********************************

[this article](http://www.teamtechnology.co.uk/tt/t-articl/mb-simpl.htm)
smhdfgh**********************************

[Cory Caplinger's summary table](http://webspace.webring.com/people/cl/lifexplore/mbintro.htm)
smhdfgh**********************************

[FOAF Myers Briggs addition](http://web.archive.org/web/20080802184922/http://rdfweb.org/mt/foaflog/archives/000004.html)
smhdfgh**********************************


### Property: foaf:name

smhdfgh**********************************

[issue tracker](http://wiki.foaf-project.org/w/IssueTracker)
smhdfgh**********************************


### Property: foaf:nick

smhdfgh**********************************


### Property: foaf:openid

smhdfgh**********************************

[indirect identifier](http://www.w3.org/TR/webarch/#indirect-identification)
smhdfgh**********************************

[OpenID](http://openid.net/specs/openid-authentication-1_1.html)
smhdfgh**********************************

[delegation model](http://openid.net/specs/openid-authentication-1_1.html#delegating_authentication)
smhdfgh**********************************

[technique](http://xmlns.com/foaf/spec/#sec-autodesc)
smhdfgh**********************************


### Property: foaf:pastProject

smhdfgh**********************************


### Property: foaf:phone

smhdfgh**********************************


### Property: foaf:plan

smhdfgh**********************************

[History of the 
Finger Protocol](http://www.rajivshah.com/Case_Studies/Finger/Finger.htm)
smhdfgh**********************************


### Property: foaf:publications

smhdfgh**********************************


### Property: foaf:schoolHomepage

smhdfgh**********************************


### Property: foaf:skypeID

smhdfgh**********************************


### Property: foaf:thumbnail

smhdfgh**********************************


### Property: foaf:tipjar

smhdfgh**********************************

[discussions](http://rdfweb.org/mt/foaflog/archives/2004/02/12/20.07.32/)
smhdfgh**********************************

[PayPal](http://www.paypal.com/)
smhdfgh**********************************


### Property: foaf:title

smhdfgh**********************************

[FOAF Issue Tracker](http://wiki.foaf-project.org/w/IssueTracker)
smhdfgh**********************************


### Property: foaf:topic

smhdfgh**********************************


### Property: foaf:topic_interest

smhdfgh**********************************


### Property: foaf:workInfoHomepage

smhdfgh**********************************


### Property: foaf:workplaceHomepage

smhdfgh**********************************


### Property: foaf:yahooChatID

smhdfgh**********************************

[Yahoo! Chat](http://chat.yahoo.com/)
smhdfgh**********************************

[Yahoo! Groups](http://www.yahoogroups.com/)
smhdfgh**********************************


### Property: foaf:age

smhdfgh**********************************


### Property: foaf:birthday

smhdfgh**********************************

[BirthdayIssue](http://wiki.foaf-project.org/w/BirthdayIssue)
smhdfgh**********************************


### Property: foaf:membershipClass

smhdfgh**********************************


### Property: foaf:sha1

smhdfgh**********************************


### Property: foaf:status

smhdfgh**********************************


### Property: foaf:dnaChecksum

smhdfgh**********************************


### Property: foaf:family_name

smhdfgh**********************************


### Property: foaf:fundedBy

smhdfgh**********************************


### Property: foaf:geekcode

smhdfgh**********************************

[Wikipedia entry](http://en.wikipedia.org/wiki/Geek_Code)
smhdfgh**********************************


### Property: foaf:givenname

smhdfgh**********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
smhdfgh**********************************


### Property: foaf:holdsAccount

smhdfgh**********************************


### Property: foaf:surname

smhdfgh**********************************

[issue 
tracker](http://wiki.foaf-project.org/w/IssueTracker)
smhdfgh**********************************


### Property: foaf:theme

smhdfgh**********************************


## External Vocabulary References

smhdfgh**********************************


### Status Vocabulary

smhdfgh**********************************

[SemWeb Vocab Status Ontology](http://www.w3.org/2003/06/sw-vocab-status/note)
smhdfgh**********************************


### W3C Basic Geo (WGS84 lat/long) Vocabulary

smhdfgh**********************************

[W3CBasic Geo Vocabulary](http://www.w3.org/2003/01/geo/)
smhdfgh**********************************


### RDF Vocabulary Description - core concepts

smhdfgh**********************************

[W3C's site](http://www.w3.org/2001/sw/)
smhdfgh**********************************

[more background on URIs](http://www.w3.org/TR/webarch/#identification)
smhdfgh**********************************

[linked data](http://www.w3.org/DesignIssues/LinkedData)
smhdfgh**********************************

[SKOS](http://www.w3.org/2004/02/skos/)
smhdfgh**********************************


### Dublin Core terms

smhdfgh**********************************

[Dublin Core terms](http://dublincore.org/documents/dcmi-terms/)
smhdfgh**********************************

[dct:Agent](http://dublincore.org/documents/dcmi-terms/#classes-Agent)
smhdfgh**********************************

[dct:creator](http://dublincore.org/documents/dcmi-terms/#terms-creator)
smhdfgh**********************************


### Wordnet terms

smhdfgh**********************************

[recent](http://www.w3.org/TR/wordnet-rdf/)
smhdfgh**********************************


### SIOC terms

smhdfgh**********************************

[SIOC](http://rdfs.org/sioc/ns#)
smhdfgh**********************************

[SIOC](http://www.sioc-project.org/)
smhdfgh**********************************


### Acknowledgments

smhdfgh**********************************

[rdfweb-dev](http://rdfweb.org/pipermail/rdfweb-dev/)
smhdfgh**********************************

[#foaf](http://rdfweb.org/irc/)
smhdfgh**********************************

[FoafExplorer](http://xml.mfd-consult.dk/foaf/explorer/)
smhdfgh**********************************

[Web View](http://eikeon.com/foaf/)
smhdfgh**********************************

[foaf-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)
smhdfgh**********************************

[Ecademy](http://www.ecademy.com/)
smhdfgh**********************************

[TypePad](http://www.typepad.com/)
smhdfgh**********************************

[many](http://conferences.oreillynet.com/cs/et2003/view/e_sess/3633)
smhdfgh**********************************

[explaining](http://hackdiary.com/)
smhdfgh**********************************

[in Japanese](http://kanzaki.com/docs/sw/foaf.html)
smhdfgh**********************************

[Spanish](http://f14web.com.ar/inkel/2003/01/27/foaf.html)
smhdfgh**********************************

[Chris Schmidt](http://crschmidt.net/)
smhdfgh**********************************

[spec generation](http://xmlns.com/foaf/0.1/specgen.py)
smhdfgh**********************************

[cool hacks](http://crschmidt.net/semweb/)
smhdfgh**********************************

[FOAF Logo](http://iandavis.com/2006/foaf-icons/)
smhdfgh**********************************

[years ago](http://www.w3.org/History/1989/proposal.html)
smhdfgh**********************************


## Recent Changes

smhdfgh**********************************


### Changes in version 0.99 (2014-01-14)

smhdfgh**********************************

[schema.org](http://schema.org/)
smhdfgh**********************************

[Person](http://schema.org/Person)
smhdfgh**********************************

[ImageObject](http://schema.org/ImageObject)
smhdfgh**********************************

[CreativeWork](http://schema.org/CreativeWork)
smhdfgh**********************************


### 2010-08-09

smhdfgh**********************************

[Bio vocabulary](http://vocab.org/bio/0.1/.html)
smhdfgh**********************************


### Changes from version 0.97 and 0.96

smhdfgh**********************************

[0.97](http://xmlns.com/foaf/spec/20100101.html)
smhdfgh**********************************

[0.96](http://xmlns.com/foaf/spec/20091215.html)
smhdfgh**********************************

[Portable Contacts](http://portablecontacts.net/)
smhdfgh**********************************


### 2009-12-15

smhdfgh**********************************


### 2007-11-02

smhdfgh**********************************


### 2007-05-24

smhdfgh**********************************

[Main page](https://en.wikipedia.org/wiki/Main_Page)
smhdfgh**********************************

[Contents](https://en.wikipedia.org/wiki/Wikipedia:Contents)
smhdfgh**********************************

[Current events](https://en.wikipedia.org/wiki/Portal:Current_events)
smhdfgh**********************************

[Random article](https://en.wikipedia.org/wiki/Special:Random)
smhdfgh**********************************

[About Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:About)
smhdfgh**********************************

[Contact us](https://en.wikipedia.org/wiki/Wikipedia:Contact_us)
smhdfgh**********************************

[Donate](https://donate.wikimedia.org/wiki/Special:FundraiserRedirector?utm_source=donate&utm_medium=sidebar&utm_campaign=C13_en.wikipedia.org&uselang=en)
smhdfgh**********************************

[Help](https://en.wikipedia.org/wiki/Help:Contents)
smhdfgh**********************************

[Learn to edit](https://en.wikipedia.org/wiki/Help:Introduction)
smhdfgh**********************************

[Community portal](https://en.wikipedia.org/wiki/Wikipedia:Community_portal)
smhdfgh**********************************

[Recent changes](https://en.wikipedia.org/wiki/Special:RecentChanges)
smhdfgh**********************************

[Upload file](https://en.wikipedia.org/wiki/Wikipedia:File_upload_wizard)
smhdfgh**********************************

[
	
	
		
		
	
](https://en.wikipedia.org/wiki/Main_Page)
smhdfgh**********************************

[

Search
	](https://en.wikipedia.org/wiki/Special:Search)
smhdfgh**********************************

[Create account](https://en.wikipedia.org/w/index.php?title=Special:CreateAccount&returnto=FOAF)
smhdfgh**********************************

[Log in](https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=FOAF)
smhdfgh**********************************

[ Create account](https://en.wikipedia.org/w/index.php?title=Special:CreateAccount&returnto=FOAF)
smhdfgh**********************************

[ Log in](https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=FOAF)
smhdfgh**********************************

[learn more](https://en.wikipedia.org/wiki/Help:Introduction)
smhdfgh**********************************

[Contributions](https://en.wikipedia.org/wiki/Special:MyContributions)
smhdfgh**********************************

[Talk](https://en.wikipedia.org/wiki/Special:MyTalk)
smhdfgh**********************************


## Contents

smhdfgh**********************************


# FOAF

smhdfgh**********************************

[Català](https://ca.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[Deutsch](https://de.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[Español](https://es.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[فارسی](https://fa.wikipedia.org/wiki/%D8%A7%D9%81%E2%80%8C%D8%A7%D9%88%D8%A7%DB%8C%E2%80%8C%D8%A7%D9%81_(%D9%87%D8%B3%D8%AA%DB%8C%E2%80%8C%D8%B4%D9%86%D8%A7%D8%B3%DB%8C))
smhdfgh**********************************

[Français](https://fr.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[Italiano](https://it.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[Latviešu](https://lv.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[Nederlands](https://nl.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[日本語](https://ja.wikipedia.org/wiki/Friend_of_a_Friend)
smhdfgh**********************************

[Norsk bokmål](https://no.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[Polski](https://pl.wikipedia.org/wiki/FOAF_(format))
smhdfgh**********************************

[Português](https://pt.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[Русский](https://ru.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[Українська](https://uk.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[Edit links](https://www.wikidata.org/wiki/Special:EntityPage/Q1389366#sitelinks-wikipedia)
smhdfgh**********************************

[Article](https://en.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[Talk](https://en.wikipedia.org/wiki/Talk:FOAF)
smhdfgh**********************************

[Read](https://en.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[Edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit)
smhdfgh**********************************

[View history](https://en.wikipedia.org/w/index.php?title=FOAF&action=history)
smhdfgh**********************************

[Read](https://en.wikipedia.org/wiki/FOAF)
smhdfgh**********************************

[Edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit)
smhdfgh**********************************

[View history](https://en.wikipedia.org/w/index.php?title=FOAF&action=history)
smhdfgh**********************************

[What links here](https://en.wikipedia.org/wiki/Special:WhatLinksHere/FOAF)
smhdfgh**********************************

[Related changes](https://en.wikipedia.org/wiki/Special:RecentChangesLinked/FOAF)
smhdfgh**********************************

[Upload file](https://en.wikipedia.org/wiki/Wikipedia:File_Upload_Wizard)
smhdfgh**********************************

[Special pages](https://en.wikipedia.org/wiki/Special:SpecialPages)
smhdfgh**********************************

[Permanent link](https://en.wikipedia.org/w/index.php?title=FOAF&oldid=1165941964)
smhdfgh**********************************

[Page information](https://en.wikipedia.org/w/index.php?title=FOAF&action=info)
smhdfgh**********************************

[Cite this page](https://en.wikipedia.org/w/index.php?title=Special:CiteThisPage&page=FOAF&id=1165941964&wpFormIdentifier=titleform)
smhdfgh**********************************

[Get shortened URL](https://en.wikipedia.org/w/index.php?title=Special:UrlShortener&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFOAF)
smhdfgh**********************************

[Download QR code](https://en.wikipedia.org/w/index.php?title=Special:QrCode&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFOAF)
smhdfgh**********************************

[Wikidata item](https://www.wikidata.org/wiki/Special:EntityPage/Q1389366)
smhdfgh**********************************

[Download as PDF](https://en.wikipedia.org/w/index.php?title=Special:DownloadAsPdf&page=FOAF&action=show-download-screen)
smhdfgh**********************************

[Printable version](https://en.wikipedia.org/w/index.php?title=FOAF&printable=yes)
smhdfgh**********************************

[Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:FOAF)
smhdfgh**********************************

[friend of a friend](https://en.wikipedia.org/wiki/Friend_of_a_friend)
smhdfgh**********************************

[Friend of a Friend (disambiguation)](https://en.wikipedia.org/wiki/Friend_of_a_Friend_(disambiguation))
smhdfgh**********************************

[](https://en.wikipedia.org/wiki/File:FoafLogo.svg)
smhdfgh**********************************

[RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework)
smhdfgh**********************************

[OWL](https://en.wikipedia.org/wiki/Web_Ontology_Language)
smhdfgh**********************************

[Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web)
smhdfgh**********************************

[CC BY 1.0](https://en.wikipedia.org/wiki/Creative_Commons_license)
smhdfgh**********************************

[xmlns.com/foaf/spec/](http://xmlns.com/foaf/spec/)
smhdfgh**********************************

[friend of a friend](https://en.wikipedia.org/wiki/Friend_of_a_friend)
smhdfgh**********************************

[machine-readable](https://en.wikipedia.org/wiki/Machine-readable_data)
smhdfgh**********************************

[ontology](https://en.wikipedia.org/wiki/Ontology_(information_science))
smhdfgh**********************************

[persons](https://en.wikipedia.org/wiki/Person)
smhdfgh**********************************

[social networks](https://en.wikipedia.org/wiki/Social_networks)
smhdfgh**********************************

[Resource Description Framework](https://en.wikipedia.org/wiki/Resource_Description_Framework)
smhdfgh**********************************

[Web Ontology Language](https://en.wikipedia.org/wiki/Web_Ontology_Language)
smhdfgh**********************************

[e-mail addresses](https://en.wikipedia.org/wiki/E-mail_address)
smhdfgh**********************************

[telephone number](https://en.wikipedia.org/wiki/Telephone_number)
smhdfgh**********************************

[Facebook](https://en.wikipedia.org/wiki/Facebook)
smhdfgh**********************************

[Jabber ID](https://en.wikipedia.org/wiki/Extensible_Messaging_and_Presence_Protocol)
smhdfgh**********************************

[URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)
smhdfgh**********************************

[Social Semantic Web](https://en.wikipedia.org/wiki/Social_Semantic_Web)
smhdfgh**********************************

[citation needed](https://en.wikipedia.org/wiki/Wikipedia:Citation_needed)
smhdfgh**********************************

[RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework)
smhdfgh**********************************

[social web](https://en.wikipedia.org/wiki/Social_web)
smhdfgh**********************************

[clarification needed](https://en.wikipedia.org/wiki/Wikipedia:Please_clarify)
smhdfgh**********************************

[Tim Berners-Lee](https://en.wikipedia.org/wiki/Tim_Berners-Lee)
smhdfgh**********************************

[semantic web](https://en.wikipedia.org/wiki/Semantic_web)
smhdfgh**********************************

[Giant Global Graph](https://en.wikipedia.org/wiki/Giant_Global_Graph)
smhdfgh**********************************

[Internet](https://en.wikipedia.org/wiki/Internet)
smhdfgh**********************************

[World Wide Web](https://en.wikipedia.org/wiki/World_Wide_Web)
smhdfgh**********************************


## WebID[edit]

smhdfgh**********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=1)
smhdfgh**********************************

[WebID](https://en.wikipedia.org/wiki/WebID)
smhdfgh**********************************


## Deployment[edit]

smhdfgh**********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=2)
smhdfgh**********************************

[Live Journal](https://en.wikipedia.org/wiki/Live_Journal)
smhdfgh**********************************

[DeadJournal](https://en.wikipedia.org/wiki/DeadJournal)
smhdfgh**********************************

[My Opera](https://en.wikipedia.org/wiki/My_Opera)
smhdfgh**********************************

[Identi.ca](https://en.wikipedia.org/wiki/Identi.ca)
smhdfgh**********************************

[FriendFeed](https://en.wikipedia.org/wiki/FriendFeed)
smhdfgh**********************************

[WordPress](https://en.wikipedia.org/wiki/WordPress)
smhdfgh**********************************

[TypePad](https://en.wikipedia.org/wiki/TypePad)
smhdfgh**********************************

[Yandex](https://en.wikipedia.org/wiki/Yandex)
smhdfgh**********************************

[Safari](https://en.wikipedia.org/wiki/Safari_(web_browser))
smhdfgh**********************************

[Firefox](https://en.wikipedia.org/wiki/Firefox_(web_browser))
smhdfgh**********************************

[Semantic MediaWiki](https://en.wikipedia.org/wiki/Semantic_MediaWiki)
smhdfgh**********************************

[semantic annotation](https://en.wikipedia.org/wiki/Semantic_annotation)
smhdfgh**********************************

[linked data](https://en.wikipedia.org/wiki/Linked_data)
smhdfgh**********************************

[MediaWiki](https://en.wikipedia.org/wiki/MediaWiki)
smhdfgh**********************************

[content management systems](https://en.wikipedia.org/wiki/Content_management_systems)
smhdfgh**********************************


## Example[edit]

smhdfgh**********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=3)
smhdfgh**********************************

[Turtle](https://en.wikipedia.org/wiki/Turtle_(syntax))
smhdfgh**********************************

[web resources](https://en.wikipedia.org/wiki/Web_resource)
smhdfgh**********************************


## History[edit]

smhdfgh**********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=4)
smhdfgh**********************************


### Versions[edit]

smhdfgh**********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=5)
smhdfgh**********************************

[http://xmlns.com/foaf/0.1/](http://xmlns.com/foaf/0.1/)
smhdfgh**********************************

[http://xmlns.com/foaf/0.1/](http://xmlns.com/foaf/0.1/)
smhdfgh**********************************


## See also[edit]

smhdfgh**********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=6)
smhdfgh**********************************

[Resource Description Framework](https://en.wikipedia.org/wiki/Resource_Description_Framework)
smhdfgh**********************************

[Web Ontology Language](https://en.wikipedia.org/wiki/Web_Ontology_Language)
smhdfgh**********************************

[Social web](https://en.wikipedia.org/wiki/Social_web)
smhdfgh**********************************

[Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web)
smhdfgh**********************************

[Description of a Career](https://en.wiktionary.org/wiki/DOAC)
smhdfgh**********************************

[Description of a Project](https://en.wikipedia.org/wiki/DOAP)
smhdfgh**********************************

[Semantically-Interlinked Online Communities](https://en.wikipedia.org/wiki/Semantically-Interlinked_Online_Communities)
smhdfgh**********************************

[hCard](https://en.wikipedia.org/wiki/HCard)
smhdfgh**********************************

[vCard](https://en.wikipedia.org/wiki/VCard)
smhdfgh**********************************

[XHTML Friends Network](https://en.wikipedia.org/wiki/XHTML_Friends_Network)
smhdfgh**********************************


## References[edit]

smhdfgh**********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=7)
smhdfgh**********************************

[XML Watch: Finding friends with XML and RDF](https://web.archive.org/web/20091223003446/http://www.ibm.com/developerworks/xml/library/x-foaf.html)
smhdfgh**********************************

[IBM DeveloperWorks](https://en.wikipedia.org/wiki/IBM_DeveloperWorks)
smhdfgh**********************************

[XML Watch: Support online communities with FOAF](https://web.archive.org/web/20100307223814/http://www.ibm.com/developerworks/xml/library/x-foaf2.html)
smhdfgh**********************************

[IBM DeveloperWorks](https://en.wikipedia.org/wiki/IBM_DeveloperWorks)
smhdfgh**********************************

["Giant Global Graph"](https://web.archive.org/web/20160713021037/http://dig.csail.mit.edu/breadcrumbs/node/215)
smhdfgh**********************************

[the original](http://dig.csail.mit.edu/breadcrumbs/node/215)
smhdfgh**********************************

["LiveJournal FOAF"](https://web.archive.org/web/20100118151037/http://community.livejournal.com/ljfoaf)
smhdfgh**********************************

[the original](http://community.livejournal.com/ljfoaf)
smhdfgh**********************************

["Known FOAF data providers"](https://web.archive.org/web/20100226072731/http://wiki.foaf-project.org/w/DataSources)
smhdfgh**********************************

[the original](http://wiki.foaf-project.org/w/DataSources)
smhdfgh**********************************

["press release on the social networking support"](http://company.yandex.com/press_center/press_releases/2008/2008-08-15.xml)
smhdfgh**********************************

["FOAF Support in Safari RSS"](http://ejohn.org/blog/foaf-support-in-safari-rss/)
smhdfgh**********************************

["Semantic Radar plugin for the Firefox browser"](https://web.archive.org/web/20140108014347/https://addons.mozilla.org/en-US/firefox/addon/semantic-radar/)
smhdfgh**********************************

[the original](https://addons.mozilla.org/en-US/firefox/addon/semantic-radar/)
smhdfgh**********************************

["FOAF support module for Perl"](https://metacpan.org/pod/XML::FOAF)
smhdfgh**********************************

["FOAF+SSL authentication support for Perl"](https://metacpan.org/pod/Web::ID)
smhdfgh**********************************

[http://drupal.org/project/foaf](https://drupal.org/project/foaf)
smhdfgh**********************************

[Drupal](https://en.wikipedia.org/wiki/Drupal)
smhdfgh**********************************

["FOAF Vocabulary Specification 0.99"](http://xmlns.com/foaf/spec/20140114.html)
smhdfgh**********************************

[Archived](https://web.archive.org/web/20220303180551/http://xmlns.com/foaf/spec/20140114.html)
smhdfgh**********************************


## External links[edit]

smhdfgh**********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=8)
smhdfgh**********************************

[Official website](http://www.foaf-project.org)
smhdfgh**********************************

[Archived](https://web.archive.org/web/20211023122305/http://www.foaf-project.org/)
smhdfgh**********************************

[Wayback Machine](https://en.wikipedia.org/wiki/Wayback_Machine)
smhdfgh**********************************

[FOAF dataset](http://ebiquity.umbc.edu/resource/html/id/82/)
smhdfgh**********************************

[FOAF-search - a search engine for FOAF data](https://web.archive.org/web/20181130195340/https://www.foaf-search.net/)
smhdfgh**********************************

[Wayback Machine](https://en.wikipedia.org/wiki/Wayback_Machine)
smhdfgh**********************************

[v](https://en.wikipedia.org/wiki/Template:Semantic_Web)
smhdfgh**********************************

[t](https://en.wikipedia.org/wiki/Template_talk:Semantic_Web)
smhdfgh**********************************

[e](https://en.wikipedia.org/wiki/Special:EditPage/Template:Semantic_Web)
smhdfgh**********************************

[Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web)
smhdfgh**********************************

[Databases](https://en.wikipedia.org/wiki/Database)
smhdfgh**********************************

[Hypertext](https://en.wikipedia.org/wiki/Hypertext)
smhdfgh**********************************

[Internet](https://en.wikipedia.org/wiki/Internet)
smhdfgh**********************************

[Ontologies](https://en.wikipedia.org/wiki/Ontology_(computer_science))
smhdfgh**********************************

[Semantics](https://en.wikipedia.org/wiki/Semantics_(computer_science))
smhdfgh**********************************

[Semantic networks](https://en.wikipedia.org/wiki/Semantic_network)
smhdfgh**********************************

[World Wide Web](https://en.wikipedia.org/wiki/World_Wide_Web)
smhdfgh**********************************

[Dataspaces](https://en.wikipedia.org/wiki/Dataspaces)
smhdfgh**********************************

[Hyperdata](https://en.wikipedia.org/wiki/Hyperdata)
smhdfgh**********************************

[Linked data](https://en.wikipedia.org/wiki/Linked_data)
smhdfgh**********************************

[Rule-based systems](https://en.wikipedia.org/wiki/Rule-based_system)
smhdfgh**********************************

[Semantic analytics](https://en.wikipedia.org/wiki/Semantic_analytics)
smhdfgh**********************************

[Semantic broker](https://en.wikipedia.org/wiki/Semantic_broker)
smhdfgh**********************************

[Semantic computing](https://en.wikipedia.org/wiki/Semantic_computing)
smhdfgh**********************************

[Semantic mapper](https://en.wikipedia.org/wiki/Semantic_mapper)
smhdfgh**********************************

[Semantic matching](https://en.wikipedia.org/wiki/Semantic_matching)
smhdfgh**********************************

[Semantic publishing](https://en.wikipedia.org/wiki/Semantic_publishing)
smhdfgh**********************************

[Semantic reasoner](https://en.wikipedia.org/wiki/Semantic_reasoner)
smhdfgh**********************************

[Semantic search](https://en.wikipedia.org/wiki/Semantic_search)
smhdfgh**********************************

[Semantic service-oriented architecture](https://en.wikipedia.org/wiki/Semantic_service-oriented_architecture)
smhdfgh**********************************

[Semantic wiki](https://en.wikipedia.org/wiki/Semantic_wiki)
smhdfgh**********************************

[Solid](https://en.wikipedia.org/wiki/Solid_(web_decentralization_project))
smhdfgh**********************************

[Collective intelligence](https://en.wikipedia.org/wiki/Collective_intelligence)
smhdfgh**********************************

[Description logic](https://en.wikipedia.org/wiki/Description_logic)
smhdfgh**********************************

[Folksonomy](https://en.wikipedia.org/wiki/Folksonomy)
smhdfgh**********************************

[Geotagging](https://en.wikipedia.org/wiki/Geotagging)
smhdfgh**********************************

[Information architecture](https://en.wikipedia.org/wiki/Information_architecture)
smhdfgh**********************************

[Knowledge extraction](https://en.wikipedia.org/wiki/Knowledge_extraction)
smhdfgh**********************************

[Knowledge management](https://en.wikipedia.org/wiki/Knowledge_management)
smhdfgh**********************************

[Knowledge representation and reasoning](https://en.wikipedia.org/wiki/Knowledge_representation_and_reasoning)
smhdfgh**********************************

[Library 2.0](https://en.wikipedia.org/wiki/Library_2.0)
smhdfgh**********************************

[Digital library](https://en.wikipedia.org/wiki/Digital_library)
smhdfgh**********************************

[Digital humanities](https://en.wikipedia.org/wiki/Digital_humanities)
smhdfgh**********************************

[Metadata](https://en.wikipedia.org/wiki/Metadata)
smhdfgh**********************************

[References](https://en.wikipedia.org/wiki/Reference_(computer_science))
smhdfgh**********************************

[Topic map](https://en.wikipedia.org/wiki/Topic_map)
smhdfgh**********************************

[Web 2.0](https://en.wikipedia.org/wiki/Web_2.0)
smhdfgh**********************************

[Web engineering](https://en.wikipedia.org/wiki/Web_engineering)
smhdfgh**********************************

[Web Science Trust](https://en.wikipedia.org/wiki/Web_Science_Trust)
smhdfgh**********************************

[HTTP](https://en.wikipedia.org/wiki/HTTP)
smhdfgh**********************************

[IRI](https://en.wikipedia.org/wiki/Internationalized_Resource_Identifier)
smhdfgh**********************************

[URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)
smhdfgh**********************************

[RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework)
smhdfgh**********************************

[triples](https://en.wikipedia.org/wiki/Semantic_triple)
smhdfgh**********************************

[RDF/XML](https://en.wikipedia.org/wiki/RDF/XML)
smhdfgh**********************************

[JSON-LD](https://en.wikipedia.org/wiki/JSON-LD)
smhdfgh**********************************

[Turtle](https://en.wikipedia.org/wiki/Turtle_(syntax))
smhdfgh**********************************

[TriG](https://en.wikipedia.org/wiki/TriG_(syntax))
smhdfgh**********************************

[Notation3](https://en.wikipedia.org/wiki/Notation3)
smhdfgh**********************************

[N-Triples](https://en.wikipedia.org/wiki/N-Triples)
smhdfgh**********************************

[TriX](https://en.wikipedia.org/wiki/TriX_(serialization_format))
smhdfgh**********************************

[RRID](https://en.wikipedia.org/wiki/Research_Resource_Identifier)
smhdfgh**********************************

[SPARQL](https://en.wikipedia.org/wiki/SPARQL)
smhdfgh**********************************

[XML](https://en.wikipedia.org/wiki/XML)
smhdfgh**********************************

[Semantic HTML](https://en.wikipedia.org/wiki/Semantic_HTML)
smhdfgh**********************************

[Common Logic](https://en.wikipedia.org/wiki/Common_Logic)
smhdfgh**********************************

[OWL](https://en.wikipedia.org/wiki/Web_Ontology_Language)
smhdfgh**********************************

[RDFS](https://en.wikipedia.org/wiki/RDF_Schema)
smhdfgh**********************************

[Rule Interchange Format](https://en.wikipedia.org/wiki/Rule_Interchange_Format)
smhdfgh**********************************

[Semantic Web Rule Language](https://en.wikipedia.org/wiki/Semantic_Web_Rule_Language)
smhdfgh**********************************

[ALPS](https://en.wikipedia.org/w/index.php?title=Application-Level_Profile_Semantics_(ALPS)&action=edit&redlink=1)
smhdfgh**********************************

[SHACL](https://en.wikipedia.org/wiki/SHACL)
smhdfgh**********************************

[eRDF](https://en.wikipedia.org/wiki/Embedded_RDF)
smhdfgh**********************************

[GRDDL](https://en.wikipedia.org/wiki/GRDDL)
smhdfgh**********************************

[Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML))
smhdfgh**********************************

[Microformats](https://en.wikipedia.org/wiki/Microformat)
smhdfgh**********************************

[RDFa](https://en.wikipedia.org/wiki/RDFa)
smhdfgh**********************************

[SAWSDL](https://en.wikipedia.org/wiki/SAWSDL)
smhdfgh**********************************

[Facebook Platform](https://en.wikipedia.org/wiki/Facebook_Platform)
smhdfgh**********************************

[DOAP](https://en.wikipedia.org/wiki/DOAP)
smhdfgh**********************************

[Dublin Core](https://en.wikipedia.org/wiki/Dublin_Core)
smhdfgh**********************************

[Schema.org](https://en.wikipedia.org/wiki/Schema.org)
smhdfgh**********************************

[SIOC](https://en.wikipedia.org/wiki/Semantically_Interlinked_Online_Communities)
smhdfgh**********************************

[SKOS](https://en.wikipedia.org/wiki/Simple_Knowledge_Organization_System)
smhdfgh**********************************

[hAtom](https://en.wikipedia.org/wiki/HAtom)
smhdfgh**********************************

[hCalendar](https://en.wikipedia.org/wiki/HCalendar)
smhdfgh**********************************

[hCard](https://en.wikipedia.org/wiki/HCard)
smhdfgh**********************************

[hProduct](https://en.wikipedia.org/wiki/HProduct)
smhdfgh**********************************

[hRecipe](https://en.wikipedia.org/wiki/HRecipe)
smhdfgh**********************************

[hReview](https://en.wikipedia.org/wiki/HReview)
smhdfgh**********************************

[v](https://en.wikipedia.org/wiki/Template:Social_networking)
smhdfgh**********************************

[t](https://en.wikipedia.org/wiki/Template_talk:Social_networking)
smhdfgh**********************************

[e](https://en.wikipedia.org/wiki/Special:EditPage/Template:Social_networking)
smhdfgh**********************************

[Social networks](https://en.wikipedia.org/wiki/Social_network)
smhdfgh**********************************

[social media](https://en.wikipedia.org/wiki/Social_media)
smhdfgh**********************************

[Personal](https://en.wikipedia.org/wiki/Personal_network)
smhdfgh**********************************

[Professional](https://en.wikipedia.org/wiki/Professional_network_service)
smhdfgh**********************************

[Sexual](https://en.wikipedia.org/wiki/Sexual_network)
smhdfgh**********************************

[Value](https://en.wikipedia.org/wiki/Value_network)
smhdfgh**********************************

[Clique](https://en.wikipedia.org/wiki/Clique)
smhdfgh**********************************

[Adolescent](https://en.wikipedia.org/wiki/Adolescent_clique)
smhdfgh**********************************

[Corporate social media](https://en.wikipedia.org/wiki/Corporate_social_media)
smhdfgh**********************************

[Distributed social network](https://en.wikipedia.org/wiki/Distributed_social_network)
smhdfgh**********************************

[list](https://en.wikipedia.org/wiki/Comparison_of_software_and_protocols_for_distributed_social_networking)
smhdfgh**********************************

[Enterprise social networking](https://en.wikipedia.org/wiki/Enterprise_social_networking)
smhdfgh**********************************

[Enterprise social software](https://en.wikipedia.org/wiki/Enterprise_social_software)
smhdfgh**********************************

[Mobile social network](https://en.wikipedia.org/wiki/Mobile_social_network)
smhdfgh**********************************

[Personal knowledge networking](https://en.wikipedia.org/wiki/Personal_knowledge_networking)
smhdfgh**********************************

[Services](https://en.wikipedia.org/wiki/Social_networking_service)
smhdfgh**********************************

[List of social networking services](https://en.wikipedia.org/wiki/List_of_social_networking_services)
smhdfgh**********************************

[List of virtual communities with more than 1 million users](https://en.wikipedia.org/wiki/List_of_virtual_communities_with_more_than_1_million_users)
smhdfgh**********************************

[Ambient awareness](https://en.wikipedia.org/wiki/Ambient_awareness)
smhdfgh**********************************

[Assortative mixing](https://en.wikipedia.org/wiki/Assortative_mixing)
smhdfgh**********************************

[Attention inequality](https://en.wikipedia.org/wiki/Attention_inequality)
smhdfgh**********************************

[Interpersonal bridge](https://en.wikipedia.org/wiki/Bridge_(interpersonal))
smhdfgh**********************************

[Organizational network analysis](https://en.wikipedia.org/wiki/Organizational_network_analysis)
smhdfgh**********************************

[Small-world experiment](https://en.wikipedia.org/wiki/Small-world_experiment)
smhdfgh**********************************

[Social aspects of television](https://en.wikipedia.org/wiki/Social_aspects_of_television)
smhdfgh**********************************

[Social capital](https://en.wikipedia.org/wiki/Social_capital)
smhdfgh**********************************

[Social data revolution](https://en.wikipedia.org/wiki/Social_data_revolution)
smhdfgh**********************************

[Social exchange theory](https://en.wikipedia.org/wiki/Social_exchange_theory)
smhdfgh**********************************

[Social identity theory](https://en.wikipedia.org/wiki/Social_identity_theory)
smhdfgh**********************************

[Social media and psychology](https://en.wikipedia.org/wiki/Social_media_and_psychology)
smhdfgh**********************************

[Social media intelligence](https://en.wikipedia.org/wiki/Social_media_intelligence)
smhdfgh**********************************

[Social media mining](https://en.wikipedia.org/wiki/Social_media_mining)
smhdfgh**********************************

[Social media optimization](https://en.wikipedia.org/wiki/Social_media_optimization)
smhdfgh**********************************

[Social network analysis](https://en.wikipedia.org/wiki/Social_network_analysis)
smhdfgh**********************************

[Social web](https://en.wikipedia.org/wiki/Social_web)
smhdfgh**********************************

[Structural endogamy](https://en.wikipedia.org/wiki/Structural_endogamy)
smhdfgh**********************************

[Virtual collective consciousness](https://en.wikipedia.org/wiki/Virtual_collective_consciousness)
smhdfgh**********************************

[Account verification](https://en.wikipedia.org/wiki/Account_verification)
smhdfgh**********************************

[Aggregation](https://en.wikipedia.org/wiki/Social_network_aggregation)
smhdfgh**********************************

[Change detection](https://en.wikipedia.org/wiki/Social_network_change_detection)
smhdfgh**********************************

[Blockmodeling](https://en.wikipedia.org/wiki/Blockmodeling)
smhdfgh**********************************

[Collaboration graph](https://en.wikipedia.org/wiki/Collaboration_graph)
smhdfgh**********************************

[Collaborative consumption](https://en.wikipedia.org/wiki/Collaborative_consumption)
smhdfgh**********************************

[Giant Global Graph](https://en.wikipedia.org/wiki/Giant_Global_Graph)
smhdfgh**********************************

[Lateral communication](https://en.wikipedia.org/wiki/Lateral_communication)
smhdfgh**********************************

[Reputation system](https://en.wikipedia.org/wiki/Reputation_system)
smhdfgh**********************************

[Social bot](https://en.wikipedia.org/wiki/Social_bot)
smhdfgh**********************************

[Social graph](https://en.wikipedia.org/wiki/Social_graph)
smhdfgh**********************************

[Social media analytics](https://en.wikipedia.org/wiki/Social_media_analytics)
smhdfgh**********************************

[Social network analysis software](https://en.wikipedia.org/wiki/Social_network_analysis_software)
smhdfgh**********************************

[Social networking potential](https://en.wikipedia.org/wiki/Social_networking_potential)
smhdfgh**********************************

[Social television](https://en.wikipedia.org/wiki/Social_television)
smhdfgh**********************************

[Structural cohesion](https://en.wikipedia.org/wiki/Structural_cohesion)
smhdfgh**********************************

[Affinity fraud](https://en.wikipedia.org/wiki/Affinity_fraud)
smhdfgh**********************************

[Attention economy](https://en.wikipedia.org/wiki/Attention_economy)
smhdfgh**********************************

[Collaborative finance](https://en.wikipedia.org/wiki/Collaborative_finance)
smhdfgh**********************************

[Creator economy](https://en.wikipedia.org/wiki/Creator_economy)
smhdfgh**********************************

[Influencer marketing](https://en.wikipedia.org/wiki/Influencer_marketing)
smhdfgh**********************************

[Narrowcasting](https://en.wikipedia.org/wiki/Narrowcasting)
smhdfgh**********************************

[Sharing economy](https://en.wikipedia.org/wiki/Sharing_economy)
smhdfgh**********************************

[Social commerce](https://en.wikipedia.org/wiki/Social_commerce)
smhdfgh**********************************

[Social sorting](https://en.wikipedia.org/wiki/Social_sorting)
smhdfgh**********************************

[Viral marketing](https://en.wikipedia.org/wiki/Viral_marketing)
smhdfgh**********************************

[Algorithmic radicalization](https://en.wikipedia.org/wiki/Algorithmic_radicalization)
smhdfgh**********************************

[Community recognition](https://en.wikipedia.org/wiki/Community_recognition)
smhdfgh**********************************

[Complex contagion](https://en.wikipedia.org/wiki/Complex_contagion)
smhdfgh**********************************

[Computer addiction](https://en.wikipedia.org/wiki/Computer_addiction)
smhdfgh**********************************

[Consequential strangers](https://en.wikipedia.org/wiki/Consequential_strangers)
smhdfgh**********************************

[Friend of a friend](https://en.wikipedia.org/wiki/Friend_of_a_friend)
smhdfgh**********************************

[Friending and following](https://en.wikipedia.org/wiki/Friending_and_following)
smhdfgh**********************************

[Friendship paradox](https://en.wikipedia.org/wiki/Friendship_paradox)
smhdfgh**********************************

[Influence-for-hire](https://en.wikipedia.org/wiki/Influence-for-hire)
smhdfgh**********************************

[Internet addiction](https://en.wikipedia.org/wiki/Internet_addiction)
smhdfgh**********************************

[Information overload](https://en.wikipedia.org/wiki/Information_overload)
smhdfgh**********************************

[Overchoice](https://en.wikipedia.org/wiki/Overchoice)
smhdfgh**********************************

[Six degrees of separation](https://en.wikipedia.org/wiki/Six_degrees_of_separation)
smhdfgh**********************************

[Social media addiction](https://en.wikipedia.org/wiki/Social_media_addiction)
smhdfgh**********************************

[Social media and suicide](https://en.wikipedia.org/wiki/Social_media_and_suicide)
smhdfgh**********************************

[Social invisibility](https://en.wikipedia.org/wiki/Social_invisibility)
smhdfgh**********************************

[Social network game](https://en.wikipedia.org/wiki/Social_network_game)
smhdfgh**********************************

[Suicide and the Internet](https://en.wikipedia.org/wiki/Suicide_and_the_Internet)
smhdfgh**********************************

[Tribe](https://en.wikipedia.org/wiki/Tribe_(internet))
smhdfgh**********************************

[Viral phenomenon](https://en.wikipedia.org/wiki/Viral_phenomenon)
smhdfgh**********************************

[Friendship recession](https://en.wikipedia.org/wiki/Friendship_recession)
smhdfgh**********************************

[Peer pressure](https://en.wikipedia.org/wiki/Peer_pressure)
smhdfgh**********************************

[Researchers](https://en.wikipedia.org/wiki/List_of_social_network_researchers)
smhdfgh**********************************

[User profile](https://en.wikipedia.org/wiki/User_profile)
smhdfgh**********************************

[Online identity](https://en.wikipedia.org/wiki/Online_identity)
smhdfgh**********************************

[Persona](https://en.wikipedia.org/wiki/Persona_(user_experience))
smhdfgh**********************************

[Social profiling](https://en.wikipedia.org/wiki/Social_profiling)
smhdfgh**********************************

[Viral messages](https://en.wikipedia.org/wiki/Viral_messages)
smhdfgh**********************************

[Virtual community](https://en.wikipedia.org/wiki/Virtual_community)
smhdfgh**********************************

[https://en.wikipedia.org/w/index.php?title=FOAF&oldid=1165941964](https://en.wikipedia.org/w/index.php?title=FOAF&oldid=1165941964)
smhdfgh**********************************

[Categories](https://en.wikipedia.org/wiki/Help:Category)
smhdfgh**********************************

[Ontology (information science)](https://en.wikipedia.org/wiki/Category:Ontology_(information_science))
smhdfgh**********************************

[Semantic Web](https://en.wikipedia.org/wiki/Category:Semantic_Web)
smhdfgh**********************************

[2000 software](https://en.wikipedia.org/wiki/Category:2000_software)
smhdfgh**********************************

[Articles with short description](https://en.wikipedia.org/wiki/Category:Articles_with_short_description)
smhdfgh**********************************

[Short description matches Wikidata](https://en.wikipedia.org/wiki/Category:Short_description_matches_Wikidata)
smhdfgh**********************************

[All articles with unsourced statements](https://en.wikipedia.org/wiki/Category:All_articles_with_unsourced_statements)
smhdfgh**********************************

[Articles with unsourced statements from April 2017](https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_April_2017)
smhdfgh**********************************

[Wikipedia articles needing clarification from April 2017](https://en.wikipedia.org/wiki/Category:Wikipedia_articles_needing_clarification_from_April_2017)
smhdfgh**********************************

[Webarchive template wayback links](https://en.wikipedia.org/wiki/Category:Webarchive_template_wayback_links)
smhdfgh**********************************

[Creative Commons Attribution-ShareAlike License 4.0](https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License)
smhdfgh**********************************

[](https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License)
smhdfgh**********************************

[Terms of Use](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Terms_of_Use)
smhdfgh**********************************

[Privacy Policy](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy)
smhdfgh**********************************

[Wikimedia Foundation, Inc.](https://www.wikimediafoundation.org/)
smhdfgh**********************************

[Privacy policy](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy)
smhdfgh**********************************

[About Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:About)
smhdfgh**********************************

[Disclaimers](https://en.wikipedia.org/wiki/Wikipedia:General_disclaimer)
smhdfgh**********************************

[Contact Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Contact_us)
smhdfgh**********************************

[Code of Conduct](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Universal_Code_of_Conduct)
smhdfgh**********************************

[Developers](https://developer.wikimedia.org)
smhdfgh**********************************

[Statistics](https://stats.wikimedia.org/#/en.wikipedia.org)
smhdfgh**********************************

[Cookie statement](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Cookie_statement)
smhdfgh**********************************

[Mobile view](https://en.m.wikipedia.org/w/index.php?title=FOAF&mobileaction=toggle_view_mobile)
smhdfgh**********************************

[](https://wikimediafoundation.org/)
smhdfgh**********************************

[](https://www.mediawiki.org/)
