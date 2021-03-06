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
        proxy: true,
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback"
    }, 
    async (accessToken, refreshToken, profile, done) => {
       const existingUser = await User.findOne({ googleID: profile.id })
       
        if (existingUser) {
            return done(null, existingUser)
        } 

        const user = await new User({ googleID: profile.id }).save()
        done(null, user);
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

