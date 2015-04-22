module.exports = function(selfie_client) {
  function is_logged_in(req, opts) {
    if (!req.cookies) {
      return opts.error()
    }

    var cookie = req.cookies.session
	  if (cookie === undefined) {
      return opts.error()
    }

    selfie_client.sessions.current(cookie, function(err, user) {
      if (err) {
        return opts.error()
      } else {
        return opts.ok(user)
      }
    })
  }

  function check_logged_in(cb) {
    return function(req, res) {
      is_logged_in(req, {
        error: function() {
          res.redirect("/login")
        },
        ok: function(current_user) {
          req.current_user = current_user
          return cb(req, res)
        }
      })
    }
  }

  function check_logged_out(cb) {
    return function(req, res) {
      is_logged_in(req, {
        error: function() {
          cb(req, res)
        },
        ok: function(current_user) {
          res.redirect("/")
        }
      })
    }
  }

  return {
    is_logged_in: is_logged_in,
    check_logged_in: check_logged_in,
    check_logged_out: check_logged_out
  }
}
