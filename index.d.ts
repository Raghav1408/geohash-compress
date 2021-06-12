export module '@lacuna/geohash-compress' {

  declare type CoordinatesArray = Array<Array<Array<number>>>

  declare class GeoHashCompress {
    constructor(compressedHashes: Set<string>, maxPrecision: number, minPrecision: number);
    contains(long: number, lat: number): boolean;
    set: Set<string>
  }

  declare const geoHashCompressFromPoly = async (polygon: CoordinatesArray, precision: number, minPrecision: number) => GeoHashCompress
  declare const buildCompressedHashSet = async (polygon: CoordinatesArray, precision: number, minPrecision: number) => GeoHashCompress
}