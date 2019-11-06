const mongoose = require('mongoose');
// Create Schema
const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hours: String,
  stations: [String],
});
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
module.exports = Restaurant;
