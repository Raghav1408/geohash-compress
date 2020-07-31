let nodeGeohash = require('ngeohash')
let turf = require('@turf/turf')

const toGeoJson = (hashes) => {
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
module.exports.toGeoJson = toGeoJson