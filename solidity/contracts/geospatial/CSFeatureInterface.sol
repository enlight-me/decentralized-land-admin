/**
 * @title CryptoSpatialFeature Interface
 * @author BENAHMED DAHO Ali
 * @notice an Interface contract that specify the Spatial Feature
 *
 * @dev GM_Primitive (ISO 19107)
 *
 * TODO :
 *
*/

pragma solidity ^0.5.0;


import './CSGeometryLib.sol';

interface CSFeatureInterface {

    //
    // Functions
    //

  function getGeometryType() external returns (CSGeometryLib.CSGeometryType);

  function getFeatureCSC() external view returns (bytes32 _csc);

  function getFeatureDGGSIndex() external view returns (bytes15);

  function fetchFeature() external view returns (bytes32 _csc,
                                                bytes15 _dggsIndex,
                                                bytes32 _wkbHash,
                                                address __owner,
                                                uint _h3Resolution,
                                                CSGeometryLib.CSGeometryType _geomteryType);

  function setWkbHash(bytes32 _wkbHash) external returns (bytes32 _wkbHashValue);

  function isAdmin(address _address) external view returns (bool);

  function kill() external;
}

/**
  * from Simple Feature Access - Part 1: Common Architecture
  * https://www.opengeospatial.org/standards/sfa
  * may be interesting to use oracles
  */
/*
+ dimension() : Integer
+ coordinateDimension() : Integer
+ spatialDimension() : Integer
+ geometry Ty pe() : String
+ SRID() : Integer
+ env elope() : Geometry
+ asText() : String
+ asBinary () : Binary
+ isEmpty () : Boolean
+ isSimple() : Boolean
+ is3D() : Boolean
+ isMeasured()() : Boolean
+ boundary () : Geometry
query
+ equals(another :Geometry ) : Boolean
+ disjoint(another :Geometry ) : Boolean
+ intersects(another :Geometry ) : Boolean
+ touches(another :Geometry ) : Boolean
+ crosses(another :Geometry ) : Boolean
+ within(another :Geometry ) : Boolean
+ contains(another :Geometry ) : Boolean
+ ov erlaps(another :Geometry ) : Boolean
+ relate(another :Geometry , matrix :String) : Boolean
+ locateAlong(mValue :Double) : Geometry
+ locateBetween(mStart :Double, mEnd :Double) : Geometry
analy sis
+ distance(another :Geometry ) : Distance
+ buf f er(distance :Distance) : Geometry
+ conv exHull() : Geometry
+ intersection(another :Geometry ) : Geometry
+ union(another :Geometry ) : Geometry
+ dif f erence(another :Geometry ) : Geometry
+ sy mDif f erence(another :Geometry ) : Geometry
*/

