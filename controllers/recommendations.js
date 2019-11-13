
const MenuItem = require('../models/MenuItem');
const Menu = require('../models/Menu');

const Restaurant = require('../models/Restaurant');
/*
const Review = require('../models/Review');
const User = require('../models/User');
*/

function generateRecommendations(availableMenuItemIds,
  filterRestaurant,
  filterPreferences,
  filterRestrictions) {
  // look up menuItem by menuItemIds
  console.log(availableMenuItemIds);
  var restaurant = '';
  if (filterRestaurant) {
    // placeholder
    const rest = 'Bruin Plate';
    Restaurant.find().where('name').equals(rest)
      .then((restId) => {
        console.log(((restId[0]).id));
        restaurant = (restId[0]).id;
      });
  }

  MenuItem.find({ _id: { $in: availableMenuItemIds } })
    .then((results) => {
      for (let i = 0; i < results.length; i += 1) {
        if (filterRestaurant) {
          console.log(results[i].restaurant);
          if ((results[i]).restaurant != restaurant){
            //results.
          }
        }  else if (filterRestrictions) {
          console.log(results[i].props);
          //parse ingredients for allergens
          //parse props
        } 
      }

      if (filterPreferences){
        //array.filter()
        //find counterpart
        //sort both
      }
      results.sort((a, b) => b.rating - a.rating);
      console.log(results);
    })
    .catch((err) => { console.log(err); });
}

function getRecommendations(req, res) {
  // placeholder
  const date = new Date('Tue Nov 12 2019 11:30:00 AM');

  (Menu.find({ endTime: { $gte: date } })).find({ startTime: { $lte: date } })
    .then((results) => {
      // results is an array of Menus available today
      console.log(results);
      let menuItemIds = [];
      for (let i = 0; i < results.length; i += 1) {
        menuItemIds = menuItemIds.concat((results[i]).menuItems);
      }
      console.log(menuItemIds);
      res.json(generateRecommendations(menuItemIds, true, false, false));
    });
}


module.exports = { getRecommendations };
