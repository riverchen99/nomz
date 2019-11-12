const MenuItem = require('../models/MenuItem');
/*
const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');
const Review = require('../models/Review');
const User = require('../models/User');
*/

function getRecommendations(req, res) {
  /*
  MenuItem.find(req.query) // empty or userId = ...
    .then((results) => {
      // change this code
      const recommendations = { recommendations: results };
      res.json(recommendations);
    })
    .catch((err) => { console.log(err); res.status(500).send(err); });
  */


  const currentDateFilter = {}; // fill this in
   Menu.find(currentDateFilter)
    .then((results) => {
      // results is an array of Menus available today


      menuItemIds = []
      for (var i = 0; i < results.length; i++) {
        menuItemIds.concat(results[i])
      }

      res.json(generateRecommendations(menuItemIds))
    }
}


generateRecommendations(availableMenuItemIds) {
    // look up menuItem by menuItemIds
    // do the algorithm
}

module.exports = { getRecommendations };
