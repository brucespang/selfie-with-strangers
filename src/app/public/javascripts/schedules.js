var map = new GMaps({
  div: '#schedule-map',
  lat: destination.lat,
  lng: destination.lon
});
map.addMarker({
  lat: destination.lat,
  lng: destination.lon,
})

Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

function distance_between(lat1, lon1, lat2, lon2) {
  lat1 = lat1.toRad();
  lon1 = lon1.toRad();
  lat2 = lat2.toRad();
  lon2 = lon2.toRad();

  var dlon = lat2-lat1;
  var dlat = lon2-lon1;
  var a = Math.sin(dlat/2) * Math.sin(dlat/2) +
      Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
      Math.sin(dlon/2) * Math.sin(dlon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var r = 3956; // radius of earth in miles
  return c * r;
}

function redirectIfNearby() {
  getLocation(function(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log(distance_between(lat, lon, destination.lat, destination.lon))
    if (distance_between(lat, lon, destination.lat, destination.lon) < 1) {
      location.href = "/matches/"+proposal.id+"?lat="+lat+"&lon="+lon
    }
  })
}

$(document).ready(function() {
  redirectIfNearby()
  setInterval(redirectIfNearby, 1000)
})
