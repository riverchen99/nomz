const express = require('express');

const router = express.Router();

const MenuItem = require('../../models/MenuItem');
const Restaurant = require('../../models/Restaurant');
const Menu = require('../../models/Menu');
const Review = require('../../models/Review');
const User = require('../../models/User');

const controllerFactory = require('../../controllers/genericControllerFactory');
const recommendationControllers = require('../../controllers/recommendations');

const endpoints = {
  '/menuItems': MenuItem,
  '/restaurants': Restaurant,
  '/menus': Menu,
  '/reviews': Review,
  '/users': User,
};

Object.keys(endpoints).forEach((endpoint) => {
  router.get(endpoint, controllerFactory.createGenericGetController(endpoints[endpoint]));
  router.post(endpoint, controllerFactory.createGenericCreateController(endpoints[endpoint]));
  router.put(endpoint, controllerFactory.createGenericUpdateController(endpoints[endpoint]));
  router.delete(endpoint, controllerFactory.createGenericDeleteController(endpoints[endpoint]));
});


router.get('/recommendations', recommendationControllers.getRecommendations);

module.exports = router;
