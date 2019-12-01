/**
 @module recommendations
 */

const Utils = require('../controllers/recommendations-utils');
const Menu = require('../models/Menu');
const User = require('../models/User');

const DEBUG = false;
/*
 * orig params
 * @param {Object} req.query.day - day
 * @param {Object} req.query.time - time period
 * @param {Object} req.query.userId - name of user whose information will be used to
 * generate recommendations
*/
/**
 * Return recommended menu items based on request query
 * @param {express.Request} req - The express request object.
 * @param {Object} req.query - Object containing properties to filter for the desired resource.
 * (Automatically filled by Express from URL params)
 * @param {Object} req.query.date - date
 * @param {Object} req.query.userId - User ID or "everyone" (default)
 * @param {express.Response} res - The express response object indicating success or failure.
 * @return {MenuItem[]} - Array of MenuItems complying with received user and time information
 */
async function recommendationController(req, res) {
  // call this with
  // GET /recommendations?date=YYYY-MM-DDTHH:MM-0800&userId=whatever

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
  if (DEBUG) {
    console.log(date);
  }
  // const userId = req.query.userId // to fix lint error

  // const oldDate = new Date('Tue Nov 12 2019 11:30:00 AM');
  // console.log(oldDate)

  // Menu.find().then(() => console.log(results));


  const availableMenus = await Menu.find({ endTime: { $gte: date }, startTime: { $lte: date } });

  // availableMenus is an array of Menus available today
  if (DEBUG) {
    // Foods whose IDs that will be passed to util function
    console.log(availableMenus);
  }
  let menuItemIds = [];
  for (let i = 0; i < availableMenus.length; i += 1) {
    menuItemIds = menuItemIds.concat((availableMenus[i]).menuItems);
  }


  let preferences = [];
  let restrictions = [];
  const restaurant = '';
  let reviewedItems = [];
  /*
  Commented out as design decision. Web app currently does not have any
  restaurant-specific pages for recommendations. Kept for future changes.
  if (req.query.restaurant !== undefined){
    restaurant = req.query.restaurant
  }
  */

  if (req.query.userId !== undefined && req.query.userId !== 'everyone') {
    // const user = await User.find({ name: req.query.userId });
    // Validate id, should be one and only one instance of user
    // Will be id OR _id
    const user = await User.find({ _id: req.query.userId });
    if (user.length !== 0) {
      // Retrieve revies of 3+ stars tp avoid poorly rated recommending items
      reviewedItems = await Utils.getUserReviewedItems(user[0], 3);
      preferences = user[0].preferences;
      restrictions = user[0].restrictions;
    }
  }
  if (DEBUG) {
    // Foods whose IDs that will be passed to util function
    console.log(reviewedItems);
  }

  const recommendations = await Utils.generateRecommendations(menuItemIds,
    restaurant,
    preferences,
    restrictions,
    reviewedItems);
  res.json(recommendations);
}

module.exports = {
  recommendationController,
};
