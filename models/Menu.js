const mongoose = require('mongoose');
// Create Schema

/**
 * @class Menu
 * @property {string} mealPeriod - The name of the meal period the menu corresponds to.
 * @property {date} startTime - The starting time of the meal period.
 * @property {date} endTime - The ending time of the meal period.
 * @property {mongoose.Schema.Types.ObjectId} restaurant - The objectId of the restaurant the menu is associated with.
 * @property {mongoose.Schema.Types.ObjectId[]} menuItems - The menuitems (dishes) that are offered on the menu.
 */
const MenuSchema = new mongoose.Schema({
  mealPeriod: String,
  startTime: Date,
  endTime: Date,
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  menuItems: { type: [mongoose.Schema.Types.String], ref: 'MenuItem' },
});
const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;
