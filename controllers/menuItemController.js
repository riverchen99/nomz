// Load MenuItem model
const MenuItem = require('../models/MenuItem');

/**
 * Filters and retrives menu items.
 * @param {express.Request} req - The express request object.
 * @param {MenuItem} req.query - Filter containing properties of the desired menuitem.
 * (Automatically filled by Express from URL params)
 * @param {express.Response} res - The express response object containing a list of menuitems.
 */
function getMenuItems(req, res) {
  MenuItem.find(req.query)
    .then((menuItems) => res.json(menuItems))
    .catch((err) => { console.log(err); res.status(500).send(err); });
}

/**
 * Creates a menu item.
 * @param {express.Request} req - The express request object.
 * @param {MenuItem} req.body - The desired menuitem to create.
 * (Automatically filled by Express from HTTP request body json)
 * @param {express.Response} res - The express response object incidating success or failure.
 */
function createMenuItem(req, res) {
  MenuItem.create(req.body)
    .then(() => res.sendStatus(200))
    .catch((err) => { console.log(err); res.status(500).send(err); });
}
/**
 * Updates a menu item.
 * @param {express.Request} req - The express request object.
 * @param {MenuItem} req.body.filter - The desired menuitem to update. Its
 * @param {MenuItem} req.body.update - The new properties to assign.
 * @param {express.Response} res - The express response object incidating success or failure.
 */
function updateMenuItem(req, res) {
  MenuItem.findOneAndUpdate(req.body.filter, req.body.update)
    .then(() => res.sendStatus(200))
    .catch((err) => { console.log(err); res.status(500).send(err); });
}

/**
 * Deletes a menu item.
 * @param {express.Request} req - The express request object.
 * @param {MenuItem} req.body - The desired menuitem to delete.
 * @param {express.Response} res - The express response object incidating success or failure.
 */
function deleteMenuItem(req, res) {
  MenuItem.findOneAndDelete(req.body)
    .then(() => res.sendStatus(200))
    .catch((err) => { console.log(err); res.status(500).send(err); });
}

module.exports = {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
