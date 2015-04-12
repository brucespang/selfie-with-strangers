function User(name) {
  this.username = username;
}

var userdb = [];

// Determines if the user is an admin. 
exports.addUser = function(profile, cb) {
  userdb.push(new User(profile.givenName))
  cb('User successfully added!');
};