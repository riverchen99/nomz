const mongoose = require('mongoose');
// Create Schema
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
