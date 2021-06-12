import {geoHashCompressFromPoly} from 'geohash-compress'
import { laFeature, laWithHoles } from '../la.js'
import { writeFile } from './utils/writeFile.js'

const main = async () => {
  console.time('init')
  const lngLats = laWithHoles.features[0].geometry.coordinates
  const polygon = await geoHashCompressFromPoly(lngLats, 7)
  console.timeEnd('init')

  const maxIterations = 400000
  const timingTag = `compute ${maxIterations} pts`
  console.time(timingTag)
  const a = []
  for (let i = 0; i < maxIterations; i++) {
    const { lng, lat } = makeRandomPointCenteredOn(-118.3941650390625, 34.093610452768715, 0.5)
    a.push({
      coordinates: [lng, lat], 
      inside: polygon.contains(lng, lat)
    })
  }
  console.timeEnd(timingTag)
  writeFeatureCollection('./output/in.json', a.filter( a => a.inside).map(a => a.coordinates))
  writeFeatureCollection('./output/out.json', a.filter( a => !a.inside).map(a => a.coordinates))
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
  writeFile(filename, JSON.stringify(data,null,4))
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