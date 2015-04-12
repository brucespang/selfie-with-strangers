var http = require('http');

module.exports = function(hostname) {
  var users = []

  return {
		users: {
			nearby: function(cb) {
        var options = {
          host: hostname,
          path: "/users/nearby"
        };

        http.request(options, function(res) {
          var str = '';
          res.setEncoding('utf8');

          //another chunk of data has been recieved, so append it to `str`
          res.on('data', function (chunk) {
            str += chunk;
          });

          //the whole response has been recieved, so we just print it out here
          res.on('end', function () {
            console.log(str);
            cb(JSON.parse(str)['users'])
          });
        }).end();
			},
			show: function(uid, cb) {
				cb(undefined, users.filter(function(u) {return u.id == uid})[0])
			}
		},
		questions: {
			random: function(cb) {
				cb(undefined, questions[Math.floor(Math.random()*questions.length)])
			}
		},
	};
};
