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
app.use(passport.initialize())
//app.use(express.static('public'));

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));

passport.use(new FacebookStrategy(
  {
    // These parameters are associated with an app created using Facebook Developers.
    clientID: config.facebook_client.id,
    clientSecret: config.facebook_client.secret,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // Currently, the returned user is added to a termporary database.
    User.addUser(profile, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

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

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/', function(req, res) {
  render(res, 'index');
});

app.post('/login', function(req, res) {
  res.redirect('/selfies');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

// This route is called by passport.
app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/selfies',
                                            failureRedirect: '/' }));

app.post('/logout', function(req, res) {
  res.redirect('/');
});

app.get('/selfies', function(req, res) {
  render(res, 'selfies/index');
});

app.post('/selfies', function(req, res) {
  console.log(req.files)
  res.redirect("/selfies")
})

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
