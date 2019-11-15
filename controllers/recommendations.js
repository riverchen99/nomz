/**
 @module genericControllerFactory
 */

const MenuItem = require('../models/MenuItem');
const Menu = require('../models/Menu');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');


/**
 * Auxiliary function to return whether a menuItem is included in the filtered results
 * based on whether its props (dietary tags) are compatible with the user's filters. If
 * checking for preferences, a menu item should have all or  * most of props identified
 * in the user preferences. If checking for restrictions, a menu item must not have any
 * props that the user restricted on order to be included.
 *
 * @param {[String]} infoArray - Contains a list of either user restrictions or
 * preferences to check
 * @param {MenuItem.props} props - Desc
 * @param {String} type - 'preferences' or 'restrictions'. Used to relate any matches
 * to type of filtering.
 * @return {Boolean} - Whether the menu item should be included
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
    if (props[infoArray[i]]) {
      matchScore += 1;
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

/**
 * Auxiliary function to return whether a menu item's ingredients comply with user restrictions.
 * If any restricted item is found, it does not comply.
 *
 * @param {[String]} restrictions - Contains a list of the user restrictions
 * @param {[String]} info - Information to search through. Either allergen or ingredient information
 * @return {Boolean} - Return whether any restricted items are listed in the menu item information
 */
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

/**
 * Checks if a menuItem is included in the filtered results based on whethers its
 * dietary information complies with the user preferences and restrictions
 *
 * @param {[String]} preferences - Array of user preferences that a menu item should have
 * @param {[String]} restrictions - Array of user restrictions that a menu item cannot have
 * @param {MenuItem} type - MenuItem object to check for compliance of user filters
 * @return {Boolean} - Whether the menu item complies with user filters
 */
function itemCompatibility(preferences, restrictions, menuItem) {
  const prefProps = (propsCheck(preferences, menuItem.props, 'preferences'));
  const restrictProps = (propsCheck(restrictions, menuItem.props, 'restrictions'));
  const ingredientCheck = restrictionCheck(restrictions, menuItem.ingredients);
  const allergenCheck = restrictionCheck(restrictions, menuItem.allergens);
  return prefProps && restrictProps && ingredientCheck && allergenCheck;
}


/**
 * Returns an array of MenuItem objects from the
 *
 * @param {[String]} availableMenuItemIds- Array of object IDs for MenuItem candidates
 * @param {[String]}
 * @param {[String]} restrictions - Array of user restrictions that a menu item cannot have
 * @param {MenuItem} type - MenuItem object to check for compliance of user filters
 * @return {Boolean} - Whether the menu item complies with user filters
 */
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
    results = results.filter((menuItem) => itemCompatibility(preferences, restrictions, menuItem));
  }

  results.sort((a, b) => b.rating - a.rating);
  console.log(results);


  return results;
}

async function recommendationController(req, res) {
  // call this with
  // GET /recommendations?day=whatver&time=THH:MM&userId=whatever

  /*
  const dayIn = req.query.day;
  const { time } = req.query;
  let dateStr = '';
  const today = new Date();
  if (dayIn === 'today') {
    dateStr = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}${time}-0800`;
  } else if (dayIn === 'tomorrow') {
    dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 1}${time}-0800`;
  }
  console.log(dateStr);
  */

  const date = new Date(req.query.date);

  console.log(date);
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
  if (req.query.userId !== undefined) {
    const user = await User.find({ name: req.query.userId });
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
