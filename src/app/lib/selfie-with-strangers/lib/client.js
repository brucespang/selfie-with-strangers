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
      request.post({url: hostname + path, json: body, followAllRedirects: true}, function(err, res, body) {
        if (err) {
          cb(err)
        } else {
          try {
            if (res.statusCode == 200) {
              cb(undefined, body);
            } else {
              cb(body['error'])
            }
          } catch(e) {
            cb(e.stack)
          }
        }
      })
    },
    del: function(path, cb) {
      request.del({url: hostname + path, followAllRedirects: true}, function(err, res, body) {
        if (err) {
          cb(err)
        } else {
          try {
            if (res.statusCode == 200) {
              cb(undefined, body);
            } else {
              cb(body['error'])
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
			show: function(username, cb) {
        api.get("/users/" + username, cb)
			},
			list: function(cb) {
        api.get("/users/", cb)
			},
      new: function(user, cb) {
        api.post("/users/", user, cb)
      },
      update: function(username, user, cb) {
        api.post("/users/" + username, user, cb)
      }
		},
    matching: {
      enter_pool: function(location, cb) {
        api.post("/matching/", location, cb)
      }
    },
    sessions: {
      new: function(params, cb) {
        request.post({url: hostname + "/sessions/", json: params}, function(err, res) {
          if (err) {
            cb(err)
          } else {
            if (res.statusCode == 200) {
              var cookies = cookie.parse(res.headers['set-cookie'][0])
              cb(undefined, cookies.session)
            } else if (res.statusCode == 401) {
              cb("Invalid username or password")
            } else {
              cb("Internal server error")
            }
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
      list: function(cb) {
        api.get("/questions/", cb)
      },
			random: function(cb) {
        api.get("/questions/random", cb)
			},
      show: function(id, cb) {
        api.get("/questions/" + id, cb)
      },
      new: function(params, cb) {
        api.post("/questions/", params, cb)
      },
      update: function(id, params, cb) {
        api.post("/questions/"+id, params, cb)
      },
      delete: function(id, cb) {
        api.del("/questions/"+id, cb)
      }
		},
    selfies: {
      show: function(id, cb) {
        api.get("/selfies/" + id, cb)
      },
      new: function(params, cb) {
        api.post("/questions/", params, cb)
      },
      delete: function(id, cb) {
        api.del("/questions/"+id, cb)
      }
    },
	};
};
