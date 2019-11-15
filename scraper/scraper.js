const axios = require('axios');
const cheerio = require('cheerio');

const Menu = require('../models/Menu');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

const menuUrl = (date) => `http://menu.dining.ucla.edu/Menus/${date}`;
const recipeUrl = (recipeId, recipeSize) => `http://menu.dining.ucla.edu/Recipes/${recipeId}/${recipeSize}`;

const fetchData = async (url) => {
  const result = await axios.get(url);
  return cheerio.load(result.data);
};

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

const fetchRecipeData = async (recipeId, recipeSize) => {
  const $ = await fetchData(recipeUrl(recipeId, recipeSize));
  const name = $('h2').text().trim();
  // main props
  const ingredientsEle = $('div.ingred_allergen').children();
  const ingredients = (ingredientsEle.length > 0)
    ? $(ingredientsEle[0]).text().split(': ')[1].split(', ') : '';
  const allergens = (ingredientsEle.length > 1)
    ? $(ingredientsEle[1]).text().split(': ')[1].split(', ') : '';
  // special properties
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
  $('div.productinfo').find('img').each((_i, imgEle) => {
    props[PROPS_MAPPING[$(imgEle).attr('alt')]] = true;
  });
  const description = $('div.description').text();

  // nutrition information
  // const nutrition = {};

  const info = {
    name,
    description,
    ingredients,
    allergens,
    props,
  };
  // console.log(info);
  return info;
};

const fetchMenuData = async (date) => {
  const $ = await fetchData(menuUrl(date));

  const items = [];

  const headers = $('#page-header');
  for (let i = 0; i < headers.length; i += 1) {
    // find the menu date
    const menuDateStr = $(headers[i]).text();
    // console.log(menuDateStr);
    const menuPeriod = menuDateStr.split(' ')[0];
    const menuDate = menuDateStr.substring(2 + menuDateStr.indexOf(',')).trim();
    const elementsBetween = $(headers[i]).nextUntil(headers[i + 1]);
    const menuBlocks = elementsBetween.filter('div.menu-block.half-col');

    // find the dining hall
    $(menuBlocks).each((_i, menuBlock) => {
      const diningHallEle = $(menuBlock).find('h3');
      const diningHall = diningHallEle.text();
      // console.log(diningHall);

      // find the dining hall section
      const diningSectionsEle = diningHallEle.nextAll().filter('ul.sect-list').children();
      $(diningSectionsEle).each((_i1, diningSectionEle) => {
        const fullDiningText = $(diningSectionEle).text().trim();
        const diningSection = fullDiningText.substring(0, fullDiningText.indexOf('\n'));
        // console.log(`  ${diningSection}`);

        // find the menu items
        $(diningSectionEle).find('li.menu-item').each((_i2, menuItemEle) => {
          const menuItemLinkEle = $(menuItemEle).find('a.recipelink');
          const recipeId = menuItemLinkEle.attr('href').split('/')[4];
          const recipeSize = menuItemLinkEle.attr('href').split('/')[5];
          // console.log(`    ${recipeId}`);
          items.push({
            recipeId, recipeSize, diningHall, diningSection, menuPeriod, menuDate,
          });
        });
      });
    });
  }
  return items;
};

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

const getUpdatedMenu = async (date) => {
  const menuItems = [];
  const restaurants = {
    Covel: await Restaurant.findOne({ name: 'Covel' }),
    'Bruin Plate': await Restaurant.findOne({ name: 'Bruin Plate' }),
    'De Neve': await Restaurant.findOne({ name: 'De Neve' }),
    Feast: await Restaurant.findOne({ name: 'Feast' }),
  };
  const menus = {};

  const times = await fetchMenuTimes(date);
  const items = await fetchMenuData(date);

  const recipePromises = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    recipePromises.push(fetchRecipeData(item.recipeId, item.recipeSize));
  }
  const recipes = await Promise.all(recipePromises);

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const recipe = recipes[i];

    // update restaurant
    // restaurants[item.diningHall](Restaurant.create({name: item.diningHall, menus:}))

    // create menu
    if (item.menuPeriod in menus) {
      menus[item.menuPeriod].menuItems.push(item.recipeId);
    } else {
      menus[item.menuPeriod] = new Menu({
        mealPeriod: item.menuPeriod,
        startTime: times[item.menuPeriod].startTime,
        endTime: times[item.menuPeriod].endTime,
        restaurant: restaurants[item.diningHall]._id,
        menuItems: [item.recipeId],
      });
    }

    // create menu item
    menuItems.push(new MenuItem({
      _id: item.recipeId,
      name: recipe.name,
      rating: null,
      description: recipe.description,
      ingredients: recipe.ingredients,
      allergens: recipe.allergens,
      props: recipe.props,
      restaurant: restaurants[item.diningHall]._id,
      station: item.diningSection,
    }));
  }

  return {
    items: menuItems,
    menus,
    restaurants,
  };
};

const testFunction = async () => {
  // const items = await getMenu('2019-11-13');
  // console.log(items);
  // const test = await getRecipe('031002', '5');
  // await updateMenuDay('2019-11-13');
  // MenuItem.find({}).then((result) => console.log(result));
  // MenuItem.findById('047073').then((result) => {
  //   if (result === null) {
  //     console.log('result is null');
  //   } else {
  //     console.log(result);
  //   }
  // });
  //
  //
  const dayMenu = await getUpdatedMenu('2019-11-13');
  console.log('finished menu');
  console.log(dayMenu);
  for (let i = 0; i < dayMenu.items.length; i += 1) {
    dayMenu.items[i].save();
    console.log('saving item');
    console.log(dayMenu.items[i]);
  }
};

module.exports = {
  test: testFunction,
};
