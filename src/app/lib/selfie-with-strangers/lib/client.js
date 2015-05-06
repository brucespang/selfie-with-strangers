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
          } catch(e) {
            cb(e.stack)
          }

          if (res.statusCode == 200) {
            cb(undefined, json);
          } else {
            cb(json['error'])
          }
        }
      })
    },
    post: function(path, body, cb) {
      request.post({url: hostname + path, json: body, followAllRedirects: true}, function(err, res, body) {
        if (err) {
          cb(err)
        } else {
          if (res.statusCode == 200) {
            cb(undefined, body);
          } else {
            cb(body['error'])
          }
        }
      })
    },
    del: function(path, cb) {
      request.del({url: hostname + path, followAllRedirects: true}, function(err, res, body) {
        if (err) {
          cb(err)
        } else {
          if (res.statusCode == 200) {
            cb(undefined, body);
          } else {
            cb(body['error'])
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
      enter_pool: function(data, cb) {
        api.post("/matching/", data, cb)
      },
      get_status: function(user, cb) {
        api.get("/matching/statuses/"+user.id, cb)
      },
      get_proposal: function(id, cb) {
        api.get("/matching/proposals/"+id, cb)
      },
      accept: function(user, cb) {
        api.post("/matching/statuses/"+user.id, {accepted: true}, cb)
      },
      reject: function(user, cb) {
        api.post("/matching/statuses/"+user.id, {accepted: false}, cb)
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
      list: function(cb) {
        api.get("/selfies/", cb)
      },
      new: function(params, cb) {
        api.post("/selfies/", params, cb)
      },
      update: function(id, params, cb) {
        api.post("/selfies/"+id, params, cb)
      },
      delete: function(id, cb) {
        api.del("/selfies/"+id, cb)
      }
    },
    selfie_users: {
      show: function(id, cb) {
        api.get("/selfie_users/" + id, cb)
      },
      new: function(params, cb) {
        api.post("/selfie_users/", params, cb)
      },
      update: function(id, params, cb) {
        api.post("/selfie_users/"+id, params, cb)
      },
      delete: function(id, cb) {
        api.del("/selfie_users/"+id, cb)
      }
    },
		locations: {
      list: function(cb) {
        api.get("/locations/", cb)
      },
      show: function(id, cb) {
        api.get("/locations/" + id, cb)
      },
      new: function(params, cb) {
        api.post("/locations/", params, cb)
      },
      update: function(id, params, cb) {
        api.post("/locations/"+id, params, cb)
      },
      delete: function(id, cb) {
        api.del("/locations/"+id, cb)
      }
		},
	};
};
