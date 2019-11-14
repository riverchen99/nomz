const mongoose = require('mongoose');
// Create Schema

/**
 * @class Restaurent
 * @property {string} name - The name of the restaurant.
 * @property {string[]} stations - Array containing names of stations at the restaurant.
 * @property {mongoose.Schema.Types.ObjectId[]} menus -
 * ObjectIds of menus associated with the restaurant
 */
const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stations: [String],
  menus: { type: [mongoose.Schema.Types.ObjectId], ref: 'Menu' },
});
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
module.exports = Restaurant;
