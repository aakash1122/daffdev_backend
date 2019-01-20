// load all the things we need
var LocalStrategy = require("passport-local").Strategy;
// load up the user model
var User = require("../models/User");

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // passport setup
  passport.use(
    new LocalStrategy({
    usernameField: 'email',
  },function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if(user){
        if (user.password === password) {
          return done(null, user)
        }else{
          return done(null, false, {message: "wrong password"})
        }
      }else{
        return done(null, false, {message: "Email is not registerd"})
      }
    });
    })
  );
};
