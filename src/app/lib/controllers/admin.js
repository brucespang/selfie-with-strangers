var express = require('express');
var render = require("helpers/render");

module.exports = function(selfie_client) {
  var auth = require('helpers/auth')(selfie_client);
  var router = express.Router();

  router.get('/', auth.check_admin_logged_in(function(req, res) {
    render(res, 'admin/index')
  }));

  return router;
};
