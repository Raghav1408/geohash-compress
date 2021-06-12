export module 'geohash-compress' {

  declare type CoordinatesArray = Array<Array<Array<number>>>

  declare class GeoHashCompress {
    constructor(compressedHashes: Set<string>, maxPrecision: number, minPrecision: number);
    contains(long: number, lat: number): boolean;
  }

  declare const geoHashCompressFromPoly = (polygon: CoordinatesArray, precision: number, minPrecision: number) => GeoHashCompress
  declare const buildCompressedHashSet = (polygon: CoordinatesArray, precision: number, minPrecision: number) => GeoHashCompress
}