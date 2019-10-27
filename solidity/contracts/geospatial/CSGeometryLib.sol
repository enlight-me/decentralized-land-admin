/**
 * @title Crypto-Spatial Geometry Library
 * @author BENAHMED DAHO Ali
 * @notice a library that implement main utilities for the Geospatial Features Geometry type
 * @dev ....
 *
 *
*/


pragma solidity ^0.5.0;

library CSGeometryLib {
  /**
  * @notice enumeration defining the Crypto-Spatial Geometry Types
  *  inspired from OGC simple feature acces
  */

  enum CSGeometryType {
    GM_POINT,
    GM_CURVE,
    GM_SURFACE
  }

  /**
  * @notice computeCSCIndex function
  * @dev calculate the Crypto-Spatial Coordinate (CSC) of the spatial feature
  * @param owner a record holding the owner of the CSC
  * @param dggsIndex the H3 index of the spatial feature
  * @return the Crypto-Spatial Coordinate (CSC) of the spatial feature
  */
  function computeCSCIndex (address owner, bytes15 dggsIndex)
  external pure returns (bytes32) {
    require(owner != address(0), "Empty address");
    require(dggsIndex[0] != 0, "Empty dggsIndex");
    return keccak256(abi.encodePacked(owner, dggsIndex));
  }

}
