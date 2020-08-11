const { Geohash } = require('./Geohash.js');
let nodeGeohash = require('ngeohash')
let turf = require('@turf/turf')
const geohashPoly = require('geohash-poly')
class geoHashCompress {
	constructor(polygon, currentPrecision = 7, minPrecision = 1) {
		this._hashes = [];
		this._currentPrecision = currentPrecision;
		this._intialPrecison = currentPrecision;
		this._minPrecision = minPrecision;
		this._result = {};
		this.init(polygon);
		return this;
	}

	async init(polygon,currentPrecision){
		let hashes;
		await geohashPoly({coords: polygon, precision: this._currentPrecision}, function (err, result) {
			if(err){
				throw Error(err);
			}
			hashes = result;
		})
		this._hashes = hashes;
	}

  getCombinations(hash) {
    const base32 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'm',
				  'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    return base32.map((c) => `${hash}${c}`);
  }

  decreasePrecison(data, currentPrecison) {
    const checked = new Map();
		const hashes = Object.keys(data[currentPrecison]);
    for (let hash of Object.keys(data[currentPrecison])){
      if (checked.has(hash.substr(0, hash.length - 1))) continue;
      else checked.set(hash.substr(0, hash.length - 1), true);

      const combinations = this.getCombinations(hash.substr(0, hash.length - 1));

      (() => {
        for (const combination of combinations) {
          if (!(combination in data[currentPrecison])) return;
        }
        for (const combination of combinations) {
          delete data[currentPrecison][combination];
        }
        if (!(currentPrecison - 1 in data)) {
          data[currentPrecison - 1] = {};
        }
        data[currentPrecison - 1][hash.substr(0, hash.length - 1)] = 1;
      })();
    };
    checked.clear();
  }

	compress() {
		const precision = this._currentPrecision;
		const minPrecision = this._minPrecision;
		if (!Array.isArray(this._hashes)) {
			throw Error('Hashes must be an Arrray');
		}
		if (precision <= minPrecision) {
			throw new Error('minimum precision should be less than given precison of hashes!');
		}

		const data = { [precision]: {} };
		data[precision] = this._hashes.reduce((acc, elem) => {
			acc[elem] = true;
			return acc;
		}, {});

		for (let i = precision; i > minPrecision; i--) {
			if (i in data) this.decreasePrecison(data, i);
			else break;
		}
		let precisions = Object.keys(data);
		precisions.forEach((finalPrecisions) => {
			let hashes = Object.keys(data[finalPrecisions])
			hashes.forEach((hash) => {
				this._result[hash] = true;
				delete data[finalPrecisions][hash];
			});
		});
		this._hashes = null;
		return this._result;
	}

  insideOrOutside(lat, long) {
    if (isNaN(lat) || isNaN(long)) {
      throw Error('Latitude and Longitude should be Numbers!');
    }
    const hash = Geohash.encode(lat, long, this._intialPrecison);
    for (let i = 1; i <= hash.length; i++) {
      if (this._result[hash.slice(0, i)]) {
        return true;
      }
    }
    return false;
  }

	toGeoJson(){
		let hashes = Object.keys(this._result);
		let hashes_bbox = [];
		hashes.forEach((hash) => {
			let [minLat,minLong,maxLat,maxLong] = nodeGeohash.decode_bbox(hash)
			hashes_bbox.push([
				[minLong,minLat],
				[maxLong,minLat,],
				[maxLong,maxLat,],
				[minLong,maxLat],
				[minLong,minLat]
			])
		})
		return turf.getGeom(turf.polygon(hashes_bbox))
	}
	// fromGeoJson = () => {
	// 	if(geoJson.type != 'Polygon'){
	// 		throw Error('Geojson type must be a polygon!')
	// 	}
	// 	if(geoJson.coordinates.length == 0){
	// 		throw Error('Not a valid Polygon!')
	// 	}
	// 	console.log("geometry",geoJson.coordinates);
	// 	return (geoJson.coordinates)[0];

	// }
}
module.exports = geoHashCompress;
