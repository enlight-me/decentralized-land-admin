var express = require('express');
const cors = require('cors');
const spatialite = require('spatialite').verbose();
const db = new spatialite.Database('db.sqlite');
var router = express.Router();
const h3 = require("h3-js");
const web3 = require('web3');

//const QUERY = 'SELECT id, geohash, owner, cscindex, AsGeoJSON(geometry) AS geometry FROM cscindex';

/* GET CSC Indexes list */

// http://localhost:4000/collections/cscindex/addFeature?geohash=0xfffffffffffffff&owner=0x000&index=0x0000
router.get('/', cors(), function (req, res) {
  
  const geoHash = web3.utils.hexToAscii(req.query.geohash);
  const hexCenterCoordinates = h3.h3ToGeo(geoHash);
  const position = ""+hexCenterCoordinates[0]+" "+hexCenterCoordinates[1];

  const ADD_QUERY = "INSERT INTO cscindex  (geohash, owner, cscindex, transhash, geometry) \
  VALUES ('"+req.query.geohash+"', '"+req.query.owner+"', '"+req.query.index+"', '"
  +req.query.transactionHash+"', GeomFromText('POINT("+position+")', 4326))";

  // console.log(ADD_QUERY);
  db.spatialite(function(err) {
    db.run(ADD_QUERY, (err, rows) => {
        if (err) {
        console.log(err)
      } 
    });
  });
  resGeoHJSON = '{"type": "Feature", "properties" : {"geohash":"'+req.query.geohash+'", "owner":"'+req.query.owner+'", "cscindex":"'+ req.query.cscindex+'"}, "geometry": {"type": "Point", "coordinates": ['+hexCenterCoordinates[0]+", "+hexCenterCoordinates[1]+']}}';
  res.send(resGeoHJSON);
  // console.log(resGeoHJSON);  
  // console.log(req.query);
})

module.exports = router;
