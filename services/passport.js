const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require("../config/keys.js")
const mongoose = require("mongoose")

const User = mongoose.model("users")

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
            done(null, user)
        })
})

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "https://cryptic-reef-91374.herokuapp.com/auth/google/callback",
    }, (accessToken, refreshToken, profile, done) => {
       
       User.findOne({ googleID: profile.id })
       .then((existingUser) => {
            if (existingUser) {
                done(null, existingUser)
            } else {
                new User({ googleID: profile.id })
                .save()
                .then(user => done(null, user))
            }
       })

    })
);

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwd'
  },
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
));

