const { Geohash } = require('./Geohash');
let nodeGeohash = require('ngeohash')
let turf = require('@turf/turf')
const geohashPoly = require('geohash-poly')
class geoHashCompress {
	/**
     * @param   {Set} compressedHashes - compressed hash set of the polygon
     * @param   {number} maxPrecision - Maximum precision of hashes generated.
     * @param   {number} minPrecision - Minimum precision of hash generated.
     */
	constructor(compressedHashes, maxPrecision = 7, minPrecision = 1) {
		this._currentPrecision = maxPrecision;
		this._intialPrecison = maxPrecision;
		this._minPrecision = minPrecision;
		this._result = compressedHashes;
		return this;
	}

	/**
   * @param   {number} long - longitude of point
	 * @param   {number} lat - 	latitude of point.
	 * @returns {bool} true/false - true if point is inside the polygon or vice versa.
     */
	contains(long, lat) {
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
	/**
	 * @returns {bool} true/false - true if point is inside the polygon or vice versa.
     */
	toGeoJson() {
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
}
module.exports = geoHashCompress;
