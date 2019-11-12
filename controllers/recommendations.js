const MenuItem = require('../models/MenuItem');
const Menu = require('../models/Menu');
/*
const Restaurant = require('../models/Restaurant');

const Review = require('../models/Review');
const User = require('../models/User');
*/

function generateRecommendations(availableMenuItemIds) {
  // look up menuItem by menuItemIds
  console.log(availableMenuItemIds);
  MenuItem.find({'_id': { $in: availableMenuItemIds}})
  .then((results) =>{
    console.log(results)
  })
  .catch((err) => { console.log(err); res.status(500).send(err); });
  // do the algorithm
}

function getRecommendations(req, res) {
  /* MenuItem.find({})// req.query}) // empty or userId = .....
  .then((results) => {
      // change this code
      results.sort((a, b) => b.rating - a.rating);
      console.log(results);
      const recommendations = { recommendations: results };
      res.json(recommendations);
    })
    .catch((err) => { console.log(err); res.status(500).send(err); });
   */

  // const currentDateFilter = {}; // fill this in
  const date = new Date('Tue Nov 12 2019 11:30:00 AM');
  (Menu.find({ endTime: { $gte: date } })).find({ startTime: { $lte: date } })
    .then((results) => {
      // results is an array of Menus available today
      // console.log(results);
      let menuItemIds = [];
      for (let i = 0; i < results.length; i += 1) {
        menuItemIds = menuItemIds.concat((results[i]).menuItems);
      }
      console.log(menuItemIds);
      res.json(generateRecommendations(menuItemIds));
    });
}


module.exports = { getRecommendations };
