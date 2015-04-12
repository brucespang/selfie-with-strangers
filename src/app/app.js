// Require libraries:
var express = require('express');
var morgan = require('morgan');
var ejs = require('ejs');
// var selfie_client = require('lib/selfie-with-strangers');

var User = require('./lib/selfie-with-strangers/lib/User.js');
// passport is used to implement facebook authentication
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

// Create an app:
var app = express();
app.set('view engine', 'ejs');

// set up logging
app.use(morgan('combined'));
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize())
//app.use(express.static('public'));

passport.use(new FacebookStrategy({
  // These parameters are associated with an app created using Facebook Developers. 
  clientID: "623832804414897",
  clientSecret: "8b0c3546f60448a4b4e9057eeefe129a",
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

function render(res, template, args) {
    res.render(template, args, function (err, html) {
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

app.get('/selfies/new', function(req, res) {
    render(res, 'selfies/new');
});

app.get('/users/nearby', function(req, res) {
    render(res, 'users/nearby', users=selfie_client.users.nearby());
});

app.get('/matches/:id', function(req, res) {
    render(res, 'matches/show',
           user=selfie_client.users.show(req.params.id),
           question=selfie_client.questions.random());
});

app.get('/settings', function(req, res) {
    render(res, 'settings');
});

app.get('/schedules/new', function(req, res) {
    render(res, 'schedules/new');
});

// Start the server:
var server = app.listen(3000, function () {
    console.log('App running on port %d', server.address().port);
});
