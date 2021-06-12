export const makeRandomPointCenteredOn = (lng, lat, delta) => {
  return {
    lat: lat + (Math.random() - 0.5) * delta,
    lng: lng + (Math.random() - 0.5) * delta
  }
}