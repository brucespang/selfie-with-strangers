module.exports = function(selfie_client) {
  var auth = require('helpers/auth')(selfie_client)

  function check_logged_out(req, res, next) {
    auth.is_logged_in(req, {
      error: function() {
        next
      },
      ok: function(current_user) {
        res.redirect("/")
      }
    })
  }

  function check_logged_in(req, res, next) {
    auth.is_logged_in(req, {
      error: function() {
        res.redirect("/login")
      },
      ok: function(current_user) {
        req.current_user = current_user
        next()
      }
    })
  }

  function check_admin_logged_in(req, res, next) {
    if (req.current_user && req.current_user.admin) {
      next()
    } else {
      res.redirect("/")
    }
  }

  return {
    check_logged_in: check_logged_in,
    check_admin_logged_in: check_admin_logged_in,
    check_logged_out: check_logged_out
  }
}
