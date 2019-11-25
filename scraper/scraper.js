/**
 @module scraper
 */

const axios = require('axios');
const cheerio = require('cheerio');

const Menu = require('../models/Menu');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// the key for the alt text of the special property icons
const PROPS_MAPPING = {
  V: 'vegetarian',
  VG: 'vegan',
  APNT: 'peanuts',
  ATNT: 'treeNuts',
  AWHT: 'wheat',
  AGTN: 'gluten',
  ASOY: 'soy',
  AMLK: 'dairy',
  AEGG: 'eggs',
  ACSF: 'shellfish',
  AFSH: 'fish',
  AHAL: 'halal',
  LC: 'lowCarbon',
};

const menuUrl = (date) => `http://menu.dining.ucla.edu/Menus/${date}`;
const recipeUrl = (recipeId, recipeSize) => `http://menu.dining.ucla.edu/Recipes/${recipeId}/${recipeSize}`;


/**
 * Helper function to fetch a webpage and pass it to cheerio for parsing.
 *
 * @param {String} url - The URL of the page to fetch
 * @return {cheerio} - Returns an instance of cheerio that can be used like jQuery
 * to select and filter elements.
 */
const fetchData = async (url) => {
  const result = await axios.get(url);
  return cheerio.load(result.data);
};

/**
 * Helper function to fetch and parse the recipe data of a menu item.
 *
 * @param {String} recipeId - The recipe ID of the menu item.
 * @param {String} recipeSize - The typical serving size of the menu item.
 * @return {Object} - Returns an recipe object containing information scraped
 * from the recipe page.
 */
const fetchRecipeData = async (recipeId, recipeSize) => {
  const $ = await fetchData(recipeUrl(recipeId, recipeSize));
  const name = $('h2').text().trim();

  // some menu items do not have recipe pages
  // in this case we return an empty object
  if (name === '') {
    return {
      name: '',
      description: '',
      ingredients: '',
      allergens: [],
      props: {
        vegetarian: false,
        vegan: false,
        peanuts: false,
        treeNuts: false,
        wheat: false,
        gluten: false,
        soy: false,
        dairy: false,
        eggs: false,
        shellfish: false,
        fish: false,
        halal: false,
        lowCarbon: false,
      },
    };
  }

  // main properties of the item
  const ingredientsEle = $('div.ingred_allergen').children();
  const description = $('div.description').text().trim();

  // the ingredients and allergens may sometimes be missing
  const ingredients = (ingredientsEle.length > 0)
    ? $(ingredientsEle[0]).text().split(': ')[1].split(', ') : '';
  const allergens = (ingredientsEle.length > 1)
    ? $(ingredientsEle[1]).text().split(': ')[1].split(', ') : '';

  // special properties of the item
  const props = {
    vegetarian: false,
    vegan: false,
    peanuts: false,
    treeNuts: false,
    wheat: false,
    gluten: false,
    soy: false,
    dairy: false,
    eggs: false,
    shellfish: false,
    fish: false,
    halal: false,
    lowCarbon: false,
  };

  // the alt text tells us what property it is
  $('div.productinfo').find('img').each((_i, imgEle) => {
    props[PROPS_MAPPING[$(imgEle).attr('alt')]] = true;
  });

  // nutrition information
  // TODO stretch goal is to get the nutrition information
  // const nutrition = {};

  const info = {
    name,
    description,
    ingredients,
    allergens,
    props,
  };
  return info;
};

/**
 * Helper function to fetch and parse the menu data for a particular day.
 *
 * @param {String} date - The ISO format date (YYYY-MM-DD)
 * @return {Array} - Returns an array of menu item objects. Each object contains
 * basic information that can be used to fetch the full recipe information with
 * fetchRecipeData.
 */
const fetchMenuData = async (date) => {
  const $ = await fetchData(menuUrl(date));

  const items = [];

  const headers = $('#page-header');
  for (let i = 0; i < headers.length; i += 1) {
    // find the menu date
    // The date string is: "PERIOD Menu for DAY, DATE"
    const menuDateStr = $(headers[i]).text();
    const menuPeriod = menuDateStr.split(' ')[0];
    const menuDate = menuDateStr.substring(2 + menuDateStr.indexOf(',')).trim();

    // we only want the menu items for this period
    const elementsBetween = $(headers[i]).nextUntil(headers[i + 1]);
    const menuBlocks = elementsBetween.filter('div.menu-block.half-col');

    // find the dining hall
    $(menuBlocks).each((_i, menuBlock) => {
      const diningHallEle = $(menuBlock).find('h3');
      const diningHall = diningHallEle.text();

      // find the dining hall section
      const diningSectionsEle = diningHallEle.nextAll().filter('ul.sect-list').children();
      $(diningSectionsEle).each((_i1, diningSectionEle) => {
        // the text returned contains all of the sub elements, we need to get only
        // the first line.
        // Sometimes the first line has a leading newline so we trim first
        const fullDiningText = $(diningSectionEle).text().trim();
        const diningSection = fullDiningText.substring(0, fullDiningText.indexOf('\n'));

        // find the menu items
        $(diningSectionEle).find('li.menu-item').each((_i2, menuItemEle) => {
          const menuItemLinkEle = $(menuItemEle).find('a.recipelink');
          // the recipe id and serving size are contained in the URL
          const recipeId = menuItemLinkEle.attr('href').split('/')[4];
          const recipeSize = menuItemLinkEle.attr('href').split('/')[5];
          const name = menuItemLinkEle.text();
          items.push({
            name, recipeId, recipeSize, diningHall, diningSection, menuPeriod, menuDate,
          });
        });
      });
    });
  }
  return items;
};

/**
 * Helper function to fetch and parse the meal periods for a particular day.
 * This function currently has a dummy implementation.
 *
 * @param {String} date - The ISO format date (YYYY-MM-DD)
 * @return {Object} - Returns an object mapping each meal period to a start and end time
 */
const fetchMenuTimes = async (date) => {
  // TODO: scrape the menu times from the web page
  const dateArr = date.split('-');
  return {
    Breakfast: {
      start: new Date(...dateArr, 6),
      end: new Date(...dateArr, 9),
    },
    Brunch: {
      start: new Date(...dateArr, 9),
      end: new Date(...dateArr, 14),
    },
    Lunch: {
      start: new Date(...dateArr, 11),
      end: new Date(...dateArr, 14),
    },
    Dinner: {
      start: new Date(...dateArr, 17),
      end: new Date(...dateArr, 20),
    },
  };
};

/**
 * Function to collate the parsed data and map it to our database schema.
 *
 * @param {String} date - The ISO format date (YYYY-MM-DD)
 * @param {Function} fetchMenu - A function to retrieve the menu data.
 * @param {Function} fetchTimes - A function to retrieve the meal period data.
 * @param {Function} fetchRecipes - A function to retrieve the recipe data.
 * @return {Object} - Returns an object encapsulating the fully collated data in
 * the form of MenuItem, Menu, and Restaurant Documents.
 */
const updateMenu = async (
  date,
  fetchMenu = fetchMenuData,
  fetchTimes = fetchMenuTimes,
  fetchRecipes = fetchRecipeData) => {
  const menuItemsData = [];
  // the restaurants must already exist in the database
  const restaurants = {
    Covel: await Restaurant.findOne({ name: 'Covel' }),
    'Bruin Plate': await Restaurant.findOne({ name: 'Bruin Plate' }),
    'De Neve': await Restaurant.findOne({ name: 'De Neve' }),
    Feast: await Restaurant.findOne({ name: 'Feast' }),
  };
  // used to reference the restaurants when updating the menu lists associated
  // with the restaurants
  const restaurantById = {};
  // we allow restricted for of iteration in this case to reduce
  // the number of variables scoped to the function
  for (const restaurant of Object.values(restaurants)) { // eslint-disable-line no-restricted-syntax
    restaurantById[restaurant._id] = restaurant;
  }
  const menus = {};

  const times = await fetchTimes(date);
  const items = await fetchMenu(date);

  // We asynchronously begin fetching the recipe data
  const recipePromises = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    recipePromises.push(fetchRecipes(item.recipeId, item.recipeSize));
  }
  // now we wait for our recipes to finish fetching and parsing
  const recipes = await Promise.all(recipePromises);

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const recipe = recipes[i];

    // create menu
    if (!(item.menuPeriod in menus)) {
      // we need to create a new menu doc
      const menuData = {
        mealPeriod: item.menuPeriod,
        startTime: times[item.menuPeriod].start,
        endTime: times[item.menuPeriod].end,
        restaurant: restaurants[item.diningHall]._id,
      };
      // we allow this await in the loop because it only fetches
      // the menu once per meal period.
      let newMenu = await Menu.findOne(menuData); // eslint-disable-line no-await-in-loop
      if (newMenu === null) {
        newMenu = new Menu(menuData);
      }
      menus[item.menuPeriod] = newMenu;
    }
    if (menus[item.menuPeriod].menuItems.indexOf(item.recipeId) === -1) {
      menus[item.menuPeriod].menuItems.push(item.recipeId);
    }

    // create menu item
    menuItemsData.push({
      _id: item.recipeId,
      name: item.name,
      rating: null,
      description: recipe.description,
      ingredients: recipe.ingredients,
      allergens: recipe.allergens,
      props: recipe.props,
      restaurant: restaurants[item.diningHall]._id,
      station: item.diningSection,
    });
  }

  const menuList = Object.values(menus);

  // update restaurant
  for (let i = 0; i < menuList.length; i += 1) {
    restaurantById[menuList[i].restaurant].menus.push(menuList[i]._id);
  }

  // save restaurants
  let savePromises = Object.values(restaurants).map((res) => res.save());
  // save menus
  savePromises = savePromises.concat(menuList.map((menu) => menu.save()));

  // remove duplicate menu items
  const filteredItemsData = [];
  for (let i = 0; i < menuItemsData.length; i += 1) {
    if (!filteredItemsData.reduce(
      ((acc, item) => (acc || item._id === menuItemsData[i]._id)),
      false,
    )) {
      filteredItemsData.push(menuItemsData[i]);
    }
  }

  // save menu items
  for (let i = 0; i < filteredItemsData.length; i += 1) {
    const data = filteredItemsData[i];
    savePromises.push(MenuItem.findById(data._id).then((item) => {
      if (item === null) {
        return (new MenuItem(data)).save();
      }
      item.overwrite(data);
      return item.save();
    }));
  }

  // wait until all are saved
  await Promise.all(savePromises);
};

const createBlankRestaurants = () => Promise.all([
  Restaurant.create({ name: 'Covel' }),
  Restaurant.create({ name: 'Bruin Plate' }),
  Restaurant.create({ name: 'De Neve' }),
  Restaurant.create({ name: 'Feast' }),
]);

module.exports = {
  updateMenu,
  createBlankRestaurants,

  // these should be private
  // they are only exported so that we can test it with Jest
  fetchMenuData,
  fetchRecipeData,
  fetchMenuTimes,
};
