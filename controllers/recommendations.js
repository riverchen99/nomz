/**
 @module recommendations
 */

const Utils = require('../controllers/recommendations-utils');
const Menu = require('../models/Menu');
const User = require('../models/User');

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
 * @param {express.Response} res - The express response object indicating success or failure.
 * @return {MenuItem[]} - Array of MenuItems the comply with the applicable filters
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

  console.log(req.query.date)
  console.log("before date")
  console.log(date);
  console.log("after date")
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
  let preferences = [];
  let restrictions = [];// 'eggs'];
  const restaurant = '';
  let reviewedItems = [];

  if (req.query.userId !== undefined && req.query.userId !== 'everyone') {
    // const user = await User.find({ name: req.query.userId });
    // Validate id, should be one and only one instance of user
    // Will be id OR _id
    const user = await User.find({ _id: req.query.userId });
    if (user.length !== 0) {
      reviewedItems = await Utils.getUserReviewedItems(user[0], 3);
      preferences = user[0].preferences;
      restrictions = user[0].restrictions;
    }
  }


  const recommendations = await Utils.generateRecommendations(menuItemIds,
    restaurant,
    preferences,
    restrictions,
    reviewedItems);
  res.json(recommendations);
}

/*
For deployment, only recommendationController will be exposed to the client
auxiliary functions are only exposed for unit testing
*/
module.exports = {
  recommendationController,
};
