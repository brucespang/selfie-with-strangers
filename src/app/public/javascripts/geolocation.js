var latitude = 0;
var longitude = 0;

window.addEventListener("DOMContentLoaded", function() {
	document.getElementById("location").onsubmit = function(e) {
		getLocation();
		document.getElementById("latitude").value = latitude;
		document.getElementById("longitude").value = longitude;
	};
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCoordinates);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}
function getCoordinates(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
}
