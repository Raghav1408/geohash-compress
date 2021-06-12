import { Geohash } from './Geohash.js'

export class GeoHashCompress {
	/**
     * @param   {Set} compressedHashes - compressed hash set of the polygon
     * @param   {number} maxPrecision - Maximum precision of hashes generated.
     * @param   {number} minPrecision - Minimum precision of hash generated.
     */
	constructor(compressedHashes, maxPrecision = 7, minPrecision = 1) {
		this.maxPrecision = maxPrecision;
		this.minPrecision = minPrecision;
		this.set = compressedHashes;
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
		const hash = Geohash.encode(lat, long, this.maxPrecision);
		for (let i = 1; i <= hash.length; i++) {
			if (this.set.has(hash.slice(0, i))) {
				return true;
			}
		}
		return false;
	}
}
