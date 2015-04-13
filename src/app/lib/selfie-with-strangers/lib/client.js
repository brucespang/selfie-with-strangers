var request = require('request');


module.exports = function(hostname) {
  var users = []

  function apiRequest(path, cb) {
    request(hostname + path, function(err, res, body) {
      if (err) {
        cb(err)
      } else {
        try {
          var json = JSON.parse(body)
          if (res.statusCode == 200) {
            cb(undefined, json);
          } else {
            cb(json['error'])
          }
        } catch(e) {
          cb(e.stack)
        }
      }
    })
  }

  return {
		users: {
			nearby: function(cb) {
        apiRequest("/users/nearby", cb)
			},
			show: function(uid, cb) {
        apiRequest("/users/" + uid, cb)
			}
		},
		questions: {
			random: function(cb) {
        apiRequest("/questions/random", cb)
			}
		},
	};
};
