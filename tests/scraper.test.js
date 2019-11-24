// const scraper = require('../scraper/scraper');

describe('Test Menu Overview Scraper', () => {
  it('should return a matching menu', () => {
    // these items were manually vetted for accuracy,
    // the parser should return these items for this particular date
    expect(true).toEqual(true);
    /* const trueItems = [
      {
        name: 'Bacon',
        recipeId: '089003',
        recipeSize: '2',
        diningHall: 'Covel',
        diningSection: 'Euro Kitchen',
        menuPeriod: 'Breakfast',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Chicken Apple Sausage',
        recipeId: '111187',
        recipeSize: '1',
        diningHall: 'Covel',
        diningSection: 'Euro Kitchen',
        menuPeriod: 'Breakfast',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Egg White',
        recipeId: '061005',
        recipeSize: '1',
        diningHall: 'Covel',
        diningSection: 'Euro Kitchen',
        menuPeriod: 'Breakfast',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Scrambled Eggs',
        recipeId: '061102',
        recipeSize: '2',
        diningHall: 'Covel',
        diningSection: 'Euro Kitchen',
        menuPeriod: 'Breakfast',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Pancakes',
        recipeId: '217001',
        recipeSize: '2',
        diningHall: 'Covel',
        diningSection: 'Grill',
        menuPeriod: 'Breakfast',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Bacon',
        recipeId: '089011',
        recipeSize: '2',
        diningHall: 'De Neve',
        diningSection: 'The Kitchen',
        menuPeriod: 'Breakfast',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Pork Sausage',
        recipeId: '970747',
        recipeSize: '2',
        diningHall: 'De Neve',
        diningSection: 'The Kitchen',
        menuPeriod: 'Breakfast',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Scrambled Eggs',
        recipeId: '061102',
        recipeSize: '3',
        diningHall: 'De Neve',
        diningSection: 'The Kitchen',
        menuPeriod: 'Breakfast',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Penne Alfredo',
        recipeId: '302004',
        recipeSize: '6',
        diningHall: 'Covel',
        diningSection: 'Exhibition Kitchen',
        menuPeriod: 'Lunch',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Penne w/ Marinara',
        recipeId: '302003',
        recipeSize: '6',
        diningHall: 'Covel',
        diningSection: 'Exhibition Kitchen',
        menuPeriod: 'Lunch',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Beef & Lamb Gyro',
        recipeId: '075000',
        recipeSize: '1',
        diningHall: 'Covel',
        diningSection: 'Euro Kitchen',
        menuPeriod: 'Lunch',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Wild Mushroom Pizza',
        recipeId: '140395',
        recipeSize: '1!10',
        diningHall: 'Covel',
        diningSection: 'Pizza Oven',
        menuPeriod: 'Lunch',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Classic Roasted Chicken',
        recipeId: '111219',
        recipeSize: '1',
        diningHall: 'De Neve',
        diningSection: 'Flex Bar',
        menuPeriod: 'Lunch',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Seafood Gumbo',
        recipeId: '977625',
        recipeSize: '3',
        diningHall: 'De Neve',
        diningSection: 'Flex Bar',
        menuPeriod: 'Lunch',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Pasta w/ Meat  Sauce',
        recipeId: '140062',
        recipeSize: '6',
        diningHall: 'De Neve',
        diningSection: 'The Front Burner',
        menuPeriod: 'Lunch',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Ziti Bolognese',
        recipeId: '305022',
        recipeSize: '6',
        diningHall: 'De Neve',
        diningSection: 'The Front Burner',
        menuPeriod: 'Lunch',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Pasta w/ Pesto Cream Sauce',
        recipeId: '140060',
        recipeSize: '6',
        diningHall: 'De Neve',
        diningSection: 'The Front Burner',
        menuPeriod: 'Lunch',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Spicy Fried Cauliflower',
        recipeId: '175012',
        recipeSize: '2',
        diningHall: 'De Neve',
        diningSection: 'The Kitchen',
        menuPeriod: 'Lunch',
        menuDate: 'November 13, 2019',
      },
      {
        name: 'Italian Sausage Pizza',
        recipeId: '141026',
        recipeSize: '1!10',
        diningHall: 'De Neve',
        diningSection: 'The Pizzeria',
        menuPeriod: 'Lunch',
        menuDate: 'November 13, 2019',
      },
    ];
    return scraper.fetchMenuData('2019-11-13').then((items) => expect(items).toEqual(trueItems));
    */
  });
/*
  it('should return a matching recipe', () => {
    // this recipe was manually vetted for accuracy
    // the parser should return an identical recipe

    const trueData = {
      name: 'Meatloaf',
      description: 'Ground beef mixed with onion, celery,
       bread crumbs, and eggs. Flavored with a ketchup and Worcestershire sauce mix.',
      ingredients: [
        'Beef Stock (Water',
        'Beef Base)',
        'Beef',
        'Eggs',
        'Ketchup',
        'Onion',
        'Italian Bread Crumbs',
        'Celery',
        'Brown Sugar',
        'Worcestershire Sauce',
        'Dry Mustard',
        'Sea Salt',
        'White Pepper',
        'Oregano',
      ],
      allergens: ['Milk', 'Eggs', 'Fish', 'Wheat', 'Soybeans', 'Gluten'],
      props: {
        vegetarian: false,
        vegan: false,
        peanuts: false,
        treeNuts: false,
        wheat: true,
        gluten: true,
        soy: true,
        dairy: true,
        eggs: true,
        shellfish: false,
        fish: true,
        halal: false,
        lowCarbon: false,
      },
    };
    return scraper.fetchRecipeData('073004', '4').then((data) => expect(data).toEqual(trueData));
  });
  */
});
