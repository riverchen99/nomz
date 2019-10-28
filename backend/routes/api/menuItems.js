const express = require('express');
const router = express.Router();

// Load MenuItem model
const MenuItem = require('../../models/MenuItem');

// @route GET api/menuItems/test
// @description test route
// @access Public
router.get('/test', (req, res) => res.send('menuitem route testing!'));

// @route GET api/menuItems
// @description Get all menuItems
// @access Public
router.get('/', (req, res) => {
  MenuItem.find()
    .then(menuItems => res.json(menuItems))
    .catch(err => res.status(404).json({ noMenuItemsFound: 'No MenuItem found' }));
});

module.exports = router;