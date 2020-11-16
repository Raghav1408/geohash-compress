let nodeGeohash = require('ngeohash')
let turf = require('@turf/turf')

const toGeoJson = (map) => {
    let hashes = Object.keys(map);
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
const fromGeoJson = (geoJson) => {
    if(geoJson.type != 'Polygon'){
        throw Error('Geojson type must be a polygon!')
    }
    if(geoJson.coordinates.length == 0){
        throw Error('Not a valid Polygon!')
    }
    console.log("geometry",geoJson.coordinates);
    return (geoJson.coordinates)[0];

}
module.exports = {
    toGeoJson,
    fromGeoJson
}