const axios = require('axios');
const cheerio = require('cheerio');

const menuUrl = 'http://menu.dining.ucla.edu/Menus';
const recipeUrl = (recipeId) => `http://menu.dining.ucla.edu/Recipes/${recipeId}/1`;

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

const getRecipe = async (recipeId) => {
  const $ = await fetchData(recipeUrl(recipeId));
  const name = $('h2').text().trim();
  const ingredientsEle = $('div.ingred_allergen').children();
  const ingredients = $(ingredientsEle[0]).text().split(': ')[1].split(', ');
  const allergens = $(ingredientsEle[1]).text().split(': ')[1].split(', ');
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
  // TODO: get ingredients and allergens
  const info = {
    name,
    ingredients,
    allergens,
    props,
  };
  console.log(info);
  return info;
};

const getCurrentMenu = async () => {
  const $ = await fetchData(menuUrl);

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
          // console.log(`    ${recipeId}`);
          items.push({
            recipeId, diningHall, diningSection, menuPeriod, menuDate,
          });
        });
      });
    });
  }
  return items;
};

const testFunction = async () => {
  // const items = await getCurrentMenu();
  // console.log(items);
  const test = await getRecipe('031002');
};

module.exports = {
  getCurrentMenu,
  getRecipe,
  test: testFunction,
};
