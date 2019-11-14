const remoteURL = 'http://cs130-nomz.herokuapp.com'; // eslint-disable-line
const localURL = 'http://localhost:8080';

/**
 * @module
 */
 
/**
 * Function to find all itemIds on a given webpage
 * @return {string[]} itemIds - An array of item id strings.
 */
function findAllItemIds() {
  const menuItems = $('.menu-item');
  console.log(menuItems);

  const itemIds = [];

  menuItems.each((index, item) => {
    console.log($(item).find('.recipelink').attr('href'));
    const itemId = $(item).find('.recipelink').attr('href').split('/')
      .slice(-2, -1)[0];
    itemIds.push(itemId);
  });

  console.log(itemIds);

  return itemIds;
}

/**
 * Function to add stars next to menuItems that are found in the database.
 * @param {object[]} menuItemData - An array of menuitem objects (result from menuItems api call)
 */
function addStars(menuItemData) {
  console.log(menuItemData);
  console.log($(`a[href*="${menuItemData[0]._id}"]`));

  for (let i = 0; i < menuItemData.length; i += 1) {
    const aTag = $(`a[href*="${menuItemData[i]._id}"]`);
    if (aTag.length !== 0) {
      const ratingDiv = aTag.after(`<div class="star-rating" id="star-rating-${menuItemData[i]._id}"></div>`);
      console.log(ratingDiv);
      ratingDiv.starRating({
        initialRating: menuItemData[i].rating,
        starSize: 10,
        starShape: 'rounded',
      });
    }
  }
}


const itemIds = findAllItemIds();
$.get(`${localURL}/api/menuItems/${itemIds.join(';')}`, addStars);