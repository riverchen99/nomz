const MenuItem = require('../models/MenuItem');
const Menu = require('../models/Menu');

const Restaurant = require('../models/Restaurant');
/*
const Review = require('../models/Review');
const User = require('../models/User');
*/

function generateRecommendations(availableMenuItemIds) {
  // look up menuItem by menuItemIds
  console.log(availableMenuItemIds);
  MenuItem.find({ _id: { $in: availableMenuItemIds } })
    .then((results) => {
      results.sort((a, b) => b.rating - a.rating);
      console.log(results);
    })
    .catch((err) => { console.log(err); });
}

function getRecommendations(req, res) {
  // placeholder
  const restaurantFilter = false;
  const date = new Date('Tue Nov 12 2019 11:30:00 AM');
  (Menu.find({ endTime: { $gte: date } })).find({ startTime: { $lte: date } })
    .then((results) => {
      // results is an array of Menus available today
      let results2 = results;
      console.log(results2);
      if (restaurantFilter) {
        // placeholder
        // const rest = 'Bruin Plate';
        Restaurant.findOne({ name: 'Bruin Plate' })
          .then((restId) => {
            console.log(restId);
            results2 = results.filter((a) => {
              console.log(a.restaurant);
              return restId === a;
            });
          });
      }
      let menuItemIds = [];
      for (let i = 0; i < results2.length; i += 1) {
        menuItemIds = menuItemIds.concat((results2[i]).menuItems);
      }
      console.log(menuItemIds);
      res.json(generateRecommendations(menuItemIds));
    });
}


module.exports = { getRecommendations };
