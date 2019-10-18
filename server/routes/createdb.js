var express = require('express');
const cors = require('cors');
const spatialite = require('spatialite').verbose();
const db = new spatialite.Database('db.sqlite');
var router = express.Router();

/*
 * Route not implemnted yet
 *
 */

const QUERY_CREATE_CSCIndex_TABLE = "CREATE TABLE IF NOT EXISTS cscindex (\
                                            id INTEGER NOT NULL PRIMARY KEY,\
                                            geohash TEXT,\
                                            owner TEXT,\
                                            transhash TEXT,\
                                            cscindex TEXT);"

const QUERY_CREATE_AddGeomColumn_TABLE = "SELECT AddGeometryColumn('cscindex','geometry', 3785, 'POINT', '2');"
const QUERY_CREATE_SpatialIndex_TABLE = "SELECT CreateSpatialIndex ('cscindex','geometry');"

createCSCIndexes = () => {

db.spatialite(function (err) {
  db.run(QUERY_CREATE_CSCIndex_TABLE, function (err) {
    if(err) { console.error(err); }
  });
  db.run("SELECT InitSpatialMetaData();", (err) => { if(err) {console.error(err);} });
  db.run(QUERY_CREATE_AddGeomColumn_TABLE, (err) => { if(err) {console.error(err);} });
  db.run(QUERY_CREATE_SpatialIndex_TABLE, (err) => {if(err) {console.error(err);}  });
});

db.spatialite(function(err) {
  db.each(QUERY, (err, result) => {
      if (err) {
      console.log(err)
    } else {
      console.log(result);
    }
  });
});
}
