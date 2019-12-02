const fs = require('fs');

const get = (url) => {
  let data = '';
  const urlEle = url.split('/');
  if (urlEle[3] === 'Menus') {
    data = fs.readFileSync(`tests/cached_pages/menu_${urlEle[4]}`);
  } else if (urlEle[3] === 'Recipes') {
    data = fs.readFileSync(`tests/cached_pages/recipe_${urlEle[4]}-${urlEle[5]}`);
  }
  return { data };
};

module.exports.get = get;
