Business Model
==============
The developpement of the DeLA project will open a lot of opportunities in the evolving field of blockchain and its applications in the geospatial industry witch count within the most profitable [industry sectors](https://www.bcg.com/documents/file109372.pdf) at present times.

The adpoted business model for the DeLA plateform is a combination of some of the patterns described below.

![](./images/blockchain-business-models.png)
 
 From [Top 7 Blockchain Business Models That You Should Know About](https://101blockchains.com/blockchain-business-models/).

## Summary 
<!--ts-->
* [Developement plateform](#developement-plateform)
* [Blockchain as a service (BaaS)](#blockchain-as-a-service-BaaS)
* [Blockchain based Software products](#blockchain-based-software-products)
* [Token economy (Tokenomiks)](#token-economy-tokenomiks)
* [Professional services](#professional-services)
<!--te-->
## Developement plateform

The main goal of this project is to deliver a framework of geospatially enabled smart contracts and libraries for secure Geo-dApps developement. It will provide implementations of standards like [OGC Simple Features Access](http://portal.opengeospatial.org/files/?artifact_id=25355), [OGC Discrete Global Grid Systems](https://www.opengeospatial.org/projects/groups/dggsswg), [ISO 19107 Geographic information — Spatial schema](https://www.iso.org/standard/66175.html?browse=tc) and the [FOAM protocol](https://foam.space/publicAssets/FOAM_Whitepaper.pdf).

The smart contracts and libraries can be deployed, as-is or extended to suit business needs, as well as Solidity components to build custom contracts and more complex decentralized systems. 

After reaching certain maturity, an  application will be made for this framework as a candidate to [OpenZeppelin](https://openzeppelin.com/) smart contracts.

## Blockchain as a service (BaaS)

To fully operate the DeLA platform, a set of permanently deployed components are required. In addition to the geospatially enabled smart contracts and libraries deployed on the Etheruem network (test in the developpement phase and mainet after) the platform will require : 
1. a mapping server with its geospatial database to store the spatial features (The Feature Index). The early odpoted solution is a locally stored [SpatiaLite](https://www.gaia-gis.it/fossil/libspatialite/index) database and [GeoJSON](https://geojson.org/) fetching requests for visualisation purposes. But to reach the required scalability in the futur, the final plateform will probably be implemented using [PostgreSQL database](https://www.postgresql.org/), [PostGIS middleware](https://postgis.net) and [Geoserver](http://geoserver.org/) as webmapping server.  
2. a backend web server to manage business logic tasks, mainly the smart contracts events handling needed to catch the ledger recorded spatial features and populate the Features Index (database). This component will implement the [OGC OpenAPI API](http://docs.opengeospatial.org/wp/16-019r4/16-019r4.html) standard to discover and fetch features.
3. a frontend web server to store and publish the platform Dashboard Application. 

The components 1 and 2 are by design a shared services that can be easily montized for further integration in custom blockchain geospatially enabled applications, without the need to redeploy them. The deploiment diagram below illustrate this strategy.

![](./diagrams/exports/deploy-crypto-spatial-lib/deploy-crypto-spatial-lib.png)

## Blockchain based Software products

The [DeLA](../README.md) (Decentralized Land Administration) platform developed in this repository is the first prototype built as a proof-of-concept for geospatially enabled application.

The aim of this pilot project is manage a crawd sourced Land Registry design in conformance with the [ISO 19152:2012 - Geographic information — Land Administration Domain Model (LADM)](https://www.iso.org/standard/51206.html?browse=tc).

This prototype will serve as a fully operationnal demonstation of the proposed concepts and implementations, and could therefore be used in a variety of tastes, including :
- Permissionless/Permissioned application for governmental agencies responsible for land adminsitration and lacking critical ressources to undertake there missions as described in the [FAO Voluntary Guidelines on the Responsible Governance of Tenure of Land, Fisheries and Forests in the Context of National Food Security](http://www.fao.org/tenure/voluntary-guidelines/en/).
- An open data crowd sourcing plateform, OpenStreetMap like, delivering useful land parcel informations where no autoritative or commerical data are available. see [Open Land Data in the Fight Against Corruption - Discussion Report - landportal.org](https://landportal.org/file/47749/download) for more informations.
- A building block for specfic business case dApps using land information like Real estate, Investments valuation, Social responsbility, Envirmental protection, Disaster management ... 

A summary of other well suited candidate blockchain applications for geopsatial enablement, that could benefit from our [Developement plateform](#developement-plateform) and [Blockchain as a service (BaaS)](#blockchain-as-a-service-(BaaS)), is included in [Blockchain use cases](./blockchain-use-cases.md).

## Token economy (Tokenomiks)
The DeLA platform will also include tokenized uses cases to manage the Disputes and the Signaling processes.
- the [Disputes process](../README.md#Usage) will incorporate a voting system to manage disputes between users claiming the same land parcel (Feature).
- the [Signaling process](../README.md#Singaling) will be built upon a tokenized approach to incentivize cartographers and surveyors to collect parcels data and to integrate them in the the DeLA platform. 

## Professional services 
Of course, an participant in the project will develop its blockchan technology skills, allowing him/her to provide consulting, auditing and developpement services in the geospatial blockchain tech-space.


