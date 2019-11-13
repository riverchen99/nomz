const menuItems = $('.menu-item');

console.log(menuItems);

const remoteURL = 'http://cs130-nomz.herokuapp.com'; // eslint-disable-line
const localURL = 'http://localhost:8080';
const itemIds = [];

menuItems.each((index, item) => {
  console.log($(item).find('.recipelink').attr('href'));
  const itemId = $(item).find('.recipelink').attr('href').split('/')
    .slice(-2, -1)[0];
  itemIds.push(itemId);
});

console.log(itemIds);


$.get(`${localURL}/api/menuItems/${itemIds.join(';')}`, (data) => {
  console.log(data);
  console.log($(`a[href*="${data[0]._id}"]`));

  for (let i = 0; i < data.length; i += 1) {
    const aTag = $(`a[href*="${data[i]._id}"]`);
    if (aTag.length !== 0) {
      const ratingDiv = aTag.after(`<div class="star-rating" id="star-rating-${data[i]._id}"></div>`);
      console.log(ratingDiv);
      ratingDiv.starRating({
        initialRating: data[i].rating,
        starSize: 10,
        starShape: 'rounded',
      });
    }
  }
});


/*
for (const menuItem of Object.values(menuItems)) {
  var text = document.createTextNode("5 stars");
  menuItem.appendChild(text);
}
*/
