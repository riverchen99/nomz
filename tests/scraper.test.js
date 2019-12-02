const fs = require('fs');
const scraper = require('../scraper/scraper');

describe('Test Menu Overview Scraper', () => {
  it('should return a matching menu', () => {
    // these items were manually vetted for accuracy,
    // the parser should return these items for this particular date
    const date = '2019-11-27';
    const trueItems = JSON.parse(fs.readFileSync(`./tests/scraper_data/menu_${date}.json`)).items;
    return scraper.fetchMenuData(date).then((items) => expect(items).toEqual(trueItems));
  });

  it('should return a matching recipe', () => {
    // this recipe was manually vetted for accuracy
    // the parser should return an identical recipe
    const id = '073004';
    const size = '4';
    const trueData = JSON.parse(fs.readFileSync(`./tests/scraper_data/recipe_${id}-${size}.json`));
    return scraper.fetchRecipeData(id, size).then((data) => expect(data).toEqual(trueData));
  });
});
