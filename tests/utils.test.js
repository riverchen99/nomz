
const Utils = require('../controllers/recommendations-utils');

const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
/*
 * Note: The following tests auxiliary functions. Only the
 * functions that contain non-trivial algorithms are tested:
 * similarityScore
 * propsCheck
 * restrictionCheck
 * itemCompatibility()is not tested as they only serve to
 * call the other functions (wrapper functions).
 * getUserReviewedItems() is not tested here as it is a
 * trivial query function implicitly tested in routes.test.js
 * generateRecommendations() and weightedRecommendations() return
 * the same content, which is seen in the recommendationsController
 * and only exist for purpose of wrapping/info-hiding (also
 * require seeding DB which is costly and thus redundant)
 */

const rest2 = new Restaurant({ name: 'Covel' });

const eggs = new MenuItem({
  _id: '6',
  name: 'Eggs',
  rating: 4,
  ingredients: ['eggs'],
  props: { eggs: true },
  restaurant: rest2.id,
});

const eggsW = new MenuItem({
  _id: '6',
  name: 'Eggs',
  rating: 2,
  ingredients: ['eggs'],
  props: { eggs: true },
  restaurant: rest2.id,
});
const bacon = new MenuItem({
  _id: '7',
  name: 'Bacon',
  ingredients: ['Bacon'],
  rating: 4,
  restaurant: rest2.id,
});
const btaco = new MenuItem({
  _id: '8',
  name: 'Breakfast Taco',
  ingredients: ['tortilla', 'avocado', 'beans'],
  rating: 5,
  restaurant: rest2.id,
});
const btacoEgg = new MenuItem({
  _id: '9',
  name: 'Breakfast Taco w/ Eggs',
  ingredients: ['tortilla', 'avocado', 'beans', 'eggs'],
  props: { eggs: true },
  rating: 4,
  restaurant: rest2.id,
});
const btacoEggW = new MenuItem({
  _id: '9',
  name: 'Breakfast Taco w/ Eggs',
  ingredients: ['tortilla', 'avocado', 'beans', 'eggs'],
  props: { eggs: true },
  rating: 5,
  restaurant: rest2.id,
});

describe('Sample Test for when auxiliary functions are no longer exposed', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true);
  });
});

describe('Props Check Test 1: ', () => {
  it('should find a no restricted tag....return true', async () => {
    const props = {
      vegetarian: true,
      peanuts: false,
      gluten: false,
    };
    const res = Utils.propsCheck(['gluten'], props, 'restrictions');
    expect(res).toBe(true);
  });
});

describe('Props Check Test 2: ', () => {
  it('should find no restricted tag....return true', async () => {
    const props = {
      vegetarian: true,
      peanuts: false,
      gluten: false,
    };
    const res = Utils.propsCheck(['fish'], props, 'restrictions');
    expect(res).toBe(true);
  });
});

describe('Props Check Test 3: ', () => {
  it('should find a preference tag....return true', async () => {
    const props = {
      vegetarian: true,
      vegan: true,
    };
    const res = Utils.propsCheck(['vegan'], props, 'preferences');
    expect(res).toBe(true);
  });
});

describe('Props Check Test 4: ', () => {
  it('should not find preference tag....return false', async () => {
    const props = {
      vegetarian: true,
      eggs: true,
    };
    const res = Utils.propsCheck(['vegan'], props, 'preferences');
    expect(res).toBe(false);
  });
});

describe('Props Check Test 5: ', () => {
  it('finds MOST of the preference tags....return false', async () => {
    const props = {
      vegetarian: true,
      vegan: true,
      peanuts: true,
    };
    const res = Utils.propsCheck(['vegan', 'vegetarian', 'halal'], props, 'preferences');
    expect(res).toBe(true);
  });
});

describe('Restriction Check Test 1: empty list', () => {
  it('should return true ', async () => {
    const res = Utils.restrictionCheck([], []);
    expect(res).toBe(true);
  });
});

describe('Restriction Check Test 2: Empty restriction search', () => {
  it('should find not any restricted items... return true', async () => {
    const res = Utils.restrictionCheck([], ['eggs']);
    expect(res).toBe(true);
  });
});

describe('Restriction Check Test 3: Empty allergen/ingredient search', () => {
  it('should not find restricted item ...return true', async () => {
    const res = Utils.restrictionCheck(['eggs'], []);
    expect(res).toBe(true);
  });
});

describe('Restriction Check Test 4: single restriction search', () => {
  it('should find restricted item ...return false', async () => {
    const res = Utils.restrictionCheck(['eggs'], ['eggs']);
    expect(res).toBe(false);
  });
});

describe('Restriction Check Test 5: multiple restriction match', () => {
  it('should find a single restrict item return false', async () => {
    const res = Utils.restrictionCheck(['eggs', 'fish', 'meat'], ['fish', 'peanuts', 'potato']);
    expect(res).toBe(false);
  });
});

describe('Similarity Score Test 1: Two way similarity (same weight)', () => {
  it('Should show score is independent of order', async () => {
    const res1 = Utils.similarityScore(bacon, btacoEgg);
    const res2 = Utils.similarityScore(btacoEgg, bacon);
    console.log(res1);
    console.log(res2);
    expect(res1 === res2).toBe(true);
  });
});

describe('Similarity Score Test 2: Two way similarity (Weighted)', () => {
  it('Should show score is now weighted by reviewed item', async () => {
    const res1 = Utils.similarityScore(bacon, btacoEggW);
    const res2 = Utils.similarityScore(btacoEggW, bacon);
    console.log(res1);
    console.log(res2);
    expect(res1 > res2).toBe(true);
  });
});

describe('Similarity Score Test 3: Relative similarity', () => {
  it('Should show that breakfast taco is more similar to taco w/egg than bacon  ', async () => {
    const res1 = Utils.similarityScore(btaco, btacoEgg);
    const res2 = Utils.similarityScore(btaco, bacon);
    console.log(res1);
    console.log(res2);
    expect(res1 > res2).toBe(true);
  });
});

describe('Similarity Score Test 4: Relative similarity (same weight)', () => {
  it('Taco w/egg is more similar to eggs than bacon  ', async () => {
    const res1 = Utils.similarityScore(btacoEgg, eggs);
    const res2 = Utils.similarityScore(btacoEgg, bacon);
    console.log(res1);
    console.log(res2);
    expect(res1 > res2).toBe(true);
  });
});

describe('Similarity Score Test 5: Relative similarity (weighted)', () => {
  it('Egg is lower than bacon due to lower rating', async () => {
    // score is weighted as to whether it's a good or bad similarity
    const res1 = Utils.similarityScore(btacoEgg, eggsW);
    const res2 = Utils.similarityScore(btacoEgg, bacon);
    console.log(res1);
    console.log(res2);
    expect(res1 < res2).toBe(true);
  });
});
