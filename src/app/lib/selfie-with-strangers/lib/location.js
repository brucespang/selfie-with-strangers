function Location (latitude, longitude) {
    this.latitude =  latitude;
    this.longitude =  longitude;
}

exports.getLocation = function (cb) {
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
        	cb(undefined, position.coords.latitude, position.coords.longitude);
    
    }); 
    else { 
        cb("Your browser does not support geolocation.");
    }
	}
}

