// consult: http://www.w3schools.com/html/html5_geolocation.asp

var latitude = 0;
var longitude = 0;

getLocation();

window.addEventListener("DOMContentLoaded", function() {
	document.getElementById("location").onsubmit = function(e) {
		document.getElementById("latitude").value = latitude;
		document.getElementById("longitude").value = longitude;
	};
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCoordinates, showError);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}

function getCoordinates(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}