// Require libraries:
var express = require('express');
var morgan = require('morgan');
var ejs = require('ejs');
var selfie_client = require('selfie-with-strangers');

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
		res.redirect('/selfies');
});

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
