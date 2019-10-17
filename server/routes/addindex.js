var express = require('express');
const cors = require('cors');
const spatialite = require('spatialite').verbose();
const db = new spatialite.Database('db.sqlite');
var router = express.Router();

//const QUERY = 'SELECT id, geohash, owner, cscindex, AsGeoJSON(geometry) AS geometry FROM cscindex';

/* GET CSC Indexes list */

// http://localhost:4000/addindex?geohash=0xfffffffffffffff&owner=0x000&cscindex=0x0000
router.get('/', cors(), function (req, res) {
  res.send(req.query.geohash);
  
   res.end("CSC Index Added");
})

module.exports = router;
