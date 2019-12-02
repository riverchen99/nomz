/**
 * @module Auth Routes
 */

const express = require('express');
const passport = require('passport');
const path = require('path');
const loginController = require('../controllers/login'); // eslint-disable-line

const CLIENT_HOME_PAGE_URL = '/recommend';
// for future use for failed logins
const CLIENT_LOGIN_PAGE_URL = '/'; // eslint-disable-line
const CALLBACK_URL_BASE = process.env.NODE_ENV === 'production' ? 'https://cs130-nomz.herokuapp.com' : '';

const router = express.Router();

// https://www.freecodecamp.org/news/how-to-set-up-twitter-oauth-using-passport-js-and-reactjs-9ffa6f49ef0/
// https://github.com/thechutrain/mern-passport


/**
 * Controller to retreive a logged in user's information.
 * @function GET /user
 * @param {express.Request} req - The express request object.
 * @param {Object} req.user - User information, automatically filled by Express if an appropriate cookie is found
 * @param {express.Response} res - The express response object containing a list of resources.
 */
router.get('/user', (req, res) => {
  console.log('===== user!!======');
  console.log(req.user);
  if (req.user) {
    return res.json({ user: req.user });
  }
  return res.json({ user: null });
});

/**
 * Controller to log out a user.
 * @function GET /logout
 * @param {express.Request} req - The express request object.
 * @param {express.Response} res - The express response object containing a list of resources.
 */
router.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");

})


/**
 * Controller to redirect to Facebook authentication page.
 * @function GET /facebook
 * @param {express.Request} req - The express request object.
 * @param {express.Response} res - The express response object containing a list of resources.
 */
router.get('/facebook', (req, res, next) => {
  passport.authenticate('facebook', {
    callbackURL: `${CALLBACK_URL_BASE}/auth/facebook/callback${req.query.extension ? '?extension=1' : ''}`,
  })(req, res, next);
});

/**
 * Controller serve login success page (if logging in from extension), 
 * or redirect to recommendation page (if logging in from webapp).
 * @function GET /logout
 * @param {express.Request} req - The express request object.
 * @param {express.Response} res - The express response object containing a list of resources.
 */
router.get('/loginSuccess', (req, res) => {
  if (req.query.extension === '1') {
    res.sendFile(path.join(__dirname, '..', 'extension', 'loggedIn.html'));
  } else {
    res.redirect((process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000') + CLIENT_HOME_PAGE_URL);
  }
});

/**
 * Controller to serve Facebook callback.
 * @function GET /facebook/callback
 * @param {express.Request} req - The express request object.
 * @param {express.Response} res - The express response object containing a list of resources.
 */
router.get('/facebook/callback',
  (req, res, next) => {
    passport.authenticate('facebook', {
      callbackURL: `${CALLBACK_URL_BASE}/auth/facebook/callback${req.query.extension ? '?extension=1' : ''}`,
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(`/auth/loginSuccess${req.query.extension ? '?extension=1' : ''}`);
  });

module.exports = router;
