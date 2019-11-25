const express = require('express');
const passport = require('passport');
const path = require('path');
const loginController = require('../controllers/login'); // eslint-disable-line

const CLIENT_HOME_PAGE_URL = '/recommend';

const router = express.Router();

// https://www.freecodecamp.org/news/how-to-set-up-twitter-oauth-using-passport-js-and-reactjs-9ffa6f49ef0/
// https://github.com/thechutrain/mern-passport

router.get('/user', (req, res) => {
  console.log('===== user!!======');
  console.log(req.user);
  if (req.user) {
    return res.json({ user: req.user });
  }
  return res.json({ user: null });
});

router.post('/logout', (req, res) => {
  if (req.user) {
    req.session.destroy();
    res.clearCookie('connect.sid'); // clean up!
    return res.json({ msg: 'logging you out' });
  }
  return res.json({ msg: 'no user to log out!' });
});

router.get('/facebook', function (req, res, next) {
  passport.authenticate('facebook', { callbackURL: "/auth/facebook/callback" + (req.query.extension ? "?extension=1" : "") })(req, res, next);
});

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.

router.get("/loginSuccess", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'extension', 'loggedIn.html'));
});

router.get("/facebook/callback",
  function(req, res, next) {
    passport.authenticate("facebook", {
      callbackURL: "/auth/facebook/callback" + (req.query.extension ? "?extension=1" : ""),
    })(req, res, next)
  },
  function(req, res) {
    console.log("extension: " + req.query.extension);
    res.redirect("/auth/loginSuccess")
  }
);

/*
router.get('/facebook/callback', function(req, res, next) {
  passport.authenticate('facebook', {}
}
  ,
  function(req, res) {
    console.log(req.query);
    if (req.query.extension === 1) {
      console.log('chrome login');
      res.redirect("/auth/loginSuccess")
    } else {
      console.log("regular login");
      res.redirect(CLIENT_HOME_PAGE_URL)
    }
    //res.redirect(CLIENT_HOME_PAGE_URL + "?id=" + req.user.id);
  }
);
*/
/*
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    // failureRedirect: '/login',
  }),
);
*/
module.exports = router;
