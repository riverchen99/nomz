const express = require('express');
const controllerFactory = require('../../controllers/genericControllerFactory');
const MenuItem = require('../../models/MenuItem');

const router = express.Router();
router.get('/', controllerFactory.genericGetController(MenuItem));
router.post('/', controllerFactory.genericCreateController(MenuItem));
router.put('/', controllerFactory.genericUpdateController(MenuItem));
router.delete('/', controllerFactory.genericDeleteController(MenuItem));

module.exports = router;
