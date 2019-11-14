const mongoose = require('mongoose');
// Create Schema

/**
 * @class MenuItem
 * @property {string} _id - The UCLA dining services assigned id of a menuitem.
 * @property {string} name - The name of the item.
 * @property {number} rating - The cached aggregate rating.
 * @property {string} description - The description of the item.
 * @property {Array<number|string>} nutrition -
 * Array containing various nutritional properties (e.g. calories, fat, etc).
 * @property {string[]} ingredients - The list of ingredients.
 * @property {string[]} allergens - The list of allergens.
 * @property {Array<boolean>} props - The list of properties (e.g. vegetarian, vegan, halal, etc).
 * @property {mongoose.Schema.Types.ObjectId} restaurant - ObjectId of the associated restaurant.
 * @property {string} station - The station that serves the item.
 */
const MenuItemSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: {
    type: String,
    required: true,
  },
  rating: Number,
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
});
const MenuItem = mongoose.model('MenuItem', MenuItemSchema);
module.exports = MenuItem;
// note: mongoose automatically uses menuitems as collection name
// https://mongoosejs.com/docs/models.html
