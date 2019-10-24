/**
 * @title CryptoSpatialFeature
 * @dev an abstract contract that implement a Geospatial Features Geometry type
 * on the etherurm blockchain
 *
 * @notice ....
 * Requirements:
 * - ....
 *
 * TODO :
 *  - inherit [point, curve, surface] from this contract
 *  - make this contract Ownable
 *  - add a WKB hash useful for [Curve, Surface] features
 *
*/

pragma solidity ^0.5.0;


import './CSC.sol';

contract SpatialFeature {

    struct CryptoGeometry {
    address owner;
    bytes15 dggsIndex;
    }

    using CSC for CSC.CryptoGeometry;
    //
    // State variables
    //

    CSC.CryptoGeometry public cscData;
    bytes32 public cscIndex;

    //
    // Functions
    //

    /// @notice constuctor
    constructor (bytes15 _dggsIndex) public {
      cscData.owner = msg.sender;
      cscData.dggsIndex = _dggsIndex;
      cscIndex = cscData.computeCSCIndex();
    }

  function () external {
      revert("this contract should never have a balance");
    }

}
