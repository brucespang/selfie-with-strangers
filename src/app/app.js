// Require libraries:
var express = require('express');
var morgan = require('morgan');
var ejs = require('ejs');

// Create an app:
var app = express();
app.set('view engine', 'ejs');

// set up logging
app.use(morgan('combined'));
app.use(express.static('public'));

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

app.get('/', function(req, res) {
		render(res, 'index');
});

app.post('/login', function(req, res) {
		res.redirect('/newsfeed');
});

app.post('/logout', function(req, res) {
		res.redirect('/newsfeed');
});

app.get('/newsfeed', function(req, res) {
		render(res, 'newsfeed');
});

app.get('/nearby', function(req, res) {
		render(res, 'nearby');
});

app.get('/settings', function(req, res) {
		render(res, 'settings');
});

app.get('/schedule', function(req, res) {
		render(res, 'schedule');
});

app.get('/match', function(req, res) {
		render(res, 'match');
});

app.get('/selfie', function(req, res) {
		render(res, 'selfie');
});

// Start the server:
var server = app.listen(3000, function () {
		console.log('App running on port %d', server.address().port);
});
