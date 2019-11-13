const axios = require('axios');
const cheerio = require('cheerio');

// const Menu = require('../models/Menu');
// const MenuItem = require('../models/MenuItem');
// const Restaurant = require('../models/Restaurant');

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

const getRecipe = async (recipeId, recipeSize) => {
  const $ = await fetchData(recipeUrl(recipeId, recipeSize));
  const name = $('h2').text().trim();
  // main props
  const ingredientsEle = $('div.ingred_allergen').children();
  const ingredients = $(ingredientsEle[0]).text().split(': ')[1].split(', ');
  const allergens = $(ingredientsEle[1]).text().split(': ')[1].split(', ');
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
  console.log(info);
  return info;
};

const getMenu = async (date) => {
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

const updateMenuDay = async (date) => {
  const items = await getMenu(date);
  let recipes = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    recipes.push(getRecipe(item.recipeId, item.recipeSize));
  }
  recipes = await Promise.all(recipes);

  for (let i = 0; i < items.length; i += 1) {
    // const item = items[i];
    // const recipe = recipes[i];
  }
};

const testFunction = async () => {
  // const items = await getMenu('2019-11-13');
  // console.log(items);
  // const test = await getRecipe('031002', '5');
  // await updateMenuDay('2019-11-13');
};

module.exports = {
  getMenu,
  getRecipe,
  test: testFunction,
  updateMenuDay,
};
