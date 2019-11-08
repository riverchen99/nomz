const express = require('express');
const controller = require('../../controllers/menuItemController');


const router = express.Router();
router.get('/', controller.getMenuItems);
router.post('/', controller.createMenuItem);
router.put('/', controller.updateMenuItem);
router.delete('/', controller.deleteMenuItem);

module.exports = router;
