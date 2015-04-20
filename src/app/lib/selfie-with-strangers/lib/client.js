var request = require('request');
var cookie = require('cookie')

module.exports = function(hostname) {
  var users = []

  var api = {
    get: function(path, cb) {
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
    },
    post: function(path, body, cb) {
      request.post({url: hostname + path, json: body}, function(err, res, body) {
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
  }

  return {
		users: {
			nearby: function(cb) {
        api.get("/users/nearby", cb)
			},
			show: function(uid, cb) {
        api.get("/users/" + uid, cb)
			}
		},
    sessions: {
      new: function(params, cb) {
        request.post({url: hostname + "/sessions/", json: params}, function(err, res) {
          if (res.statusCode == 200) {
            var cookies = cookie.parse(res.headers['set-cookie'][0])
            cb(undefined, cookies.session)
          } else {
            cb(err || "login failed")
          }
        })
      },
      current: function(cookie, cb) {
        request.get({url: hostname + "/sessions/current", headers: {cookie: "session="+cookie}},
                    function(err, res, body) {
                      if (err) {
                        cb(err)
                      } else if (res.statusCode != 200) {
                        cb("no session")
                      } else {
                        cb(undefined, JSON.parse(body))
                      }
                    })
      }
    },
		questions: {
			random: function(cb) {
        api.get("/questions/random", cb)
			}
		},
	};
};
