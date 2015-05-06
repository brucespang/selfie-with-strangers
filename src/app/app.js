// Require libraries:
var express = require('express');
var morgan = require('morgan');
var ejs = require('ejs');
var SWS = require('selfie-with-strangers');

// passport is used to implement facebook authentication
var passport = require('passport')
, FacebookStrategy = require('passport-facebook').Strategy;

var fs = require('fs');
var yaml = require('js-yaml');

// Create an app:
var app = express();
app.set('view engine', 'ejs');
app.set('port', process.env.NODE_PORT || 3000);

// set up logging
app.use(morgan('combined'));
app.use(express.static(__dirname + '/public'));

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));

var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser')
var methodOverride = require('method-override')
var session = require('express-session');
var flash = require('flash');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(cookieParser())
app.use(methodOverride('_method'));
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));
app.use(flash());

var selfie_client = SWS(config.api_host);

var render = require("helpers/render");
var auth = require('helpers/auth')(selfie_client)

app.locals.static_file = function(path) {
  if (path[0] != "/") {
    throw "path must start with a /";
  }
  return path;
};

var admin	= require('controllers/admin')(selfie_client);
var selfies	= require('controllers/selfies')(selfie_client);
app.use('/admin', admin);
app.use('/selfies', selfies);

app.get('/', function(req, res) {
  auth.is_logged_in(req, {
    error: function() {
      res.redirect("/login")
    },
    ok: function(current_user) {
      res.redirect("/selfies")
    }
  })
});

app.get('/login', auth.check_logged_out(function(req, res) {
  render(res, 'login')
}))

app.post('/login', auth.check_logged_out(function(req, res) {
  var email = req.body.email
  var password = req.body.password
  selfie_client.sessions.new({email: email, password: password}, function(err, cookie) {
    if (err) {
      res.flash("danger", err)
      res.redirect("/login")
    } else {
      res.cookie("session", cookie)
      res.redirect("/")
    }
  })
}));

app.get('/users/new', auth.check_logged_out(function(req, res) {
  render(res, 'users/new', {user: req.query})
}));

app.post('/users', auth.check_logged_out(function(req, res) {
  var user = {
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    name: req.body.name,
  }

  selfie_client.users.new(user, function(err, cookie) {
    if (err) {
      res.flash("danger", err)
      res.redirect("/users/new?email="+user.email+"&username="+user.username+"&name="+user.name)
    } else {
      selfie_client.sessions.new({email: user.email, password: user.password}, function(err, cookie) {
        if (err) {
          res.flash("danger", err)
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

app.get('/users/nearby', function(req, res) {
  selfie_client.users.nearby(function(err, users) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal error')
    } else {
      render(res, 'users/nearby', {users: users.data});
    }
  })
});

app.post('/matching', auth.check_logged_in(function(req, res) {
  var data = {
    user_id: req.current_user.id,
    lat: req.body.latitude,
    lon: req.body.longitude
  }

  selfie_client.matching.enter_pool(data, function(err, matching) {
    if (err){
      console.error(err);
      res.status(500).send('Internal error');
    } else {
      if (!matching || matching.status == 'waiting') {
        render(res, 'schedules/new', {user: req.current_user});
      } else {
        res.redirect("/schedule")
      }
    }
  });
}));

app.get('/schedule', auth.check_logged_in(function(req, res) {
  selfie_client.matching.get_status(req.current_user, function(err, proposal) {
    if (err){
      console.error(err);
      res.status(500).send('Internal error');
    } else {
      render(res, 'schedules/show', {user: req.current_user, proposal: proposal, location: proposal.location,
                                       javascripts: ["/javascripts/geolocation.js", "/javascripts/gmaps.js", "/javascripts/schedules.js"]});
    }
  });
}));

app.get('/matching/status', auth.check_logged_in(function(req, res) {
  selfie_client.matching.get_status(req.current_user, function(err, status) {
    if (err){
      console.error(err);
      res.status(500).send('Internal error');
    } else {
      res.status(200).send(JSON.stringify(status))
    }
  });
}));

Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}

function distance_between(o1, o2) {
  var lat1 = o1.lat.toRad();
  var lon1 = o1.lon.toRad();
  var lat2 = o2.lat.toRad();
  var lon2 = o2.lon.toRad();

  var dlon = lat2-lat1;
  var dlat = lon2-lon1;
  var a = Math.sin(dlat/2) * Math.sin(dlat/2) +
      Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
      Math.sin(dlon/2) * Math.sin(dlon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var r = 3956; // radius of earth in miles
  return c * r;
}

app.get('/matches/:proposal', auth.check_logged_in(function(req, res) {
  var data = {
    user_id: req.current_user.id,
    proposal_id: req.params.proposal,
    lat: parseFloat(req.query.lat),
    lon: parseFloat(req.query.lon)
  }

  selfie_client.matching.get_proposal(data.proposal_id, function(err, proposal) {
    if (err || distance_between(data, proposal.location) > 1) {
      res.status(404).send("Not found")
    } else {
      var other_user_id = proposal.user1_id == data.user_id ? proposal.user2_id : proposal.user1_id

      selfie_client.questions.random(function(err, question) {
        selfie_client.users.show(other_user_id, function(err, user) {
          if (err) {
            console.error(err);
            res.status(500).send('Internal error')
          } else {
            render(res, 'matches/show', {question: question, other_user: user});
          }
        })
      })
    }
  })

}));

app.post('/settings', auth.check_logged_in(function(req, res) {
  var user = {};
  if (req.body.email) user.email = req.body.email
  if (req.body.username) user.username = req.body.username
  if (req.body.name) user.name = req.body.name
  if (req.body.password) user.password = req.body.password

  selfie_client.users.update(req.current_user.username, user, function(err) {
    if (err) {
      res.flash("danger", err)
    }
    res.redirect("/settings")
  })
}));

app.get('/settings', auth.check_logged_in(function(req, res) {
  render(res, 'settings', {user: req.current_user});
}));

// Start the server:
var server = app.listen(app.get('port'), function () {
  console.log('App running on port %d', server.address().port);
});
