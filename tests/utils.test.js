
const Recommendations = require('../controllers/recommendations');
/**
 * Note: The following tests auxiliary functions. These only work
 * if they are exposed to the client so it's
 */

describe('Sample Test for when auxiliary functions are no longer exposed', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true);
  });
});

describe('Restriction Check Test 1: empty list', () => {
  it('should return true ', async () => {
    const res = Recommendations.restrictionCheck([], []);
    expect(res).toBe(true);
  });
});

describe('Restriction Check Test 2: Empty restriction search', () => {
  it('should find not any restricted items... return true', async () => {
    const res = Recommendations.restrictionCheck([], ['eggs']);
    expect(res).toBe(true);
  });
});

describe('Restriction Check Test 3: Empty allergen/ingredient search', () => {
  it('should not find restricted item ...return true', async () => {
    const res = Recommendations.restrictionCheck(['eggs'], []);
    expect(res).toBe(true);
  });
});

describe('Restriction Check Test 4: single restriction search', () => {
  it('should find restricted item ...return false', async () => {
    const res = Recommendations.restrictionCheck(['eggs'], ['eggs']);
    expect(res).toBe(false);
  });
});

describe('Restriction Check Test 5: multiple restriction match', () => {
  it('should find a single restrict item return false', async () => {
    const res = Recommendations.restrictionCheck(['eggs', 'fish', 'meat'], ['fish', 'peanuts', 'potato']);
    expect(res).toBe(false);
  });
});

describe('Props Check Test 1: ', () => {
  it('should find a no restricted tag....return true', async () => {
    const props = {
      vegetarian: true,
      peanuts: false,
      gluten: false,
    };
    const res = Recommendations.propsCheck(['gluten'], props, 'restrictions');
    expect(res).toBe(true);
  });
});

describe('Props Check Test 2: ', () => {
  it('should find a no restricted tag....return true', async () => {
    const props = {
      vegetarian: true,
      peanuts: false,
      gluten: false,
    };
    const res = Recommendations.propsCheck(['fish'], props, 'restrictions');
    expect(res).toBe(true);
  });
});

describe('Props Check Test 3: ', () => {
  it('should find a preference tag....return true', async () => {
    const props = {
      vegetarian: true,
      vegan: true,
    };
    const res = Recommendations.propsCheck(['vegan'], props, 'preferences');
    expect(res).toBe(true);
  });
});

describe('Props Check Test 4: ', () => {
  it('should not find preference tag....return false', async () => {
    const props = {
      vegetarian: true,
      eggs: true,
    };
    const res = Recommendations.propsCheck(['vegan'], props, 'preferences');
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
    const res = Recommendations.propsCheck(['vegan', 'vegetarian', 'halal'], props, 'preferences');
    expect(res).toBe(true);
  });
});

describe('Props Check Test 6: ', () => {
  it('finds MOST of the preference tags....return false', async () => {
    const props = {
      vegetarian: true,
      vegan: false,
      peanuts: true,
    };
    const res = Recommendations.propsCheck(['vegan', 'vegetarian', 'halal'], props, 'preferences');
    expect(res).toBe(false);
  });
});
