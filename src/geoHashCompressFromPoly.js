const geoHashCompress = require('./geoHashCompress.js');
const geohashPoly = require('geohash-poly');

module.exports = async (polygon, precision = 7, minPrecision = 1) => {
  const uncompressedHash = await new Promise((resolve, reject) => {
    geohashPoly({coords: polygon, precision}, (err, result) => {
      if (err) {
        reject(Error(err));
      } else {
        resolve(result);
      }
    })
  }) 
  return new geoHashCompress(uncompressedHash, precision, minPrecision);
}
