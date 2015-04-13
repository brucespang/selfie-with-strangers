var request = require('request');


module.exports = function(hostname) {
  var users = []

  function apiRequest(path, cb) {
    request(hostname + "/users/nearby", function(err, res, body) {
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
				cb(undefined, users.filter(function(u) {return u.id == uid})[0])
			}
		},
		questions: {
			random: function(cb) {
				cb(undefined, questions[Math.floor(Math.random()*questions.length)])
			}
		},
	};
};
