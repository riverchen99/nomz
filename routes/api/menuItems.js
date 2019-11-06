const express = require('express');

const router = express.Router();

// Load MenuItem model
const MenuItem = require('../../models/MenuItem');

// @route GET api/menuItems/test
// @description test route
// @access Public
router.get('/test', (req, res) => res.send('menuitem route testing!'));

// @route GET api/menuItems
// @description Get menuItems
// @access Public
router.get('/', (req, res) => {
  MenuItem.find(req.query)
    .then((menuItems) => res.json(menuItems))
    .catch((err) => { console.log(err); res.status(404).json({ noMenuItemsFound: 'No MenuItem found' }); });
});

router.post('/', (req, res) => {
  MenuItem.create(req.body)
    .then(() => res.sendStatus(200))
    .catch((err) => { console.log(err); res.status(500).send(err); });
});

router.put('/', (req, res) => {
  MenuItem.findOneAndUpdate(req.body.filter, req.body.update)
    .then(() => res.sendStatus(200))
    .catch((err) => { console.log(err); res.status(500).send(err); });
});

router.delete('/', (req, res) => {
  MenuItem.findOneAndDelete(req.body)
    .then(() => res.sendStatus(200))
    .catch((err) => { console.log(err); res.status(500).send(err); });
});

module.exports = router;
