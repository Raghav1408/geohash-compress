
# geohash - compress
A data compression and [Geo-hasing](http://en.wikipedia.org/wiki/Geohash) library for large sized Geo-polygons. It solves the problem when standard point-in-polygon query takes too much time and conversion of Geo-polygon into Geohashes for constant time point-in-polygon query, takes large space in memory. This library provides a memory effiecent soltution for constant time point-in-polygon query by converting the hashes to lowest possible order.



## Installation
### In Node.js
``` sh
pnpm install @lacuna/geohash-compress 
```

<!-- USAGE EXAMPLES -->
## Simple Usage
```ts
import { geoHashCompressFromPoly, GeoHashCompress } from '@lacuna/geohash-compress'

(async()=>{
    // an array of arrays of [long, lat]
    const geofence = [[
        [75.4375024, 22.8725924],
        [75.4401784, 22.9105034],
        [75.4562348, 22.9185316],
        [75.4620329, 22.9287898],
        [75.4375024, 22.8725924],
    ]]
    const maxHashLength = 7;
    const minHashLength = 1
    // this step can take a while, as it's turning a polygon into a hash-set then compressing it.  It is best to do this offline as demonstrated in "more performant usage" section bellow
    const polygon: GeoHashCompress = await geoHashCompressFromPoly(geofence, maxHashLength, minHashLength);

    console.log(polygon.contains(75.8814993,22.7418224)) 
})()
 
```

## More performant usage
```ts
import { buildCompressedHashSet, GeoHashCompress } from '@lacuna/geohash-compress'
import fs from 'fs'

(async()=>{
    // an array of arrays of [long, lat]
    const geofence = [[
        [75.4375024, 22.8725924],
        [75.4401784, 22.9105034],
        [75.4562348, 22.9185316],
        [75.4620329, 22.9287898],
        [75.4375024, 22.8725924],
    ]]
    const maxHashLength = 7;
    const minHashLength = 1

    // Store this compressed hash array (string array) for cached usage later.  Write to disk / read from disk on app start - as the buildCompressedHashSet is computationally expensive
    const hash: string[] = await buildCompressedHashSet(geofence, maxHashLength, minHashLength);

    const polygon = new GeoHashCompress(new Set([...hash]), maxHashLength, minHashLength);
    // do lots of polygon.contain calls!
    console.log(polygon.contains(75.8814993,22.7418224)) 
})()
 
```

## Benchmarks
```html
Intial data size of polygon : 34.8 MB
Final data size of polygon : 1.2 MB

100 point-in-polygon query without compression: 3ms
100 point-in-polygon query with compression: 4ms
```

![Without Compression 34.8 MB](/images/image1.png)![With Compression 1.2MB](images/image3.png)
### *Without Compression 34.8 MB* -> *With Compression 1.2 MB*
<!-- LICENSE -->
## License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.


<!-- ![title](images/image3.png)
![title](images/image2.png) -->
