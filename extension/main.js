const remoteURL = 'http://cs130-nomz.herokuapp.com'; // eslint-disable-line
const localURL = 'http://localhost:8080';

let menuItemData;
let reviewData;
let userId;

// star rating library from https://github.com/nashio/star-rating-svg

/**
 * @module
 */

/**
 * Function to find all itemIds on a given webpage
 * @return {string[]} itemIds - An array of item id strings.
 */
function findAllItemIds() {
  const menuItems = $('.menu-item');
  // console.log(menuItems);

  const itemIds = [];

  menuItems.each((index, item) => {
    // console.log($(item).find('.recipelink').attr('href'));
    const itemId = $(item).find('.recipelink').attr('href').split('/')
      .slice(-2, -1)[0];
    itemIds.push(itemId);
  });

  // console.log(itemIds);

  return itemIds;
}

function addRating(rating, $el, menuItemId, newReview) {
  console.log($el);
  console.log(menuItemId);
  console.log(rating);
  if (newReview) {
    $.ajax({
      url: `${remoteURL}/api/reviews`,
      type: 'POST',
      success: console.log,
      data: JSON.stringify({
        menuItem: menuItemId,
        author: userId,
        rating,
      }),
      contentType: 'application/json',
    });
  } else {
    $.ajax({
      url: `${remoteURL}/api/reviews`,
      type: 'PUT',
      success: console.log,
      data: JSON.stringify({
        filter: {
          menuItem: menuItemId,
          author: userId,
        },
        update: {
          rating,
        },
      }),
      contentType: 'application/json',
    });
  }
}

/**
 * Function to add stars next to menuItems that are found in the database.
 * @param {object[]} menuItemData - An array of menuitem objects (result from menuItems api call)
 */
function addStars(reviewData, menuItemData) { // eslint-disable-line
  // console.log(menuItemData);
  // console.log($(`a[href*="${menuItemData[0]._id}"]`));

  for (let i = 0; i < menuItemData.length; i += 1) {
    const aTag = $(`a[href*="${menuItemData[i]._id}"]`);
    console.log(aTag);
    if (aTag.length !== 0) {
      aTag.after(`<span class="star-rating" id="star-rating-${menuItemData[i]._id}"></span>`);

      const userReview = reviewData.find((e) => e.menuItem === menuItemData[i]._id);
      $(`#star-rating-${menuItemData[i]._id}`).starRating({
        initialRating: (userReview === undefined) ? menuItemData[i].rating : userReview.rating,
        starSize: 10,
        starShape: 'rounded',
        useGradient: false,
        activeColor: (userReview === undefined) ? 'gold' : 'crimson',
        callback: (rating, $el) => { addRating(rating, $el, menuItemData[i]._id, userReview === undefined); }, // eslint-disable-line
      });
    }
  }
}


function getUserId() {
  $.ajax({
    url: 'https://cs130-nomz.herokuapp.com/auth/user',
    type: 'GET',
    xhrFields: {
      withCredentials: true,
    },
    async: false,
  }).done((resp) => {
    console.log(resp);
    if (resp.user !== null) {
      return resp.user._id;
    }
    return null;
  });
}


const itemIds = findAllItemIds();

userId = getUserId();

$.when(
  $.get(`${remoteURL}/api/menuItems/${itemIds.join(';')}`, (data) => { menuItemData = data; console.log(menuItemData); }),

  $.get(`${remoteURL}/api/reviews?menuItem={"$in":[${itemIds.map((id) => `"${id}"`).join(',')}]}${userId === null ? '' : `&author=${userId}`}`, (data) => { reviewData = data; console.log(reviewData); }),
).then(() => {
  addStars(reviewData, menuItemData);
});
