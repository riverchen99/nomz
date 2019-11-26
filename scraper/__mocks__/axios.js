const fs = require('fs');

const get = (url) => {
  let data = '';
  if (url.indexOf('2019-11-13') !== -1) {
    data = fs.readFileSync('tests/cached_pages/2019-11-13');
  } else if (url.indexOf('073004' !== -1)) {
    data = fs.readFileSync('tests/cached_pages/4');
  }
  return { data };
};

module.exports.get = get;
