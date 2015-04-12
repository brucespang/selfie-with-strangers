function User(name) {
  this.name = name;
}

var termporarydb = [];

// Adds a user to the termporary database. 
exports.addUser = function(profile, cb) {
  userdb.push(new User(profile.givenName))
  cb(undefined, 'User successfully added!!!');
};