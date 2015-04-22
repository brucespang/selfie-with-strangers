var extend = require('util')._extend

module.exports = function render(res, template, args) {
  var default_args = {
    stylesheets: [],
    javascripts: []
  }

  res.render(template, extend(default_args, args || {}), function (err, html) {
    if (err) {
      console.error(err);
      res.status(500);
      res.send("Internal server error");
    } else {
      res.send(html);
    }
  });
}
