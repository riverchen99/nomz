/**
 * @module
 */

const Review = require('../models/Review');
const MenuItem = require('../models/MenuItem');

/**
 * Higher order function to create a generic controller for GET endpoint requests.
 * @param {mongoose.Model} model - The mongoose model for the resource to be queried.
 * @return {genericGetController} - Controller function
 */
const createGenericGetController = function (model) {
  /**
   * Controller to filter and retrive a mongoose model.
   * @function genericGetController
   * @param {express.Request} req - The express request object.
   * @param {Object} req.params.ids - Semicolon separated list of IDs to retreive
   * @param {Object} req.query - Object containing properties to filter for the desired resource.
   * (Automatically filled by Express from URL params)
   * @param {express.Response} res - The express response object containing a list of resources.
   */
  const genericGetController = function (req, res) {
    console.log(req.params.ids);
    console.log(req.query);
    for (var k of Object.keys(req.query)) { // eslint-disable-line
      req.query[k] = JSON.parse(req.query[k]);
    }
    console.log(req.query);
    const query = req.params.ids === undefined ? req.query : { _id: { $in: req.params.ids.split(';') } };
    model.find(query)
      .then((results) => res.json(results))
      .catch((err) => { console.log(err); res.status(500).send(err); });
  };
  return genericGetController;
};

/**
 * Helper function to update cached aggregate rating from the average of individual ratings
 * @param {string} menuItemId - the id of the menuitem to update
 */
async function updateAggregateRating(menuItemId) {
  const averageObject = await Review.aggregate([
    { $match: { menuItem: menuItemId } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } },
  ]);
  console.log(averageObject);
  await MenuItem.findOneAndUpdate(
    { _id: menuItemId },
    { rating: averageObject[0].avgRating },
  );
}

/**
 * Higher order function to create a generic controller for POST endpoint requests.
 * @param {mongoose.Model} model - The mongoose model for the resource to be created.
 * @return {genericCreateController} - Controller function
 */
function createGenericCreateController(model) {
  /**
   * Controller to create a mongoose model.
   * @function genericCreateController
   * @param {express.Request} req - The express request object.
   * @param {Object} req.body - Object containing properties to filter for the desired resource.
   * (Automatically filled by Express from URL params)
   * @param {express.Response} res - The express response object indicating success or failure.
   */
  const genericCreateController = async function (req, res) {
    try {
      await model.create(req.body);
      if (model === Review) { // if we provided a review, update the aggergate rating
        await updateAggregateRating(req.body.menuItem);
      }
      res.sendStatus(200);
    } catch (err) {
      console.log(err); res.status(500).send(err);
    }
  };
  return genericCreateController;
}

/**
 * Higher order function to create a generic controller for PUT endpoint requests.
 * @param {mongoose.Model} model - The mongoose model for the resource to be updated.
 * @return {genericUpdateController} - Controller function
 */
function createGenericUpdateController(model) {
  /**
   * Controller to update a mongoose model.
   * @function genericUpdateController
   * @param {express.Request} req - The express request object.
   * @param {Object} req.body.filter - Object containing properties to
   * filter for the desired resource.
   * @param {Object} req.body.update - Object containing the new properties to assign.
   * @param {express.Response} res - The express response object indicating success or failure.
   */
  const genericUpdateController = function (req, res) {
    model.findOneAndUpdate(req.body.filter, req.body.update)
      .then(() => res.sendStatus(200))
      .catch((err) => { console.log(err); res.status(500).send(err); });
  };
  return genericUpdateController;
}

/**
 * Higher order function to create a generic controller for DELETE endpoint requests.
 * @param {mongoose.Model} model - The mongoose model for the resource to be queried.
 * @return {genericDeleteController} - Controller function
 */
function createGenericDeleteController(model) {
  /**
   * Controller to delete a mongoose model.
   * @function genericDeleteController
   * @param {express.Request} req - The express request object.
   * @param {Object} req.body - Object containing properties to filter for the desired resource.
   * (Automatically filled by Express from URL params)
   * @param {express.Response} res - The express response object indicating success or failure.
   */
  const genericDeleteController = function (req, res) {
    model.findOneAndDelete(req.body)
      .then(() => res.sendStatus(200))
      .catch((err) => { console.log(err); res.status(500).send(err); });
  };
  return genericDeleteController;
}

module.exports = {
  createGenericGetController,
  createGenericDeleteController,
  createGenericUpdateController,
  createGenericCreateController,
};
