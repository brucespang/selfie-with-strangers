var express = require('express');
var render = require("helpers/render");
var methodOverride = require('method-override')

module.exports = function(selfie_client) {
  var auth = require('helpers/middleware')(selfie_client);
  var router = express.Router();

  router.use(auth.check_logged_in);
  router.use(auth.check_admin_logged_in);
  router.use(methodOverride('_method'));

  router.get('/', function(req, res) {
    render(res, 'admin/index')
  });

  router.get('/users', function(req, res) {
    selfie_client.users.list(function(err, users) {
      if (err) {
        abort(500)
      } else {
        render(res, 'admin/users/index', {users: users.data})
      }
    })
  });

  var questions = require('controllers/admin/questions')(selfie_client)
  var locations = require('controllers/admin/locations')(selfie_client)
  router.use('/questions', questions)
  router.use('/locations', locations)

  return router;
};
