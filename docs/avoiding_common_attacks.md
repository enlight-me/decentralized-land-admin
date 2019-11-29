Avoiding common attacks 
===========
In this document we explain the strategies used to avoid common attacks in the developpment of the solidity smart contracts of this project. The article [Solidity Security: Comprehensive list of known attack vectors and common anti-patterns](https://blog.sigmaprime.io/solidity-security.html#reentrancy) is used as a base structure.

Table of contents
=================
<!--ts-->
* [Strategies used to avoid common attacks](#strategies)
* [Security tools](#security-tools)
  * [MythX](#mythx)
  * [Mythril](#mythril)
  * [Slither](#slither)
   
<!--te-->
# Strategies

## Reentrancy 
In this release of the project (0.2) ther is no logic involving tranferring value between addresses.
Nevertheless, We tried as much as possible to respect the best practices to avoid reentrancy as placing any code that performs external calls as the last operation. Example :

- The call to ```computeCSCIndex``` function in [CSFeature.sol](../solidity/contracts/geospatial/CSFeature.sol).

- The call to ```kill``` in the ```removeFeature``` function in [CSFeatureRegistry.sol](../solidity/contracts/geospatial/CSFeatureRegistry.sol)


## Arithmetic Over/Under Flows
To guard against under/overflow vulnerabilities we use the openZeppelin ```SafeMath``` mathematical library for the state variable ```featuresCount (uint256)``` in the [CSFeatureRegistry.sol](../solidity/contracts/geospatial/CSFeatureRegistry.sol).

## Unexpected Ether
In this release of the project (0.2) ther is no logic based on ```this.balance```.
Nevertheless, as the [CSFeature.sol](../solidity/contracts/geospatial/CSFeature.sol) contract implement a ```selfdestruct``` function, even if someone send ether to it, this contract will refund all gathered Ether to the its owner. 

## Delegatecall
In this release of the project (0.2) we don't use ```delegatecall``` and we used the stateless ```library``` keyword to implement the [CSGeometryLib.sol](../solidity/contracts/geospatial/CSGeometryLib.sol).

## Default Visibilities
The visibility for all the contracts functions and state variables of this project contracts are clearly specified.

##  Entropy (randomness) Illusion
In this release of the project (0.2) we don't rely on any random variable.

## External Contract Referencing
In this release of the project (0.2) we don't make calls to any untrusted externall contract.

## Short Address/Parameter Attack
To avoid this type of attack it is advised to order correctly the parameter of the functions as padding only occurs at the end.
TODO should check my contracts and well understand the problem.

## Unchecked CALL Return Values
In this release of the project (0.2) we don't use the CALL low-level function.

## Front Running
In this release of the project (0.2) we believe that this type of attack is not valuable to any potenital attacker.

## Denial Of Service (DOS)
In this release of the project (0.2) :
- no function loop through data structures that are artificially manipulated by external users;
- for LAParcel contract we have an array of admins(the creator and the LAParcleRegistry contract) that have acces to key state variables and functions.

## Block Timestamp Manipulation
In this release of the project (0.2) we don't rely on timestamp.

## Constructors with Care
All the contracts of this project uses the ```constructor``` keyword.

## Uninitialised Storage Pointers
All the contracts of this project targets the 0.5.x version of the solidity compiler in whichthe use of memory and storage keywords are mandatory.

## Floating Points and Precision
In this release of the project (0.2) we don't use fixed points values.

## Tx.Origin Authentication
In this release of the project (0.2) we don't use tx.Origin.

# Security tools
## MythX
Having some trouble using the command line analysis `truffle run verify`, the MythX Visual Studio Code was used instead.
The full report highlight two low severity issues described bellow. 

Detected Issues

| 0 High | 0 Medium | 2 Low |
|--------|----------|-------|

| ID | Severity |  Name | File | Location |
|----|----------|-------|------|----------|
|SWC-103| Low| Floating Pragma |CSFeatureRegistry.sol |L: 9 C: 0 |
|SWC-108 |Low|State Variable Default Visibility|CSFeatureRegistry.sol |L: 30 C: 10|

As a correction, the line of code n° 30 was updated in the commit [08231bb](https://github.com/allilou/onchain-land-administration/commit/08231bb54bbe0d7e3313cd2cca0a0c62e09d817c) as follow :

```
uint256 internal featuresCount = 0;
```

## Mythril
Knowing that the free version of MythX don't analyze all the security vulnerabilities, the `mythril` tool was also used to check the smart contracts of this project.

Unfortunately, the latest version (v0.21.20) of this tool don't returns any analysis result.
```
mythril always retuns  The analysis was completed successfully. No issues were detected.
```
We tried with docker (on Debian Linux / windows 10) and with the python installed version of mythril, we get the same result !!!. The log was :
```
mythril.support.signatures [INFO]: Using signature database at /root/.mythril/signatures.db
mythril.analysis.security [INFO]: Found 0 detection modules
mythril.laser.ethereum.svm [INFO]: LASER EVM initialized with dynamic loader: <mythril.support.loader.DynLoader object at 0x7fb962e14b38>
mythril.laser.ethereum.strategy.extensions.bounded_loops [INFO]: Loaded search strategy extension: Loop bounds (limit = 10)
mythril.laser.ethereum.plugins.plugin_loader [INFO]: Loading plugin: <mythril.laser.ethereum.plugins.implementations.mutation_pruner.MutationPruner object at 0x7fb96265cdd8>
mythril.laser.ethereum.plugins.plugin_loader [INFO]: Loading plugin: <mythril.laser.ethereum.plugins.implementations.coverage.coverage_plugin.InstructionCoveragePlugin object at 0x7fb962e02d30>
mythril.laser.ethereum.plugins.plugin_loader [INFO]: Loading plugin: <mythril.laser.ethereum.plugins.implementations.dependency_pruner.DependencyPruner object at 0x7fb962e02b70>
mythril.analysis.security [INFO]: Found 14 detection modules
mythril.analysis.security [INFO]: Found 14 detection modules
mythril.laser.ethereum.svm [INFO]: Starting contract creation transaction
mythril.laser.ethereum.svm [INFO]: Finished contract creation, found 1 open states
mythril.laser.ethereum.svm [INFO]: Starting message call transaction, iteration: 0, 1 initial states
mythril.laser.ethereum.plugins.implementations.coverage.coverage_plugin [INFO]: Number of new instructions covered in tx 0: 529 
...
mythril.analysis.security [INFO]: Starting analysis
mythril.analysis.security [INFO]: Found 0 detection modules
mythril.analysis.security [INFO]: Found 14 detection modules
mythril.analysis.security [INFO]: Found 14 detection modules
mythril.mythril.mythril_analyzer [INFO]: Solver statistics: 
Query count: 116 
Solver time: 12.620124101638794
The analysis was completed successfully. No issues were detected.
```
## Slither
Desperate from using `mythril`, the `slither` tool was used and returns the following results.

```
INFO:Slither:./contracts/LAParcelRegistry.sol analyzed (13 contracts with 40 detectors), 36 result(s) found
INFO:Slither:Use https://crytic.io/ to get access to additional detectors and Github integration

```

***Reentrancy 1***
```
INFO:Detectors:
Reentrancy in LAParcelRegistry.claimParcel(bytes15,bytes32,string,string,uint256,string) (contracts/LAParcelRegistry.sol#47-67):
	External calls:
	- parcel.setExtAddressId(addr) (contracts/LAParcelRegistry.sol#60)
	- parcel.setLabel(lbl) (contracts/LAParcelRegistry.sol#61)
	- parcel.setArea(area) (contracts/LAParcelRegistry.sol#62)
	- parcel.setParcelType(parcelType) (contracts/LAParcelRegistry.sol#63)
	State variables written after the call(s):
	- CSFeatureRegistry.features (contracts/geospatial/CSFeatureRegistry.sol#32) in features[csc] = address(parcel) (contracts/LAParcelRegistry.sol#64)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-2
```
For this reentrancy warning the code was update as follow :
```
LAParcel parcel = new LAParcel(dggsIndex,wkbHash, msg.sender, h3Resolution);
    bytes32 csc = parcel.getFeatureCSC();
    features[csc] = address(parcel); // state variable set before functions calls
    parcel.setExtAddressId(addr);
    parcel.setLabel(lbl);
    parcel.setArea(area);
    parcel.setParcelType(parcelType);
```

***Reentrancy 2***

```
INFO:Detectors:
Reentrancy in LAParcelRegistry.claimParcel(bytes15,bytes32,string,string,uint256,string) (contracts/LAParcelRegistry.sol#47-67):
	External calls:
	- parcel.setExtAddressId(addr) (contracts/LAParcelRegistry.sol#60)
	- parcel.setLabel(lbl) (contracts/LAParcelRegistry.sol#61)
	- parcel.setArea(area) (contracts/LAParcelRegistry.sol#62)
	- parcel.setParcelType(parcelType) (contracts/LAParcelRegistry.sol#63)
	Event emitted after the call(s):
	- LogParcelClaimed(csc,dggsIndex,wkbHash,addr,lbl,area,parcelType,msg.sender) (contracts/LAParcelRegistry.sol#65)
Reentrancy in CSFeatureRegistry.removeFeature(bytes32) (contracts/geospatial/CSFeatureRegistry.sol#126-138):
	External calls:
	- feature.kill() (contracts/geospatial/CSFeatureRegistry.sol#136)
	Event emitted after the call(s):
	- LogFeatureRemoved(name,csc,dggsIndex,msg.sender) (contracts/geospatial/CSFeatureRegistry.sol#137)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3
```
For the reentrancy waring concerning the `removeFeature` function the code was modified as follow :
```
    emit LogFeatureRemoved(name, csc, dggsIndex, msg.sender);
    feature.kill();
``` 
This make sens if we consider that state variables are no more available after the `kill()` call.

***Shadows vulnerability***
```
INFO:Detectors:
LAParcel.constructor(bytes15,bytes32,address,uint256)._owner (contracts/LAParcel.sol#35) shadows:
	- Ownable._owner (node_modules/@openzeppelin/contracts/ownership/Ownable.sol#14) (state variable)
CSSurface.constructor(bytes15,bytes32,address,uint256)._owner (contracts/geospatial/CSSurface.sol#33) shadows:
	- Ownable._owner (node_modules/@openzeppelin/contracts/ownership/Ownable.sol#14) (state variable)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#local-variable-shadowing

```
No correction was undertaken for this result considered as a warning.

***Old compiler version allowed***

```
INFO:Detectors:
Pragma version^0.5.0 (contracts/LAParcel.sol#11) allows old versions
Pragma version^0.5.0 (contracts/LAParcelRegistry.sol#9) allows old versions
Pragma version^0.5.0 (contracts/geospatial/CSFeature.sol#14) allows old versions
Pragma version^0.5.0 (contracts/geospatial/CSFeatureInterface.sol#12) allows old versions
Pragma version^0.5.0 (contracts/geospatial/CSFeatureRegistry.sol#9) allows old versions
Pragma version^0.5.0 (contracts/geospatial/CSGeometryLib.sol#11) allows old versions
Pragma version^0.5.0 (contracts/geospatial/CSSurface.sol#11) allows old versions
Pragma version^0.5.0 (node_modules/@openzeppelin/contracts/GSN/Context.sol#1) allows old versions
Pragma version^0.5.0 (node_modules/@openzeppelin/contracts/access/Roles.sol#1) allows old versions
Pragma version^0.5.0 (node_modules/@openzeppelin/contracts/access/roles/PauserRole.sol#1) allows old versions
Pragma version^0.5.0 (node_modules/@openzeppelin/contracts/lifecycle/Pausable.sol#1) allows old versions
Pragma version^0.5.0 (node_modules/@openzeppelin/contracts/math/SafeMath.sol#1) allows old versions
Pragma version^0.5.0 (node_modules/@openzeppelin/contracts/ownership/Ownable.sol#1) allows old versions
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-versions-of-solidity
```
No correction was undertaken for this result considered as a warning.

***Variables not in mixedCase***

```
INFO:Detectors:
Parameter LAParcel.setExtAddressId(string)._addrId (contracts/LAParcel.sol#44) is not in mixedCase
Parameter LAParcel.setLabel(string)._lbl (contracts/LAParcel.sol#53) is not in mixedCase
Parameter LAParcel.setArea(uint256)._area (contracts/LAParcel.sol#62) is not in mixedCase
Parameter LAParcel.setParcelType(string)._parcelType (contracts/LAParcel.sol#71) is not in mixedCase
Parameter CSFeature.setWkbHash(bytes32)._wkbHash (contracts/geospatial/CSFeature.sol#110) is not in mixedCase
Parameter CSFeature.isAdmin(address)._address (contracts/geospatial/CSFeature.sol#122) is not in mixedCase
Parameter CSFeatureRegistry.dggsIndexExist(bytes15)._dggsIndex (contracts/geospatial/CSFeatureRegistry.sol#110) is not in mixedCase
Parameter CSFeatureRegistry.dggsIndexOwner(bytes15)._dggsIndex (contracts/geospatial/CSFeatureRegistry.sol#119) is not in mixedCase
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions
```
No correction was undertaken for this result considered as a warning.

***'function' should be declared external***
```
INFO:Detectors:
fetchParcel() should be declared external:
	- LAParcel.fetchParcel() (contracts/LAParcel.sol#78-82)
claimParcel(bytes15,bytes32,string,string,uint256,string) should be declared external:
	- LAParcelRegistry.claimParcel(bytes15,bytes32,string,string,uint256,string) (contracts/LAParcelRegistry.sol#47-67)
getFeatureCount() should be declared external:
	- CSFeatureRegistry.getFeatureCount() (contracts/geospatial/CSFeatureRegistry.sol#92-94)
dggsIndexExist(bytes15) should be declared external:
	- CSFeatureRegistry.dggsIndexExist(bytes15) (contracts/geospatial/CSFeatureRegistry.sol#110-112)
dggsIndexOwner(bytes15) should be declared external:
	- CSFeatureRegistry.dggsIndexOwner(bytes15) (contracts/geospatial/CSFeatureRegistry.sol#119-121)
addPauser(address) should be declared external:
	- PauserRole.addPauser(address) (node_modules/@openzeppelin/contracts/access/roles/PauserRole.sol#27-29)
renouncePauser() should be declared external:
	- PauserRole.renouncePauser() (node_modules/@openzeppelin/contracts/access/roles/PauserRole.sol#31-33)
pause() should be declared external:
	- Pausable.pause() (node_modules/@openzeppelin/contracts/lifecycle/Pausable.sol#62-65)
unpause() should be declared external:
	- Pausable.unpause() (node_modules/@openzeppelin/contracts/lifecycle/Pausable.sol#70-73)
renounceOwnership() should be declared external:
	- Ownable.renounceOwnership() (node_modules/@openzeppelin/contracts/ownership/Ownable.sol#55-58)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#public-function-that-could-be-declared-as-external
```
No correction was undertaken for this result considered as a warning.


