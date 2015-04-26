var extend = require('util')._extend

module.exports = function render(res, template, args) {
  console.log(res.locals)
  var default_args = {
    stylesheets: [],
    javascripts: [],
    flash: function() {
      var r = ""
      while (message = res.locals.flash.shift()) {
        r += '<div class="alert alert-'+message.type+'" role="alert">' + message.message + '</div>'
      }
      return r
    }
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
