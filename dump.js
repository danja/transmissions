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
f = /home/danny/HKMS/treadmill/src/transmissions/link-lister/data/starter-links.md
Line = [[[https://en.wikipedia.org/wiki/FOAF]]]
HG GETTING*****************
Line = [[[http://xmlns.com/foaf/spec/]]]
HG GETTING*****************
HG DONE*****************
LF DONE*****************
emitLocal === ~~done~~
SMDATA*********************************
~~done~~
SM  DONE**********************************

Filewriter.targetFile = links.md
Filewriter.targetFile = links.html
emitLocal === 
[Main page](https://en.wikipedia.org/wiki/Main_Page)
SMDATA*********************************

[Main page](https://en.wikipedia.org/wiki/Main_Page)
emitLocal === 
[Contents](https://en.wikipedia.org/wiki/Wikipedia:Contents)
SMDATA*********************************

[Contents](https://en.wikipedia.org/wiki/Wikipedia:Contents)
emitLocal === 
[Current events](https://en.wikipedia.org/wiki/Portal:Current_events)
SMDATA*********************************

[Current events](https://en.wikipedia.org/wiki/Portal:Current_events)
emitLocal === 
[Random article](https://en.wikipedia.org/wiki/Special:Random)
SMDATA*********************************

[Random article](https://en.wikipedia.org/wiki/Special:Random)
emitLocal === 
[About Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:About)
SMDATA*********************************

[About Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:About)
emitLocal === 
[Contact us](https://en.wikipedia.org/wiki/Wikipedia:Contact_us)
SMDATA*********************************

[Contact us](https://en.wikipedia.org/wiki/Wikipedia:Contact_us)
emitLocal === 
[Donate](https://donate.wikimedia.org/wiki/Special:FundraiserRedirector?utm_source=donate&utm_medium=sidebar&utm_campaign=C13_en.wikipedia.org&uselang=en)
SMDATA*********************************

[Donate](https://donate.wikimedia.org/wiki/Special:FundraiserRedirector?utm_source=donate&utm_medium=sidebar&utm_campaign=C13_en.wikipedia.org&uselang=en)
emitLocal === 
[Help](https://en.wikipedia.org/wiki/Help:Contents)
SMDATA*********************************

[Help](https://en.wikipedia.org/wiki/Help:Contents)
emitLocal === 
[Learn to edit](https://en.wikipedia.org/wiki/Help:Introduction)
SMDATA*********************************

[Learn to edit](https://en.wikipedia.org/wiki/Help:Introduction)
emitLocal === 
[Community portal](https://en.wikipedia.org/wiki/Wikipedia:Community_portal)
SMDATA*********************************

[Community portal](https://en.wikipedia.org/wiki/Wikipedia:Community_portal)
emitLocal === 
[Recent changes](https://en.wikipedia.org/wiki/Special:RecentChanges)
SMDATA*********************************

[Recent changes](https://en.wikipedia.org/wiki/Special:RecentChanges)
emitLocal === 
[Upload file](https://en.wikipedia.org/wiki/Wikipedia:File_upload_wizard)
SMDATA*********************************

[Upload file](https://en.wikipedia.org/wiki/Wikipedia:File_upload_wizard)
emitLocal === 
[
	
	
		
		
	
](https://en.wikipedia.org/wiki/Main_Page)
SMDATA*********************************

[
	
	
		
		
	
](https://en.wikipedia.org/wiki/Main_Page)
emitLocal === 
[

Search
	](https://en.wikipedia.org/wiki/Special:Search)
SMDATA*********************************

[

Search
	](https://en.wikipedia.org/wiki/Special:Search)
emitLocal === 
[Create account](https://en.wikipedia.org/w/index.php?title=Special:CreateAccount&returnto=FOAF)
SMDATA*********************************

[Create account](https://en.wikipedia.org/w/index.php?title=Special:CreateAccount&returnto=FOAF)
emitLocal === 
[Log in](https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=FOAF)
SMDATA*********************************

[Log in](https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=FOAF)
emitLocal === 
[ Create account](https://en.wikipedia.org/w/index.php?title=Special:CreateAccount&returnto=FOAF)
SMDATA*********************************

[ Create account](https://en.wikipedia.org/w/index.php?title=Special:CreateAccount&returnto=FOAF)
emitLocal === 
[ Log in](https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=FOAF)
SMDATA*********************************

[ Log in](https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=FOAF)
emitLocal === 
[learn more](https://en.wikipedia.org/wiki/Help:Introduction)
SMDATA*********************************

[learn more](https://en.wikipedia.org/wiki/Help:Introduction)
emitLocal === 
[Contributions](https://en.wikipedia.org/wiki/Special:MyContributions)
SMDATA*********************************

[Contributions](https://en.wikipedia.org/wiki/Special:MyContributions)
emitLocal === 
[Talk](https://en.wikipedia.org/wiki/Special:MyTalk)
SMDATA*********************************

[Talk](https://en.wikipedia.org/wiki/Special:MyTalk)
emitLocal === 

## Contents

SMDATA*********************************


## Contents

emitLocal === 

# FOAF

SMDATA*********************************


# FOAF

emitLocal === 
[Català](https://ca.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Català](https://ca.wikipedia.org/wiki/FOAF)
emitLocal === 
[Deutsch](https://de.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Deutsch](https://de.wikipedia.org/wiki/FOAF)
emitLocal === 
[Español](https://es.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Español](https://es.wikipedia.org/wiki/FOAF)
emitLocal === 
[فارسی](https://fa.wikipedia.org/wiki/%D8%A7%D9%81%E2%80%8C%D8%A7%D9%88%D8%A7%DB%8C%E2%80%8C%D8%A7%D9%81_(%D9%87%D8%B3%D8%AA%DB%8C%E2%80%8C%D8%B4%D9%86%D8%A7%D8%B3%DB%8C))
SMDATA*********************************

[فارسی](https://fa.wikipedia.org/wiki/%D8%A7%D9%81%E2%80%8C%D8%A7%D9%88%D8%A7%DB%8C%E2%80%8C%D8%A7%D9%81_(%D9%87%D8%B3%D8%AA%DB%8C%E2%80%8C%D8%B4%D9%86%D8%A7%D8%B3%DB%8C))
emitLocal === 
[Français](https://fr.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Français](https://fr.wikipedia.org/wiki/FOAF)
emitLocal === 
[Italiano](https://it.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Italiano](https://it.wikipedia.org/wiki/FOAF)
emitLocal === 
[Latviešu](https://lv.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Latviešu](https://lv.wikipedia.org/wiki/FOAF)
emitLocal === 
[Nederlands](https://nl.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Nederlands](https://nl.wikipedia.org/wiki/FOAF)
emitLocal === 
[日本語](https://ja.wikipedia.org/wiki/Friend_of_a_Friend)
SMDATA*********************************

[日本語](https://ja.wikipedia.org/wiki/Friend_of_a_Friend)
emitLocal === 
[Norsk bokmål](https://no.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Norsk bokmål](https://no.wikipedia.org/wiki/FOAF)
emitLocal === 
[Polski](https://pl.wikipedia.org/wiki/FOAF_(format))
SMDATA*********************************

[Polski](https://pl.wikipedia.org/wiki/FOAF_(format))
emitLocal === 
[Português](https://pt.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Português](https://pt.wikipedia.org/wiki/FOAF)
emitLocal === 
[Русский](https://ru.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Русский](https://ru.wikipedia.org/wiki/FOAF)
emitLocal === 
[Українська](https://uk.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Українська](https://uk.wikipedia.org/wiki/FOAF)
emitLocal === 
[Edit links](https://www.wikidata.org/wiki/Special:EntityPage/Q1389366#sitelinks-wikipedia)
SMDATA*********************************

[Edit links](https://www.wikidata.org/wiki/Special:EntityPage/Q1389366#sitelinks-wikipedia)
emitLocal === 
[Article](https://en.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Article](https://en.wikipedia.org/wiki/FOAF)
emitLocal === 
[Talk](https://en.wikipedia.org/wiki/Talk:FOAF)
SMDATA*********************************

[Talk](https://en.wikipedia.org/wiki/Talk:FOAF)
emitLocal === 
[Read](https://en.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Read](https://en.wikipedia.org/wiki/FOAF)
emitLocal === 
[Edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit)
SMDATA*********************************

[Edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit)
emitLocal === 
[View history](https://en.wikipedia.org/w/index.php?title=FOAF&action=history)
SMDATA*********************************

[View history](https://en.wikipedia.org/w/index.php?title=FOAF&action=history)
emitLocal === 
[Read](https://en.wikipedia.org/wiki/FOAF)
SMDATA*********************************

[Read](https://en.wikipedia.org/wiki/FOAF)
emitLocal === 
[Edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit)
SMDATA*********************************

[Edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit)
emitLocal === 
[View history](https://en.wikipedia.org/w/index.php?title=FOAF&action=history)
SMDATA*********************************

[View history](https://en.wikipedia.org/w/index.php?title=FOAF&action=history)
emitLocal === 
[What links here](https://en.wikipedia.org/wiki/Special:WhatLinksHere/FOAF)
SMDATA*********************************

[What links here](https://en.wikipedia.org/wiki/Special:WhatLinksHere/FOAF)
emitLocal === 
[Related changes](https://en.wikipedia.org/wiki/Special:RecentChangesLinked/FOAF)
SMDATA*********************************

[Related changes](https://en.wikipedia.org/wiki/Special:RecentChangesLinked/FOAF)
emitLocal === 
[Upload file](https://en.wikipedia.org/wiki/Wikipedia:File_Upload_Wizard)
SMDATA*********************************

[Upload file](https://en.wikipedia.org/wiki/Wikipedia:File_Upload_Wizard)
emitLocal === 
[Special pages](https://en.wikipedia.org/wiki/Special:SpecialPages)
SMDATA*********************************

[Special pages](https://en.wikipedia.org/wiki/Special:SpecialPages)
emitLocal === 
[Permanent link](https://en.wikipedia.org/w/index.php?title=FOAF&oldid=1165941964)
SMDATA*********************************

[Permanent link](https://en.wikipedia.org/w/index.php?title=FOAF&oldid=1165941964)
emitLocal === 
[Page information](https://en.wikipedia.org/w/index.php?title=FOAF&action=info)
SMDATA*********************************

[Page information](https://en.wikipedia.org/w/index.php?title=FOAF&action=info)
emitLocal === 
[Cite this page](https://en.wikipedia.org/w/index.php?title=Special:CiteThisPage&page=FOAF&id=1165941964&wpFormIdentifier=titleform)
SMDATA*********************************

[Cite this page](https://en.wikipedia.org/w/index.php?title=Special:CiteThisPage&page=FOAF&id=1165941964&wpFormIdentifier=titleform)
emitLocal === 
[Get shortened URL](https://en.wikipedia.org/w/index.php?title=Special:UrlShortener&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFOAF)
SMDATA*********************************

[Get shortened URL](https://en.wikipedia.org/w/index.php?title=Special:UrlShortener&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFOAF)
emitLocal === 
[Download QR code](https://en.wikipedia.org/w/index.php?title=Special:QrCode&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFOAF)
SMDATA*********************************

[Download QR code](https://en.wikipedia.org/w/index.php?title=Special:QrCode&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFOAF)
emitLocal === 
[Wikidata item](https://www.wikidata.org/wiki/Special:EntityPage/Q1389366)
SMDATA*********************************

[Wikidata item](https://www.wikidata.org/wiki/Special:EntityPage/Q1389366)
emitLocal === 
[Download as PDF](https://en.wikipedia.org/w/index.php?title=Special:DownloadAsPdf&page=FOAF&action=show-download-screen)
SMDATA*********************************

[Download as PDF](https://en.wikipedia.org/w/index.php?title=Special:DownloadAsPdf&page=FOAF&action=show-download-screen)
emitLocal === 
[Printable version](https://en.wikipedia.org/w/index.php?title=FOAF&printable=yes)
SMDATA*********************************

[Printable version](https://en.wikipedia.org/w/index.php?title=FOAF&printable=yes)
emitLocal === 
[Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:FOAF)
SMDATA*********************************

[Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:FOAF)
emitLocal === 
[friend of a friend](https://en.wikipedia.org/wiki/Friend_of_a_friend)
SMDATA*********************************

[friend of a friend](https://en.wikipedia.org/wiki/Friend_of_a_friend)
emitLocal === 
[Friend of a Friend (disambiguation)](https://en.wikipedia.org/wiki/Friend_of_a_Friend_(disambiguation))
SMDATA*********************************

[Friend of a Friend (disambiguation)](https://en.wikipedia.org/wiki/Friend_of_a_Friend_(disambiguation))
emitLocal === 
[](https://en.wikipedia.org/wiki/File:FoafLogo.svg)
SMDATA*********************************

[](https://en.wikipedia.org/wiki/File:FoafLogo.svg)
emitLocal === 
[RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework)
SMDATA*********************************

[RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework)
emitLocal === 
[OWL](https://en.wikipedia.org/wiki/Web_Ontology_Language)
SMDATA*********************************

[OWL](https://en.wikipedia.org/wiki/Web_Ontology_Language)
emitLocal === 
[Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web)
SMDATA*********************************

[Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web)
emitLocal === 
[CC BY 1.0](https://en.wikipedia.org/wiki/Creative_Commons_license)
SMDATA*********************************

[CC BY 1.0](https://en.wikipedia.org/wiki/Creative_Commons_license)
emitLocal === 
[xmlns.com/foaf/spec/](http://xmlns.com/foaf/spec/)
SMDATA*********************************

[xmlns.com/foaf/spec/](http://xmlns.com/foaf/spec/)
emitLocal === 
[friend of a friend](https://en.wikipedia.org/wiki/Friend_of_a_friend)
SMDATA*********************************

[friend of a friend](https://en.wikipedia.org/wiki/Friend_of_a_friend)
emitLocal === 
[machine-readable](https://en.wikipedia.org/wiki/Machine-readable_data)
SMDATA*********************************

[machine-readable](https://en.wikipedia.org/wiki/Machine-readable_data)
emitLocal === 
[ontology](https://en.wikipedia.org/wiki/Ontology_(information_science))
SMDATA*********************************

[ontology](https://en.wikipedia.org/wiki/Ontology_(information_science))
emitLocal === 
[persons](https://en.wikipedia.org/wiki/Person)
SMDATA*********************************

[persons](https://en.wikipedia.org/wiki/Person)
emitLocal === 
[social networks](https://en.wikipedia.org/wiki/Social_networks)
SMDATA*********************************

[social networks](https://en.wikipedia.org/wiki/Social_networks)
emitLocal === 
[Resource Description Framework](https://en.wikipedia.org/wiki/Resource_Description_Framework)
SMDATA*********************************

[Resource Description Framework](https://en.wikipedia.org/wiki/Resource_Description_Framework)
emitLocal === 
[Web Ontology Language](https://en.wikipedia.org/wiki/Web_Ontology_Language)
SMDATA*********************************

[Web Ontology Language](https://en.wikipedia.org/wiki/Web_Ontology_Language)
emitLocal === 
[e-mail addresses](https://en.wikipedia.org/wiki/E-mail_address)
SMDATA*********************************

[e-mail addresses](https://en.wikipedia.org/wiki/E-mail_address)
emitLocal === 
[telephone number](https://en.wikipedia.org/wiki/Telephone_number)
SMDATA*********************************

[telephone number](https://en.wikipedia.org/wiki/Telephone_number)
emitLocal === 
[Facebook](https://en.wikipedia.org/wiki/Facebook)
SMDATA*********************************

[Facebook](https://en.wikipedia.org/wiki/Facebook)
emitLocal === 
[Jabber ID](https://en.wikipedia.org/wiki/Extensible_Messaging_and_Presence_Protocol)
SMDATA*********************************

[Jabber ID](https://en.wikipedia.org/wiki/Extensible_Messaging_and_Presence_Protocol)
emitLocal === 
[URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)
SMDATA*********************************

[URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)
emitLocal === 
[Social Semantic Web](https://en.wikipedia.org/wiki/Social_Semantic_Web)
SMDATA*********************************

[Social Semantic Web](https://en.wikipedia.org/wiki/Social_Semantic_Web)
emitLocal === 
[citation needed](https://en.wikipedia.org/wiki/Wikipedia:Citation_needed)
SMDATA*********************************

[citation needed](https://en.wikipedia.org/wiki/Wikipedia:Citation_needed)
emitLocal === 
[RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework)
SMDATA*********************************

[RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework)
emitLocal === 
[social web](https://en.wikipedia.org/wiki/Social_web)
SMDATA*********************************

[social web](https://en.wikipedia.org/wiki/Social_web)
emitLocal === 
[clarification needed](https://en.wikipedia.org/wiki/Wikipedia:Please_clarify)
SMDATA*********************************

[clarification needed](https://en.wikipedia.org/wiki/Wikipedia:Please_clarify)
emitLocal === 
[Tim Berners-Lee](https://en.wikipedia.org/wiki/Tim_Berners-Lee)
SMDATA*********************************

[Tim Berners-Lee](https://en.wikipedia.org/wiki/Tim_Berners-Lee)
emitLocal === 
[semantic web](https://en.wikipedia.org/wiki/Semantic_web)
SMDATA*********************************

[semantic web](https://en.wikipedia.org/wiki/Semantic_web)
emitLocal === 
[Giant Global Graph](https://en.wikipedia.org/wiki/Giant_Global_Graph)
SMDATA*********************************

[Giant Global Graph](https://en.wikipedia.org/wiki/Giant_Global_Graph)
emitLocal === 
[Internet](https://en.wikipedia.org/wiki/Internet)
SMDATA*********************************

[Internet](https://en.wikipedia.org/wiki/Internet)
emitLocal === 
[World Wide Web](https://en.wikipedia.org/wiki/World_Wide_Web)
SMDATA*********************************

[World Wide Web](https://en.wikipedia.org/wiki/World_Wide_Web)
emitLocal === 

## WebID[edit]

SMDATA*********************************


## WebID[edit]

emitLocal === 
[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=1)
SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=1)
emitLocal === 
[WebID](https://en.wikipedia.org/wiki/WebID)
SMDATA*********************************

[WebID](https://en.wikipedia.org/wiki/WebID)
emitLocal === 

## Deployment[edit]

SMDATA*********************************


## Deployment[edit]

emitLocal === 
[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=2)
SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=2)
emitLocal === 
[Live Journal](https://en.wikipedia.org/wiki/Live_Journal)
SMDATA*********************************

[Live Journal](https://en.wikipedia.org/wiki/Live_Journal)
emitLocal === 
[DeadJournal](https://en.wikipedia.org/wiki/DeadJournal)
SMDATA*********************************

[DeadJournal](https://en.wikipedia.org/wiki/DeadJournal)
emitLocal === 
[My Opera](https://en.wikipedia.org/wiki/My_Opera)
SMDATA*********************************

[My Opera](https://en.wikipedia.org/wiki/My_Opera)
emitLocal === 
[Identi.ca](https://en.wikipedia.org/wiki/Identi.ca)
SMDATA*********************************

[Identi.ca](https://en.wikipedia.org/wiki/Identi.ca)
emitLocal === 
[FriendFeed](https://en.wikipedia.org/wiki/FriendFeed)
SMDATA*********************************

[FriendFeed](https://en.wikipedia.org/wiki/FriendFeed)
emitLocal === 
[WordPress](https://en.wikipedia.org/wiki/WordPress)
SMDATA*********************************

[WordPress](https://en.wikipedia.org/wiki/WordPress)
emitLocal === 
[TypePad](https://en.wikipedia.org/wiki/TypePad)
SMDATA*********************************

[TypePad](https://en.wikipedia.org/wiki/TypePad)
emitLocal === 
[Yandex](https://en.wikipedia.org/wiki/Yandex)
SMDATA*********************************

[Yandex](https://en.wikipedia.org/wiki/Yandex)
emitLocal === 
[Safari](https://en.wikipedia.org/wiki/Safari_(web_browser))
SMDATA*********************************

[Safari](https://en.wikipedia.org/wiki/Safari_(web_browser))
emitLocal === 
[Firefox](https://en.wikipedia.org/wiki/Firefox_(web_browser))
SMDATA*********************************

[Firefox](https://en.wikipedia.org/wiki/Firefox_(web_browser))
emitLocal === 
[Semantic MediaWiki](https://en.wikipedia.org/wiki/Semantic_MediaWiki)
SMDATA*********************************

[Semantic MediaWiki](https://en.wikipedia.org/wiki/Semantic_MediaWiki)
emitLocal === 
[semantic annotation](https://en.wikipedia.org/wiki/Semantic_annotation)
SMDATA*********************************

[semantic annotation](https://en.wikipedia.org/wiki/Semantic_annotation)
emitLocal === 
[linked data](https://en.wikipedia.org/wiki/Linked_data)
SMDATA*********************************

[linked data](https://en.wikipedia.org/wiki/Linked_data)
emitLocal === 
[MediaWiki](https://en.wikipedia.org/wiki/MediaWiki)
SMDATA*********************************

[MediaWiki](https://en.wikipedia.org/wiki/MediaWiki)
emitLocal === 
[content management systems](https://en.wikipedia.org/wiki/Content_management_systems)
SMDATA*********************************

[content management systems](https://en.wikipedia.org/wiki/Content_management_systems)
emitLocal === 

## Example[edit]

SMDATA*********************************


## Example[edit]

emitLocal === 
[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=3)
SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=3)
emitLocal === 
[Turtle](https://en.wikipedia.org/wiki/Turtle_(syntax))
SMDATA*********************************

[Turtle](https://en.wikipedia.org/wiki/Turtle_(syntax))
emitLocal === 
[web resources](https://en.wikipedia.org/wiki/Web_resource)
SMDATA*********************************

[web resources](https://en.wikipedia.org/wiki/Web_resource)
emitLocal === 

## History[edit]

SMDATA*********************************


## History[edit]

emitLocal === 
[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=4)
SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=4)
emitLocal === 

### Versions[edit]

SMDATA*********************************


### Versions[edit]

emitLocal === 
[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=5)
SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=5)
emitLocal === 
[http://xmlns.com/foaf/0.1/](http://xmlns.com/foaf/0.1/)
SMDATA*********************************

[http://xmlns.com/foaf/0.1/](http://xmlns.com/foaf/0.1/)
emitLocal === 
[http://xmlns.com/foaf/0.1/](http://xmlns.com/foaf/0.1/)
SMDATA*********************************

[http://xmlns.com/foaf/0.1/](http://xmlns.com/foaf/0.1/)
emitLocal === 

## See also[edit]

SMDATA*********************************


## See also[edit]

emitLocal === 
[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=6)
SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=6)
emitLocal === 
[Resource Description Framework](https://en.wikipedia.org/wiki/Resource_Description_Framework)
SMDATA*********************************

[Resource Description Framework](https://en.wikipedia.org/wiki/Resource_Description_Framework)
emitLocal === 
[Web Ontology Language](https://en.wikipedia.org/wiki/Web_Ontology_Language)
SMDATA*********************************

[Web Ontology Language](https://en.wikipedia.org/wiki/Web_Ontology_Language)
emitLocal === 
[Social web](https://en.wikipedia.org/wiki/Social_web)
SMDATA*********************************

[Social web](https://en.wikipedia.org/wiki/Social_web)
emitLocal === 
[Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web)
SMDATA*********************************

[Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web)
emitLocal === 
[Description of a Career](https://en.wiktionary.org/wiki/DOAC)
SMDATA*********************************

[Description of a Career](https://en.wiktionary.org/wiki/DOAC)
emitLocal === 
[Description of a Project](https://en.wikipedia.org/wiki/DOAP)
SMDATA*********************************

[Description of a Project](https://en.wikipedia.org/wiki/DOAP)
emitLocal === 
[Semantically-Interlinked Online Communities](https://en.wikipedia.org/wiki/Semantically-Interlinked_Online_Communities)
SMDATA*********************************

[Semantically-Interlinked Online Communities](https://en.wikipedia.org/wiki/Semantically-Interlinked_Online_Communities)
emitLocal === 
[hCard](https://en.wikipedia.org/wiki/HCard)
SMDATA*********************************

[hCard](https://en.wikipedia.org/wiki/HCard)
emitLocal === 
[vCard](https://en.wikipedia.org/wiki/VCard)
SMDATA*********************************

[vCard](https://en.wikipedia.org/wiki/VCard)
emitLocal === 
[XHTML Friends Network](https://en.wikipedia.org/wiki/XHTML_Friends_Network)
SMDATA*********************************

[XHTML Friends Network](https://en.wikipedia.org/wiki/XHTML_Friends_Network)
emitLocal === 

## References[edit]

SMDATA*********************************


## References[edit]

emitLocal === 
[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=7)
SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=7)
emitLocal === 
[XML Watch: Finding friends with XML and RDF](https://web.archive.org/web/20091223003446/http://www.ibm.com/developerworks/xml/library/x-foaf.html)
SMDATA*********************************

[XML Watch: Finding friends with XML and RDF](https://web.archive.org/web/20091223003446/http://www.ibm.com/developerworks/xml/library/x-foaf.html)
emitLocal === 
[IBM DeveloperWorks](https://en.wikipedia.org/wiki/IBM_DeveloperWorks)
SMDATA*********************************

[IBM DeveloperWorks](https://en.wikipedia.org/wiki/IBM_DeveloperWorks)
emitLocal === 
[XML Watch: Support online communities with FOAF](https://web.archive.org/web/20100307223814/http://www.ibm.com/developerworks/xml/library/x-foaf2.html)
SMDATA*********************************

[XML Watch: Support online communities with FOAF](https://web.archive.org/web/20100307223814/http://www.ibm.com/developerworks/xml/library/x-foaf2.html)
emitLocal === 
[IBM DeveloperWorks](https://en.wikipedia.org/wiki/IBM_DeveloperWorks)
SMDATA*********************************

[IBM DeveloperWorks](https://en.wikipedia.org/wiki/IBM_DeveloperWorks)
emitLocal === 
["Giant Global Graph"](https://web.archive.org/web/20160713021037/http://dig.csail.mit.edu/breadcrumbs/node/215)
SMDATA*********************************

["Giant Global Graph"](https://web.archive.org/web/20160713021037/http://dig.csail.mit.edu/breadcrumbs/node/215)
emitLocal === 
[the original](http://dig.csail.mit.edu/breadcrumbs/node/215)
SMDATA*********************************

[the original](http://dig.csail.mit.edu/breadcrumbs/node/215)
emitLocal === 
["LiveJournal FOAF"](https://web.archive.org/web/20100118151037/http://community.livejournal.com/ljfoaf)
SMDATA*********************************

["LiveJournal FOAF"](https://web.archive.org/web/20100118151037/http://community.livejournal.com/ljfoaf)
emitLocal === 
[the original](http://community.livejournal.com/ljfoaf)
SMDATA*********************************

[the original](http://community.livejournal.com/ljfoaf)
emitLocal === 
["Known FOAF data providers"](https://web.archive.org/web/20100226072731/http://wiki.foaf-project.org/w/DataSources)
SMDATA*********************************

["Known FOAF data providers"](https://web.archive.org/web/20100226072731/http://wiki.foaf-project.org/w/DataSources)
emitLocal === 
[the original](http://wiki.foaf-project.org/w/DataSources)
SMDATA*********************************

[the original](http://wiki.foaf-project.org/w/DataSources)
emitLocal === 
["press release on the social networking support"](http://company.yandex.com/press_center/press_releases/2008/2008-08-15.xml)
SMDATA*********************************

["press release on the social networking support"](http://company.yandex.com/press_center/press_releases/2008/2008-08-15.xml)
emitLocal === 
["FOAF Support in Safari RSS"](http://ejohn.org/blog/foaf-support-in-safari-rss/)
SMDATA*********************************

["FOAF Support in Safari RSS"](http://ejohn.org/blog/foaf-support-in-safari-rss/)
emitLocal === 
["Semantic Radar plugin for the Firefox browser"](https://web.archive.org/web/20140108014347/https://addons.mozilla.org/en-US/firefox/addon/semantic-radar/)
SMDATA*********************************

["Semantic Radar plugin for the Firefox browser"](https://web.archive.org/web/20140108014347/https://addons.mozilla.org/en-US/firefox/addon/semantic-radar/)
emitLocal === 
[the original](https://addons.mozilla.org/en-US/firefox/addon/semantic-radar/)
SMDATA*********************************

[the original](https://addons.mozilla.org/en-US/firefox/addon/semantic-radar/)
emitLocal === 
["FOAF support module for Perl"](https://metacpan.org/pod/XML::FOAF)
SMDATA*********************************

["FOAF support module for Perl"](https://metacpan.org/pod/XML::FOAF)
emitLocal === 
["FOAF+SSL authentication support for Perl"](https://metacpan.org/pod/Web::ID)
SMDATA*********************************

["FOAF+SSL authentication support for Perl"](https://metacpan.org/pod/Web::ID)
emitLocal === 
[http://drupal.org/project/foaf](https://drupal.org/project/foaf)
SMDATA*********************************

[http://drupal.org/project/foaf](https://drupal.org/project/foaf)
emitLocal === 
[Drupal](https://en.wikipedia.org/wiki/Drupal)
SMDATA*********************************

[Drupal](https://en.wikipedia.org/wiki/Drupal)
emitLocal === 
["FOAF Vocabulary Specification 0.99"](http://xmlns.com/foaf/spec/20140114.html)
SMDATA*********************************

["FOAF Vocabulary Specification 0.99"](http://xmlns.com/foaf/spec/20140114.html)
emitLocal === 
[Archived](https://web.archive.org/web/20220303180551/http://xmlns.com/foaf/spec/20140114.html)
SMDATA*********************************

[Archived](https://web.archive.org/web/20220303180551/http://xmlns.com/foaf/spec/20140114.html)
emitLocal === 

## External links[edit]

SMDATA*********************************


## External links[edit]

emitLocal === 
[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=8)
SMDATA*********************************

[edit](https://en.wikipedia.org/w/index.php?title=FOAF&action=edit&section=8)
emitLocal === 
[Official website](http://www.foaf-project.org)
SMDATA*********************************

[Official website](http://www.foaf-project.org)
emitLocal === 
[Archived](https://web.archive.org/web/20211023122305/http://www.foaf-project.org/)
SMDATA*********************************

[Archived](https://web.archive.org/web/20211023122305/http://www.foaf-project.org/)
emitLocal === 
[Wayback Machine](https://en.wikipedia.org/wiki/Wayback_Machine)
SMDATA*********************************

[Wayback Machine](https://en.wikipedia.org/wiki/Wayback_Machine)
emitLocal === 
[FOAF dataset](http://ebiquity.umbc.edu/resource/html/id/82/)
SMDATA*********************************

[FOAF dataset](http://ebiquity.umbc.edu/resource/html/id/82/)
emitLocal === 
[FOAF-search - a search engine for FOAF data](https://web.archive.org/web/20181130195340/https://www.foaf-search.net/)
SMDATA*********************************

[FOAF-search - a search engine for FOAF data](https://web.archive.org/web/20181130195340/https://www.foaf-search.net/)
emitLocal === 
[Wayback Machine](https://en.wikipedia.org/wiki/Wayback_Machine)
SMDATA*********************************

[Wayback Machine](https://en.wikipedia.org/wiki/Wayback_Machine)
emitLocal === 
[v](https://en.wikipedia.org/wiki/Template:Semantic_Web)
SMDATA*********************************

[v](https://en.wikipedia.org/wiki/Template:Semantic_Web)
emitLocal === 
[t](https://en.wikipedia.org/wiki/Template_talk:Semantic_Web)
SMDATA*********************************

[t](https://en.wikipedia.org/wiki/Template_talk:Semantic_Web)
emitLocal === 
[e](https://en.wikipedia.org/wiki/Special:EditPage/Template:Semantic_Web)
SMDATA*********************************

[e](https://en.wikipedia.org/wiki/Special:EditPage/Template:Semantic_Web)
emitLocal === 
[Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web)
SMDATA*********************************

[Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web)
emitLocal === 
[Databases](https://en.wikipedia.org/wiki/Database)
SMDATA*********************************

[Databases](https://en.wikipedia.org/wiki/Database)
emitLocal === 
[Hypertext](https://en.wikipedia.org/wiki/Hypertext)
SMDATA*********************************

[Hypertext](https://en.wikipedia.org/wiki/Hypertext)
emitLocal === 
[Internet](https://en.wikipedia.org/wiki/Internet)
SMDATA*********************************

[Internet](https://en.wikipedia.org/wiki/Internet)
emitLocal === 
[Ontologies](https://en.wikipedia.org/wiki/Ontology_(computer_science))
SMDATA*********************************

[Ontologies](https://en.wikipedia.org/wiki/Ontology_(computer_science))
emitLocal === 
[Semantics](https://en.wikipedia.org/wiki/Semantics_(computer_science))
SMDATA*********************************

[Semantics](https://en.wikipedia.org/wiki/Semantics_(computer_science))
emitLocal === 
[Semantic networks](https://en.wikipedia.org/wiki/Semantic_network)
SMDATA*********************************

[Semantic networks](https://en.wikipedia.org/wiki/Semantic_network)
emitLocal === 
[World Wide Web](https://en.wikipedia.org/wiki/World_Wide_Web)
SMDATA*********************************

[World Wide Web](https://en.wikipedia.org/wiki/World_Wide_Web)
emitLocal === 
[Dataspaces](https://en.wikipedia.org/wiki/Dataspaces)
SMDATA*********************************

[Dataspaces](https://en.wikipedia.org/wiki/Dataspaces)
emitLocal === 
[Hyperdata](https://en.wikipedia.org/wiki/Hyperdata)
SMDATA*********************************

[Hyperdata](https://en.wikipedia.org/wiki/Hyperdata)
emitLocal === 
[Linked data](https://en.wikipedia.org/wiki/Linked_data)
SMDATA*********************************

[Linked data](https://en.wikipedia.org/wiki/Linked_data)
emitLocal === 
[Rule-based systems](https://en.wikipedia.org/wiki/Rule-based_system)
SMDATA*********************************

[Rule-based systems](https://en.wikipedia.org/wiki/Rule-based_system)
emitLocal === 
[Semantic analytics](https://en.wikipedia.org/wiki/Semantic_analytics)
SMDATA*********************************

[Semantic analytics](https://en.wikipedia.org/wiki/Semantic_analytics)
emitLocal === 
[Semantic broker](https://en.wikipedia.org/wiki/Semantic_broker)
SMDATA*********************************

[Semantic broker](https://en.wikipedia.org/wiki/Semantic_broker)
emitLocal === 
[Semantic computing](https://en.wikipedia.org/wiki/Semantic_computing)
SMDATA*********************************

[Semantic computing](https://en.wikipedia.org/wiki/Semantic_computing)
emitLocal === 
[Semantic mapper](https://en.wikipedia.org/wiki/Semantic_mapper)
SMDATA*********************************

[Semantic mapper](https://en.wikipedia.org/wiki/Semantic_mapper)
emitLocal === 
[Semantic matching](https://en.wikipedia.org/wiki/Semantic_matching)
SMDATA*********************************

[Semantic matching](https://en.wikipedia.org/wiki/Semantic_matching)
emitLocal === 
[Semantic publishing](https://en.wikipedia.org/wiki/Semantic_publishing)
SMDATA*********************************

[Semantic publishing](https://en.wikipedia.org/wiki/Semantic_publishing)
emitLocal === 
[Semantic reasoner](https://en.wikipedia.org/wiki/Semantic_reasoner)
SMDATA*********************************

[Semantic reasoner](https://en.wikipedia.org/wiki/Semantic_reasoner)
emitLocal === 
[Semantic search](https://en.wikipedia.org/wiki/Semantic_search)
SMDATA*********************************

[Semantic search](https://en.wikipedia.org/wiki/Semantic_search)
emitLocal === 
[Semantic service-oriented architecture](https://en.wikipedia.org/wiki/Semantic_service-oriented_architecture)
SMDATA*********************************

[Semantic service-oriented architecture](https://en.wikipedia.org/wiki/Semantic_service-oriented_architecture)
emitLocal === 
[Semantic wiki](https://en.wikipedia.org/wiki/Semantic_wiki)
SMDATA*********************************

[Semantic wiki](https://en.wikipedia.org/wiki/Semantic_wiki)
emitLocal === 
[Solid](https://en.wikipedia.org/wiki/Solid_(web_decentralization_project))
SMDATA*********************************

[Solid](https://en.wikipedia.org/wiki/Solid_(web_decentralization_project))
emitLocal === 
[Collective intelligence](https://en.wikipedia.org/wiki/Collective_intelligence)
SMDATA*********************************

[Collective intelligence](https://en.wikipedia.org/wiki/Collective_intelligence)
emitLocal === 
[Description logic](https://en.wikipedia.org/wiki/Description_logic)
SMDATA*********************************

[Description logic](https://en.wikipedia.org/wiki/Description_logic)
emitLocal === 
[Folksonomy](https://en.wikipedia.org/wiki/Folksonomy)
SMDATA*********************************

[Folksonomy](https://en.wikipedia.org/wiki/Folksonomy)
emitLocal === 
[Geotagging](https://en.wikipedia.org/wiki/Geotagging)
SMDATA*********************************

[Geotagging](https://en.wikipedia.org/wiki/Geotagging)
emitLocal === 
[Information architecture](https://en.wikipedia.org/wiki/Information_architecture)
SMDATA*********************************

[Information architecture](https://en.wikipedia.org/wiki/Information_architecture)
emitLocal === 
[Knowledge extraction](https://en.wikipedia.org/wiki/Knowledge_extraction)
SMDATA*********************************

[Knowledge extraction](https://en.wikipedia.org/wiki/Knowledge_extraction)
emitLocal === 
[Knowledge management](https://en.wikipedia.org/wiki/Knowledge_management)
SMDATA*********************************

[Knowledge management](https://en.wikipedia.org/wiki/Knowledge_management)
emitLocal === 
[Knowledge representation and reasoning](https://en.wikipedia.org/wiki/Knowledge_representation_and_reasoning)
SMDATA*********************************

[Knowledge representation and reasoning](https://en.wikipedia.org/wiki/Knowledge_representation_and_reasoning)
emitLocal === 
[Library 2.0](https://en.wikipedia.org/wiki/Library_2.0)
SMDATA*********************************

[Library 2.0](https://en.wikipedia.org/wiki/Library_2.0)
emitLocal === 
[Digital library](https://en.wikipedia.org/wiki/Digital_library)
SMDATA*********************************

[Digital library](https://en.wikipedia.org/wiki/Digital_library)
emitLocal === 
[Digital humanities](https://en.wikipedia.org/wiki/Digital_humanities)
SMDATA*********************************

[Digital humanities](https://en.wikipedia.org/wiki/Digital_humanities)
emitLocal === 
[Metadata](https://en.wikipedia.org/wiki/Metadata)
SMDATA*********************************

[Metadata](https://en.wikipedia.org/wiki/Metadata)
emitLocal === 
[References](https://en.wikipedia.org/wiki/Reference_(computer_science))
SMDATA*********************************

[References](https://en.wikipedia.org/wiki/Reference_(computer_science))
emitLocal === 
[Topic map](https://en.wikipedia.org/wiki/Topic_map)
SMDATA*********************************

[Topic map](https://en.wikipedia.org/wiki/Topic_map)
emitLocal === 
[Web 2.0](https://en.wikipedia.org/wiki/Web_2.0)
SMDATA*********************************

[Web 2.0](https://en.wikipedia.org/wiki/Web_2.0)
emitLocal === 
[Web engineering](https://en.wikipedia.org/wiki/Web_engineering)
SMDATA*********************************

[Web engineering](https://en.wikipedia.org/wiki/Web_engineering)
emitLocal === 
[Web Science Trust](https://en.wikipedia.org/wiki/Web_Science_Trust)
SMDATA*********************************

[Web Science Trust](https://en.wikipedia.org/wiki/Web_Science_Trust)
emitLocal === 
[HTTP](https://en.wikipedia.org/wiki/HTTP)
SMDATA*********************************

[HTTP](https://en.wikipedia.org/wiki/HTTP)
emitLocal === 
[IRI](https://en.wikipedia.org/wiki/Internationalized_Resource_Identifier)
SMDATA*********************************

[IRI](https://en.wikipedia.org/wiki/Internationalized_Resource_Identifier)
emitLocal === 
[URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)
SMDATA*********************************

[URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)
emitLocal === 
[RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework)
SMDATA*********************************

[RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework)
emitLocal === 
[triples](https://en.wikipedia.org/wiki/Semantic_triple)
SMDATA*********************************

[triples](https://en.wikipedia.org/wiki/Semantic_triple)
emitLocal === 
[RDF/XML](https://en.wikipedia.org/wiki/RDF/XML)
SMDATA*********************************

[RDF/XML](https://en.wikipedia.org/wiki/RDF/XML)
emitLocal === 
[JSON-LD](https://en.wikipedia.org/wiki/JSON-LD)
SMDATA*********************************

[JSON-LD](https://en.wikipedia.org/wiki/JSON-LD)
emitLocal === 
[Turtle](https://en.wikipedia.org/wiki/Turtle_(syntax))
SMDATA*********************************

[Turtle](https://en.wikipedia.org/wiki/Turtle_(syntax))
emitLocal === 
[TriG](https://en.wikipedia.org/wiki/TriG_(syntax))
SMDATA*********************************

[TriG](https://en.wikipedia.org/wiki/TriG_(syntax))
emitLocal === 
[Notation3](https://en.wikipedia.org/wiki/Notation3)
SMDATA*********************************

[Notation3](https://en.wikipedia.org/wiki/Notation3)
emitLocal === 
[N-Triples](https://en.wikipedia.org/wiki/N-Triples)
SMDATA*********************************

[N-Triples](https://en.wikipedia.org/wiki/N-Triples)
emitLocal === 
[TriX](https://en.wikipedia.org/wiki/TriX_(serialization_format))
SMDATA*********************************

[TriX](https://en.wikipedia.org/wiki/TriX_(serialization_format))
emitLocal === 
[RRID](https://en.wikipedia.org/wiki/Research_Resource_Identifier)
SMDATA*********************************

[RRID](https://en.wikipedia.org/wiki/Research_Resource_Identifier)
emitLocal === 
[SPARQL](https://en.wikipedia.org/wiki/SPARQL)
SMDATA*********************************

[SPARQL](https://en.wikipedia.org/wiki/SPARQL)
emitLocal === 
[XML](https://en.wikipedia.org/wiki/XML)
SMDATA*********************************

[XML](https://en.wikipedia.org/wiki/XML)
emitLocal === 
[Semantic HTML](https://en.wikipedia.org/wiki/Semantic_HTML)
SMDATA*********************************

[Semantic HTML](https://en.wikipedia.org/wiki/Semantic_HTML)
emitLocal === 
[Common Logic](https://en.wikipedia.org/wiki/Common_Logic)
SMDATA*********************************

[Common Logic](https://en.wikipedia.org/wiki/Common_Logic)
emitLocal === 
[OWL](https://en.wikipedia.org/wiki/Web_Ontology_Language)
SMDATA*********************************

[OWL](https://en.wikipedia.org/wiki/Web_Ontology_Language)
emitLocal === 
[RDFS](https://en.wikipedia.org/wiki/RDF_Schema)
SMDATA*********************************

[RDFS](https://en.wikipedia.org/wiki/RDF_Schema)
emitLocal === 
[Rule Interchange Format](https://en.wikipedia.org/wiki/Rule_Interchange_Format)
SMDATA*********************************

[Rule Interchange Format](https://en.wikipedia.org/wiki/Rule_Interchange_Format)
emitLocal === 
[Semantic Web Rule Language](https://en.wikipedia.org/wiki/Semantic_Web_Rule_Language)
SMDATA*********************************

[Semantic Web Rule Language](https://en.wikipedia.org/wiki/Semantic_Web_Rule_Language)
emitLocal === 
[ALPS](https://en.wikipedia.org/w/index.php?title=Application-Level_Profile_Semantics_(ALPS)&action=edit&redlink=1)
SMDATA*********************************

[ALPS](https://en.wikipedia.org/w/index.php?title=Application-Level_Profile_Semantics_(ALPS)&action=edit&redlink=1)
emitLocal === 
[SHACL](https://en.wikipedia.org/wiki/SHACL)
SMDATA*********************************

[SHACL](https://en.wikipedia.org/wiki/SHACL)
emitLocal === 
[eRDF](https://en.wikipedia.org/wiki/Embedded_RDF)
SMDATA*********************************

[eRDF](https://en.wikipedia.org/wiki/Embedded_RDF)
emitLocal === 
[GRDDL](https://en.wikipedia.org/wiki/GRDDL)
SMDATA*********************************

[GRDDL](https://en.wikipedia.org/wiki/GRDDL)
emitLocal === 
[Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML))
SMDATA*********************************

[Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML))
emitLocal === 
[Microformats](https://en.wikipedia.org/wiki/Microformat)
SMDATA*********************************

[Microformats](https://en.wikipedia.org/wiki/Microformat)
emitLocal === 
[RDFa](https://en.wikipedia.org/wiki/RDFa)
SMDATA*********************************

[RDFa](https://en.wikipedia.org/wiki/RDFa)
emitLocal === 
[SAWSDL](https://en.wikipedia.org/wiki/SAWSDL)
SMDATA*********************************

[SAWSDL](https://en.wikipedia.org/wiki/SAWSDL)
emitLocal === 
[Facebook Platform](https://en.wikipedia.org/wiki/Facebook_Platform)
SMDATA*********************************

[Facebook Platform](https://en.wikipedia.org/wiki/Facebook_Platform)
emitLocal === 
[DOAP](https://en.wikipedia.org/wiki/DOAP)
SMDATA*********************************

[DOAP](https://en.wikipedia.org/wiki/DOAP)
emitLocal === 
[Dublin Core](https://en.wikipedia.org/wiki/Dublin_Core)
SMDATA*********************************

[Dublin Core](https://en.wikipedia.org/wiki/Dublin_Core)
emitLocal === 
[Schema.org](https://en.wikipedia.org/wiki/Schema.org)
SMDATA*********************************

[Schema.org](https://en.wikipedia.org/wiki/Schema.org)
emitLocal === 
[SIOC](https://en.wikipedia.org/wiki/Semantically_Interlinked_Online_Communities)
SMDATA*********************************

[SIOC](https://en.wikipedia.org/wiki/Semantically_Interlinked_Online_Communities)
emitLocal === 
[SKOS](https://en.wikipedia.org/wiki/Simple_Knowledge_Organization_System)
SMDATA*********************************

[SKOS](https://en.wikipedia.org/wiki/Simple_Knowledge_Organization_System)
emitLocal === 
[hAtom](https://en.wikipedia.org/wiki/HAtom)
SMDATA*********************************

[hAtom](https://en.wikipedia.org/wiki/HAtom)
emitLocal === 
[hCalendar](https://en.wikipedia.org/wiki/HCalendar)
SMDATA*********************************

[hCalendar](https://en.wikipedia.org/wiki/HCalendar)
emitLocal === 
[hCard](https://en.wikipedia.org/wiki/HCard)
SMDATA*********************************

[hCard](https://en.wikipedia.org/wiki/HCard)
emitLocal === 
[hProduct](https://en.wikipedia.org/wiki/HProduct)
SMDATA*********************************

[hProduct](https://en.wikipedia.org/wiki/HProduct)
emitLocal === 
[hRecipe](https://en.wikipedia.org/wiki/HRecipe)
SMDATA*********************************

[hRecipe](https://en.wikipedia.org/wiki/HRecipe)
emitLocal === 
[hReview](https://en.wikipedia.org/wiki/HReview)
SMDATA*********************************

[hReview](https://en.wikipedia.org/wiki/HReview)
emitLocal === 
[v](https://en.wikipedia.org/wiki/Template:Social_networking)
SMDATA*********************************

[v](https://en.wikipedia.org/wiki/Template:Social_networking)
emitLocal === 
[t](https://en.wikipedia.org/wiki/Template_talk:Social_networking)
SMDATA*********************************

[t](https://en.wikipedia.org/wiki/Template_talk:Social_networking)
emitLocal === 
[e](https://en.wikipedia.org/wiki/Special:EditPage/Template:Social_networking)
SMDATA*********************************

[e](https://en.wikipedia.org/wiki/Special:EditPage/Template:Social_networking)
emitLocal === 
[Social networks](https://en.wikipedia.org/wiki/Social_network)
SMDATA*********************************

[Social networks](https://en.wikipedia.org/wiki/Social_network)
emitLocal === 
[social media](https://en.wikipedia.org/wiki/Social_media)
SMDATA*********************************

[social media](https://en.wikipedia.org/wiki/Social_media)
emitLocal === 
[Personal](https://en.wikipedia.org/wiki/Personal_network)
SMDATA*********************************

[Personal](https://en.wikipedia.org/wiki/Personal_network)
emitLocal === 
[Professional](https://en.wikipedia.org/wiki/Professional_network_service)
SMDATA*********************************

[Professional](https://en.wikipedia.org/wiki/Professional_network_service)
emitLocal === 
[Sexual](https://en.wikipedia.org/wiki/Sexual_network)
SMDATA*********************************

[Sexual](https://en.wikipedia.org/wiki/Sexual_network)
emitLocal === 
[Value](https://en.wikipedia.org/wiki/Value_network)
SMDATA*********************************

[Value](https://en.wikipedia.org/wiki/Value_network)
emitLocal === 
[Clique](https://en.wikipedia.org/wiki/Clique)
SMDATA*********************************

[Clique](https://en.wikipedia.org/wiki/Clique)
emitLocal === 
[Adolescent](https://en.wikipedia.org/wiki/Adolescent_clique)
SMDATA*********************************

[Adolescent](https://en.wikipedia.org/wiki/Adolescent_clique)
emitLocal === 
[Corporate social media](https://en.wikipedia.org/wiki/Corporate_social_media)
SMDATA*********************************

[Corporate social media](https://en.wikipedia.org/wiki/Corporate_social_media)
emitLocal === 
[Distributed social network](https://en.wikipedia.org/wiki/Distributed_social_network)
SMDATA*********************************

[Distributed social network](https://en.wikipedia.org/wiki/Distributed_social_network)
emitLocal === 
[list](https://en.wikipedia.org/wiki/Comparison_of_software_and_protocols_for_distributed_social_networking)
SMDATA*********************************

[list](https://en.wikipedia.org/wiki/Comparison_of_software_and_protocols_for_distributed_social_networking)
emitLocal === 
[Enterprise social networking](https://en.wikipedia.org/wiki/Enterprise_social_networking)
SMDATA*********************************

[Enterprise social networking](https://en.wikipedia.org/wiki/Enterprise_social_networking)
emitLocal === 
[Enterprise social software](https://en.wikipedia.org/wiki/Enterprise_social_software)
SMDATA*********************************

[Enterprise social software](https://en.wikipedia.org/wiki/Enterprise_social_software)
emitLocal === 
[Mobile social network](https://en.wikipedia.org/wiki/Mobile_social_network)
SMDATA*********************************

[Mobile social network](https://en.wikipedia.org/wiki/Mobile_social_network)
emitLocal === 
[Personal knowledge networking](https://en.wikipedia.org/wiki/Personal_knowledge_networking)
SMDATA*********************************

[Personal knowledge networking](https://en.wikipedia.org/wiki/Personal_knowledge_networking)
emitLocal === 
[Services](https://en.wikipedia.org/wiki/Social_networking_service)
SMDATA*********************************

[Services](https://en.wikipedia.org/wiki/Social_networking_service)
emitLocal === 
[List of social networking services](https://en.wikipedia.org/wiki/List_of_social_networking_services)
SMDATA*********************************

[List of social networking services](https://en.wikipedia.org/wiki/List_of_social_networking_services)
emitLocal === 
[List of virtual communities with more than 1 million users](https://en.wikipedia.org/wiki/List_of_virtual_communities_with_more_than_1_million_users)
SMDATA*********************************

[List of virtual communities with more than 1 million users](https://en.wikipedia.org/wiki/List_of_virtual_communities_with_more_than_1_million_users)
emitLocal === 
[Ambient awareness](https://en.wikipedia.org/wiki/Ambient_awareness)
SMDATA*********************************

[Ambient awareness](https://en.wikipedia.org/wiki/Ambient_awareness)
emitLocal === 
[Assortative mixing](https://en.wikipedia.org/wiki/Assortative_mixing)
SMDATA*********************************

[Assortative mixing](https://en.wikipedia.org/wiki/Assortative_mixing)
emitLocal === 
[Attention inequality](https://en.wikipedia.org/wiki/Attention_inequality)
SMDATA*********************************

[Attention inequality](https://en.wikipedia.org/wiki/Attention_inequality)
emitLocal === 
[Interpersonal bridge](https://en.wikipedia.org/wiki/Bridge_(interpersonal))
SMDATA*********************************

[Interpersonal bridge](https://en.wikipedia.org/wiki/Bridge_(interpersonal))
emitLocal === 
[Organizational network analysis](https://en.wikipedia.org/wiki/Organizational_network_analysis)
SMDATA*********************************

[Organizational network analysis](https://en.wikipedia.org/wiki/Organizational_network_analysis)
emitLocal === 
[Small-world experiment](https://en.wikipedia.org/wiki/Small-world_experiment)
SMDATA*********************************

[Small-world experiment](https://en.wikipedia.org/wiki/Small-world_experiment)
emitLocal === 
[Social aspects of television](https://en.wikipedia.org/wiki/Social_aspects_of_television)
SMDATA*********************************

[Social aspects of television](https://en.wikipedia.org/wiki/Social_aspects_of_television)
emitLocal === 
[Social capital](https://en.wikipedia.org/wiki/Social_capital)
SMDATA*********************************

[Social capital](https://en.wikipedia.org/wiki/Social_capital)
emitLocal === 
[Social data revolution](https://en.wikipedia.org/wiki/Social_data_revolution)
SMDATA*********************************

[Social data revolution](https://en.wikipedia.org/wiki/Social_data_revolution)
emitLocal === 
[Social exchange theory](https://en.wikipedia.org/wiki/Social_exchange_theory)
SMDATA*********************************

[Social exchange theory](https://en.wikipedia.org/wiki/Social_exchange_theory)
emitLocal === 
[Social identity theory](https://en.wikipedia.org/wiki/Social_identity_theory)
SMDATA*********************************

[Social identity theory](https://en.wikipedia.org/wiki/Social_identity_theory)
emitLocal === 
[Social media and psychology](https://en.wikipedia.org/wiki/Social_media_and_psychology)
SMDATA*********************************

[Social media and psychology](https://en.wikipedia.org/wiki/Social_media_and_psychology)
emitLocal === 
[Social media intelligence](https://en.wikipedia.org/wiki/Social_media_intelligence)
SMDATA*********************************

[Social media intelligence](https://en.wikipedia.org/wiki/Social_media_intelligence)
emitLocal === 
[Social media mining](https://en.wikipedia.org/wiki/Social_media_mining)
SMDATA*********************************

[Social media mining](https://en.wikipedia.org/wiki/Social_media_mining)
emitLocal === 
[Social media optimization](https://en.wikipedia.org/wiki/Social_media_optimization)
SMDATA*********************************

[Social media optimization](https://en.wikipedia.org/wiki/Social_media_optimization)
emitLocal === 
[Social network analysis](https://en.wikipedia.org/wiki/Social_network_analysis)
SMDATA*********************************

[Social network analysis](https://en.wikipedia.org/wiki/Social_network_analysis)
emitLocal === 
[Social web](https://en.wikipedia.org/wiki/Social_web)
SMDATA*********************************

[Social web](https://en.wikipedia.org/wiki/Social_web)
emitLocal === 
[Structural endogamy](https://en.wikipedia.org/wiki/Structural_endogamy)
SMDATA*********************************

[Structural endogamy](https://en.wikipedia.org/wiki/Structural_endogamy)
emitLocal === 
[Virtual collective consciousness](https://en.wikipedia.org/wiki/Virtual_collective_consciousness)
SMDATA*********************************

[Virtual collective consciousness](https://en.wikipedia.org/wiki/Virtual_collective_consciousness)
emitLocal === 
[Account verification](https://en.wikipedia.org/wiki/Account_verification)
SMDATA*********************************

[Account verification](https://en.wikipedia.org/wiki/Account_verification)
emitLocal === 
[Aggregation](https://en.wikipedia.org/wiki/Social_network_aggregation)
SMDATA*********************************

[Aggregation](https://en.wikipedia.org/wiki/Social_network_aggregation)
emitLocal === 
[Change detection](https://en.wikipedia.org/wiki/Social_network_change_detection)
SMDATA*********************************

[Change detection](https://en.wikipedia.org/wiki/Social_network_change_detection)
emitLocal === 
[Blockmodeling](https://en.wikipedia.org/wiki/Blockmodeling)
SMDATA*********************************

[Blockmodeling](https://en.wikipedia.org/wiki/Blockmodeling)
emitLocal === 
[Collaboration graph](https://en.wikipedia.org/wiki/Collaboration_graph)
SMDATA*********************************

[Collaboration graph](https://en.wikipedia.org/wiki/Collaboration_graph)
emitLocal === 
[Collaborative consumption](https://en.wikipedia.org/wiki/Collaborative_consumption)
SMDATA*********************************

[Collaborative consumption](https://en.wikipedia.org/wiki/Collaborative_consumption)
emitLocal === 
[Giant Global Graph](https://en.wikipedia.org/wiki/Giant_Global_Graph)
SMDATA*********************************

[Giant Global Graph](https://en.wikipedia.org/wiki/Giant_Global_Graph)
emitLocal === 
[Lateral communication](https://en.wikipedia.org/wiki/Lateral_communication)
SMDATA*********************************

[Lateral communication](https://en.wikipedia.org/wiki/Lateral_communication)
emitLocal === 
[Reputation system](https://en.wikipedia.org/wiki/Reputation_system)
SMDATA*********************************

[Reputation system](https://en.wikipedia.org/wiki/Reputation_system)
emitLocal === 
[Social bot](https://en.wikipedia.org/wiki/Social_bot)
SMDATA*********************************

[Social bot](https://en.wikipedia.org/wiki/Social_bot)
emitLocal === 
[Social graph](https://en.wikipedia.org/wiki/Social_graph)
SMDATA*********************************

[Social graph](https://en.wikipedia.org/wiki/Social_graph)
emitLocal === 
[Social media analytics](https://en.wikipedia.org/wiki/Social_media_analytics)
SMDATA*********************************

[Social media analytics](https://en.wikipedia.org/wiki/Social_media_analytics)
emitLocal === 
[Social network analysis software](https://en.wikipedia.org/wiki/Social_network_analysis_software)
SMDATA*********************************

[Social network analysis software](https://en.wikipedia.org/wiki/Social_network_analysis_software)
emitLocal === 
[Social networking potential](https://en.wikipedia.org/wiki/Social_networking_potential)
SMDATA*********************************

[Social networking potential](https://en.wikipedia.org/wiki/Social_networking_potential)
emitLocal === 
[Social television](https://en.wikipedia.org/wiki/Social_television)
SMDATA*********************************

[Social television](https://en.wikipedia.org/wiki/Social_television)
emitLocal === 
[Structural cohesion](https://en.wikipedia.org/wiki/Structural_cohesion)
SMDATA*********************************

[Structural cohesion](https://en.wikipedia.org/wiki/Structural_cohesion)
emitLocal === 
[Affinity fraud](https://en.wikipedia.org/wiki/Affinity_fraud)
SMDATA*********************************

[Affinity fraud](https://en.wikipedia.org/wiki/Affinity_fraud)
emitLocal === 
[Attention economy](https://en.wikipedia.org/wiki/Attention_economy)
SMDATA*********************************

[Attention economy](https://en.wikipedia.org/wiki/Attention_economy)
emitLocal === 
[Collaborative finance](https://en.wikipedia.org/wiki/Collaborative_finance)
SMDATA*********************************

[Collaborative finance](https://en.wikipedia.org/wiki/Collaborative_finance)
emitLocal === 
[Creator economy](https://en.wikipedia.org/wiki/Creator_economy)
SMDATA*********************************

[Creator economy](https://en.wikipedia.org/wiki/Creator_economy)
emitLocal === 
[Influencer marketing](https://en.wikipedia.org/wiki/Influencer_marketing)
SMDATA*********************************

[Influencer marketing](https://en.wikipedia.org/wiki/Influencer_marketing)
emitLocal === 
[Narrowcasting](https://en.wikipedia.org/wiki/Narrowcasting)
SMDATA*********************************

[Narrowcasting](https://en.wikipedia.org/wiki/Narrowcasting)
emitLocal === 
[Sharing economy](https://en.wikipedia.org/wiki/Sharing_economy)
SMDATA*********************************

[Sharing economy](https://en.wikipedia.org/wiki/Sharing_economy)
emitLocal === 
[Social commerce](https://en.wikipedia.org/wiki/Social_commerce)
SMDATA*********************************

[Social commerce](https://en.wikipedia.org/wiki/Social_commerce)
emitLocal === 
[Social sorting](https://en.wikipedia.org/wiki/Social_sorting)
SMDATA*********************************

[Social sorting](https://en.wikipedia.org/wiki/Social_sorting)
emitLocal === 
[Viral marketing](https://en.wikipedia.org/wiki/Viral_marketing)
SMDATA*********************************

[Viral marketing](https://en.wikipedia.org/wiki/Viral_marketing)
emitLocal === 
[Algorithmic radicalization](https://en.wikipedia.org/wiki/Algorithmic_radicalization)
SMDATA*********************************

[Algorithmic radicalization](https://en.wikipedia.org/wiki/Algorithmic_radicalization)
emitLocal === 
[Community recognition](https://en.wikipedia.org/wiki/Community_recognition)
SMDATA*********************************

[Community recognition](https://en.wikipedia.org/wiki/Community_recognition)
emitLocal === 
[Complex contagion](https://en.wikipedia.org/wiki/Complex_contagion)
SMDATA*********************************

[Complex contagion](https://en.wikipedia.org/wiki/Complex_contagion)
emitLocal === 
[Computer addiction](https://en.wikipedia.org/wiki/Computer_addiction)
SMDATA*********************************

[Computer addiction](https://en.wikipedia.org/wiki/Computer_addiction)
emitLocal === 
[Consequential strangers](https://en.wikipedia.org/wiki/Consequential_strangers)
SMDATA*********************************

[Consequential strangers](https://en.wikipedia.org/wiki/Consequential_strangers)
emitLocal === 
[Friend of a friend](https://en.wikipedia.org/wiki/Friend_of_a_friend)
SMDATA*********************************

[Friend of a friend](https://en.wikipedia.org/wiki/Friend_of_a_friend)
emitLocal === 
[Friending and following](https://en.wikipedia.org/wiki/Friending_and_following)
SMDATA*********************************

[Friending and following](https://en.wikipedia.org/wiki/Friending_and_following)
emitLocal === 
[Friendship paradox](https://en.wikipedia.org/wiki/Friendship_paradox)
SMDATA*********************************

[Friendship paradox](https://en.wikipedia.org/wiki/Friendship_paradox)
emitLocal === 
[Influence-for-hire](https://en.wikipedia.org/wiki/Influence-for-hire)
SMDATA*********************************

[Influence-for-hire](https://en.wikipedia.org/wiki/Influence-for-hire)
emitLocal === 
[Internet addiction](https://en.wikipedia.org/wiki/Internet_addiction)
SMDATA*********************************

[Internet addiction](https://en.wikipedia.org/wiki/Internet_addiction)
emitLocal === 
[Information overload](https://en.wikipedia.org/wiki/Information_overload)
SMDATA*********************************

[Information overload](https://en.wikipedia.org/wiki/Information_overload)
emitLocal === 
[Overchoice](https://en.wikipedia.org/wiki/Overchoice)
SMDATA*********************************

[Overchoice](https://en.wikipedia.org/wiki/Overchoice)
emitLocal === 
[Six degrees of separation](https://en.wikipedia.org/wiki/Six_degrees_of_separation)
SMDATA*********************************

[Six degrees of separation](https://en.wikipedia.org/wiki/Six_degrees_of_separation)
emitLocal === 
[Social media addiction](https://en.wikipedia.org/wiki/Social_media_addiction)
SMDATA*********************************

[Social media addiction](https://en.wikipedia.org/wiki/Social_media_addiction)
emitLocal === 
[Social media and suicide](https://en.wikipedia.org/wiki/Social_media_and_suicide)
SMDATA*********************************

[Social media and suicide](https://en.wikipedia.org/wiki/Social_media_and_suicide)
emitLocal === 
[Social invisibility](https://en.wikipedia.org/wiki/Social_invisibility)
SMDATA*********************************

[Social invisibility](https://en.wikipedia.org/wiki/Social_invisibility)
emitLocal === 
[Social network game](https://en.wikipedia.org/wiki/Social_network_game)
SMDATA*********************************

[Social network game](https://en.wikipedia.org/wiki/Social_network_game)
emitLocal === 
[Suicide and the Internet](https://en.wikipedia.org/wiki/Suicide_and_the_Internet)
SMDATA*********************************

[Suicide and the Internet](https://en.wikipedia.org/wiki/Suicide_and_the_Internet)
emitLocal === 
[Tribe](https://en.wikipedia.org/wiki/Tribe_(internet))
SMDATA*********************************

[Tribe](https://en.wikipedia.org/wiki/Tribe_(internet))
emitLocal === 
[Viral phenomenon](https://en.wikipedia.org/wiki/Viral_phenomenon)
SMDATA*********************************

[Viral phenomenon](https://en.wikipedia.org/wiki/Viral_phenomenon)
emitLocal === 
[Friendship recession](https://en.wikipedia.org/wiki/Friendship_recession)
SMDATA*********************************

[Friendship recession](https://en.wikipedia.org/wiki/Friendship_recession)
emitLocal === 
[Peer pressure](https://en.wikipedia.org/wiki/Peer_pressure)
SMDATA*********************************

[Peer pressure](https://en.wikipedia.org/wiki/Peer_pressure)
emitLocal === 
[Researchers](https://en.wikipedia.org/wiki/List_of_social_network_researchers)
SMDATA*********************************

[Researchers](https://en.wikipedia.org/wiki/List_of_social_network_researchers)
emitLocal === 
[User profile](https://en.wikipedia.org/wiki/User_profile)
SMDATA*********************************

[User profile](https://en.wikipedia.org/wiki/User_profile)
emitLocal === 
[Online identity](https://en.wikipedia.org/wiki/Online_identity)
SMDATA*********************************

[Online identity](https://en.wikipedia.org/wiki/Online_identity)
emitLocal === 
[Persona](https://en.wikipedia.org/wiki/Persona_(user_experience))
SMDATA*********************************

[Persona](https://en.wikipedia.org/wiki/Persona_(user_experience))
emitLocal === 
[Social profiling](https://en.wikipedia.org/wiki/Social_profiling)
SMDATA*********************************

[Social profiling](https://en.wikipedia.org/wiki/Social_profiling)
emitLocal === 
[Viral messages](https://en.wikipedia.org/wiki/Viral_messages)
SMDATA*********************************

[Viral messages](https://en.wikipedia.org/wiki/Viral_messages)
emitLocal === 
[Virtual community](https://en.wikipedia.org/wiki/Virtual_community)
SMDATA*********************************

[Virtual community](https://en.wikipedia.org/wiki/Virtual_community)
emitLocal === 
[https://en.wikipedia.org/w/index.php?title=FOAF&oldid=1165941964](https://en.wikipedia.org/w/index.php?title=FOAF&oldid=1165941964)
SMDATA*********************************

[https://en.wikipedia.org/w/index.php?title=FOAF&oldid=1165941964](https://en.wikipedia.org/w/index.php?title=FOAF&oldid=1165941964)
emitLocal === 
[Categories](https://en.wikipedia.org/wiki/Help:Category)
SMDATA*********************************

[Categories](https://en.wikipedia.org/wiki/Help:Category)
emitLocal === 
[Ontology (information science)](https://en.wikipedia.org/wiki/Category:Ontology_(information_science))
SMDATA*********************************

[Ontology (information science)](https://en.wikipedia.org/wiki/Category:Ontology_(information_science))
emitLocal === 
[Semantic Web](https://en.wikipedia.org/wiki/Category:Semantic_Web)
SMDATA*********************************

[Semantic Web](https://en.wikipedia.org/wiki/Category:Semantic_Web)
emitLocal === 
[2000 software](https://en.wikipedia.org/wiki/Category:2000_software)
SMDATA*********************************

[2000 software](https://en.wikipedia.org/wiki/Category:2000_software)
emitLocal === 
[Articles with short description](https://en.wikipedia.org/wiki/Category:Articles_with_short_description)
SMDATA*********************************

[Articles with short description](https://en.wikipedia.org/wiki/Category:Articles_with_short_description)
emitLocal === 
[Short description matches Wikidata](https://en.wikipedia.org/wiki/Category:Short_description_matches_Wikidata)
SMDATA*********************************

[Short description matches Wikidata](https://en.wikipedia.org/wiki/Category:Short_description_matches_Wikidata)
emitLocal === 
[All articles with unsourced statements](https://en.wikipedia.org/wiki/Category:All_articles_with_unsourced_statements)
SMDATA*********************************

[All articles with unsourced statements](https://en.wikipedia.org/wiki/Category:All_articles_with_unsourced_statements)
emitLocal === 
[Articles with unsourced statements from April 2017](https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_April_2017)
SMDATA*********************************

[Articles with unsourced statements from April 2017](https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_April_2017)
emitLocal === 
[Wikipedia articles needing clarification from April 2017](https://en.wikipedia.org/wiki/Category:Wikipedia_articles_needing_clarification_from_April_2017)
SMDATA*********************************

[Wikipedia articles needing clarification from April 2017](https://en.wikipedia.org/wiki/Category:Wikipedia_articles_needing_clarification_from_April_2017)
emitLocal === 
[Webarchive template wayback links](https://en.wikipedia.org/wiki/Category:Webarchive_template_wayback_links)
SMDATA*********************************

[Webarchive template wayback links](https://en.wikipedia.org/wiki/Category:Webarchive_template_wayback_links)
emitLocal === 
[Creative Commons Attribution-ShareAlike License 4.0](https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License)
SMDATA*********************************

[Creative Commons Attribution-ShareAlike License 4.0](https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License)
emitLocal === 
[](https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License)
SMDATA*********************************

[](https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License)
emitLocal === 
[Terms of Use](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Terms_of_Use)
SMDATA*********************************

[Terms of Use](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Terms_of_Use)
emitLocal === 
[Privacy Policy](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy)
SMDATA*********************************

[Privacy Policy](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy)
emitLocal === 
[Wikimedia Foundation, Inc.](https://www.wikimediafoundation.org/)
SMDATA*********************************

[Wikimedia Foundation, Inc.](https://www.wikimediafoundation.org/)
emitLocal === 
[Privacy policy](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy)
SMDATA*********************************

[Privacy policy](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy)
emitLocal === 
[About Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:About)
SMDATA*********************************

[About Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:About)
emitLocal === 
[Disclaimers](https://en.wikipedia.org/wiki/Wikipedia:General_disclaimer)
SMDATA*********************************

[Disclaimers](https://en.wikipedia.org/wiki/Wikipedia:General_disclaimer)
emitLocal === 
[Contact Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Contact_us)
SMDATA*********************************

[Contact Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Contact_us)
emitLocal === 
[Code of Conduct](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Universal_Code_of_Conduct)
SMDATA*********************************

[Code of Conduct](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Universal_Code_of_Conduct)
emitLocal === 
[Developers](https://developer.wikimedia.org)
SMDATA*********************************

[Developers](https://developer.wikimedia.org)
emitLocal === 
[Statistics](https://stats.wikimedia.org/#/en.wikipedia.org)
SMDATA*********************************

[Statistics](https://stats.wikimedia.org/#/en.wikipedia.org)
emitLocal === 
[Cookie statement](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Cookie_statement)
SMDATA*********************************

[Cookie statement](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Cookie_statement)
emitLocal === 
[Mobile view](https://en.m.wikipedia.org/w/index.php?title=FOAF&mobileaction=toggle_view_mobile)
SMDATA*********************************

[Mobile view](https://en.m.wikipedia.org/w/index.php?title=FOAF&mobileaction=toggle_view_mobile)
emitLocal === 
[](https://wikimediafoundation.org/)
SMDATA*********************************

[](https://wikimediafoundation.org/)
emitLocal === 
[](https://www.mediawiki.org/)
SMDATA*********************************

[](https://www.mediawiki.org/)
emitLocal === 

# FOAF Vocabulary Specification 0.99

SMDATA*********************************


# FOAF Vocabulary Specification 0.99

emitLocal === 

## Namespace Document 14 January 2014 - Paddington Edition

SMDATA*********************************


## Namespace Document 14 January 2014 - Paddington Edition

emitLocal === 
[http://xmlns.com/foaf/spec/20140114.html](http://xmlns.com/foaf/spec/20140114.html)
SMDATA*********************************

[http://xmlns.com/foaf/spec/20140114.html](http://xmlns.com/foaf/spec/20140114.html)
emitLocal === 
[rdf](http://xmlns.com/foaf/spec/20140114.rdf)
SMDATA*********************************

[rdf](http://xmlns.com/foaf/spec/20140114.rdf)
emitLocal === 
[http://xmlns.com/foaf/spec/](http://xmlns.com/foaf/spec/)
SMDATA*********************************

[http://xmlns.com/foaf/spec/](http://xmlns.com/foaf/spec/)
emitLocal === 
[rdf](http://xmlns.com/foaf/spec/index.rdf)
SMDATA*********************************

[rdf](http://xmlns.com/foaf/spec/index.rdf)
emitLocal === 
[http://xmlns.com/foaf/spec/20100809.html](http://xmlns.com/foaf/spec/20100809.html)
SMDATA*********************************

[http://xmlns.com/foaf/spec/20100809.html](http://xmlns.com/foaf/spec/20100809.html)
emitLocal === 
[rdf](http://xmlns.com/foaf/spec/20100809.rdf)
SMDATA*********************************

[rdf](http://xmlns.com/foaf/spec/20100809.rdf)
emitLocal === 
[Dan Brickley](mailto:danbri@danbri.org)
SMDATA*********************************

[Dan Brickley](mailto:danbri@danbri.org)
emitLocal === 
[Libby Miller](mailto:libby@nicecupoftea.org)
SMDATA*********************************

[Libby Miller](mailto:libby@nicecupoftea.org)
emitLocal === 
[foaf-dev@lists.foaf-project.org](http://lists.foaf-project.org/)
SMDATA*********************************

[foaf-dev@lists.foaf-project.org](http://lists.foaf-project.org/)
emitLocal === 
[RDF
    and Semantic Web developer community](http://www.w3.org/2001/sw/interest/)
SMDATA*********************************

[RDF
    and Semantic Web developer community](http://www.w3.org/2001/sw/interest/)
emitLocal === 
[](http://creativecommons.org/licenses/by/1.0/)
SMDATA*********************************

[](http://creativecommons.org/licenses/by/1.0/)
emitLocal === 
[Creative Commons Attribution License](http://creativecommons.org/licenses/by/1.0/)
SMDATA*********************************

[Creative Commons Attribution License](http://creativecommons.org/licenses/by/1.0/)
emitLocal === 
[RDF](http://www.w3.org/RDF/)
SMDATA*********************************

[RDF](http://www.w3.org/RDF/)
emitLocal === 

## Abstract

SMDATA*********************************


## Abstract

emitLocal === 

## Status of This Document

SMDATA*********************************


## Status of This Document

emitLocal === 
[FOAF project](http://www.foaf-project.org/)
SMDATA*********************************

[FOAF project](http://www.foaf-project.org/)
emitLocal === 
[RDFS/OWL](http://xmlns.com/foaf/spec/index.rdf)
SMDATA*********************************

[RDFS/OWL](http://xmlns.com/foaf/spec/index.rdf)
emitLocal === 
[per-term](http://xmlns.com/foaf/doc/)
SMDATA*********************************

[per-term](http://xmlns.com/foaf/doc/)
emitLocal === 
[multilingual translations](http://svn.foaf-project.org/foaftown/foaf18n/)
SMDATA*********************************

[multilingual translations](http://svn.foaf-project.org/foaftown/foaf18n/)
emitLocal === 
[direct link](http://xmlns.com/foaf/spec/index.rdf)
SMDATA*********************************

[direct link](http://xmlns.com/foaf/spec/index.rdf)
emitLocal === 
[content negotiation](http://en.wikipedia.org/wiki/Content_negotiation)
SMDATA*********************************

[content negotiation](http://en.wikipedia.org/wiki/Content_negotiation)
emitLocal === 
[namespace URI](http://xmlns.com/foaf/0.1/)
SMDATA*********************************

[namespace URI](http://xmlns.com/foaf/0.1/)
emitLocal === 
[foaf-dev@lists.foaf-project.org](mailto:foaf-dev@lists.foaf-project.org)
SMDATA*********************************

[foaf-dev@lists.foaf-project.org](mailto:foaf-dev@lists.foaf-project.org)
emitLocal === 
[public archives](http://lists.foaf-project.org)
SMDATA*********************************

[public archives](http://lists.foaf-project.org)
emitLocal === 
[FOAF mailing list](mailto:foaf-dev@lists.foaf-project.org)
SMDATA*********************************

[FOAF mailing list](mailto:foaf-dev@lists.foaf-project.org)
emitLocal === 
[FOAF website](http://www.foaf-project.org/)
SMDATA*********************************

[FOAF website](http://www.foaf-project.org/)
emitLocal === 

### Changes in version 0.99

SMDATA*********************************


### Changes in version 0.99

emitLocal === 

## Table of Contents

SMDATA*********************************


## Table of Contents

emitLocal === 

## FOAF at a glance

SMDATA*********************************


## FOAF at a glance

emitLocal === 
[Dublin Core](http://www.dublincore.org/)
SMDATA*********************************

[Dublin Core](http://www.dublincore.org/)
emitLocal === 
[SKOS](http://www.w3.org/2004/02/skos/)
SMDATA*********************************

[SKOS](http://www.w3.org/2004/02/skos/)
emitLocal === 
[DOAP](http://trac.usefulinc.com/doap)
SMDATA*********************************

[DOAP](http://trac.usefulinc.com/doap)
emitLocal === 
[SIOC](http://sioc-project.org/)
SMDATA*********************************

[SIOC](http://sioc-project.org/)
emitLocal === 
[Org vocabulary](http://www.epimorphics.com/public/vocabulary/org.html)
SMDATA*********************************

[Org vocabulary](http://www.epimorphics.com/public/vocabulary/org.html)
emitLocal === 
[Bio vocabulary](http://vocab.org/bio/0.1/.html)
SMDATA*********************************

[Bio vocabulary](http://vocab.org/bio/0.1/.html)
emitLocal === 
[Portable Contacts](http://portablecontacts.net/)
SMDATA*********************************

[Portable Contacts](http://portablecontacts.net/)
emitLocal === 
[W3C Social Web group](http://www.w3.org/2005/Incubator/socialweb/)
SMDATA*********************************

[W3C Social Web group](http://www.w3.org/2005/Incubator/socialweb/)
emitLocal === 

### FOAF Core

SMDATA*********************************


### FOAF Core

emitLocal === 

### Social Web

SMDATA*********************************


### Social Web

emitLocal === 

### A-Z of FOAF terms (current and archaic)

SMDATA*********************************


### A-Z of FOAF terms (current and archaic)

emitLocal === 

## Example

SMDATA*********************************


## Example

emitLocal === 

## 1 Introduction: FOAF Basics

SMDATA*********************************


## 1 Introduction: FOAF Basics

emitLocal === 

### The Semantic Web

SMDATA*********************************


### The Semantic Web

emitLocal === 
[W3 future directions](http://www.w3.org/Talks/WWW94Tim/)
SMDATA*********************************

[W3 future directions](http://www.w3.org/Talks/WWW94Tim/)
emitLocal === 
[Giant Global Graph](http://dig.csail.mit.edu/breadcrumbs/node/215)
SMDATA*********************************

[Giant Global Graph](http://dig.csail.mit.edu/breadcrumbs/node/215)
emitLocal === 
[foaf](http://www.w3.org/People/Berners-Lee/card)
SMDATA*********************************

[foaf](http://www.w3.org/People/Berners-Lee/card)
emitLocal === 

### FOAF and the Semantic Web

SMDATA*********************************


### FOAF and the Semantic Web

emitLocal === 
[Semantic Web](http://www.w3.org/2001/sw/)
SMDATA*********************************

[Semantic Web](http://www.w3.org/2001/sw/)
emitLocal === 
[SPARQL](http://www.w3.org/TR/rdf-sparql-query/)
SMDATA*********************************

[SPARQL](http://www.w3.org/TR/rdf-sparql-query/)
emitLocal === 
[SKOS](http://www.w3.org/2004/02/skos/)
SMDATA*********************************

[SKOS](http://www.w3.org/2004/02/skos/)
emitLocal === 
[GRDDL](http://www.w3.org/2001/sw/grddl-wg/)
SMDATA*********************************

[GRDDL](http://www.w3.org/2001/sw/grddl-wg/)
emitLocal === 
[RDFa](http://www.w3.org/TR/xhtml-rdfa-primer/)
SMDATA*********************************

[RDFa](http://www.w3.org/TR/xhtml-rdfa-primer/)
emitLocal === 
[Linked 
  Data](http://www.w3.org/DesignIssues/LinkedData.html)
SMDATA*********************************

[Linked 
  Data](http://www.w3.org/DesignIssues/LinkedData.html)
emitLocal === 

### The Basic Idea

SMDATA*********************************


### The Basic Idea

emitLocal === 
[FOAF namespace
  document](http://xmlns.com/foaf/0.1/)
SMDATA*********************************

[FOAF namespace
  document](http://xmlns.com/foaf/0.1/)
emitLocal === 

## What's FOAF for?

SMDATA*********************************


## What's FOAF for?

emitLocal === 
[XML
  Watch: Finding friends with XML and RDF](http://www-106.ibm.com/developerworks/xml/library/x-foaf.html)
SMDATA*********************************

[XML
  Watch: Finding friends with XML and RDF](http://www-106.ibm.com/developerworks/xml/library/x-foaf.html)
emitLocal === 
[with image metadata](http://rdfweb.org/2002/01/photo/)
SMDATA*********************************

[with image metadata](http://rdfweb.org/2002/01/photo/)
emitLocal === 
[co-depiction](http://rdfweb.org/2002/01/photo/)
SMDATA*********************************

[co-depiction](http://rdfweb.org/2002/01/photo/)
emitLocal === 
[FOAF-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)
SMDATA*********************************

[FOAF-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)
emitLocal === 
[FOAF project home page](http://www.foaf-project.org)
SMDATA*********************************

[FOAF project home page](http://www.foaf-project.org)
emitLocal === 

## Background

SMDATA*********************************


## Background

emitLocal === 
[alt.folklore.urban archive](http://www.urbanlegends.com/)
SMDATA*********************************

[alt.folklore.urban archive](http://www.urbanlegends.com/)
emitLocal === 
[snopes.com](http://www.snopes.com/)
SMDATA*********************************

[snopes.com](http://www.snopes.com/)
emitLocal === 

## FOAF and Standards

SMDATA*********************************


## FOAF and Standards

emitLocal === 
[ISO
  Standardisation](http://www.iso.ch/iso/en/ISOOnline.openerpage)
SMDATA*********************************

[ISO
  Standardisation](http://www.iso.ch/iso/en/ISOOnline.openerpage)
emitLocal === 
[W3C](http://www.w3.org/)
SMDATA*********************************

[W3C](http://www.w3.org/)
emitLocal === 
[Process](http://www.w3.org/Consortium/Process/)
SMDATA*********************************

[Process](http://www.w3.org/Consortium/Process/)
emitLocal === 
[Open Source](http://www.opensource.org/)
SMDATA*********************************

[Open Source](http://www.opensource.org/)
emitLocal === 
[Free Software](http://www.gnu.org/philosophy/free-sw.html)
SMDATA*********************************

[Free Software](http://www.gnu.org/philosophy/free-sw.html)
emitLocal === 
[Jabber
  JEPs](http://www.jabber.org/jeps/jep-0001.html)
SMDATA*********************************

[Jabber
  JEPs](http://www.jabber.org/jeps/jep-0001.html)
emitLocal === 
[Resource Description Framework](http://www.w3.org/RDF/)
SMDATA*********************************

[Resource Description Framework](http://www.w3.org/RDF/)
emitLocal === 

## The FOAF Vocabulary Description

SMDATA*********************************


## The FOAF Vocabulary Description

emitLocal === 
[RDF](http://www.w3.org/RDF/)
SMDATA*********************************

[RDF](http://www.w3.org/RDF/)
emitLocal === 
[Semantic Web](http://www.w3.org/2001/sw/)
SMDATA*********************************

[Semantic Web](http://www.w3.org/2001/sw/)
emitLocal === 
[Semantic Web](http://www.w3.org/2001/sw/)
SMDATA*********************************

[Semantic Web](http://www.w3.org/2001/sw/)
emitLocal === 

### Evolution and Extension of FOAF

SMDATA*********************************


### Evolution and Extension of FOAF

emitLocal === 
[Dublin Core](http://dublincore.org/)
SMDATA*********************************

[Dublin Core](http://dublincore.org/)
emitLocal === 

## FOAF Auto-Discovery: Publishing and Linking FOAF files

SMDATA*********************************


## FOAF Auto-Discovery: Publishing and Linking FOAF files

emitLocal === 
[foaf-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)
SMDATA*********************************

[foaf-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)
emitLocal === 
[FOAF
  autodiscovery](http://web.archive.org/web/20040416181630/rdfweb.org/mt/foaflog/archives/000041.html)
SMDATA*********************************

[FOAF
  autodiscovery](http://web.archive.org/web/20040416181630/rdfweb.org/mt/foaflog/archives/000041.html)
emitLocal === 

## FOAF cross-reference: Listing FOAF Classes and
  Properties

SMDATA*********************************


## FOAF cross-reference: Listing FOAF Classes and
  Properties

emitLocal === 
[RDF/XML](http://xmlns.com/foaf/spec/index.rdf)
SMDATA*********************************

[RDF/XML](http://xmlns.com/foaf/spec/index.rdf)
emitLocal === 

### Classes and Properties (full detail)

SMDATA*********************************


### Classes and Properties (full detail)

emitLocal === 

## Classes

SMDATA*********************************


## Classes

emitLocal === 

### Class: foaf:Agent

SMDATA*********************************


### Class: foaf:Agent

emitLocal === 

### Class: foaf:Document

SMDATA*********************************


### Class: foaf:Document

emitLocal === 

### Class: foaf:Group

SMDATA*********************************


### Class: foaf:Group

emitLocal === 
[issue tracker](http://wiki.foaf-project.org/w/IssueTracker)
SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/IssueTracker)
emitLocal === 
[OWL](http://www.w3.org/2001/sw/WebOnt)
SMDATA*********************************

[OWL](http://www.w3.org/2001/sw/WebOnt)
emitLocal === 

### Class: foaf:Image

SMDATA*********************************


### Class: foaf:Image

emitLocal === 

### Class: foaf:Organization

SMDATA*********************************


### Class: foaf:Organization

emitLocal === 

### Class: foaf:Person

SMDATA*********************************


### Class: foaf:Person

emitLocal === 

### Class: foaf:OnlineAccount

SMDATA*********************************


### Class: foaf:OnlineAccount

emitLocal === 

### Class: foaf:PersonalProfileDocument

SMDATA*********************************


### Class: foaf:PersonalProfileDocument

emitLocal === 
[GRDDL](http://www.w3.org/2004/01/rdxh/spec)
SMDATA*********************************

[GRDDL](http://www.w3.org/2004/01/rdxh/spec)
emitLocal === 

### Class: foaf:Project

SMDATA*********************************


### Class: foaf:Project

emitLocal === 

### Class: foaf:LabelProperty

SMDATA*********************************


### Class: foaf:LabelProperty

emitLocal === 

### Class: foaf:OnlineChatAccount

SMDATA*********************************


### Class: foaf:OnlineChatAccount

emitLocal === 
[Jabber](http://www.jabber.org/)
SMDATA*********************************

[Jabber](http://www.jabber.org/)
emitLocal === 
[AIM](http://www.aim.com/)
SMDATA*********************************

[AIM](http://www.aim.com/)
emitLocal === 
[MSN](http://chat.msn.com/)
SMDATA*********************************

[MSN](http://chat.msn.com/)
emitLocal === 
[ICQ](http://web.icq.com/icqchat/)
SMDATA*********************************

[ICQ](http://web.icq.com/icqchat/)
emitLocal === 
[Yahoo!](http://chat.yahoo.com/)
SMDATA*********************************

[Yahoo!](http://chat.yahoo.com/)
emitLocal === 
[MSN](http://chat.msn.com/)
SMDATA*********************************

[MSN](http://chat.msn.com/)
emitLocal === 
[Freenode](http://www.freenode.net/)
SMDATA*********************************

[Freenode](http://www.freenode.net/)
emitLocal === 

### Class: foaf:OnlineEcommerceAccount

SMDATA*********************************


### Class: foaf:OnlineEcommerceAccount

emitLocal === 
[Amazon](http://www.amazon.com/)
SMDATA*********************************

[Amazon](http://www.amazon.com/)
emitLocal === 
[eBay](http://www.ebay.com/)
SMDATA*********************************

[eBay](http://www.ebay.com/)
emitLocal === 
[PayPal](http://www.paypal.com/)
SMDATA*********************************

[PayPal](http://www.paypal.com/)
emitLocal === 
[thinkgeek](http://www.thinkgeek.com/)
SMDATA*********************************

[thinkgeek](http://www.thinkgeek.com/)
emitLocal === 

### Class: foaf:OnlineGamingAccount

SMDATA*********************************


### Class: foaf:OnlineGamingAccount

emitLocal === 
[EverQuest](http://everquest.station.sony.com/)
SMDATA*********************************

[EverQuest](http://everquest.station.sony.com/)
emitLocal === 
[Xbox live](http://www.xbox.com/live/)
SMDATA*********************************

[Xbox live](http://www.xbox.com/live/)
emitLocal === 
[Neverwinter Nights](http://nwn.bioware.com/)
SMDATA*********************************

[Neverwinter Nights](http://nwn.bioware.com/)
emitLocal === 

## Properties

SMDATA*********************************


## Properties

emitLocal === 

### Property: foaf:homepage

SMDATA*********************************


### Property: foaf:homepage

emitLocal === 

### Property: foaf:isPrimaryTopicOf

SMDATA*********************************


### Property: foaf:isPrimaryTopicOf

emitLocal === 

### Property: foaf:knows

SMDATA*********************************


### Property: foaf:knows

emitLocal === 
[Relationship module](http://www.perceive.net/schemas/20021119/relationship/)
SMDATA*********************************

[Relationship module](http://www.perceive.net/schemas/20021119/relationship/)
emitLocal === 
[scutters](http://wiki.foaf-project.org/w/ScutterSpec)
SMDATA*********************************

[scutters](http://wiki.foaf-project.org/w/ScutterSpec)
emitLocal === 

### Property: foaf:made

SMDATA*********************************


### Property: foaf:made

emitLocal === 

### Property: foaf:maker

SMDATA*********************************


### Property: foaf:maker

emitLocal === 
[UsingDublinCoreCreator](http://wiki.foaf-project.org/w/UsingDublinCoreCreator)
SMDATA*********************************

[UsingDublinCoreCreator](http://wiki.foaf-project.org/w/UsingDublinCoreCreator)
emitLocal === 

### Property: foaf:mbox

SMDATA*********************************


### Property: foaf:mbox

emitLocal === 
[RFC 2368](http://ftp.ics.uci.edu/pub/ietf/uri/rfc2368.txt)
SMDATA*********************************

[RFC 2368](http://ftp.ics.uci.edu/pub/ietf/uri/rfc2368.txt)
emitLocal === 

### Property: foaf:member

SMDATA*********************************


### Property: foaf:member

emitLocal === 

### Property: foaf:page

SMDATA*********************************


### Property: foaf:page

emitLocal === 

### Property: foaf:primaryTopic

SMDATA*********************************


### Property: foaf:primaryTopic

emitLocal === 
[Wikipedia](http://www.wikipedia.org/)
SMDATA*********************************

[Wikipedia](http://www.wikipedia.org/)
emitLocal === 
[NNDB](http://www.nndb.com/)
SMDATA*********************************

[NNDB](http://www.nndb.com/)
emitLocal === 

### Property: foaf:weblog

SMDATA*********************************


### Property: foaf:weblog

emitLocal === 

### Property: foaf:account

SMDATA*********************************


### Property: foaf:account

emitLocal === 

### Property: foaf:accountName

SMDATA*********************************


### Property: foaf:accountName

emitLocal === 

### Property: foaf:accountServiceHomepage

SMDATA*********************************


### Property: foaf:accountServiceHomepage

emitLocal === 

### Property: foaf:aimChatID

SMDATA*********************************


### Property: foaf:aimChatID

emitLocal === 
[AIM](http://www.aim.com/)
SMDATA*********************************

[AIM](http://www.aim.com/)
emitLocal === 
[iChat](http://www.apple.com/macosx/what-is-macosx/ichat.html)
SMDATA*********************************

[iChat](http://www.apple.com/macosx/what-is-macosx/ichat.html)
emitLocal === 
[Apple](http://www.apple.com/)
SMDATA*********************************

[Apple](http://www.apple.com/)
emitLocal === 

### Property: foaf:based_near

SMDATA*********************************


### Property: foaf:based_near

emitLocal === 
[geo-positioning vocabulary](http://www.w3.org/2003/01/geo/wgs84_pos#)
SMDATA*********************************

[geo-positioning vocabulary](http://www.w3.org/2003/01/geo/wgs84_pos#)
emitLocal === 
[GeoInfo](http://esw.w3.org/topic/GeoInfo)
SMDATA*********************************

[GeoInfo](http://esw.w3.org/topic/GeoInfo)
emitLocal === 
[GeoOnion vocab](http://esw.w3.org/topic/GeoOnion)
SMDATA*********************************

[GeoOnion vocab](http://esw.w3.org/topic/GeoOnion)
emitLocal === 
[UsingContactNearestAirport](http://wiki.foaf-project.org/w/UsingContactNearestAirport)
SMDATA*********************************

[UsingContactNearestAirport](http://wiki.foaf-project.org/w/UsingContactNearestAirport)
emitLocal === 

### Property: foaf:currentProject

SMDATA*********************************


### Property: foaf:currentProject

emitLocal === 

### Property: foaf:depiction

SMDATA*********************************


### Property: foaf:depiction

emitLocal === 
[Co-Depiction](http://rdfweb.org/2002/01/photo/)
SMDATA*********************************

[Co-Depiction](http://rdfweb.org/2002/01/photo/)
emitLocal === 
['Annotating Images With SVG'](http://www.jibbering.com/svg/AnnotateImage.html)
SMDATA*********************************

['Annotating Images With SVG'](http://www.jibbering.com/svg/AnnotateImage.html)
emitLocal === 

### Property: foaf:depicts

SMDATA*********************************


### Property: foaf:depicts

emitLocal === 

### Property: foaf:familyName

SMDATA*********************************


### Property: foaf:familyName

emitLocal === 
[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
emitLocal === 

### Property: foaf:firstName

SMDATA*********************************


### Property: foaf:firstName

emitLocal === 
[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
emitLocal === 

### Property: foaf:focus

SMDATA*********************************


### Property: foaf:focus

emitLocal === 
[SKOS](http://www.w3.org/2004/02/skos/)
SMDATA*********************************

[SKOS](http://www.w3.org/2004/02/skos/)
emitLocal === 
[In SKOS](http://www.w3.org/TR/2005/WD-swbp-skos-core-guide-20050510/#secmodellingrdf)
SMDATA*********************************

[In SKOS](http://www.w3.org/TR/2005/WD-swbp-skos-core-guide-20050510/#secmodellingrdf)
emitLocal === 
[2005 discussion](http://www.w3.org/TR/2005/WD-swbp-skos-core-guide-20051102/#secopen)
SMDATA*********************************

[2005 discussion](http://www.w3.org/TR/2005/WD-swbp-skos-core-guide-20051102/#secopen)
emitLocal === 
[TDB URI scheme](http://larry.masinter.net/duri.html)
SMDATA*********************************

[TDB URI scheme](http://larry.masinter.net/duri.html)
emitLocal === 
[original goals](http://www.foaf-project.org/original-intro)
SMDATA*********************************

[original goals](http://www.foaf-project.org/original-intro)
emitLocal === 

### Property: foaf:gender

SMDATA*********************************


### Property: foaf:gender

emitLocal === 
[foaf-dev](http://lists.foaf-project.org/mailman/listinfo/foaf-dev)
SMDATA*********************************

[foaf-dev](http://lists.foaf-project.org/mailman/listinfo/foaf-dev)
emitLocal === 

### Property: foaf:givenName

SMDATA*********************************


### Property: foaf:givenName

emitLocal === 
[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
emitLocal === 

### Property: foaf:icqChatID

SMDATA*********************************


### Property: foaf:icqChatID

emitLocal === 
[icq chat](http://web.icq.com/icqchat/)
SMDATA*********************************

[icq chat](http://web.icq.com/icqchat/)
emitLocal === 
[What is ICQ?](http://www.icq.com/products/whatisicq.html)
SMDATA*********************************

[What is ICQ?](http://www.icq.com/products/whatisicq.html)
emitLocal === 
[About Us](http://company.icq.com/info/)
SMDATA*********************************

[About Us](http://company.icq.com/info/)
emitLocal === 

### Property: foaf:img

SMDATA*********************************


### Property: foaf:img

emitLocal === 

### Property: foaf:interest

SMDATA*********************************


### Property: foaf:interest

emitLocal === 
[RDF](http://www.w3.org/RDF/)
SMDATA*********************************

[RDF](http://www.w3.org/RDF/)
emitLocal === 
[CPAN](http://www.cpan.org/)
SMDATA*********************************

[CPAN](http://www.cpan.org/)
emitLocal === 

### Property: foaf:jabberID

SMDATA*********************************


### Property: foaf:jabberID

emitLocal === 
[Jabber](http://www.jabber.org/)
SMDATA*********************************

[Jabber](http://www.jabber.org/)
emitLocal === 
[Jabber](http://www.jabber.org/)
SMDATA*********************************

[Jabber](http://www.jabber.org/)
emitLocal === 

### Property: foaf:lastName

SMDATA*********************************


### Property: foaf:lastName

emitLocal === 
[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
emitLocal === 

### Property: foaf:logo

SMDATA*********************************


### Property: foaf:logo

emitLocal === 

### Property: foaf:mbox_sha1sum

SMDATA*********************************


### Property: foaf:mbox_sha1sum

emitLocal === 
[Edd Dumbill's 
documentation](http://usefulinc.com/foaf/)
SMDATA*********************************

[Edd Dumbill's 
documentation](http://usefulinc.com/foaf/)
emitLocal === 
[FOAF-based whitelists](http://www.w3.org/2001/12/rubyrdf/util/foafwhite/intro.html)
SMDATA*********************************

[FOAF-based whitelists](http://www.w3.org/2001/12/rubyrdf/util/foafwhite/intro.html)
emitLocal === 
[in Sam Ruby's 
weblog entry](http://www.intertwingly.net/blog/1545.html)
SMDATA*********************************

[in Sam Ruby's 
weblog entry](http://www.intertwingly.net/blog/1545.html)
emitLocal === 

### Property: foaf:msnChatID

SMDATA*********************************


### Property: foaf:msnChatID

emitLocal === 
[Windows Live Messenger](http://en.wikipedia.org/wiki/Windows_Live_Messenger)
SMDATA*********************************

[Windows Live Messenger](http://en.wikipedia.org/wiki/Windows_Live_Messenger)
emitLocal === 
[Microsoft mesenger](http://download.live.com/messenger)
SMDATA*********************************

[Microsoft mesenger](http://download.live.com/messenger)
emitLocal === 
[Windows Live ID](http://en.wikipedia.org/wiki/Windows_Live_ID)
SMDATA*********************************

[Windows Live ID](http://en.wikipedia.org/wiki/Windows_Live_ID)
emitLocal === 

### Property: foaf:myersBriggs

SMDATA*********************************


### Property: foaf:myersBriggs

emitLocal === 
[this article](http://www.teamtechnology.co.uk/tt/t-articl/mb-simpl.htm)
SMDATA*********************************

[this article](http://www.teamtechnology.co.uk/tt/t-articl/mb-simpl.htm)
emitLocal === 
[Cory Caplinger's summary table](http://webspace.webring.com/people/cl/lifexplore/mbintro.htm)
SMDATA*********************************

[Cory Caplinger's summary table](http://webspace.webring.com/people/cl/lifexplore/mbintro.htm)
emitLocal === 
[FOAF Myers Briggs addition](http://web.archive.org/web/20080802184922/http://rdfweb.org/mt/foaflog/archives/000004.html)
SMDATA*********************************

[FOAF Myers Briggs addition](http://web.archive.org/web/20080802184922/http://rdfweb.org/mt/foaflog/archives/000004.html)
emitLocal === 

### Property: foaf:name

SMDATA*********************************


### Property: foaf:name

emitLocal === 
[issue tracker](http://wiki.foaf-project.org/w/IssueTracker)
SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/IssueTracker)
emitLocal === 

### Property: foaf:nick

SMDATA*********************************


### Property: foaf:nick

emitLocal === 

### Property: foaf:openid

SMDATA*********************************


### Property: foaf:openid

emitLocal === 
[indirect identifier](http://www.w3.org/TR/webarch/#indirect-identification)
SMDATA*********************************

[indirect identifier](http://www.w3.org/TR/webarch/#indirect-identification)
emitLocal === 
[OpenID](http://openid.net/specs/openid-authentication-1_1.html)
SMDATA*********************************

[OpenID](http://openid.net/specs/openid-authentication-1_1.html)
emitLocal === 
[delegation model](http://openid.net/specs/openid-authentication-1_1.html#delegating_authentication)
SMDATA*********************************

[delegation model](http://openid.net/specs/openid-authentication-1_1.html#delegating_authentication)
emitLocal === 
[technique](http://xmlns.com/foaf/spec/#sec-autodesc)
SMDATA*********************************

[technique](http://xmlns.com/foaf/spec/#sec-autodesc)
emitLocal === 

### Property: foaf:pastProject

SMDATA*********************************


### Property: foaf:pastProject

emitLocal === 

### Property: foaf:phone

SMDATA*********************************


### Property: foaf:phone

emitLocal === 

### Property: foaf:plan

SMDATA*********************************


### Property: foaf:plan

emitLocal === 
[History of the 
Finger Protocol](http://www.rajivshah.com/Case_Studies/Finger/Finger.htm)
SMDATA*********************************

[History of the 
Finger Protocol](http://www.rajivshah.com/Case_Studies/Finger/Finger.htm)
emitLocal === 

### Property: foaf:publications

SMDATA*********************************


### Property: foaf:publications

emitLocal === 

### Property: foaf:schoolHomepage

SMDATA*********************************


### Property: foaf:schoolHomepage

emitLocal === 

### Property: foaf:skypeID

SMDATA*********************************


### Property: foaf:skypeID

emitLocal === 

### Property: foaf:thumbnail

SMDATA*********************************


### Property: foaf:thumbnail

emitLocal === 

### Property: foaf:tipjar

SMDATA*********************************


### Property: foaf:tipjar

emitLocal === 
[discussions](http://rdfweb.org/mt/foaflog/archives/2004/02/12/20.07.32/)
SMDATA*********************************

[discussions](http://rdfweb.org/mt/foaflog/archives/2004/02/12/20.07.32/)
emitLocal === 
[PayPal](http://www.paypal.com/)
SMDATA*********************************

[PayPal](http://www.paypal.com/)
emitLocal === 

### Property: foaf:title

SMDATA*********************************


### Property: foaf:title

emitLocal === 
[FOAF Issue Tracker](http://wiki.foaf-project.org/w/IssueTracker)
SMDATA*********************************

[FOAF Issue Tracker](http://wiki.foaf-project.org/w/IssueTracker)
emitLocal === 

### Property: foaf:topic

SMDATA*********************************


### Property: foaf:topic

emitLocal === 

### Property: foaf:topic_interest

SMDATA*********************************


### Property: foaf:topic_interest

emitLocal === 

### Property: foaf:workInfoHomepage

SMDATA*********************************


### Property: foaf:workInfoHomepage

emitLocal === 

### Property: foaf:workplaceHomepage

SMDATA*********************************


### Property: foaf:workplaceHomepage

emitLocal === 

### Property: foaf:yahooChatID

SMDATA*********************************


### Property: foaf:yahooChatID

emitLocal === 
[Yahoo! Chat](http://chat.yahoo.com/)
SMDATA*********************************

[Yahoo! Chat](http://chat.yahoo.com/)
emitLocal === 
[Yahoo! Groups](http://www.yahoogroups.com/)
SMDATA*********************************

[Yahoo! Groups](http://www.yahoogroups.com/)
emitLocal === 

### Property: foaf:age

SMDATA*********************************


### Property: foaf:age

emitLocal === 

### Property: foaf:birthday

SMDATA*********************************


### Property: foaf:birthday

emitLocal === 
[BirthdayIssue](http://wiki.foaf-project.org/w/BirthdayIssue)
SMDATA*********************************

[BirthdayIssue](http://wiki.foaf-project.org/w/BirthdayIssue)
emitLocal === 

### Property: foaf:membershipClass

SMDATA*********************************


### Property: foaf:membershipClass

emitLocal === 

### Property: foaf:sha1

SMDATA*********************************


### Property: foaf:sha1

emitLocal === 

### Property: foaf:status

SMDATA*********************************


### Property: foaf:status

emitLocal === 

### Property: foaf:dnaChecksum

SMDATA*********************************


### Property: foaf:dnaChecksum

emitLocal === 

### Property: foaf:family_name

SMDATA*********************************


### Property: foaf:family_name

emitLocal === 

### Property: foaf:fundedBy

SMDATA*********************************


### Property: foaf:fundedBy

emitLocal === 

### Property: foaf:geekcode

SMDATA*********************************


### Property: foaf:geekcode

emitLocal === 
[Wikipedia entry](http://en.wikipedia.org/wiki/Geek_Code)
SMDATA*********************************

[Wikipedia entry](http://en.wikipedia.org/wiki/Geek_Code)
emitLocal === 

### Property: foaf:givenname

SMDATA*********************************


### Property: foaf:givenname

emitLocal === 
[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
SMDATA*********************************

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)
emitLocal === 

### Property: foaf:holdsAccount

SMDATA*********************************


### Property: foaf:holdsAccount

emitLocal === 

### Property: foaf:surname

SMDATA*********************************


### Property: foaf:surname

emitLocal === 
[issue 
tracker](http://wiki.foaf-project.org/w/IssueTracker)
SMDATA*********************************

[issue 
tracker](http://wiki.foaf-project.org/w/IssueTracker)
emitLocal === 

### Property: foaf:theme

SMDATA*********************************


### Property: foaf:theme

emitLocal === 

## External Vocabulary References

SMDATA*********************************


## External Vocabulary References

emitLocal === 

### Status Vocabulary

SMDATA*********************************


### Status Vocabulary

emitLocal === 
[SemWeb Vocab Status Ontology](http://www.w3.org/2003/06/sw-vocab-status/note)
SMDATA*********************************

[SemWeb Vocab Status Ontology](http://www.w3.org/2003/06/sw-vocab-status/note)
emitLocal === 

### W3C Basic Geo (WGS84 lat/long) Vocabulary

SMDATA*********************************


### W3C Basic Geo (WGS84 lat/long) Vocabulary

emitLocal === 
[W3CBasic Geo Vocabulary](http://www.w3.org/2003/01/geo/)
SMDATA*********************************

[W3CBasic Geo Vocabulary](http://www.w3.org/2003/01/geo/)
emitLocal === 

### RDF Vocabulary Description - core concepts

SMDATA*********************************


### RDF Vocabulary Description - core concepts

emitLocal === 
[W3C's site](http://www.w3.org/2001/sw/)
SMDATA*********************************

[W3C's site](http://www.w3.org/2001/sw/)
emitLocal === 
[more background on URIs](http://www.w3.org/TR/webarch/#identification)
SMDATA*********************************

[more background on URIs](http://www.w3.org/TR/webarch/#identification)
emitLocal === 
[linked data](http://www.w3.org/DesignIssues/LinkedData)
SMDATA*********************************

[linked data](http://www.w3.org/DesignIssues/LinkedData)
emitLocal === 
[SKOS](http://www.w3.org/2004/02/skos/)
SMDATA*********************************

[SKOS](http://www.w3.org/2004/02/skos/)
emitLocal === 

### Dublin Core terms

SMDATA*********************************


### Dublin Core terms

emitLocal === 
[Dublin Core terms](http://dublincore.org/documents/dcmi-terms/)
SMDATA*********************************

[Dublin Core terms](http://dublincore.org/documents/dcmi-terms/)
emitLocal === 
[dct:Agent](http://dublincore.org/documents/dcmi-terms/#classes-Agent)
SMDATA*********************************

[dct:Agent](http://dublincore.org/documents/dcmi-terms/#classes-Agent)
emitLocal === 
[dct:creator](http://dublincore.org/documents/dcmi-terms/#terms-creator)
SMDATA*********************************

[dct:creator](http://dublincore.org/documents/dcmi-terms/#terms-creator)
emitLocal === 

### Wordnet terms

SMDATA*********************************


### Wordnet terms

emitLocal === 
[recent](http://www.w3.org/TR/wordnet-rdf/)
SMDATA*********************************

[recent](http://www.w3.org/TR/wordnet-rdf/)
emitLocal === 

### SIOC terms

SMDATA*********************************


### SIOC terms

emitLocal === 
[SIOC](http://rdfs.org/sioc/ns#)
SMDATA*********************************

[SIOC](http://rdfs.org/sioc/ns#)
emitLocal === 
[SIOC](http://www.sioc-project.org/)
SMDATA*********************************

[SIOC](http://www.sioc-project.org/)
emitLocal === 

### Acknowledgments

SMDATA*********************************


### Acknowledgments

emitLocal === 
[rdfweb-dev](http://rdfweb.org/pipermail/rdfweb-dev/)
SMDATA*********************************

[rdfweb-dev](http://rdfweb.org/pipermail/rdfweb-dev/)
emitLocal === 
[#foaf](http://rdfweb.org/irc/)
SMDATA*********************************

[#foaf](http://rdfweb.org/irc/)
emitLocal === 
[FoafExplorer](http://xml.mfd-consult.dk/foaf/explorer/)
SMDATA*********************************

[FoafExplorer](http://xml.mfd-consult.dk/foaf/explorer/)
emitLocal === 
[Web View](http://eikeon.com/foaf/)
SMDATA*********************************

[Web View](http://eikeon.com/foaf/)
emitLocal === 
[foaf-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)
SMDATA*********************************

[foaf-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)
emitLocal === 
[Ecademy](http://www.ecademy.com/)
SMDATA*********************************

[Ecademy](http://www.ecademy.com/)
emitLocal === 
[TypePad](http://www.typepad.com/)
SMDATA*********************************

[TypePad](http://www.typepad.com/)
emitLocal === 
[many](http://conferences.oreillynet.com/cs/et2003/view/e_sess/3633)
SMDATA*********************************

[many](http://conferences.oreillynet.com/cs/et2003/view/e_sess/3633)
emitLocal === 
[explaining](http://hackdiary.com/)
SMDATA*********************************

[explaining](http://hackdiary.com/)
emitLocal === 
[in Japanese](http://kanzaki.com/docs/sw/foaf.html)
SMDATA*********************************

[in Japanese](http://kanzaki.com/docs/sw/foaf.html)
emitLocal === 
[Spanish](http://f14web.com.ar/inkel/2003/01/27/foaf.html)
SMDATA*********************************

[Spanish](http://f14web.com.ar/inkel/2003/01/27/foaf.html)
emitLocal === 
[Chris Schmidt](http://crschmidt.net/)
SMDATA*********************************

[Chris Schmidt](http://crschmidt.net/)
emitLocal === 
[spec generation](http://xmlns.com/foaf/0.1/specgen.py)
SMDATA*********************************

[spec generation](http://xmlns.com/foaf/0.1/specgen.py)
emitLocal === 
[cool hacks](http://crschmidt.net/semweb/)
SMDATA*********************************

[cool hacks](http://crschmidt.net/semweb/)
emitLocal === 
[FOAF Logo](http://iandavis.com/2006/foaf-icons/)
SMDATA*********************************

[FOAF Logo](http://iandavis.com/2006/foaf-icons/)
emitLocal === 
[years ago](http://www.w3.org/History/1989/proposal.html)
SMDATA*********************************

[years ago](http://www.w3.org/History/1989/proposal.html)
emitLocal === 

## Recent Changes

SMDATA*********************************


## Recent Changes

emitLocal === 

### Changes in version 0.99 (2014-01-14)

SMDATA*********************************


### Changes in version 0.99 (2014-01-14)

emitLocal === 
[schema.org](http://schema.org/)
SMDATA*********************************

[schema.org](http://schema.org/)
emitLocal === 
[Person](http://schema.org/Person)
SMDATA*********************************

[Person](http://schema.org/Person)
emitLocal === 
[ImageObject](http://schema.org/ImageObject)
SMDATA*********************************

[ImageObject](http://schema.org/ImageObject)
emitLocal === 
[CreativeWork](http://schema.org/CreativeWork)
SMDATA*********************************

[CreativeWork](http://schema.org/CreativeWork)
emitLocal === 

### 2010-08-09

SMDATA*********************************


### 2010-08-09

emitLocal === 
[Bio vocabulary](http://vocab.org/bio/0.1/.html)
SMDATA*********************************

[Bio vocabulary](http://vocab.org/bio/0.1/.html)
emitLocal === 

### Changes from version 0.97 and 0.96

SMDATA*********************************


### Changes from version 0.97 and 0.96

emitLocal === 
[0.97](http://xmlns.com/foaf/spec/20100101.html)
SMDATA*********************************

[0.97](http://xmlns.com/foaf/spec/20100101.html)
emitLocal === 
[0.96](http://xmlns.com/foaf/spec/20091215.html)
SMDATA*********************************

[0.96](http://xmlns.com/foaf/spec/20091215.html)
emitLocal === 
[Portable Contacts](http://portablecontacts.net/)
SMDATA*********************************

[Portable Contacts](http://portablecontacts.net/)
emitLocal === 

### 2009-12-15

SMDATA*********************************


### 2009-12-15

emitLocal === 

### 2007-11-02

SMDATA*********************************


### 2007-11-02

emitLocal === 

### 2007-05-24

SMDATA*********************************


### 2007-05-24

