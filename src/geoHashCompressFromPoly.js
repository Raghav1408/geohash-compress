import {geoHashCompress} from './geoHashCompress.js'
import geohashPoly from 'geohash-poly'
import fs from 'fs'

export const geoHashCompressFromPoly = async (polygon, precision = 7, minPrecision = 1) => {
  const uncompressedHash = await getUncompressedHashFromCoords(polygon, precision);
  const compressedHash = compress(uncompressedHash, precision, minPrecision);
  const geohash = new geoHashCompress(compressedHash, precision, minPrecision);
  return geohash;
}

const getUncompressedHashFromCoords = (coords, precision) => new Promise((resolve, reject) => {
  geohashPoly({coords, precision}, (err, result) => {
    if (err) {
      reject(Error(err));
    } else {
      resolve(result);
    }
  });
});

const compress = (uncompressedHash, precision, minPrecision) => {
  const result = {};
  if (!Array.isArray(uncompressedHash)) {
    throw new Error('Hashes must be an Arrray');
  }
  if (precision <= minPrecision) {
    throw new Error('minimum precision should be less than given precison of hashes!');
  }

  const data = { [precision]: {} };
  data[precision] = uncompressedHash.reduce((acc, elem) => {
    acc[elem] = true;
    return acc;
  }, {});

  for (let i = precision; i > minPrecision; i--) {
    if (i in data) decreasePrecison(data, i);
    else break;
  }
  let precisions = Object.keys(data);
  precisions.forEach((finalPrecisions) => {
    let hashes = Object.keys(data[finalPrecisions])
    hashes.forEach((hash) => {
      result[hash] = true;
      delete data[finalPrecisions][hash];
    });
  });
  return result;
}

const decreasePrecison = (data, currentPrecison) => {
  const checked = new Map();
  const base32 = [...'0123456789bcdefghjkmnpqrstuvwxyz'];

  for (let hash of Object.keys(data[currentPrecison])) {
    if (checked.has(hash.substr(0, hash.length - 1))) continue;
    else checked.set(hash.substr(0, hash.length - 1), true);

    const subHash = hash.substr(0, hash.length - 1);
    const combinations = base32.map((c) => `${subHash}${c}`);

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
  }
}
