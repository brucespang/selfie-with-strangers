var map = new GMaps({
  div: '#schedule-map',
  lat: destination.lat,
  lng: destination.lon
});
map.addMarker({
  lat: destination.lat,
  lng: destination.lon,
})
