
/**
 @module recommendations-utils
 */

const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Review = require('../models/Review');

const DEBUG = false;

/**
 * Return reviews submitted by a specified user. Can specify a minimum rating
 * for the reviews to return
 * Auxiliary function not exposed to frontend client.
 *
 * @param {User} user - Id of user
 * @param {Number} ratingThresh - Minimum rating for extracted reviews
 * @return {Object[]} - Array of (MenuItem, rating) objects user has reviewed in
 * ascending order of rating
 */
async function getUserReviewedItems(user, ratingThresh) {
  const reviews = await Review.find({ author: user, rating: { $gte: ratingThresh } });
  const reviewedItems = [];
  for (let i = 0; i < reviews.length; i += 1) {
    reviewedItems.push({
      item: (reviews[i]).menuItem,
      userRating: (reviews[i].rating),
    });
  }
  if (DEBUG) {
    console.log(reviewedItems.sort((a, b) => a.userRating - b.userRating));
  }
  return reviewedItems.sort((a, b) => a.userRating - b.userRating);
}

/**
 * Return whether a menuItem is included in the filtered results
 * based on whether its props (dietary tags) are compatible with the user's filters. If
 * checking for preferences, a menu item should have all or  * most of props identified
 * in the user preferences. If checking for restrictions, a menu item must not have any
 * props that the user restricted on order to be included.
 * Auxiliary function not exposed to frontend client.
 *
 * @param {string[]} infoArray - Contains a list of either user restrictions or
 * preferences to check
 * @param {MenuItem.props} props - Props of menuItem
 * @param {string} type - 'preferences' or 'restrictions'. Used to relate any matches
 * to type of filtering.
 * @return {Boolean} - Whether the menu item should be included
 */
function propsCheck(infoArray, props, type) {
  let matchScore = 0;
  const maxScore = infoArray.length;
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
    // 50% matching threshold for acceptance of match
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
   * Auxiliary function not exposed to frontend client.
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
   * Auxiliary function not exposed to frontend client.
   *
   * @param {string[]} preferences - Array of user preferences that a menu item should have
   * @param {string[]} restrictions - Array of user restrictions that a menu item cannot have
   * @param {MenuItem} menuItem - MenuItem object to check for compliance of user filters
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
 * Return quantified similarity between two menu items.
 * Auxiliary function not exposed to frontend client.
 *
 * @param {MenuItem} menuItem1 - Menu item from current availability
 * @param {MenuItem} menuItem2 - Menu item from user reviews
 * @return {Number} - Similarity score
 */
function similarityScore(menuItem1, menuItem2) {
  // ingredient score


  const ingredients1 = menuItem1.ingredients;
  const ingredients2 = menuItem2.ingredients;

  if (DEBUG) {
    console.log(`Ingredients1: ${ingredients1}`);
    console.log(`Ingredients2: ${ingredients2}`);
  }
  let score = 0;


  let similar = 0;
  for (let i = 0; i < ingredients2.length; i += 1) {
    if (ingredients1.includes(ingredients1[i])) {
      similar += 2;
    }
  }
  score += ((menuItem2.rating * 100 * similar) / (ingredients1.length + ingredients2.length));

  // Prop match
  const prop1 = menuItem1.props;
  const prop2 = menuItem2.props;
  if (DEBUG) {
    console.log(`Prop1: ${prop1}`);
    console.log(`Prop2: ${prop2}`);
  }
  Object.keys(prop1).forEach((key) => {
    if (prop1[key] !== undefined && prop1[key] === prop2[key]) {
      if (DEBUG) {
        console.log(`Prop1Key: ${prop1[key]}`);
        console.log(`Prop2Key: ${prop2[key]}`);
      }
      score += 5;
    }
  });

  // Restaurant match
  if (menuItem1.restaurant === menuItem2.restaurant) {
    score += 5;
  }
  if (DEBUG) {
    console.log(`Compare ${menuItem1.name} with ${menuItem2.name}: ${score}`);
  }
  return score;
}

/**
 * Rank available menu items based on user reviewed items.
 * Auxiliary function not exposed to frontend client.
 *
 * @param {MenuItem[]} menuItems -  Available MenuItem objects
 * @param {MenuItem[]} reviewed - User reviewed MenuItem objects
 * @param {Number[]} - Array of respective user ratings for reviewed objects
 * @return {Object} - Array of {Menu Item, score} objects sorted by weight score
 */
function weightedRecommendations(menuItems, reviewed, reviewedRatings) {
  const ratingWeight = 10;
  const dict = []; // create an empty array


  for (let i = 0; i < menuItems.length; i += 1) {
    let cumeScore = 0;
    const menuItem = menuItems[i];
    // Score rating
    cumeScore += (menuItem.rating * ratingWeight);
    console.log(cumeScore);
    // Score similarity of item to user history
    for (let j = 0; j < reviewed.length; j += 1) {
      if (menuItem._id === reviewed[j]._id) {
        // standard similarity score = would give 100% match
        let match = 0;
        match += reviewed[j].rating * 100; // ingredients
        match += Object.keys(menuItem.props).length * 5;
        match += 5; // restaurant
        // Extra points for being in user history
        // Weighted by user rating
        match += reviewedRatings[j] * ratingWeight;

        cumeScore += (j + 1) * reviewedRatings[j] * match;
        if (DEBUG) {
          console.log(match);
          console.log(`Compare ${menuItem} SAME: ${cumeScore}`);
        }
      } else {
        cumeScore += (j + 1) * reviewedRatings[j] * similarityScore(menuItem, reviewed[j]);
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

/**
 * Returns an array of MenuItem objects from the MenuItem array based on user filters.
 * Auxiliary function not exposed to frontend client.
 * @param {string[]} availableMenuItemIds - Array of object IDs for MenuItem candidates
 * @param {string} restaurantFilter - name of restaurant, if applicable. Empty string otherwise
 * @param {string[]} preferences - Array of user preferences to filter through menu items by
 * @param {string[]} restrictions - Array of user restrictions to filter out menu items by
 * @param {Object[]} reviewedItems - Array of user reviewed (item, rating) pairs
 * @param {MenuItem} reviewedItems.item - Reviewed Menu item
 * @param {Number} reviewedItems.userRating - Corresponding user rating
 * @return {MenuItem[]} - Array of MenuItems that comply with the user information
 */
async function generateRecommendations(
  availableMenuItemIds,
  restaurantFilter,
  preferences,
  restrictions,
  reviewedItems,
) {
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
  if (DEBUG) {
    console.log('Weighted');
    console.log(weightedResults);
  }
  const scoredResults = weightedResults.map((a) => a.item);
  if (DEBUG) {
    console.log('Final');
    console.log(scoredResults);
  }

  // Original seen for debugging purposes
  results.sort((a, b) => b.rating - a.rating);
  /* if (DEBUG){
    console.log('Regular');
    console.log(results);
  } */


  return scoredResults;
}

module.exports = {
  propsCheck, restrictionCheck, generateRecommendations, getUserReviewedItems, similarityScore,
};
