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
    selfie_client.locations.list(function(err, locations) {
      if (err) {
        abort(500)
      } else {
        render(res, 'admin/locations/index', {locations: locations.data})
      }
    })
  });

  router.get('/new', function(req, res) {
    var defaults = {name: req.query.name, lat: req.query.lat, lon: req.query.lon}
    render(res, 'admin/locations/new', defaults)
  });

  router.post('/', function(req, res) {
    var data = {
      name: req.body.name,
      lat: req.body.lat,
      lon: req.body.lon,
    }

    selfie_client.locations.new(data, function(err) {
      if (err) {
        res.flash("danger", err)
        res.redirect("/admin/locations/new?name="+data.name+"&lat="+data.lat+"&lon="+data.lon)
      } else {
        res.redirect("/admin/locations/")
      }
    })
  });

  router.get('/:id', function(req, res) {
    selfie_client.locations.show(req.params.id, function(err, location) {
      if (err) {
        abort(500)
      } else {
        render(res, 'admin/locations/edit', {location: location})
      }
    })
  });

  router.post('/:id', function(req, res) {
    var id = req.params.id
    var data = {
      name: req.body.name,
      lat: req.body.lat,
      lon: req.body.lon,
    }

    selfie_client.locations.update(id, data, function(err) {
      if (err) {
        res.flash("danger", err)
      }
      res.redirect("/admin/locations/" + id)
    })
  });

  router.delete('/:id', function(req, res) {
    selfie_client.locations.delete(req.params.id, function(err) {
      if (err) {
        res.flash("danger", err)
      } else {
        res.redirect("/admin/locations/")
      }
    })
  });

  return router;
};
