
/**
 @module recommendations-utils
 */

const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Review = require('../models/Review');


function similarityScore(menuItem1, menuItem2) {
  // ingredient score
  console.log(menuItem2);
  const ingredients1 = menuItem1.ingredients;
  const ingredients2 = menuItem2.ingredients;
  console.log(`Ingredients2: ${ingredients2}`);
  let score = 0;
  // assume imgredients listed by importance
  const len = ingredients1.length;
  for (let i = 0; i < ingredients1.length; i += 1) {
    if (ingredients2.includes(ingredients1[i])) {
      score += (len - i);
    }
  }

  const prop1 = menuItem1.props;
  const prop2 = menuItem2.props;
  Object.keys(prop1).forEach((key) => {
    if (prop1[key] === prop2[key]) {
      score += 1;
    }
  });
  return score;
}

function weightedRecommendations(menuItems, reviewed, reviewedRatings) {
  const ratingWeight = 10;
  const dict = []; // create an empty array


  for (let i = 0; i < menuItems.length; i += 1) {
    let cumeScore = 0;
    const menuItem = menuItems[i];
    // Score rating
    cumeScore += (menuItem.rating * ratingWeight);
    // Score similarity of item to user history
    for (let j = 0; j < reviewed.length; j += 1) {
      console.log('Menu Item: ', menuItem);
      console.log('Reviewed Item: ', reviewed[j]);
      if (menuItem._id === reviewed[j]._id) {
        // standard similarity score
        cumeScore += menuItem.ingredients.length;
        // Extra points for being in user history
        cumeScore += reviewedRatings[i] * ratingWeight;
      } else {
        cumeScore += similarityScore(menuItem, reviewed[j]);
      }
    }
    // Cume score
    dict.push({
      item: menuItem,
      score: cumeScore,
    });
  }

  dict.sort((a, b) => b.score - a.score);
  return dict;
}

async function getUserReviewedItems(user, ratingThresh) {
  const reviews = await Review.find({ author: user, rating: { $gte: ratingThresh } });
  const reviewedItems = [];
  for (let i = 0; i < reviews.length; i += 1) {
    reviewedItems.push({
      item: (reviews[i]).menuItem,
      userRating: (reviews[i].rating),
    });
  }
  return reviewedItems;
}

/**
 * Return whether a menuItem is included in the filtered results
 * based on whether its props (dietary tags) are compatible with the user's filters. If
 * checking for preferences, a menu item should have all or  * most of props identified
 * in the user preferences. If checking for restrictions, a menu item must not have any
 * props that the user restricted on order to be included.
 * Auxiliary function not exposed to client.
 *
 * @param {string[]} infoArray - Contains a list of either user restrictions or
 * preferences to check
 * @param {MenuItem.props} props - Desc
 * @param {string} type - 'preferences' or 'restrictions'. Used to relate any matches
 * to type of filtering.
 * @return {Boolean} - Whether the menu item should be included
 */
function propsCheck(infoArray, props, type) {
  let matchScore = 0;
  const maxScore = infoArray.length;
  // console.log(infoArray);
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
   * Return whether a menu item's ingredients comply with user restrictions.
   * If any restricted item is found, it does not comply.
   * Auxiliary function not exposed to client.
   *
   * @param {string[]} restrictions - Contains a list of the user restrictions
   * @param {string[]} info - Allergen or ingredient information to search through
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
   * Auxiliary function not exposed to client.
   *
   * @param {string[]} preferences - Array of user preferences that a menu item should have
   * @param {string[]} restrictions - Array of user restrictions that a menu item cannot have
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
 * Returns an array of MenuItem objects from the MenuItem array based on user filters.
 * Auxiliary function not exposed to client.
 * @param {string[]} availableMenuItemIds- Array of object IDs for MenuItem candidates
 * @param {string} restaurantFilter - name of restaurant, if applicable. Empty string otherwise
 * @param {string[]} preferences - Array of user preferences to filter through menu items by
 * @param {string[]} restrictions - Array of user restrictions to filter out menu items by
 * @return {MenuItem[]} - Array of MenuItems the comply with the applicable filters
 */
async function generateRecommendations(
  availableMenuItemIds,
  restaurantFilter,
  preferences,
  restrictions,
  reviewedItems,
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

  let reviewedItemsIds = [];
  let reviewedItemsRatings = [];
  if (reviewedItems.length !== 0) {
    reviewedItemsIds = reviewedItems.map((a) => a.item);
    reviewedItemsRatings = reviewedItems.map((a) => a.userRating);
  }
  let results = await MenuItem.find({ _id: { $in: availableMenuItemIds } });

  const reviewed = await MenuItem.find({ _id: { $in: reviewedItemsIds } });
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

  // add score to remaining results that we want to sort
  const weightedResults = weightedRecommendations(results, reviewed, reviewedItemsRatings);
  console.log('Weighted');
  console.log(weightedResults);

  const scoredResults = weightedResults.map((a) => a.item);

  console.log('Final');
  console.log(scoredResults);

  // Original seen for debugging purposes
  results.sort((a, b) => b.rating - a.rating);
  console.log('Regular');
  console.log(results);


  return results;
}

module.exports = {
  propsCheck, restrictionCheck, generateRecommendations, getUserReviewedItems,
};
