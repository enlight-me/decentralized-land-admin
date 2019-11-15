# Desgin pattern decisions

The OnChain Land Administration dApp make use of the FOAM protocol


## Fail early and fail loud
use  require(); and assert


## Restricting Access

use openZeppelin Ownable/Roles/


## Auto Deprecation

contracts that should expire after a certain amount of time ??

## Mortal

contract Mortal is Ownable {
    
    function kill()
    {
           if(msg.sender == owner()) selfdestruct(address(uint160(owner()))); // cast owner to address payable
    }

}

## Pull over Push Payments (also known as the Withdrawal Pattern)

## Circuit Breaker


## State Machine

In dispute / bid

## Speed Bump
Speed bumps slow down actions so that if malicious actions occur, there is time to recover.


============================================


# CSFeatureRegistry
import '@openzeppelin/contracts/lifecycle/Pausable.sol';
import '@openzeppelin/contracts/ownership/Ownable.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';

contract CSFeatureRegistry is Pausable, Ownable {

  // Use safe math for featureCount;
  using SafeMath for uint256;


-------------------------------

# CSFeature

import '@openzeppelin/contracts/access/Roles.sol';
import '@openzeppelin/contracts/ownership/Ownable.sol';

contract CSFeature is CSFeatureInterface, Ownable {

    //
    // State variables
    //

    bytes32 internal csc;         // Crypto-Spatial Coordinate
    bytes32 internal wkbHash;     // Well Known Binary Hash
    bytes15 internal dggsIndex;   // DGGS (Disrcete Global Geodetic System) index
    uint internal h3Resolution;   // H3 resolution (H3 is a compliant DGGS library)
    CSGeometryLib.CSGeometryType internal geomteryType; // geometry type

    // adding access control
    using Roles for Roles.Role;

    Roles.Role private _admins;

  //
  // Events - publicize actions to external listeners
  //
    event LogFeatureCreated(bytes32 indexed csc, bytes15 indexed dggsIndex, bytes32 wkbHash, address indexed owner);
    event LogFeatureKilled(bytes32 indexed csc, bytes15 indexed dggsIndex, bytes32 wkbHash, address indexed owner);

    //
    // Modifiers
    //

    modifier onlyAdmins(address _address) {
      require(_admins.has(_address),"Caller haven't admins rights on the feature");
      _;
    }


  private variables 
  bytes32 internal csc;         // Crypto-Spatial Coordinate
    bytes32 internal wkbHash;     // Well Known Binary Hash
    bytes15 internal dggsIndex;   // DGGS (Disrcete Global Geodetic System) index
    uint internal h3Resolution;   // H3 resolution (H3 is a compliant DGGS library)
    CSGeometryLib.CSGeometryType internal geomteryType; // geometry type



  function kill() external onlyAdmins(msg.sender) 

  # CSFeatureinterface

  # Inheritance

Add admin accounts to Registry
Make state variables private 
  CircuitBreaker
dd import "./Roles.sol" to LAParcel
 add CircuitBreaker to LARegistry
 add killer to LAParcel

 Design Pattern : inherit CSFeature from Openzeppelin Ownable/Roles

  