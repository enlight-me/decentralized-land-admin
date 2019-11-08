var express = require('express');
const cors = require('cors');
const spatialite = require('spatialite').verbose();
const db = new spatialite.Database('db.sqlite');
var router = express.Router();

//const QUERY = 'SELECT id, geohash, owner, cscindex, AsGeoJSON(geometry) AS geometry FROM cscindex';
const QUERY = 'SELECT id, reg_name, dggs_index, owner, csc, wkb_hash, transhash, AsGeoJSON(geometry) AS geometry FROM features';

/* GET CSC Indexes list */

router.get('/', cors(), function (req, res) {
  res.write('[\n');
  // res.setHeader('Content-Type', 'application/json');
  db.spatialite(function(err) {
    db.all(QUERY, (err, rows) => {
        if (err) {
        console.log(err)
      } else {
        rows.forEach((element, index, arr) => {
          // res.write(JSON.stringify(element));
          res.write('{"type": "Feature", "properties" : {"id":"'+element.id
                                                        +'", "regName":"'+element.reg_name
                                                        +'", "dggsIndex":"'+element.dggs_index
                                                        +'", "owner":"'+element.owner
                                                        +'", "csc":"'+element.csc
                                                        +'", "wkbHash":"'+element.wkb_hash
                                                        +'", "transHash":"'+element.transhash
                                                        +'"}, "geometry":'+element.geometry+'}');
          if (index != arr.length-1) { res.write(',\n'); }
          // res.json(rows);    
        });
        res.end(']');
      }
    });
  });
})


module.exports = router;
