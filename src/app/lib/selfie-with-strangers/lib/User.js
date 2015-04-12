function User(name) {
  this.name = name;
}

var userdb = [];

// Determines if the user is an admin. 
exports.addUser = function(profile, cb) {
  userdb.push(new User(profile.givenName))
  cb(undefined, 'User successfully added!!!');
};