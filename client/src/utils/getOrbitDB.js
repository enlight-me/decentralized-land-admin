import IpfsClient from 'ipfs-http-client';
import IPFS from 'ipfs';
import OrbitDB from 'orbit-db';

const getOrbitDB = (useHttp, getParcelGeoms) =>
  new Promise((resolve, reject) => {

    // const useHttp = false;
    var wkbHashs = [];

    if (useHttp) {

      const ipfs = IpfsClient('http://localhost:5001');
      // const _ipfsHttp = IpfsClient('/ip4/127.0.0.1/tcp/5001');

      OrbitDB.createInstance(ipfs).then(async (orbitdb) => {

        const options = {
          // Give write access to ourselves
          accessController: {
            write: ['*']
          }
        }

        const _kv = await orbitdb.kvstore('land-parcels', options);
        _kv.load();

        _kv.events.on('load.progress', (address, hash, entry, progress, total) => {
          // console.log('load', entry.payload.key);
          wkbHashs = [...wkbHashs, entry.payload.key];
        });
        
        _kv.events.on('ready', (dbname, heads) => {
          // console.log('ready', dbname, heads, wkbHashs);
          wkbHashs.forEach(hash => {
            console.log(hash);
            /*
            setIPFSFeatures(ipfsFeatures => {
              const geojson = wkx.Geometry.parse(_kv.get(hash)).toGeoJSON();
              console.log(geojson);
              const list = [...ipfsFeatures, { 'wkbHash': hash, 'geojson': geojson }];
              return list;
            });
            */

          });

        });

        _kv.events.on('write', (dbname, hash, entry) => {
          console.log(entry); //entry[0].payload.value);
          /*
          setIPFSFeatures(ipfsFeatures => {
            const geojson = wkx.Geometry.parse(entry[0].payload.value).toGeoJSON();
            const list = [...ipfsFeatures, { 'wkbHash': entry[0].payload.key, 'geojson': geojson }];
            return list;
          });
          */
        });
        resolve(_kv);
        // setKVDBFeatures(_kv);
      });
    }
    else {
      var orbitdb = {};

      const ipfs = new IPFS({
        init: true,
        start: true,
        config: {
          Bootstrap: [
            "/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu",
            "/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd",
            "/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3",
            "/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm",
            "/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64"
          ]
        }
      });

      ipfs.on('error', (e) => console.error(e));

      ipfs.on('ready', async () => {
        orbitdb = await OrbitDB.createInstance(ipfs);

        const options = {
          // Give write access to ourselves
          accessController: {
            write: ['*']
          }
        }

        const _kv = await orbitdb.kvstore('land-parcels', options);
        _kv.load();

        _kv.events.on('load.progress', getParcelGeoms );
        
        /*
        _kv.events.on('load.progress', (address, hash, entry, progress, total) => {
          // console.log('load', entry.payload.key);
          wkbHashs = [...wkbHashs, entry.payload.key];
        });
        */

        _kv.events.on('ready', (dbname, heads) => {
          wkbHashs.forEach(hash => {
            // console.log(hash);
            
            // setParcelGeoms(geom => {
            //   const geojson = wkx.Geometry.parse(_kv.get(hash)).toGeoJSON();
            //   // console.log(geojson);
            //   const list = [...geom, { 'wkbHash': hash, 'geojson': geojson }];
            //   return list;
            // });
            
          });
        });
        

        _kv.events.on('write', (dbname, hash, entry) => {
          console.log(entry); //entry[0].payload.value);
          /*
          setIPFSFeatures(ipfsFeatures => {
            const geojson = wkx.Geometry.parse(entry[0].payload.value).toGeoJSON();
            const list = [...ipfsFeatures, { 'wkbHash': entry[0].payload.key, 'geojson': geojson }];
            return list;
          });
          */
        });

        _kv.events.on('replicated', (dbname, hash, entry) => {
          console.log('replication', entry); //entry[0].payload.value);
        });

        resolve(_kv);
      // try {
      // } catch (error) {
      //   reject(error);
      // }
     
        // setKVDBFeatures(_kv);
      });
    }
  });

export default getOrbitDB;
