// Require libraries:
var express = require('express');
var morgan = require('morgan');
var ejs = require('ejs');
var SWS = require('selfie-with-strangers');

// passport is used to implement facebook authentication
var passport = require('passport')
, FacebookStrategy = require('passport-facebook').Strategy;

var extend = require('util')._extend
var fs = require('fs');
var yaml = require('js-yaml');

// Create an app:
var app = express();
app.set('view engine', 'ejs');
app.set('port', process.env.NODE_PORT || 3000);

// set up logging
app.use(morgan('combined'));
app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');
var multer = require('multer');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

var cookieParser = require('cookie-parser')
app.use(cookieParser())

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));

var selfie_client = SWS(config.api_host);

function render(res, template, args) {
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

app.locals.static_file = function(path) {
  if (path[0] != "/") {
    throw "path must start with a /";
  }
  return path;
};

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

app.get('/', function(req, res) {
  is_logged_in(req, {
    error: function() {
      res.redirect("/login")
    },
    ok: function(current_user) {
      res.redirect("/selfies")
    }
  })
});

app.get('/login', check_logged_out(function(req, res) {
  render(res, 'login')
}))

app.post('/login', check_logged_out(function(req, res) {
  var email = req.body.email
  var password = req.body.password
  selfie_client.sessions.new({email: email, password: password}, function(err, cookie) {
    if (err) {
      res.redirect("/login")
    } else {
      res.cookie("session", cookie)
      res.redirect("/")
    }
  })
}));

app.get('/users/new', check_logged_out(function(req, res) {
  render(res, 'users/new')
}));

app.post('/users', check_logged_out(function(req, res) {
  var user = {
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    name: req.body.name,
  }

  selfie_client.users.new(user, function(err, cookie) {
    if (err) {
      res.redirect("/users/new")
    } else {
      selfie_client.sessions.new({email: user.email, password: user.password}, function(err, cookie) {
        if (err) {
          res.redirect("/login")
        } else {
          res.cookie("session", cookie)
          res.redirect("/")
        }
      })
    }
  })
}));

// This route is called by passport.
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/selfies',
                                            failureRedirect: '/' }));

app.post('/logout', function(req, res) {
  res.cookie("session", "")
  res.redirect("/login")
});

app.get('/selfies', function(req, res) {
  var p = [];
  render(res, 'selfies/index', { pics : p });
});

app.post('/selfies', function(req, res) {
  console.log(req.files);
  var p = [];
  p.push(req.body.picture);

  render(res, 'selfies/index', { pics : p });
  //res.redirect("/selfies");
});

app.get('/selfies/new', function(req, res) {
  render(res, 'selfies/new', {
    javascripts: ["/javascripts/camera.js", "/javascripts/jquery.min.js"]
  });
});

app.get('/users/nearby', function(req, res) {
  selfie_client.users.nearby(function(err, users) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal error')
    } else {
      render(res, 'users/nearby', {users: users['users']});
    }
  })
});

app.get('/matches/:id', function(req, res) {
  selfie_client.questions.random(function(err, question) {
    selfie_client.users.show(req.params.id, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal error')
      } else {
        render(res, 'matches/show', {question: question, user: user});
      }
    })
  })
});

app.get('/settings', function(req, res) {
  render(res, 'settings');
});

app.get('/schedules/new', function(req, res) {
  render(res, 'schedules/new');
});

// Start the server:
var server = app.listen(app.get('port'), function () {
  console.log('App running on port %d', server.address().port);
});
