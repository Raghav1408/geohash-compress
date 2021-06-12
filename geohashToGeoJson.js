import nodeGeohash from 'ngeohash'
import turf from '@turf/turf'

export const toGeoJson = (map) => {
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
export const fromGeoJson = (geoJson) => {
    if(geoJson.type != 'Polygon'){
        throw Error('Geojson type must be a polygon!')
    }
    if(geoJson.coordinates.length == 0){
        throw Error('Not a valid Polygon!')
    }
    console.log("geometry",geoJson.coordinates);
    return (geoJson.coordinates)[0];

}