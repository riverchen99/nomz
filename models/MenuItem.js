const mongoose = require('mongoose');
// Create Schema

/**
 * @class MenuItem
 */
const MenuItemSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
  description: String,
  nutrition: {
    defaultServingSize: Number,
    servingUnit: String,
    calories: Number,
    fatCal: Number,
    totalFat: Number,
    satFat: Number,
    transFat: Number,
    cholesterol: Number,
    sodium: Number,
    totalCarbohydrate: Number,
    dietaryFiber: Number,
    sugars: Number,
    protein: Number,
    vitA: Number,
    vitC: Number,
    calcium: Number,
    iron: Number,
  },
  ingredients: [String],
  allergens: [String],
  props: {
    vegetarian: Boolean,
    vegan: Boolean,
    peanuts: Boolean,
    treeNuts: Boolean,
    wheat: Boolean,
    gluten: Boolean,
    soy: Boolean,
    dairy: Boolean,
    eggs: Boolean,
    shellfish: Boolean,
    fish: Boolean,
    halal: Boolean,
    lowCarbon: Boolean,
  },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  station: String,
  rating: Number,
});
const MenuItem = mongoose.model('MenuItem', MenuItemSchema);
module.exports = MenuItem;
// note: mongoose automatically uses menuitems as collection name
// https://mongoosejs.com/docs/models.html
