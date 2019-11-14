
const MenuItem = require('../models/MenuItem');
const Menu = require('../models/Menu');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
/*

IN PROGRESS FOR USER FILTERS
HAVEN'T BEEN IMPLEMENTED FOR
DB POPULATION SO COMMENTING THIS OUT
const Review = require('../models/Review');
const User = require('../models/User');
*/


function propsCheck(infoArray, props, type) {
  let matchScore = 0;
  const maxScore = infoArray.length;
  console.log(infoArray);
  if (maxScore === 0) {
    // no restrictions/preferences to worry about so we can include it
    return true;
  }
  for (let i = 0; i < infoArray.length; i += 1) {
    switch (infoArray[i]) {
      case ('vegetarian'):
      {
        if (props.vegetarian) {
          matchScore += 1;
        }
        break;
      }
      case ('vegan'):
      {
        if (props.vegan) {
          matchScore += 1;
        }
        break;
      }
      case ('peanuts'):
      {
        if (props.peanuts) {
          matchScore += 1;
        }
        break;
      }
      case ('treeNuts'):
      {
        if (props.treeNuts) {
          matchScore += 1;
        }
        break;
      }
      case ('wheat'):
      {
        if (props.wheat) {
          matchScore += 1;
        }
        break;
      }
      case ('gluten'):
      {
        if (props.gluten) {
          matchScore += 1;
        }
        break;
      }
      case ('soy'):
      {
        if (props.soy) {
          matchScore += 1;
        }
        break;
      }
      case ('dairy'):
      {
        if (props.dairy) {
          matchScore += 1;
        }
        break;
      }
      case ('eggs'):
      {
        if (props.eggs) {
          matchScore += 1;
        }
        break;
      }
      case ('shellfish'):
      {
        if (props.shellfish) {
          matchScore += 1;
        }
        break;
      }
      case ('fish'):
      {
        if (props.fish) {
          matchScore += 1;
        }
        break;
      }
      case ('halal'):
      {
        if (props.halal) {
          matchScore += 1;
        }
        break;
      }
      case ('lowCarbon'):
      {
        if (props.lowCarbon) {
          matchScore += 1;
        }
        break;
      }
      default: {
        matchScore += 0;
      }
    }
  }
  if (type === 'restrictions') {
    if (matchScore === 0) {
      // contains no "bad" stuff, include in filtered results
      return true;
    }
    // contains incompatible stuff, exclude from filtered results
    return false;
  } if (type === 'preferences') {
    // 80% matching threshold for acceptance of match
    if ((matchScore / maxScore) >= 0.5) {
      return true;
    }
    return false;
  }
  // No "bad" stuff
  return true;
}

// Used by both ingredients and allergens
function restrictionCheck(restrictions, info) {
  // var infoArray = info.split(", ");
  if (restrictions.length === 0 || info.length === 0) {
    // no restrictions, good to go
    return true;
  }

  for (let i = 0; i < restrictions.length; i += 1) {
    if (info.includes(restrictions[i])) {
      // Exclude from filtered results
      return false;
    }
  }
  // Include in filtered results
  return true;
}

function itemCompatibilty(preferences, restrictions, menuItem) {
  const prefProps = (propsCheck(preferences, menuItem.props, 'preferences'));
  const restrictProps = (propsCheck(restrictions, menuItem.props, 'restrictions'));
  const ingredientCheck = restrictionCheck(restrictions, menuItem.ingredients);
  const allergenCheck = restrictionCheck(restrictions, menuItem.allergens);
  return prefProps && restrictProps && ingredientCheck && allergenCheck;
}


async function generateRecommendations(
  availableMenuItemIds,
  restaurantFilter,
  preferences,
  restrictions,
) {
  // look up menuItem by menuItemIds

  // console.log(availableMenuItemIds);
  const filterRestaurant = (restaurantFilter.length !== 0);
  const filterPreferences = (preferences.length !== 0);
  const filterRestrictions = (restrictions.length !== 0);
  if (filterRestaurant) {
    // placeholder
    const rest = 'Bruin Plate';
    Restaurant.find().where('name').equals(rest)
      .then((restId) => {
        console.log(((restId[0]).id));
        const restaurant = (restId[0]).id; // eslint-disable-line
      });
  }

  let results = await MenuItem.find({ _id: { $in: availableMenuItemIds } });


  // refactor this
  for (let i = 0; i < results.length; i += 1) {
    if (filterRestaurant) {
      console.log(results[i].restaurant);
      // if ((results[i]).restaurant !== restaurant){
      // remove this menuItem
      // }
    }
    // These booleans will be populated by user info
  }
  if (filterRestrictions || filterPreferences) {
    results = results.filter((menuItem) => itemCompatibilty(preferences, restrictions, menuItem));
  }

  results.sort((a, b) => b.rating - a.rating);
  console.log(results);


  return results;
}

async function recommendationController(req, res) {
  // call this with
  // GET /recommendations?day=whatver&time=THH:MM&userId=whatever
  const dayIn = req.query.day;
  const { time } = req.query;
  let dateStr = '';
  const today = new Date();
  if (dayIn === 'today') {
    dateStr = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}${time}`;
  } else if (dayIn === 'tomorrow') {
    dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 1}${time}`;
  }
  console.log(dateStr);
  const date = new Date(dateStr);
  console.log(date);
  // console.log(date);
  // const userId = req.query.userId // to fix lint error

  // const oldDate = new Date('Tue Nov 12 2019 11:30:00 AM');
  // console.log(oldDate)

  // Menu.find().then(() => console.log(results));


  const availableMenus = await Menu.find({ endTime: { $gte: date }, startTime: { $lte: date } });

  // availableMenus is an array of Menus available today
  console.log(availableMenus);
  let menuItemIds = [];
  for (let i = 0; i < availableMenus.length; i += 1) {
    menuItemIds = menuItemIds.concat((availableMenus[i]).menuItems);
  }
  // console.log(menuItemIds);
  // For now, user filters are false to only generate general recommendations

  let preferences = [];
  let restrictions = [];// 'eggs'];
  const restaurant = '';
  const userInfo = req.query.userId;
  if (userInfo.length !== 0) {
    const user = await User.find({ name: userInfo });
    if (user.length !== 0) {
      preferences = user[0].preferences;
      restrictions = user[0].restrictions;
    }
  }


  const recommendations = await generateRecommendations(menuItemIds,
    restaurant,
    preferences,
    restrictions);
  res.json(recommendations);
}


module.exports = { recommendationController };
