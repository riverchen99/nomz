const request = require('supertest');
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Menu = require('../models/Menu');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const Review = require('../models/Review');

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
  _id: '10',
  name: 'combo',
  rating: 3,
  restaurant: rest1.id,
});
const item2 = new MenuItem({
  _id: '12',
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
  rating: 4,
  ingredients: ['eggs'],
  props: { eggs: true },
  restaurant: rest2.id,
});
const item8 = new MenuItem({
  _id: '7',
  name: 'Bacon',
  ingredients: ['Bacon'],
  rating: 4,
  restaurant: rest2.id,
});
const item9 = new MenuItem({
  _id: '8',
  name: 'Breakfast Taco',
  ingredients: ['tortilla', 'avocado', 'beans'],
  rating: 5,
  restaurant: rest2.id,
});
const item10 = new MenuItem({
  _id: '9',
  name: 'Breakfast Taco w/ Eggs',
  ingredients: ['tortilla', 'avocado', 'beans', 'eggs'],
  props: { eggs: true },
  rating: 4,
  restaurant: rest2.id,
});

const user1 = new User({
  name: 'Mufasa',
  preferences: [],
  restrictions: ['eggs'],
  _id: '1',
});

const user2 = new User({
  name: 'Scar',
  preferences: ['vegetarian'],
  restrictions: ['nuts'],
  _id: '2',
});

const user3 = new User({
  name: 'Pumbaa',
  preferences: [],
  restrictions: ['non-grub things'],
  _id: '3',
});

const user4 = new User({
  name: 'EmptyUser',
  preferences: [],
  restrictions: [],
  _id: '4',
});

const user5 = new User({
  name: 'HappyMufasa',
  preferences: [],
  restrictions: ['eggs'],
  _id: '5',
});

const user6 = new User({
  name: 'PickyMufasa',
  preferences: [],
  restrictions: ['eggs'],
  _id: '6',
});

function seedUserData() {
  return User.insertMany([
    user1,
    user2,
    user3,
    user4,
    user5,
    user6,
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
    item10,
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
        menuItems: [item7.id, item8.id, item9.id, item10.id],
      },
    ],
  );
}

function seedReviewData() {
  return Review.insertMany([
    {
      menuItem: item8,
      author: user5,
      rating: 4,
      comment: 'Yum',
    },
    {
      menuItem: item8,
      author: user6,
      rating: 1,
      comment: 'Yuck',
    },
    {
      menuItem: item8,
      author: user4,
      rating: 3,
      comment: 'Meh',
    },
    {
      menuItem: item9,
      author: user4,
      rating: 5,
      comment: 'Yum',
    },
  ]);
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
      expect(res.body).toHaveLength(10);
    });
  });

  describe('POST Endpoint', () => {
    it('should return 200 and add entry', async () => {
      const res = await request(app).post('/api/menuitems').send({ name: 'new item', _id: '100' });
      expect(res.status).toBe(200);
      const menuItems = await MenuItem.find();
      expect(menuItems).toHaveLength(11);
    });
  });

  describe('POST Review', () => {
    it('should update the corresponding MenuItem rating', async () => {
      await User.create({ name: 'NewUser', _id: 'asdf' });
      const users = await User.find();
      console.log(users);
      const res = await request(app).post('/api/reviews').send({ menuItem: '10', author: users[0]._id, rating: 5 });
      expect(res.status).toBe(200);
      const menuItem = await MenuItem.find({ _id: '10' });
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
      const res = await request(app).delete('/api/menuitems').send({ _id: '10' });
      expect(res.status).toBe(200);
      const menuItems = await MenuItem.find();
      expect(menuItems).toHaveLength(9);
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
    seedReviewData(),
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
      const res = await request(app).get('/api/recommendations?date=2019-11-14T08:30-0800');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(4);
    });
  });

  describe('Get Recommendations 3: Edge start time filtering', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/recommendations?date=2019-11-14T07:00-0800');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(4);
    });
  });

  describe('Get Recommendations 4: Edge edge morning time filtering', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/recommendations?date=2019-11-14T09:00-0800');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(4);
    });
  });

  describe('GET Endpoint Test 4: Edge edge lunch time filtering', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/recommendations?date=2019-11-14T14:00-0800');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(6);
    });
  });

  describe('GET Endpoint Test 5: Unavailable time filtering', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/recommendations?date=2019-11-14T02:00-0800');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('Get Recommendations 6: Breakfast egg restriction', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get(`/api/recommendations?date=2019-11-14T09:00-0800&userId=${user1._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('Get Recommendations Test 7: Trivial time filtering for everyone', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get('/api/recommendations?date=2019-11-14T09:00-0800&userId=everyone');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(4);
    });
  });

  describe('Get Recommendations 7: Breakfast egg restriction, Favors lower rated item', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get(`/api/recommendations?date=2019-11-14T09:00-0800&userId=${user5._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      // lower rated item is higher because user likes it more
      const answer = [item8, item9];
      expect(JSON.stringify(res.body, ['_id'])).toBe(JSON.stringify(answer, ['_id']));
    });
  });

  describe('Get Recommendations 8: Breakfast egg restriction, Only reviewed low rated item but disliked it', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get(`/api/recommendations?date=2019-11-14T09:00-0800&userId=${user6._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);

      const answer = [item9, item8];

      expect(JSON.stringify(res.body, ['_id'])).toBe(JSON.stringify(answer, ['_id']));
    });
  });

  describe('Get Recommendations 9: Recommend New Item higher based on Reviews', () => {
    it('should return 200 and nonempty list', async () => {
      const res = await request(app).get(`/api/recommendations?date=2019-11-14T09:00-0800&userId=${user4._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(4);
      const answer = [item9, item10, item8, item7];
      expect(JSON.stringify(res.body, ['_id'])).toBe(JSON.stringify(answer, ['_id']));
    });
  });
});
