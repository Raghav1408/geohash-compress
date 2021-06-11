import {geoHashCompressFromPoly} from 'geohash-compress'
import { laFeature, laWithHoles } from './la.js'
import geohashPoly from 'geohash-poly'
import fs from 'fs'

const main = async () => {
  console.time('init')
  console.time('poly to uncompressed')
  const lngLats = laWithHoles.features[0].geometry.coordinates
  const polygon = await geoHashCompressFromPoly(lngLats, 7)
  console.timeEnd('poly to uncompressed')

  let hashes = {}
  try {
    console.time('compress')
    hashes = polygon.compress()
    console.timeEnd('compress')
    fs.writeFileSync('./output/outHash.json', JSON.stringify(hashes))
  } catch (e) {
    console.error("this went wrong", e)
  }
  console.timeEnd('init')

  console.time('t')
    const a = []
    for (let i = 0; i < 400000; i++) {
      const {lng, lat} = makeRandomPointCenteredOn(-118.3941650390625, 34.093610452768715, 0.5)
      if (polygon.insideOrOutside(lng, lat)) {
        a.push([lng, lat])
      }

    }
  console.timeEnd('t')
  // console.log('IN', a.filter(a => a))

  writeFeatureCollection('./output/yes.json', a)
}

const writeFeatureCollection = (filename, lngLats) => {
  const data = lngLats.map((lngLat) => ({
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": lngLat
    }
  }))
  fs.writeFileSync(filename, JSON.stringify(data,null,4))
}

const makeRandomPointCenteredOn = (lng, lat, delta) => {
  return {
    lat: lat + (Math.random() - 0.5) * delta,
    lng: lng + (Math.random() - 0.5) * delta
  }
}

try {
  main()
} catch (e) {
  console.error('e', e)
}



// // const main2 = () => {
// //   const la = laWithHoles.features[0].geometry.coordinates

// // //  let polygon = [[[-122.350051, 47.702893 ], [-122.344774, 47.702877 ], [-122.344777, 47.70324 ], [-122.341982, 47.703234 ], [-122.341959, 47.701421 ], [-122.339749, 47.701416 ], [-122.339704, 47.69776 ], [-122.341913, 47.697797 ], [-122.341905, 47.697071 ], [-122.344576, 47.697084 ], [-122.344609, 47.697807 ], [-122.349999, 47.697822 ], [-122.350051, 47.702893 ]]];
// //   geohashPoly({coords: la, precision: 7}, (err, result) => {
// //     console.log('hello err', err, result)
// //     fs.writeFileSync('./hash.json', JSON.stringify(result))
// //   })
// // }

// // main2()