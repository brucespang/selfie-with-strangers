var express = require('express');
var render = require("helpers/render");
var methodOverride = require('method-override')

module.exports = function(selfie_client) {
  var auth = require('helpers/middleware')(selfie_client);
  var router = express.Router();

  router.use(auth.check_logged_in);
  router.use(methodOverride('_method'));

  var selfiePics = [];

  router.get('/', function(req, res) {
    render(res, 'selfies/index', { pics : selfiePics , javascripts: ["/javascripts/geolocation.js"]});
  });

  router.post('/', function(req, res) {
    console.log(req.files);
    selfiePics.unshift(req.body.picture);
    if(selfiePics.length > 30){
  	  selfiePics.pop();
    }

    render(res, 'selfies/index', { pics : selfiePics });
  });

  router.get('/new', function(req, res) {
    render(res, 'selfies/new', {
      javascripts: ["/javascripts/camera.js", "/javascripts/jquery.min.js"]
    });
  });


  return router;
};
