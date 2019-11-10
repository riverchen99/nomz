const MenuItem = require('../models/MenuItem');
/*
const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');
const Review = require('../models/Review');
const User = require('../models/User');
*/

function getRecommendations(req, res) {
  MenuItem.find(req.query) // empty or userId = ...
    .then((results) => {
      // change this code
      const recommendations = { recommendations: results };
      res.json(recommendations);
    })
    .catch((err) => { console.log(err); res.status(500).send(err); });
}

module.exports = { getRecommendations };
