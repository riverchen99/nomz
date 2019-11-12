const axios = require('axios');
const cheerio = require('cheerio');

const util = require('util');

const siteUrl = 'http://menu.dining.ucla.edu/Menus';

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

const getCurrentMenu = async () => {
  const $ = await fetchData();

  const items = [];
  console.log('Test:');

  const headers = $('#page-header');
  for (let i = 0; i < headers.length; i++) {
    // find the menu date
    const menuDateStr = $(headers[i]).text();
    console.log(menuDateStr);
    const menuPeriod = menuDateStr.split(' ')[0];
    const menuDate = menuDateStr.substring(2 + menuDateStr.indexOf(',')).trim();
    const elementsBetween = $(headers[i]).nextUntil(headers[i + 1]);
    const menuBlocks = elementsBetween.filter('div.menu-block.half-col');

    // find the dining hall
    // for (let j = 0; j < menuBlocks.length; j++) {
    $(menuBlocks).each((_i, menuBlock) => {
      const diningHallEle = $(menuBlock).find('h3');
      const diningHall = diningHallEle.text();
      console.log(diningHall);

      // find the dining hall section
      const diningSectionsEle = diningHallEle.nextAll().filter('ul.sect-list').children();
      $(diningSectionsEle).each((_i1, diningSectionEle) => {
        const fullDiningText = $(diningSectionEle).text().trim();
        const diningSection = fullDiningText.substring(0, fullDiningText.indexOf('\n'));
        console.log(`  ${diningSection}`);

        // find the menu items
        $(diningSectionEle).find('li.menu-item').each((_i2, menuItemEle) => {
          const menuItemLinkEle = $(menuItemEle).find('a.recipelink');
          const recipeId = menuItemLinkEle.attr('href').split('/')[4];
          console.log(`    ${recipeId}`);
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
  const items = await getCurrentMenu();
  console.log(items);
};

module.exports = {
  getCurrentMenu,
  test: testFunction,
};
