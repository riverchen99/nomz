const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const keys = require('../config/keys');
const User = require('../models/User');


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
  clientID: keys.facebook_api_key,
  clientSecret: keys.facebook_api_secret,
  callbackURL: keys.facebook_callback_url,
},
((accessToken, refreshToken, profile, done) => {
  console.log(`profile: ${profile}`);
  User.findByIdAndUpdate(
    profile.id,
    { name: profile.displayName },
    { upsert: true },
    (err, results) => {
      console.log(`results: ${results}`);
      console.log(`err: ${err}`);
      done(null, results);
    },
  );
})));
