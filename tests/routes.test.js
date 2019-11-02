const request = require('supertest');
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const { app, runServer, closeServer } = require('../server');
const TEST_DB_URI = process.env.MONGODB_TEST_URI || require('../config/keys').mongoTestURI; // eslint-disable-line

function seedMenuItemData() {
  console.log(MenuItem);
  return MenuItem.insertMany([{ name: 'combo' }]);
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

  describe('GET Endpoints', () => {
    it('should return 200', async () => {
      const res = await request(app).get('/api/menuitems');
      expect(res.status).toBe(200);
    });
  });
});