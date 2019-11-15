const request = require('supertest');
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Menu = require('../models/Menu');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
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

const item1 = new MenuItem({
  _id: '0',
  name: 'combo',
  rating: 3,
  restaurant: rest1.id,
});
const item2 = new MenuItem({
  _id: '1',
  name: 'fish and chips',
  ingredients: ['fish', 'potato'],
  rating: 4,
  restaurant: rest1.id,
});
const item3 = new MenuItem({
  _id: '2',
  name: 'spaghetti',
  ingredients: ['pasta', 'tomato', 'oregano'],
  rating: 5,
  restaurant: rest1.id,
});
const item4 = new MenuItem({
  _id: '3',
  name: 'Veggies',
  rating: 2,
  restaurant: rest2.id,
});
const item5 = new MenuItem({
  _id: '4',
  name: 'Steak',
  ingredients: ['Beef', 'potato'],
  rating: 5,
  restaurant: rest2.id,
});
const item6 = new MenuItem({
  _id: '5',
  name: 'lentil spaghetti',
  ingredients: ['pasta', 'lentil', 'oregano'],
  rating: 5,
  restaurant: rest2.id,
});
const item7 = new MenuItem({
  _id: '6',
  name: 'Eggs',
  rating: 3,
  ingredients: ['eggs'],
  props: { eggs: true },
  restaurant: rest2.id,
});
const item8 = new MenuItem({
  _id: '7',
  name: 'Bacon',
  ingredients: ['Bacon'],
  rating: 5,
  restaurant: rest2.id,
});
const item9 = new MenuItem({
  _id: '8',
  name: 'Breakfast Taco',
  ingredients: ['tortilla'],
  rating: 5,
  restaurant: rest2.id,
});

const user1 = new User({
  name: 'Mufasa',
  preferences: [],
  restrictions: ['eggs'],
});

const user2 = new User({
  name: 'Scar',
  preferences: ['vegetarian'],
  restrictions: ['nuts'],
});

const user3 = new User({
  name: 'Pumbaa',
  preferences: [],
  restrictions: ['non-grub things'],
});

const user4 = new User({
  name: 'EmptyUser',
  preferences: [],
  restrictions: [],
});

function seedUserData() {
  return User.insertMany([
    user1,
    user2,
    user3,
    user4,
  ]);
}

function seedRestaurantData() {
  return Restaurant.insertMany([
    rest1,
    rest2,
    rest3,
    rest4,
  ]);
}

function seedMenuItemData() {
  return MenuItem.insertMany([
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
        startTime: new Date('2019-11-14T19:00:00.000Z'),
        endTime: new Date('2019-11-14T22:00:00.000Z'),
        menuItems: [item1.id, item2.id, item3.id],
      },

      {
        restaurant: rest2.id,
        startTime: new Date('2019-11-14T19:00:00.000Z'),
        endTime: new Date('2019-11-14T22:00:00.000Z'),
        menuItems: [item4.id, item5.id, item6.id],
      },

      {
        restaurant: rest2.id,
        startTime: new Date('2019-11-14T15:00:00.000Z'),
        endTime: new Date('2019-11-14T17:00:00.000Z'),
        menuItems: [item7.id, item8.id, item9.id],
      },
    ],
  );
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('CRUD API Endpoints works correctly', () => {
  beforeAll(() => runServer(TEST_DB_URI));

  beforeEach(() => seedMenuItemData());

  afterEach(() => tearDownDb());

  afterAll(() => closeServer());

  describe('GET Endpoint', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/menuitems');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(9);
      // console.log(res.body);
    });
  });

  describe('POST Endpoint', () => {
    it('should return 200 and add entry', async () => {
      const res = await request(app).post('/api/menuitems').send({ name: 'new item', _id: '100' });
      expect(res.status).toBe(200);
      const menuItems = await MenuItem.find();
      expect(menuItems).toHaveLength(10);
    });
  });

  describe('POST Review', () => {
    it('should update the corresponding MenuItem rating', async () => {
      await User.create({ name: 'NewUser' });
      const users = await User.find();
      console.log(users);
      const res = await request(app).post('/api/reviews').send({ menuItem: '0', author: users[0]._id, rating: 5 });
      expect(res.status).toBe(200);
      const menuItem = await MenuItem.find({ _id: '0' });
      expect(menuItem[0].rating).toBe(5);
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
      const res = await request(app).delete('/api/menuitems').send({ _id: '0' });
      expect(res.status).toBe(200);
      const menuItems = await MenuItem.find();
      expect(menuItems).toHaveLength(8);
    });
  });
});


describe('Recommendations API works correctly', () => {
  beforeAll(() => runServer(TEST_DB_URI));

  beforeEach(() => Promise.all([
    seedMenuItemData(),
    seedMenuData(),
    seedUserData(),
    seedRestaurantData(),
  ]));

  afterEach(() => tearDownDb());

  afterAll(() => closeServer());


  describe('Get Recommendations Test 1: Trivial time filtering', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/recommendations?date=2019-11-14T11:30-0800');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(6);
    });
  });

  describe('Get Recommendations Test 2: Trivial time filtering', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/recommendations?date=2019-11-14T08:30&userId=EmptyUser');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
    });
  });

  describe('Get Recommendations 3: Edge start time filtering', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/recommendations?date=2019-11-14T07:00&userId=EmptyUser');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
    });
  });

  describe('Get Recommendations 4: Edge edge morning time filtering', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/recommendations?date=2019-11-14T09:00&userId=EmptyUser');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
    });
  });

  describe('GET Endpoint Test 4: Edge edge lunch time filtering', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/recommendations?date=2019-11-14T14:00&userId=EmptyUser');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(6);
    });
  });

  describe('GET Endpoint Test 5: Unavailable time filtering', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/recommendations?date=2019-11-14T02:00&userId=EmptyUser');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('Get Recommendations 6: Breakfast egg restriction', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/recommendations?date=2019-11-14T09:00&userId=Mufasa');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

});
