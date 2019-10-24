/**
 * @title CSC (Crypto-SpatialCoordinate)
 * @dev a library that implement main utilities for the Geospatial Features Geometry type
 *
 * @notice ....
 * Requirements:
 * - ....
 *
*/

pragma solidity ^0.5.0;

library CSC {

    struct CSCStruct {
    address owner;
    bytes15 dggsIndex;
    }

    /**
    * @dev calculate the CSC Index using ...
    * @notice calcCSCIndex
    * @param cscData a record holding the owner of the CSC
    *         and the dggsIndex of the geospatialy referenced entity
    */
    function computeCSCIndex (CSCStruct storage cscData)
    public
    returns (bytes32) {
      require(cscData.owner != address(0), "Empty address");
      require(cscData.dggsIndex[0] != 0, "Empty dggsIndex");
      return keccak256(abi.encodePacked(cscData.owner, cscData.dggsIndex));
    }

    /* @notice isCSCIndex
    * @param cscData a record holding the owner of the CSC
    *         and the dggsIndex of the geospatialy referenced entity
    * @param  _cscIndex the CSC Index
    */
    function isValidCSCIndex(CSCStruct storage cscData, bytes32 _cscIndex)
    public
    returns (bool) {
      return (_cscIndex == computeCSCIndex(cscData));
    }

}
