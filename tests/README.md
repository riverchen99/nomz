# Test Cases

The test cases for the backend routes are found in routes.test.js. 
Before all tests, we populate a test database with preset data. After every test, the database is dropped. 
CRUD Endpoint Tests:
  - GET endpoint: Query the GET endpoint and check that we received nine MenuItems.
  - POST Endpoint: Query the POST endpoint and add a new MenuItem. Verify that the new item is added (i.e. we have 10 MenuItems after the addition).
  - POST Endpoint: Query the POST endpoint and add a new review. Verify that the corresponding MenuItem's rating has changed. 
  - PUT Endpoint: Query the PUT endpoint and update a MenuItem's description. Verify that the item now has the description.
  - DELETE Endpoint: Query the DELETE endpoint and delete a MenuItem. Verify that the item is deleted (i.e. we have 8 MenuItems after deletion).

Recommendation Endpoint Tests:
 - Test Cases 1, 2: Filter the list of available Menus (and MenuItems) by time.
 - Test Cases 3, 4, 5: Filter the list of available Menus (and MenuItems) by time. Edge cases for start time, and unavailable times.
 - Test Cases 6: Test the dietary restriction filtering functionality. Verify that only two available MenuItems are returned to the user.