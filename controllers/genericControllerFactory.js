/**
 * @module
 */

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
   * @param {Object} req.params - Object containing properties to filter for the desired resource.
   * (Automatically filled by Express from URL params)
   * @param {express.Response} res - The express response object containing a list of resources.
   */
  const genericGetController = function (req, res) {
    console.log(req.params.ids);
    const query = req.params.ids === undefined ? {} : { _id: { $in: req.params.ids.split(';') } };
    model.find(query)
      .then((results) => res.json(results))
      .catch((err) => { console.log(err); res.status(500).send(err); });
  };
  return genericGetController;
};

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
  const genericCreateController = function (req, res) {
    model.create(req.body)
      .then(() => res.sendStatus(200))
      .catch((err) => { console.log(err); res.status(500).send(err); });
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
