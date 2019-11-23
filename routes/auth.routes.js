const express = require('express');
const passport = require('passport');
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

router.get('/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
/*
router.get('/facebook/callback',
  passport.authenticate('facebook'),
  function(req, res) {
    res.redirect(CLIENT_HOME_PAGE_URL + "?id=" + req.user.id);
  }
);
*/
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    // failureRedirect: '/login',
  }),
);

module.exports = router;
