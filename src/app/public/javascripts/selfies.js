$(document).ready(function() {
  getLocation(function(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log(lat)
    console.log(lon)
	  document.getElementById("location").onsubmit = function(e) {
		  document.getElementById("latitude").value = lat;
		  document.getElementById("longitude").value = lon;
    }
    $("#location").show()
	});
});
