# FOAF Vocabulary Specification 0.99

## Namespace Document 14 January 2014 - Paddington Edition

[http://xmlns.com/foaf/spec/20140114.html](http://xmlns.com/foaf/spec/20140114.html)

[rdf](http://example.org/20140114.rdf)

[http://xmlns.com/foaf/spec/](http://xmlns.com/foaf/spec/)

[rdf](http://example.org/index.rdf)

[http://xmlns.com/foaf/spec/20100809.html](http://xmlns.com/foaf/spec/20100809.html)

[rdf](http://example.org/20100809.rdf)

[Dan Brickley](mailto:danbri@danbri.org)

[Libby Miller](mailto:libby@nicecupoftea.org)

[foaf-dev@lists.foaf-project.org](http://lists.foaf-project.org/)

[RDF
    and Semantic Web developer community](http://www.w3.org/2001/sw/interest/)

[acknowledgements](http://example.org/#sec-ack)

[](http://creativecommons.org/licenses/by/1.0/)

[Creative Commons Attribution License](http://creativecommons.org/licenses/by/1.0/)

[RDF](http://www.w3.org/RDF/)

## Abstract

## Status of This Document

[change](http://example.org/#sec-evolution)

[FOAF project](http://www.foaf-project.org/)

[RDFS/OWL](http://example.org/index.rdf)

[per-term](http://example.org/doc/)

[multilingual translations](http://svn.foaf-project.org/foaftown/foaf18n/)

[direct link](http://example.org/index.rdf)

[content negotiation](http://en.wikipedia.org/wiki/Content_negotiation)

[namespace URI](http://xmlns.com/foaf/0.1/)

[foaf-dev@lists.foaf-project.org](mailto:foaf-dev@lists.foaf-project.org)

[public archives](http://lists.foaf-project.org)

[FOAF mailing list](mailto:foaf-dev@lists.foaf-project.org)

[FOAF website](http://www.foaf-project.org/)

### Changes in version 0.99

[changes](http://example.org/#sec-changes)

## Table of Contents

[FOAF at a glance](http://example.org/#sec-glance)

[Introduction](http://example.org/#sec-intro)

[The Semantic Web](http://example.org/#sec-sw)

[FOAF and the Semantic Web](http://example.org/#sec-foafsw)

[What's FOAF for?](http://example.org/#sec-for)

[Background](http://example.org/#sec-bg)

[FOAF and Standards](http://example.org/#sec-standards)

[Evolution and Extension of FOAF](http://example.org/#sec-evolution)

[FOAF Auto-Discovery: Publishing and Linking FOAF files](http://example.org/#sec-autodesc)

[FOAF cross-reference: Listing FOAF Classes and Properties](http://example.org/#sec-crossref)

[External Vocabulary References](http://example.org/#sec-extrefs)

[Acknowledgments](http://example.org/#sec-ack)

[Recent Changes](http://example.org/#sec-changes)

[](undefined)

## FOAF at a glance

[Dublin Core](http://www.dublincore.org/)

[SKOS](http://www.w3.org/2004/02/skos/)

[DOAP](http://trac.usefulinc.com/doap)

[SIOC](http://sioc-project.org/)

[Org vocabulary](http://www.epimorphics.com/public/vocabulary/org.html)

[Bio vocabulary](http://vocab.org/bio/0.1/.html)

[Portable Contacts](http://portablecontacts.net/)

[W3C Social Web group](http://www.w3.org/2005/Incubator/socialweb/)

[geekcode](http://example.org/#term_geekcode)

[focus](http://example.org/#term_focus)

[LabelProperty](http://example.org/#term_LabelProperty)

### FOAF Core

[Agent](http://example.org/#term_Agent)

[Person](http://example.org/#term_Person)

[name](http://example.org/#term_name)

[title](http://example.org/#term_title)

[img](http://example.org/#term_img)

[depiction](http://example.org/#term_depiction)

[depicts](http://example.org/#term_depicts)

[familyName](http://example.org/#term_familyName)

[givenName](http://example.org/#term_givenName)

[knows](http://example.org/#term_knows)

[based_near](http://example.org/#term_based_near)

[age](http://example.org/#term_age)

[made](http://example.org/#term_made)

[maker](http://example.org/#term_maker)

[primaryTopic](http://example.org/#term_primaryTopic)

[primaryTopicOf](http://example.org/#term_isPrimaryTopicOf)

[Project](http://example.org/#term_Project)

[Organization](http://example.org/#term_Organization)

[Group](http://example.org/#term_Group)

[member](http://example.org/#term_member)

[Document](http://example.org/#term_Document)

[Image](http://example.org/#term_Image)

### Social Web

[nick](http://example.org/#term_nick)

[mbox](http://example.org/#term_mbox)

[homepage](http://example.org/#term_homepage)

[weblog](http://example.org/#term_weblog)

[openid](http://example.org/#term_openid)

[jabberID](http://example.org/#term_jabberID)

[mbox_sha1sum](http://example.org/#term_mbox_sha1sum)

[interest](http://example.org/#term_interest)

[topic_interest](http://example.org/#term_topic_interest)

[topic](http://example.org/#term_topic)

[page](http://example.org/#term_page)

[workplaceHomepage](http://example.org/#term_workplaceHomepage)

[workInfoHomepage](http://example.org/#term_workInfoHomepage)

[schoolHomepage](http://example.org/#term_schoolHomepage)

[publications](http://example.org/#term_publications)

[currentProject](http://example.org/#term_currentProject)

[pastProject](http://example.org/#term_pastProject)

[account](http://example.org/#term_account)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[accountName](http://example.org/#term_accountName)

[accountServiceHomepage](http://example.org/#term_accountServiceHomepage)

[PersonalProfileDocument](http://example.org/#term_PersonalProfileDocument)

[tipjar](http://example.org/#term_tipjar)

[sha1](http://example.org/#term_sha1)

[thumbnail](http://example.org/#term_thumbnail)

[logo](http://example.org/#term_logo)

### A-Z of FOAF terms (current and archaic)

[Agent](http://example.org/#term_Agent)

[Document](http://example.org/#term_Document)

[Group](http://example.org/#term_Group)

[Image](http://example.org/#term_Image)

[LabelProperty](http://example.org/#term_LabelProperty)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[OnlineChatAccount](http://example.org/#term_OnlineChatAccount)

[OnlineEcommerceAccount](http://example.org/#term_OnlineEcommerceAccount)

[OnlineGamingAccount](http://example.org/#term_OnlineGamingAccount)

[Organization](http://example.org/#term_Organization)

[Person](http://example.org/#term_Person)

[PersonalProfileDocument](http://example.org/#term_PersonalProfileDocument)

[Project](http://example.org/#term_Project)

[account](http://example.org/#term_account)

[accountName](http://example.org/#term_accountName)

[accountServiceHomepage](http://example.org/#term_accountServiceHomepage)

[age](http://example.org/#term_age)

[aimChatID](http://example.org/#term_aimChatID)

[based_near](http://example.org/#term_based_near)

[birthday](http://example.org/#term_birthday)

[currentProject](http://example.org/#term_currentProject)

[depiction](http://example.org/#term_depiction)

[depicts](http://example.org/#term_depicts)

[dnaChecksum](http://example.org/#term_dnaChecksum)

[familyName](http://example.org/#term_familyName)

[family_name](http://example.org/#term_family_name)

[firstName](http://example.org/#term_firstName)

[focus](http://example.org/#term_focus)

[fundedBy](http://example.org/#term_fundedBy)

[geekcode](http://example.org/#term_geekcode)

[gender](http://example.org/#term_gender)

[givenName](http://example.org/#term_givenName)

[givenname](http://example.org/#term_givenname)

[holdsAccount](http://example.org/#term_holdsAccount)

[homepage](http://example.org/#term_homepage)

[icqChatID](http://example.org/#term_icqChatID)

[img](http://example.org/#term_img)

[interest](http://example.org/#term_interest)

[isPrimaryTopicOf](http://example.org/#term_isPrimaryTopicOf)

[jabberID](http://example.org/#term_jabberID)

[knows](http://example.org/#term_knows)

[lastName](http://example.org/#term_lastName)

[logo](http://example.org/#term_logo)

[made](http://example.org/#term_made)

[maker](http://example.org/#term_maker)

[mbox](http://example.org/#term_mbox)

[mbox_sha1sum](http://example.org/#term_mbox_sha1sum)

[member](http://example.org/#term_member)

[membershipClass](http://example.org/#term_membershipClass)

[msnChatID](http://example.org/#term_msnChatID)

[myersBriggs](http://example.org/#term_myersBriggs)

[name](http://example.org/#term_name)

[nick](http://example.org/#term_nick)

[openid](http://example.org/#term_openid)

[page](http://example.org/#term_page)

[pastProject](http://example.org/#term_pastProject)

[phone](http://example.org/#term_phone)

[plan](http://example.org/#term_plan)

[primaryTopic](http://example.org/#term_primaryTopic)

[publications](http://example.org/#term_publications)

[schoolHomepage](http://example.org/#term_schoolHomepage)

[sha1](http://example.org/#term_sha1)

[skypeID](http://example.org/#term_skypeID)

[status](http://example.org/#term_status)

[surname](http://example.org/#term_surname)

[theme](http://example.org/#term_theme)

[thumbnail](http://example.org/#term_thumbnail)

[tipjar](http://example.org/#term_tipjar)

[title](http://example.org/#term_title)

[topic](http://example.org/#term_topic)

[topic_interest](http://example.org/#term_topic_interest)

[weblog](http://example.org/#term_weblog)

[workInfoHomepage](http://example.org/#term_workInfoHomepage)

[workplaceHomepage](http://example.org/#term_workplaceHomepage)

[yahooChatID](http://example.org/#term_yahooChatID)

## Example

[foaf:Person](http://example.org/#term_Person)

[foaf:name](http://example.org/#term_name)

[foaf:homepage](http://example.org/#term_homepage)

[foaf:openid](http://example.org/#term_openid)

[foaf:img](http://example.org/#term_img)

## 1 Introduction: FOAF Basics

### The Semantic Web

[W3 future directions](http://www.w3.org/Talks/WWW94Tim/)

[Giant Global Graph](http://dig.csail.mit.edu/breadcrumbs/node/215)

[foaf](http://www.w3.org/People/Berners-Lee/card)

### FOAF and the Semantic Web

[Semantic Web](http://www.w3.org/2001/sw/)

[SPARQL](http://www.w3.org/TR/rdf-sparql-query/)

[SKOS](http://www.w3.org/2004/02/skos/)

[GRDDL](http://www.w3.org/2001/sw/grddl-wg/)

[RDFa](http://www.w3.org/TR/xhtml-rdfa-primer/)

[Linked 
  Data](http://www.w3.org/DesignIssues/LinkedData.html)

### The Basic Idea

[FOAF namespace
  document](http://xmlns.com/foaf/0.1/)

## What's FOAF for?

[XML
  Watch: Finding friends with XML and RDF](http://www-106.ibm.com/developerworks/xml/library/x-foaf.html)

[with image metadata](http://rdfweb.org/2002/01/photo/)

[co-depiction](http://rdfweb.org/2002/01/photo/)

[FOAF-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)

[FOAF project home page](http://www.foaf-project.org)

## Background

[alt.folklore.urban archive](http://www.urbanlegends.com/)

[snopes.com](http://www.snopes.com/)

## FOAF and Standards

[ISO
  Standardisation](http://www.iso.ch/iso/en/ISOOnline.openerpage)

[W3C](http://www.w3.org/)

[Process](http://www.w3.org/Consortium/Process/)

[Open Source](http://www.opensource.org/)

[Free Software](http://www.gnu.org/philosophy/free-sw.html)

[Jabber
  JEPs](http://www.jabber.org/jeps/jep-0001.html)

[Resource Description Framework](http://www.w3.org/RDF/)

## The FOAF Vocabulary Description

[RDF](http://www.w3.org/RDF/)

[Semantic Web](http://www.w3.org/2001/sw/)

[Semantic Web](http://www.w3.org/2001/sw/)

### Evolution and Extension of FOAF

[Dublin Core](http://dublincore.org/)

## FOAF Auto-Discovery: Publishing and Linking FOAF files

[foaf-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)

[FOAF
  autodiscovery](http://web.archive.org/web/20040416181630/rdfweb.org/mt/foaflog/archives/000041.html)

## FOAF cross-reference: Listing FOAF Classes and
  Properties

[RDF/XML](http://example.org/index.rdf)

[Agent](http://example.org/#term_Agent)

[Document](http://example.org/#term_Document)

[Group](http://example.org/#term_Group)

[Image](http://example.org/#term_Image)

[LabelProperty](http://example.org/#term_LabelProperty)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[OnlineChatAccount](http://example.org/#term_OnlineChatAccount)

[OnlineEcommerceAccount](http://example.org/#term_OnlineEcommerceAccount)

[OnlineGamingAccount](http://example.org/#term_OnlineGamingAccount)

[Organization](http://example.org/#term_Organization)

[Person](http://example.org/#term_Person)

[PersonalProfileDocument](http://example.org/#term_PersonalProfileDocument)

[Project](http://example.org/#term_Project)

[account](http://example.org/#term_account)

[accountName](http://example.org/#term_accountName)

[accountServiceHomepage](http://example.org/#term_accountServiceHomepage)

[age](http://example.org/#term_age)

[aimChatID](http://example.org/#term_aimChatID)

[based_near](http://example.org/#term_based_near)

[birthday](http://example.org/#term_birthday)

[currentProject](http://example.org/#term_currentProject)

[depiction](http://example.org/#term_depiction)

[depicts](http://example.org/#term_depicts)

[dnaChecksum](http://example.org/#term_dnaChecksum)

[familyName](http://example.org/#term_familyName)

[family_name](http://example.org/#term_family_name)

[firstName](http://example.org/#term_firstName)

[focus](http://example.org/#term_focus)

[fundedBy](http://example.org/#term_fundedBy)

[geekcode](http://example.org/#term_geekcode)

[gender](http://example.org/#term_gender)

[givenName](http://example.org/#term_givenName)

[givenname](http://example.org/#term_givenname)

[holdsAccount](http://example.org/#term_holdsAccount)

[homepage](http://example.org/#term_homepage)

[icqChatID](http://example.org/#term_icqChatID)

[img](http://example.org/#term_img)

[interest](http://example.org/#term_interest)

[isPrimaryTopicOf](http://example.org/#term_isPrimaryTopicOf)

[jabberID](http://example.org/#term_jabberID)

[knows](http://example.org/#term_knows)

[lastName](http://example.org/#term_lastName)

[logo](http://example.org/#term_logo)

[made](http://example.org/#term_made)

[maker](http://example.org/#term_maker)

[mbox](http://example.org/#term_mbox)

[mbox_sha1sum](http://example.org/#term_mbox_sha1sum)

[member](http://example.org/#term_member)

[membershipClass](http://example.org/#term_membershipClass)

[msnChatID](http://example.org/#term_msnChatID)

[myersBriggs](http://example.org/#term_myersBriggs)

[name](http://example.org/#term_name)

[nick](http://example.org/#term_nick)

[openid](http://example.org/#term_openid)

[page](http://example.org/#term_page)

[pastProject](http://example.org/#term_pastProject)

[phone](http://example.org/#term_phone)

[plan](http://example.org/#term_plan)

[primaryTopic](http://example.org/#term_primaryTopic)

[publications](http://example.org/#term_publications)

[schoolHomepage](http://example.org/#term_schoolHomepage)

[sha1](http://example.org/#term_sha1)

[skypeID](http://example.org/#term_skypeID)

[status](http://example.org/#term_status)

[surname](http://example.org/#term_surname)

[theme](http://example.org/#term_theme)

[thumbnail](http://example.org/#term_thumbnail)

[tipjar](http://example.org/#term_tipjar)

[title](http://example.org/#term_title)

[topic](http://example.org/#term_topic)

[topic_interest](http://example.org/#term_topic_interest)

[weblog](http://example.org/#term_weblog)

[workInfoHomepage](http://example.org/#term_workInfoHomepage)

[workplaceHomepage](http://example.org/#term_workplaceHomepage)

[yahooChatID](http://example.org/#term_yahooChatID)

### Classes and Properties (full detail)

## Classes

### Class: foaf:Agent

[gender](http://example.org/#term_gender)

[yahooChatID](http://example.org/#term_yahooChatID)

[account](http://example.org/#term_account)

[birthday](http://example.org/#term_birthday)

[icqChatID](http://example.org/#term_icqChatID)

[aimChatID](http://example.org/#term_aimChatID)

[jabberID](http://example.org/#term_jabberID)

[made](http://example.org/#term_made)

[mbox](http://example.org/#term_mbox)

[interest](http://example.org/#term_interest)

[tipjar](http://example.org/#term_tipjar)

[skypeID](http://example.org/#term_skypeID)

[topic_interest](http://example.org/#term_topic_interest)

[age](http://example.org/#term_age)

[mbox_sha1sum](http://example.org/#term_mbox_sha1sum)

[status](http://example.org/#term_status)

[msnChatID](http://example.org/#term_msnChatID)

[openid](http://example.org/#term_openid)

[holdsAccount](http://example.org/#term_holdsAccount)

[weblog](http://example.org/#term_weblog)

[maker](http://example.org/#term_maker)

[member](http://example.org/#term_member)

[Group](http://example.org/#term_Group)

[Person](http://example.org/#term_Person)

[Organization](http://example.org/#term_Organization)

[Agent](http://example.org/#term_Agent)

[Person](http://example.org/#term_Person)

[Organization](http://example.org/#term_Organization)

[Group](http://example.org/#term_Group)

[Agent](http://example.org/#term_Agent)

[Person](http://example.org/#term_Person)

[#](http://example.org/#term_Agent)

[back to top](http://example.org/#glance)

### Class: foaf:Document

[topic](http://example.org/#term_topic)

[primaryTopic](http://example.org/#term_primaryTopic)

[sha1](http://example.org/#term_sha1)

[workInfoHomepage](http://example.org/#term_workInfoHomepage)

[workplaceHomepage](http://example.org/#term_workplaceHomepage)

[page](http://example.org/#term_page)

[accountServiceHomepage](http://example.org/#term_accountServiceHomepage)

[openid](http://example.org/#term_openid)

[tipjar](http://example.org/#term_tipjar)

[schoolHomepage](http://example.org/#term_schoolHomepage)

[publications](http://example.org/#term_publications)

[isPrimaryTopicOf](http://example.org/#term_isPrimaryTopicOf)

[interest](http://example.org/#term_interest)

[homepage](http://example.org/#term_homepage)

[weblog](http://example.org/#term_weblog)

[Image](http://example.org/#term_Image)

[PersonalProfileDocument](http://example.org/#term_PersonalProfileDocument)

[Project](http://example.org/#term_Project)

[Organization](http://example.org/#term_Organization)

[Document](http://example.org/#term_Document)

[Image](http://example.org/#term_Image)

[Document](http://example.org/#term_Document)

[sha1](http://example.org/#term_sha1)

[#](http://example.org/#term_Document)

[back to top](http://example.org/#glance)

### Class: foaf:Group

[member](http://example.org/#term_member)

[Agent](http://example.org/#term_Agent)

[Group](http://example.org/#term_Group)

[Agent](http://example.org/#term_Agent)

[homepage](http://example.org/#term_homepage)

[name](http://example.org/#term_name)

[Group](http://example.org/#term_Group)

[Agent](http://example.org/#term_Agent)

[Agent](http://example.org/#term_Agent)

[Group](http://example.org/#term_Group)

[membershipClass](http://example.org/#term_membershipClass)

[Group](http://example.org/#term_Group)

[Agent](http://example.org/#term_Agent)

[Group](http://example.org/#term_Group)

[Group](http://example.org/#term_Group)

[Group](http://example.org/#term_Group)

[member](http://example.org/#term_member)

[Group](http://example.org/#term_Group)

[Group](http://example.org/#term_Group)

[membershipClass](http://example.org/#term_membershipClass)

[Person](http://example.org/#term_Person)

[workplaceHomepage](http://example.org/#term_workplaceHomepage)

[Agent](http://example.org/#term_Agent)

[Person](http://example.org/#term_Person)

[Person](http://example.org/#term_Person)

[workplaceHomepage](http://example.org/#term_workplaceHomepage)

[member](http://example.org/#term_member)

[name](http://example.org/#term_name)

[Group](http://example.org/#term_Group)

[issue tracker](http://wiki.foaf-project.org/w/IssueTracker)

[OWL](http://www.w3.org/2001/sw/WebOnt)

[#](http://example.org/#term_Group)

[back to top](http://example.org/#glance)

### Class: foaf:Image

[depicts](http://example.org/#term_depicts)

[thumbnail](http://example.org/#term_thumbnail)

[img](http://example.org/#term_img)

[thumbnail](http://example.org/#term_thumbnail)

[depiction](http://example.org/#term_depiction)

[Document](http://example.org/#term_Document)

[Image](http://example.org/#term_Image)

[Document](http://example.org/#term_Document)

[Image](http://example.org/#term_Image)

[#](http://example.org/#term_Image)

[back to top](http://example.org/#glance)

### Class: foaf:Organization

[Agent](http://example.org/#term_Agent)

[Document](http://example.org/#term_Document)

[Person](http://example.org/#term_Person)

[Organization](http://example.org/#term_Organization)

[Agent](http://example.org/#term_Agent)

[Group](http://example.org/#term_Group)

[#](http://example.org/#term_Organization)

[back to top](http://example.org/#glance)

### Class: foaf:Person

[plan](http://example.org/#term_plan)

[surname](http://example.org/#term_surname)

[geekcode](http://example.org/#term_geekcode)

[pastProject](http://example.org/#term_pastProject)

[lastName](http://example.org/#term_lastName)

[family_name](http://example.org/#term_family_name)

[publications](http://example.org/#term_publications)

[currentProject](http://example.org/#term_currentProject)

[familyName](http://example.org/#term_familyName)

[firstName](http://example.org/#term_firstName)

[workInfoHomepage](http://example.org/#term_workInfoHomepage)

[myersBriggs](http://example.org/#term_myersBriggs)

[schoolHomepage](http://example.org/#term_schoolHomepage)

[img](http://example.org/#term_img)

[workplaceHomepage](http://example.org/#term_workplaceHomepage)

[knows](http://example.org/#term_knows)

[knows](http://example.org/#term_knows)

[Agent](http://example.org/#term_Agent)

[Spatial Thing](http://example.org/#term_SpatialThing)

[Project](http://example.org/#term_Project)

[Organization](http://example.org/#term_Organization)

[Person](http://example.org/#term_Person)

[Person](http://example.org/#term_Person)

[Person](http://example.org/#term_Person)

[Agent](http://example.org/#term_Agent)

[#](http://example.org/#term_Person)

[back to top](http://example.org/#glance)

### Class: foaf:OnlineAccount

[accountName](http://example.org/#term_accountName)

[accountServiceHomepage](http://example.org/#term_accountServiceHomepage)

[account](http://example.org/#term_account)

[holdsAccount](http://example.org/#term_holdsAccount)

[Thing](http://example.org/#term_Thing)

[Online E-commerce Account](http://example.org/#term_OnlineEcommerceAccount)

[Online Gaming Account](http://example.org/#term_OnlineGamingAccount)

[Online Chat Account](http://example.org/#term_OnlineChatAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[accountServiceHomepage](http://example.org/#term_accountServiceHomepage)

[Agent](http://example.org/#term_Agent)

[account](http://example.org/#term_account)

[OnlineChatAccount](http://example.org/#term_OnlineChatAccount)

[OnlineEcommerceAccount](http://example.org/#term_OnlineEcommerceAccount)

[OnlineGamingAccount](http://example.org/#term_OnlineGamingAccount)

[#](http://example.org/#term_OnlineAccount)

[back to top](http://example.org/#glance)

### Class: foaf:PersonalProfileDocument

[Document](http://example.org/#term_Document)

[PersonalProfileDocument](http://example.org/#term_PersonalProfileDocument)

[Document](http://example.org/#term_Document)

[maker](http://example.org/#term_maker)

[Person](http://example.org/#term_Person)

[made](http://example.org/#term_made)

[primaryTopic](http://example.org/#term_primaryTopic)

[PersonalProfileDocument](http://example.org/#term_PersonalProfileDocument)

[PersonalProfileDocument](http://example.org/#term_PersonalProfileDocument)

[PersonalProfileDocument](http://example.org/#term_PersonalProfileDocument)

[Person](http://example.org/#term_Person)

[maker](http://example.org/#term_maker)

[Person](http://example.org/#term_Person)

[maker](http://example.org/#term_maker)

[PersonalProfileDocument](http://example.org/#term_PersonalProfileDocument)

[primaryTopic](http://example.org/#term_primaryTopic)

[Document](http://example.org/#term_Document)

[PersonalProfileDocument](http://example.org/#term_PersonalProfileDocument)

[PersonalProfileDocument](http://example.org/#term_PersonalProfileDocument)

[GRDDL](http://www.w3.org/2004/01/rdxh/spec)

[#](http://example.org/#term_PersonalProfileDocument)

[back to top](http://example.org/#glance)

### Class: foaf:Project

[Document](http://example.org/#term_Document)

[Person](http://example.org/#term_Person)

[Project](http://example.org/#term_Project)

[homepage](http://example.org/#term_homepage)

[Project](http://example.org/#term_Project)

[currentProject](http://example.org/#term_currentProject)

[pastProject](http://example.org/#term_pastProject)

[#](http://example.org/#term_Project)

[back to top](http://example.org/#glance)

### Class: foaf:LabelProperty

[LabelProperty](http://example.org/#term_LabelProperty)

[LabelProperty](http://example.org/#term_LabelProperty)

[#](http://example.org/#term_LabelProperty)

[back to top](http://example.org/#glance)

### Class: foaf:OnlineChatAccount

[Online Account](http://example.org/#term_OnlineAccount)

[OnlineChatAccount](http://example.org/#term_OnlineChatAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[jabberID](http://example.org/#term_jabberID)

[aimChatID](http://example.org/#term_aimChatID)

[skypeID](http://example.org/#term_skypeID)

[msnChatID](http://example.org/#term_msnChatID)

[icqChatID](http://example.org/#term_icqChatID)

[yahooChatID](http://example.org/#term_yahooChatID)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[mbox](http://example.org/#term_mbox)

[mbox_sha1sum](http://example.org/#term_mbox_sha1sum)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[OnlineChatAccount](http://example.org/#term_OnlineChatAccount)

[jabberID](http://example.org/#term_jabberID)

[aimChatID](http://example.org/#term_aimChatID)

[icqChatID](http://example.org/#term_icqChatID)

[msnChatID](http://example.org/#term_msnChatID)

[yahooChatID](http://example.org/#term_yahooChatID)

[skypeID](http://example.org/#term_skypeID)

[Jabber](http://www.jabber.org/)

[AIM](http://www.aim.com/)

[MSN](http://chat.msn.com/)

[ICQ](http://web.icq.com/icqchat/)

[Yahoo!](http://chat.yahoo.com/)

[MSN](http://chat.msn.com/)

[skypeID](http://example.org/#term_skypeID)

[accountServiceHomepage](http://example.org/#term_accountServiceHomepage)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[Freenode](http://www.freenode.net/)

[#](http://example.org/#term_OnlineChatAccount)

[back to top](http://example.org/#glance)

### Class: foaf:OnlineEcommerceAccount

[Online Account](http://example.org/#term_OnlineAccount)

[OnlineEcommerceAccount](http://example.org/#term_OnlineEcommerceAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[Amazon](http://www.amazon.com/)

[eBay](http://www.ebay.com/)

[PayPal](http://www.paypal.com/)

[thinkgeek](http://www.thinkgeek.com/)

[#](http://example.org/#term_OnlineEcommerceAccount)

[back to top](http://example.org/#glance)

### Class: foaf:OnlineGamingAccount

[Online Account](http://example.org/#term_OnlineAccount)

[OnlineGamingAccount](http://example.org/#term_OnlineGamingAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[EverQuest](http://everquest.station.sony.com/)

[Xbox live](http://www.xbox.com/live/)

[Neverwinter Nights](http://nwn.bioware.com/)

[#](http://example.org/#term_OnlineGamingAccount)

[back to top](http://example.org/#glance)

## Properties

### Property: foaf:homepage

[Thing](http://example.org/#term_Thing)

[Document](http://example.org/#term_Document)

[homepage](http://example.org/#term_homepage)

[homepage](http://example.org/#term_homepage)

[topic](http://example.org/#term_topic)

[homepage](http://example.org/#term_homepage)

[page](http://example.org/#term_page)

[topic](http://example.org/#term_topic)

[page](http://example.org/#term_page)

[#](http://example.org/#term_homepage)

[back to top](http://example.org/#glance)

### Property: foaf:isPrimaryTopicOf

[Thing](http://example.org/#term_Thing)

[Document](http://example.org/#term_Document)

[isPrimaryTopicOf](http://example.org/#term_isPrimaryTopicOf)

[isPrimaryTopicOf](http://example.org/#term_isPrimaryTopicOf)

[primaryTopic](http://example.org/#term_primaryTopic)

[page](http://example.org/#term_page)

[isPrimaryTopicOf](http://example.org/#term_isPrimaryTopicOf)

[page](http://example.org/#term_page)

[homepage](http://example.org/#term_homepage)

[page](http://example.org/#term_page)

[isPrimaryTopicOf](http://example.org/#term_isPrimaryTopicOf)

[isPrimaryTopicOf](http://example.org/#term_isPrimaryTopicOf)

[#](http://example.org/#term_isPrimaryTopicOf)

[back to top](http://example.org/#glance)

### Property: foaf:knows

[Person](http://example.org/#term_Person)

[Person](http://example.org/#term_Person)

[knows](http://example.org/#term_knows)

[Person](http://example.org/#term_Person)

[Person](http://example.org/#term_Person)

[knows](http://example.org/#term_knows)

[knows](http://example.org/#term_knows)

[knows](http://example.org/#term_knows)

[weblog](http://example.org/#term_weblog)

[made](http://example.org/#term_made)

[knows](http://example.org/#term_knows)

[knows](http://example.org/#term_knows)

[Relationship module](http://www.perceive.net/schemas/20021119/relationship/)

[workplaceHomepage](http://example.org/#term_workplaceHomepage)

[Document](http://example.org/#term_Document)

[maker](http://example.org/#term_maker)

[knows](http://example.org/#term_knows)

[knows](http://example.org/#term_knows)

[scutters](http://wiki.foaf-project.org/w/ScutterSpec)

[#](http://example.org/#term_knows)

[back to top](http://example.org/#glance)

### Property: foaf:made

[Agent](http://example.org/#term_Agent)

[Thing](http://example.org/#term_Thing)

[made](http://example.org/#term_made)

[Agent](http://example.org/#term_Agent)

[made](http://example.org/#term_made)

[maker](http://example.org/#term_maker)

[made](http://example.org/#term_made)

[#](http://example.org/#term_made)

[back to top](http://example.org/#glance)

### Property: foaf:maker

[Thing](http://example.org/#term_Thing)

[Agent](http://example.org/#term_Agent)

[maker](http://example.org/#term_maker)

[Agent](http://example.org/#term_Agent)

[made](http://example.org/#term_made)

[made](http://example.org/#term_made)

[name](http://example.org/#term_name)

[maker](http://example.org/#term_maker)

[maker](http://example.org/#term_maker)

[Person](http://example.org/#term_Person)

[name](http://example.org/#term_name)

[maker](http://example.org/#term_maker)

[UsingDublinCoreCreator](http://wiki.foaf-project.org/w/UsingDublinCoreCreator)

[#](http://example.org/#term_maker)

[back to top](http://example.org/#glance)

### Property: foaf:mbox

[Agent](http://example.org/#term_Agent)

[Thing](http://example.org/#term_Thing)

[mbox](http://example.org/#term_mbox)

[RFC 2368](http://ftp.ics.uci.edu/pub/ietf/uri/rfc2368.txt)

[mbox](http://example.org/#term_mbox)

[mbox](http://example.org/#term_mbox)

[mbox](http://example.org/#term_mbox)

[mbox_sha1sum](http://example.org/#term_mbox_sha1sum)

[#](http://example.org/#term_mbox)

[back to top](http://example.org/#glance)

### Property: foaf:member

[Group](http://example.org/#term_Group)

[Agent](http://example.org/#term_Agent)

[member](http://example.org/#term_member)

[Group](http://example.org/#term_Group)

[Agent](http://example.org/#term_Agent)

[Group](http://example.org/#term_Group)

[#](http://example.org/#term_member)

[back to top](http://example.org/#glance)

### Property: foaf:page

[Thing](http://example.org/#term_Thing)

[Document](http://example.org/#term_Document)

[page](http://example.org/#term_page)

[topic](http://example.org/#term_topic)

[#](http://example.org/#term_page)

[back to top](http://example.org/#glance)

### Property: foaf:primaryTopic

[Document](http://example.org/#term_Document)

[Thing](http://example.org/#term_Thing)

[primaryTopic](http://example.org/#term_primaryTopic)

[primaryTopic](http://example.org/#term_primaryTopic)

[isPrimaryTopicOf](http://example.org/#term_isPrimaryTopicOf)

[primaryTopic](http://example.org/#term_primaryTopic)

[isPrimaryTopicOf](http://example.org/#term_isPrimaryTopicOf)

[Wikipedia](http://www.wikipedia.org/)

[NNDB](http://www.nndb.com/)

[#](http://example.org/#term_primaryTopic)

[back to top](http://example.org/#glance)

### Property: foaf:weblog

[Agent](http://example.org/#term_Agent)

[Document](http://example.org/#term_Document)

[weblog](http://example.org/#term_weblog)

[Agent](http://example.org/#term_Agent)

[#](http://example.org/#term_weblog)

[back to top](http://example.org/#glance)

### Property: foaf:account

[Agent](http://example.org/#term_Agent)

[Online Account](http://example.org/#term_OnlineAccount)

[account](http://example.org/#term_account)

[Agent](http://example.org/#term_Agent)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[#](http://example.org/#term_account)

[back to top](http://example.org/#glance)

### Property: foaf:accountName

[Online Account](http://example.org/#term_OnlineAccount)

[accountName](http://example.org/#term_accountName)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[#](http://example.org/#term_accountName)

[back to top](http://example.org/#glance)

### Property: foaf:accountServiceHomepage

[Online Account](http://example.org/#term_OnlineAccount)

[Document](http://example.org/#term_Document)

[accountServiceHomepage](http://example.org/#term_accountServiceHomepage)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[#](http://example.org/#term_accountServiceHomepage)

[back to top](http://example.org/#glance)

### Property: foaf:aimChatID

[Agent](http://example.org/#term_Agent)

[aimChatID](http://example.org/#term_aimChatID)

[Agent](http://example.org/#term_Agent)

[AIM](http://www.aim.com/)

[iChat](http://www.apple.com/macosx/what-is-macosx/ichat.html)

[Apple](http://www.apple.com/)

[OnlineChatAccount](http://example.org/#term_OnlineChatAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[#](http://example.org/#term_aimChatID)

[back to top](http://example.org/#glance)

### Property: foaf:based_near

[Spatial Thing](http://example.org/#term_SpatialThing)

[Spatial Thing](http://example.org/#term_SpatialThing)

[based_near](http://example.org/#term_based_near)

[geo-positioning vocabulary](http://www.w3.org/2003/01/geo/wgs84_pos#)

[GeoInfo](http://esw.w3.org/topic/GeoInfo)

[GeoOnion vocab](http://esw.w3.org/topic/GeoOnion)

[UsingContactNearestAirport](http://wiki.foaf-project.org/w/UsingContactNearestAirport)

[#](http://example.org/#term_based_near)

[back to top](http://example.org/#glance)

### Property: foaf:currentProject

[Person](http://example.org/#term_Person)

[Thing](http://example.org/#term_Thing)

[currentProject](http://example.org/#term_currentProject)

[Person](http://example.org/#term_Person)

[Document](http://example.org/#term_Document)

[Person](http://example.org/#term_Person)

[Person](http://example.org/#term_Person)

[pastProject](http://example.org/#term_pastProject)

[Person](http://example.org/#term_Person)

[pastProject](http://example.org/#term_pastProject)

[currentProject](http://example.org/#term_currentProject)

[pastProject](http://example.org/#term_pastProject)

[Document](http://example.org/#term_Document)

[Project](http://example.org/#term_Project)

[homepage](http://example.org/#term_homepage)

[interest](http://example.org/#term_interest)

[#](http://example.org/#term_currentProject)

[back to top](http://example.org/#glance)

### Property: foaf:depiction

[Thing](http://example.org/#term_Thing)

[Image](http://example.org/#term_Image)

[depiction](http://example.org/#term_depiction)

[Image](http://example.org/#term_Image)

[depicts](http://example.org/#term_depicts)

[depiction](http://example.org/#term_depiction)

[depicts](http://example.org/#term_depicts)

[Co-Depiction](http://rdfweb.org/2002/01/photo/)

['Annotating Images With SVG'](http://www.jibbering.com/svg/AnnotateImage.html)

[depiction](http://example.org/#term_depiction)

[img](http://example.org/#term_img)

[depiction](http://example.org/#term_depiction)

[Image](http://example.org/#term_Image)

[img](http://example.org/#term_img)

[#](http://example.org/#term_depiction)

[back to top](http://example.org/#glance)

### Property: foaf:depicts

[Image](http://example.org/#term_Image)

[Thing](http://example.org/#term_Thing)

[depicts](http://example.org/#term_depicts)

[Image](http://example.org/#term_Image)

[depiction](http://example.org/#term_depiction)

[depiction](http://example.org/#term_depiction)

[#](http://example.org/#term_depicts)

[back to top](http://example.org/#glance)

### Property: foaf:familyName

[Person](http://example.org/#term_Person)

[familyName](http://example.org/#term_familyName)

[givenName](http://example.org/#term_givenName)

[name](http://example.org/#term_name)

[firstName](http://example.org/#term_firstName)

[lastName](http://example.org/#term_lastName)

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)

[#](http://example.org/#term_familyName)

[back to top](http://example.org/#glance)

### Property: foaf:firstName

[Person](http://example.org/#term_Person)

[firstName](http://example.org/#term_firstName)

[lastName](http://example.org/#term_lastName)

[familyName](http://example.org/#term_familyName)

[givenName](http://example.org/#term_givenName)

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)

[name](http://example.org/#term_name)

[#](http://example.org/#term_firstName)

[back to top](http://example.org/#glance)

### Property: foaf:focus

[Concept](http://example.org/#term_Concept)

[Thing](http://example.org/#term_Thing)

[focus](http://example.org/#term_focus)

[SKOS](http://www.w3.org/2004/02/skos/)

[In SKOS](http://www.w3.org/TR/2005/WD-swbp-skos-core-guide-20050510/#secmodellingrdf)

[2005 discussion](http://www.w3.org/TR/2005/WD-swbp-skos-core-guide-20051102/#secopen)

[topic](http://example.org/#term_topic)

[primaryTopic](http://example.org/#term_primaryTopic)

[primaryTopic](http://example.org/#term_primaryTopic)

[TDB URI scheme](http://larry.masinter.net/duri.html)

[original goals](http://www.foaf-project.org/original-intro)

[#](http://example.org/#term_focus)

[back to top](http://example.org/#glance)

### Property: foaf:gender

[Agent](http://example.org/#term_Agent)

[gender](http://example.org/#term_gender)

[Agent](http://example.org/#term_Agent)

[Person](http://example.org/#term_Person)

[gender](http://example.org/#term_gender)

[gender](http://example.org/#term_gender)

[gender](http://example.org/#term_gender)

[Agent](http://example.org/#term_Agent)

[Agent](http://example.org/#term_Agent)

[Group](http://example.org/#term_Group)

[Agent](http://example.org/#term_Agent)

[gender](http://example.org/#term_gender)

[gender](http://example.org/#term_gender)

[Agent](http://example.org/#term_Agent)

[gender](http://example.org/#term_gender)

[foaf-dev](http://lists.foaf-project.org/mailman/listinfo/foaf-dev)

[gender](http://example.org/#term_gender)

[gender](http://example.org/#term_gender)

[#](http://example.org/#term_gender)

[back to top](http://example.org/#glance)

### Property: foaf:givenName

[givenName](http://example.org/#term_givenName)

[familyName](http://example.org/#term_familyName)

[name](http://example.org/#term_name)

[firstName](http://example.org/#term_firstName)

[lastName](http://example.org/#term_lastName)

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)

[#](http://example.org/#term_givenName)

[back to top](http://example.org/#glance)

### Property: foaf:icqChatID

[Agent](http://example.org/#term_Agent)

[icqChatID](http://example.org/#term_icqChatID)

[Agent](http://example.org/#term_Agent)

[icq chat](http://web.icq.com/icqchat/)

[What is ICQ?](http://www.icq.com/products/whatisicq.html)

[About Us](http://company.icq.com/info/)

[aimChatID](http://example.org/#term_aimChatID)

[OnlineChatAccount](http://example.org/#term_OnlineChatAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[#](http://example.org/#term_icqChatID)

[back to top](http://example.org/#glance)

### Property: foaf:img

[Person](http://example.org/#term_Person)

[Image](http://example.org/#term_Image)

[img](http://example.org/#term_img)

[Person](http://example.org/#term_Person)

[Image](http://example.org/#term_Image)

[depiction](http://example.org/#term_depiction)

[img](http://example.org/#term_img)

[depiction](http://example.org/#term_depiction)

[depicts](http://example.org/#term_depicts)

[img](http://example.org/#term_img)

[Person](http://example.org/#term_Person)

[depiction](http://example.org/#term_depiction)

[img](http://example.org/#term_img)

[depiction](http://example.org/#term_depiction)

[img](http://example.org/#term_img)

[Image](http://example.org/#term_Image)

[img](http://example.org/#term_img)

[img](http://example.org/#term_img)

[#](http://example.org/#term_img)

[back to top](http://example.org/#glance)

### Property: foaf:interest

[Agent](http://example.org/#term_Agent)

[Document](http://example.org/#term_Document)

[interest](http://example.org/#term_interest)

[Agent](http://example.org/#term_Agent)

[Document](http://example.org/#term_Document)

[topic](http://example.org/#term_topic)

[interest](http://example.org/#term_interest)

[RDF](http://www.w3.org/RDF/)

[interest](http://example.org/#term_interest)

[CPAN](http://www.cpan.org/)

[interest](http://example.org/#term_interest)

[interest](http://example.org/#term_interest)

[#](http://example.org/#term_interest)

[back to top](http://example.org/#glance)

### Property: foaf:jabberID

[Agent](http://example.org/#term_Agent)

[jabberID](http://example.org/#term_jabberID)

[Agent](http://example.org/#term_Agent)

[Jabber](http://www.jabber.org/)

[Jabber](http://www.jabber.org/)

[Agent](http://example.org/#term_Agent)

[jabberID](http://example.org/#term_jabberID)

[OnlineChatAccount](http://example.org/#term_OnlineChatAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[#](http://example.org/#term_jabberID)

[back to top](http://example.org/#glance)

### Property: foaf:lastName

[Person](http://example.org/#term_Person)

[lastName](http://example.org/#term_lastName)

[firstName](http://example.org/#term_firstName)

[familyName](http://example.org/#term_familyName)

[givenName](http://example.org/#term_givenName)

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)

[name](http://example.org/#term_name)

[#](http://example.org/#term_lastName)

[back to top](http://example.org/#glance)

### Property: foaf:logo

[Thing](http://example.org/#term_Thing)

[Thing](http://example.org/#term_Thing)

[logo](http://example.org/#term_logo)

[#](http://example.org/#term_logo)

[back to top](http://example.org/#glance)

### Property: foaf:mbox_sha1sum

[Agent](http://example.org/#term_Agent)

[mbox_sha1sum](http://example.org/#term_mbox_sha1sum)

[Person](http://example.org/#term_Person)

[mbox](http://example.org/#term_mbox)

[mbox](http://example.org/#term_mbox)

[mbox_sha1sum](http://example.org/#term_mbox_sha1sum)

[mbox](http://example.org/#term_mbox)

[mbox_sha1sum](http://example.org/#term_mbox_sha1sum)

[Person](http://example.org/#term_Person)

[mbox_sha1sum](http://example.org/#term_mbox_sha1sum)

[Edd Dumbill's 
documentation](http://usefulinc.com/foaf/)

[FOAF-based whitelists](http://www.w3.org/2001/12/rubyrdf/util/foafwhite/intro.html)

[in Sam Ruby's 
weblog entry](http://www.intertwingly.net/blog/1545.html)

[mbox_sha1sum](http://example.org/#term_mbox_sha1sum)

[#](http://example.org/#term_mbox_sha1sum)

[back to top](http://example.org/#glance)

### Property: foaf:msnChatID

[Agent](http://example.org/#term_Agent)

[msnChatID](http://example.org/#term_msnChatID)

[Agent](http://example.org/#term_Agent)

[Windows Live Messenger](http://en.wikipedia.org/wiki/Windows_Live_Messenger)

[Microsoft mesenger](http://download.live.com/messenger)

[Windows Live ID](http://en.wikipedia.org/wiki/Windows_Live_ID)

[OnlineChatAccount](http://example.org/#term_OnlineChatAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[#](http://example.org/#term_msnChatID)

[back to top](http://example.org/#glance)

### Property: foaf:myersBriggs

[Person](http://example.org/#term_Person)

[myersBriggs](http://example.org/#term_myersBriggs)

[myersBriggs](http://example.org/#term_myersBriggs)

[Person](http://example.org/#term_Person)

[myersBriggs](http://example.org/#term_myersBriggs)

[weblog](http://example.org/#term_weblog)

[myersBriggs](http://example.org/#term_myersBriggs)

[this article](http://www.teamtechnology.co.uk/tt/t-articl/mb-simpl.htm)

[Cory Caplinger's summary table](http://webspace.webring.com/people/cl/lifexplore/mbintro.htm)

[FOAF Myers Briggs addition](http://web.archive.org/web/20080802184922/http://rdfweb.org/mt/foaflog/archives/000004.html)

[#](http://example.org/#term_myersBriggs)

[back to top](http://example.org/#glance)

### Property: foaf:name

[Thing](http://example.org/#term_Thing)

[name](http://example.org/#term_name)

[issue tracker](http://wiki.foaf-project.org/w/IssueTracker)

[name](http://example.org/#term_name)

[name](http://example.org/#term_name)

[#](http://example.org/#term_name)

[back to top](http://example.org/#glance)

### Property: foaf:nick

[nick](http://example.org/#term_nick)

[Person](http://example.org/#term_Person)

[jabberID](http://example.org/#term_jabberID)

[aimChatID](http://example.org/#term_aimChatID)

[msnChatID](http://example.org/#term_msnChatID)

[icqChatID](http://example.org/#term_icqChatID)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[#](http://example.org/#term_nick)

[back to top](http://example.org/#glance)

### Property: foaf:openid

[Agent](http://example.org/#term_Agent)

[Document](http://example.org/#term_Document)

[openid](http://example.org/#term_openid)

[Agent](http://example.org/#term_Agent)

[indirect identifier](http://www.w3.org/TR/webarch/#indirect-identification)

[OpenID](http://openid.net/specs/openid-authentication-1_1.html)

[openid](http://example.org/#term_openid)

[openid](http://example.org/#term_openid)

[Organization](http://example.org/#term_Organization)

[Group](http://example.org/#term_Group)

[Agent](http://example.org/#term_Agent)

[openid](http://example.org/#term_openid)

[delegation model](http://openid.net/specs/openid-authentication-1_1.html#delegating_authentication)

[technique](http://xmlns.com/foaf/spec/#sec-autodesc)

[#](http://example.org/#term_openid)

[back to top](http://example.org/#glance)

### Property: foaf:pastProject

[Person](http://example.org/#term_Person)

[Thing](http://example.org/#term_Thing)

[Person](http://example.org/#term_Person)

[currentProject](http://example.org/#term_currentProject)

[pastProject](http://example.org/#term_pastProject)

[Person](http://example.org/#term_Person)

[Person](http://example.org/#term_Person)

[pastProject](http://example.org/#term_pastProject)

[currentProject](http://example.org/#term_currentProject)

[pastProject](http://example.org/#term_pastProject)

[#](http://example.org/#term_pastProject)

[back to top](http://example.org/#glance)

### Property: foaf:phone

[phone](http://example.org/#term_phone)

[#](http://example.org/#term_phone)

[back to top](http://example.org/#glance)

### Property: foaf:plan

[Person](http://example.org/#term_Person)

[plan](http://example.org/#term_plan)

[Person](http://example.org/#term_Person)

[History of the 
Finger Protocol](http://www.rajivshah.com/Case_Studies/Finger/Finger.htm)

[geekcode](http://example.org/#term_geekcode)

[#](http://example.org/#term_plan)

[back to top](http://example.org/#glance)

### Property: foaf:publications

[Person](http://example.org/#term_Person)

[Document](http://example.org/#term_Document)

[publications](http://example.org/#term_publications)

[Document](http://example.org/#term_Document)

[Person](http://example.org/#term_Person)

[homepage](http://example.org/#term_homepage)

[#](http://example.org/#term_publications)

[back to top](http://example.org/#glance)

### Property: foaf:schoolHomepage

[Person](http://example.org/#term_Person)

[Document](http://example.org/#term_Document)

[Person](http://example.org/#term_Person)

[Document](http://example.org/#term_Document)

[homepage](http://example.org/#term_homepage)

[Organization](http://example.org/#term_Organization)

[schoolHomepage](http://example.org/#term_schoolHomepage)

[schoolHomepage](http://example.org/#term_schoolHomepage)

[#](http://example.org/#term_schoolHomepage)

[back to top](http://example.org/#glance)

### Property: foaf:skypeID

[Agent](http://example.org/#term_Agent)

[skype](http://example.org/#term_skype)

[Agent](http://example.org/#term_Agent)

[OnlineChatAccount](http://example.org/#term_OnlineChatAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[#](http://example.org/#term_skypeID)

[back to top](http://example.org/#glance)

### Property: foaf:thumbnail

[Image](http://example.org/#term_Image)

[Image](http://example.org/#term_Image)

[thumbnail](http://example.org/#term_thumbnail)

[Image](http://example.org/#term_Image)

[Image](http://example.org/#term_Image)

[img](http://example.org/#term_img)

[depiction](http://example.org/#term_depiction)

[thumbnail](http://example.org/#term_thumbnail)

[depicts](http://example.org/#term_depicts)

[thumbnail](http://example.org/#term_thumbnail)

[#](http://example.org/#term_thumbnail)

[back to top](http://example.org/#glance)

### Property: foaf:tipjar

[Agent](http://example.org/#term_Agent)

[Document](http://example.org/#term_Document)

[tipjar](http://example.org/#term_tipjar)

[Agent](http://example.org/#term_Agent)

[Document](http://example.org/#term_Document)

[tipjar](http://example.org/#term_tipjar)

[discussions](http://rdfweb.org/mt/foaflog/archives/2004/02/12/20.07.32/)

[tipjar](http://example.org/#term_tipjar)

[PayPal](http://www.paypal.com/)

[tipjar](http://example.org/#term_tipjar)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[#](http://example.org/#term_tipjar)

[back to top](http://example.org/#glance)

### Property: foaf:title

[FOAF Issue Tracker](http://wiki.foaf-project.org/w/IssueTracker)

[title](http://example.org/#term_title)

[#](http://example.org/#term_title)

[back to top](http://example.org/#glance)

### Property: foaf:topic

[Document](http://example.org/#term_Document)

[Thing](http://example.org/#term_Thing)

[topic](http://example.org/#term_topic)

[page](http://example.org/#term_page)

[#](http://example.org/#term_topic)

[back to top](http://example.org/#glance)

### Property: foaf:topic_interest

[Agent](http://example.org/#term_Agent)

[Thing](http://example.org/#term_Thing)

[topic_interest](http://example.org/#term_topic_interest)

[Agent](http://example.org/#term_Agent)

[topic](http://example.org/#term_topic)

[#](http://example.org/#term_topic_interest)

[back to top](http://example.org/#glance)

### Property: foaf:workInfoHomepage

[Person](http://example.org/#term_Person)

[Document](http://example.org/#term_Document)

[workInfoHomepage](http://example.org/#term_workInfoHomepage)

[Person](http://example.org/#term_Person)

[Document](http://example.org/#term_Document)

[homepage](http://example.org/#term_homepage)

[workplaceHomepage](http://example.org/#term_workplaceHomepage)

[#](http://example.org/#term_workInfoHomepage)

[back to top](http://example.org/#glance)

### Property: foaf:workplaceHomepage

[Person](http://example.org/#term_Person)

[Document](http://example.org/#term_Document)

[workplaceHomepage](http://example.org/#term_workplaceHomepage)

[Person](http://example.org/#term_Person)

[Document](http://example.org/#term_Document)

[homepage](http://example.org/#term_homepage)

[Organization](http://example.org/#term_Organization)

[Person](http://example.org/#term_Person)

[homepage](http://example.org/#term_homepage)

[Organization](http://example.org/#term_Organization)

[homepage](http://example.org/#term_homepage)

[workplaceHomepage](http://example.org/#term_workplaceHomepage)

[schoolHomepage](http://example.org/#term_schoolHomepage)

[Person](http://example.org/#term_Person)

[Organization](http://example.org/#term_Organization)

[#](http://example.org/#term_workplaceHomepage)

[back to top](http://example.org/#glance)

### Property: foaf:yahooChatID

[Agent](http://example.org/#term_Agent)

[yahooChatID](http://example.org/#term_yahooChatID)

[Agent](http://example.org/#term_Agent)

[Yahoo! Chat](http://chat.yahoo.com/)

[Yahoo! Groups](http://www.yahoogroups.com/)

[OnlineChatAccount](http://example.org/#term_OnlineChatAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[#](http://example.org/#term_yahooChatID)

[back to top](http://example.org/#glance)

### Property: foaf:age

[Agent](http://example.org/#term_Agent)

[age](http://example.org/#term_age)

[Agent](http://example.org/#term_Agent)

[birthday](http://example.org/#term_birthday)

[#](http://example.org/#term_age)

[back to top](http://example.org/#glance)

### Property: foaf:birthday

[Agent](http://example.org/#term_Agent)

[birthday](http://example.org/#term_birthday)

[Agent](http://example.org/#term_Agent)

[BirthdayIssue](http://wiki.foaf-project.org/w/BirthdayIssue)

[age](http://example.org/#term_age)

[#](http://example.org/#term_birthday)

[back to top](http://example.org/#glance)

### Property: foaf:membershipClass

[membershipClass](http://example.org/#term_membershipClass)

[Group](http://example.org/#term_Group)

[Agent](http://example.org/#term_Agent)

[member](http://example.org/#term_member)

[Group](http://example.org/#term_Group)

[Group](http://example.org/#term_Group)

[#](http://example.org/#term_membershipClass)

[back to top](http://example.org/#glance)

### Property: foaf:sha1

[Document](http://example.org/#term_Document)

[sha1](http://example.org/#term_sha1)

[Document](http://example.org/#term_Document)

[Document](http://example.org/#term_Document)

[sha1](http://example.org/#term_sha1)

[#](http://example.org/#term_sha1)

[back to top](http://example.org/#glance)

### Property: foaf:status

[Agent](http://example.org/#term_Agent)

[status](http://example.org/#term_status)

[#](http://example.org/#term_status)

[back to top](http://example.org/#glance)

### Property: foaf:dnaChecksum

[dnaChecksum](http://example.org/#term_dnaChecksum)

[#](http://example.org/#term_dnaChecksum)

[back to top](http://example.org/#glance)

### Property: foaf:family_name

[Person](http://example.org/#term_Person)

[familyName](http://example.org/#term_familyName)

[#](http://example.org/#term_family_name)

[back to top](http://example.org/#glance)

### Property: foaf:fundedBy

[Thing](http://example.org/#term_Thing)

[Thing](http://example.org/#term_Thing)

[fundedBy](http://example.org/#term_fundedBy)

[#](http://example.org/#term_fundedBy)

[back to top](http://example.org/#glance)

### Property: foaf:geekcode

[Person](http://example.org/#term_Person)

[geekcode](http://example.org/#term_geekcode)

[Person](http://example.org/#term_Person)

[Wikipedia entry](http://en.wikipedia.org/wiki/Geek_Code)

[geekcode](http://example.org/#term_geekcode)

[#](http://example.org/#term_geekcode)

[back to top](http://example.org/#glance)

### Property: foaf:givenname

[givenName](http://example.org/#term_givenName)

[familyName](http://example.org/#term_familyName)

[name](http://example.org/#term_name)

[firstName](http://example.org/#term_firstName)

[lastName](http://example.org/#term_lastName)

[issue tracker](http://wiki.foaf-project.org/w/NameVocabIssue)

[#](http://example.org/#term_givenname)

[back to top](http://example.org/#glance)

### Property: foaf:holdsAccount

[Agent](http://example.org/#term_Agent)

[Online Account](http://example.org/#term_OnlineAccount)

[account](http://example.org/#term_account)

[holdsAccount](http://example.org/#term_holdsAccount)

[Agent](http://example.org/#term_Agent)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[account](http://example.org/#term_account)

[#](http://example.org/#term_holdsAccount)

[back to top](http://example.org/#glance)

### Property: foaf:surname

[Person](http://example.org/#term_Person)

[firstName](http://example.org/#term_firstName)

[givenName](http://example.org/#term_givenName)

[surname](http://example.org/#term_surname)

[issue 
tracker](http://wiki.foaf-project.org/w/IssueTracker)

[name](http://example.org/#term_name)

[#](http://example.org/#term_surname)

[back to top](http://example.org/#glance)

### Property: foaf:theme

[Thing](http://example.org/#term_Thing)

[Thing](http://example.org/#term_Thing)

[theme](http://example.org/#term_theme)

[#](http://example.org/#term_theme)

[back to top](http://example.org/#glance)

## External Vocabulary References

### Status Vocabulary

[SemWeb Vocab Status Ontology](http://www.w3.org/2003/06/sw-vocab-status/note)

### W3C Basic Geo (WGS84 lat/long) Vocabulary

[W3CBasic Geo Vocabulary](http://www.w3.org/2003/01/geo/)

[foaf:based_near](http://example.org/#term_based_near)

### RDF Vocabulary Description - core concepts

[W3C's site](http://www.w3.org/2001/sw/)

[more background on URIs](http://www.w3.org/TR/webarch/#identification)

[foaf:depicts](http://example.org/#term_depicts)

[linked data](http://www.w3.org/DesignIssues/LinkedData)

[SKOS](http://www.w3.org/2004/02/skos/)

[foaf:focus](http://example.org/#term_focus)

### Dublin Core terms

[Dublin Core terms](http://dublincore.org/documents/dcmi-terms/)

[dct:Agent](http://dublincore.org/documents/dcmi-terms/#classes-Agent)

[dct:creator](http://dublincore.org/documents/dcmi-terms/#terms-creator)

### Wordnet terms

[recent](http://www.w3.org/TR/wordnet-rdf/)

### SIOC terms

[SIOC](http://rdfs.org/sioc/ns#)

[SIOC](http://www.sioc-project.org/)

### Acknowledgments

[rdfweb-dev](http://rdfweb.org/pipermail/rdfweb-dev/)

[#foaf](http://rdfweb.org/irc/)

[FoafExplorer](http://xml.mfd-consult.dk/foaf/explorer/)

[Web View](http://eikeon.com/foaf/)

[foaf-a-matic](http://www.ldodds.com/foaf/foaf-a-matic.html)

[Ecademy](http://www.ecademy.com/)

[TypePad](http://www.typepad.com/)

[many](http://conferences.oreillynet.com/cs/et2003/view/e_sess/3633)

[explaining](http://hackdiary.com/)

[in Japanese](http://kanzaki.com/docs/sw/foaf.html)

[Spanish](http://f14web.com.ar/inkel/2003/01/27/foaf.html)

[Chris Schmidt](http://crschmidt.net/)

[spec generation](http://example.org/0.1/specgen.py)

[cool hacks](http://crschmidt.net/semweb/)

[FOAF Logo](http://iandavis.com/2006/foaf-icons/)

[years ago](http://www.w3.org/History/1989/proposal.html)

## Recent Changes

### Changes in version 0.99 (2014-01-14)

[schema.org](http://schema.org/)

[Person](http://schema.org/Person)

[ImageObject](http://schema.org/ImageObject)

[CreativeWork](http://schema.org/CreativeWork)

### 2010-08-09

[foaf:focus](http://example.org/#term_focus)

[Bio vocabulary](http://vocab.org/bio/0.1/.html)

[topic_interest](http://example.org/#term_topic_interest)

[Project](http://example.org/#term_Project)

[OnlineAccount](http://example.org/#term_OnlineAccount)

[based_near](http://example.org/#term_based_near)

[title](http://example.org/#term_title)

[skypeID](http://example.org/#term_skypeID)

[lastName](http://example.org/#term_lastName)

[openid](http://example.org/#term_openid)

[account](http://example.org/#term_account)

[accountServiceHomepage](http://example.org/#term_accountServiceHomepage)

[accountName](http://example.org/#term_accountName)

[dna_checksum](http://example.org/#term_dna_checksum)

[surname](http://example.org/#term_surname)

[primaryTopic](http://example.org/#term_primaryTopic)

[knows](http://example.org/#term_knows)

[Image](http://example.org/#term_Image)

[Document](http://example.org/#term_Document)

[foaf:topic_interest](http://example.org/#term_topic_interest)

[foaf:interest](http://example.org/#term_interest)

[foaf:logo](http://example.org/#term_logo)

### Changes from version 0.97 and 0.96

[0.97](http://xmlns.com/foaf/spec/20100101.html)

[0.96](http://xmlns.com/foaf/spec/20091215.html)

[foaf:givenName](http://example.org/#term_givenName)

[foaf:familyName](http://example.org/#term_familyName)

[foaf:givenname](http://example.org/#term_givenname)

[foaf:family_name](http://example.org/#term_family_name)

[Portable Contacts](http://portablecontacts.net/)

[foaf:fundedBy](http://example.org/#term_fundedBy)

[foaf:theme](http://example.org/#term_theme)

[foaf:holdsAccount](http://example.org/#term_holdsAccount)

[foaf:account](http://example.org/#term_account)

### 2009-12-15

### 2007-11-02

[foaf:openid](http://example.org/#term_openid)

### 2007-05-24