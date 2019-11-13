const request = require('supertest');
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Menu = require('../models/Menu');
const Restaurant = require('../models/Restaurant');
// const User = require('../models/User');
// const Recommendations = require('../controllers/recommendations');
const { app, runServer, closeServer } = require('../server');

let TEST_DB_URI;
try {
  // running locally
  const keys = require('../config/keys'); // eslint-disable-line
  TEST_DB_URI = keys.mongoTestURI;
} catch (ex) {
  TEST_DB_URI = process.env.MONGODB_TEST_URI;
}

// let menuItemsIds = [];
const rest1 = new Restaurant({ name: 'Covel' });
const rest2 = new Restaurant({ name: 'Bruin Plate' });
const rest3 = new Restaurant({ name: 'Feast' });
const rest4 = new Restaurant({ name: 'De Neve' });

const item1 = new MenuItem({ name: 'combo', rating: 3, restaurant: rest1.id });
const item2 = new MenuItem({
  name: 'fish and chips',
  ingredients: ['fish', 'potato'],
  rating: 4,
  restaurant: rest1.id,
});
const item3 = new MenuItem({
  name: 'spaghetti',
  ingredients: ['pasta', 'tomato', 'oregano'],
  rating: 5,
  restaurant: rest1.id,
});
const item4 = new MenuItem({
  name: 'Veggies',
  rating: 2,
  restaurant: rest2.id,
});
const item5 = new MenuItem({
  name: 'Steak',
  ingredients: ['Beef', 'potato'],
  rating: 5,
  restaurant: rest2.id,
});
const item6 = new MenuItem({
  name: 'lentil spaghetti',
  ingredients: ['pasta', 'lentil', 'oregano'],
  rating: 5,
  restaurant: rest2.id,
});
const item7 = new MenuItem({
  name: 'Eggs',
  rating: 3,
  restaurant: rest2.id,
});
const item8 = new MenuItem({
  name: 'Bacon',
  ingredients: ['Bacon'],
  rating: 5,
  restaurant: rest2.id,
});
const item9 = new MenuItem({
  name: 'Breakfast Taco',
  ingredients: ['tortilla'],
  rating: 5,
  restaurant: rest2.id,
});

function seedRestaurantData() {
  Restaurant.insertMany([
    rest1,
    rest2,
    rest3,
    rest4,
  ]);
}

function seedMenuItemData() {
  MenuItem.insertMany([
    item1,
    item2,
    item3,
    item4,
    item5,
    item6,
    item7,
    item8,
    item9,
  ]);
}

function seedMenuData() {
  return Menu.insertMany(
    [
      {
        restaurant: rest1.id,
        startTime: new Date('Tue Nov 12 2019 11:00 AM'),
        endTime: new Date('Tue Nov 12 2019 2:00 PM'),
        menuItems: [item1.id, item2.id, item3.id],
      },

      {
        restaurant: rest2.id,
        startTime: new Date('Tue Nov 12 2019 11:00 AM'),
        endTime: new Date('Tue Nov 12 2019 2:00 PM'),
        menuItems: [item4.id, item5.id, item6.id],
      },

      {
        restaurant: rest2.id,
        startTime: new Date('Tue Nov 12 2019 7:00 AM'),
        endTime: new Date('Tue Nov 12 2019 9:00 AM'),
        menuItems: [item7.id, item8.id, item9.id],
      },
    ],
  );
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('MenuItems API works correctly', () => {
  beforeAll(() => runServer(TEST_DB_URI));

  beforeEach(() => seedMenuItemData());

  afterEach(() => tearDownDb());

  afterAll(() => closeServer());

  describe('GET Endpoint', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/menuitems');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(9);
      console.log(res.body);
    });
  });

  describe('POST Endpoint', () => {
    it('should return 200 and add entry', async () => {
      const res = await request(app).post('/api/menuitems').send({ name: 'new item' });
      expect(res.status).toBe(200);
      const menuItems = await MenuItem.find();
      expect(menuItems).toHaveLength(10);
    });
  });

  describe('PUT Endpoint', () => {
    it('should return 200 and update entry', async () => {
      const res = await request(app).put('/api/menuitems').send({
        filter: { name: 'fish and chips' },
        update: { description: 'delicious' },
      });
      expect(res.status).toBe(200);

      const menuItems = await MenuItem.find({ name: 'fish and chips' });
      expect(menuItems[0]).toHaveProperty('description');
      console.log(menuItems[0].description);
    });
  });

  describe('DELETE Endpoint', () => {
    it('should return 200 and delete entry', async () => {
      const res = await request(app).delete('/api/menuitems').send({ name: 'fish and chips' });
      expect(res.status).toBe(200);
      const menuItems = await MenuItem.find();
      expect(menuItems).toHaveLength(9);
    });
  });
});

describe('Recommendations API works correctly', () => {
  beforeAll(() => runServer(TEST_DB_URI));

  beforeEach(() => {
    seedMenuItemData();
    seedMenuData();
    seedRestaurantData();
  });
  afterEach(() => tearDownDb());

  afterAll(() => closeServer());


  describe('GET Endpoint', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/recommendations');
      expect(res.status).toBe(200);
      // expect(res.body).toHaveLength(3);
    });
  });
});
