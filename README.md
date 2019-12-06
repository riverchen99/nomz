[![Build Status](https://travis-ci.org/riverchen99/nomz.svg?branch=master)](https://travis-ci.org/riverchen99/nomz)
# nomz
CS 130 Capstone Project

### Problem:
UCLA Dining offers an abundant variety of cuisines and new dishes are offered every quarter. Some items are well-known favorites (lamb chops @BPlate) while others are undiscovered gems. Incoming freshmen or guests may be overwhelmed by the choices offered, and busy students may not always have the time to dig through the menus in detail. 

### Solution:
Nomz is an all-in-one solution for hungry UCLA students and staff who want to find the best dishes for them. Comprised of a chrome extension and a web application, it offers easy access to view star ratings and reviews on individual menu items served in dining halls. In addition, Nomz has an algorithm that can generate personalized recommendations for logged-in users to try next if they're looking for something new. Users are encouraged to leave reviews and ratings so everyone can find their own comfort food away from home. :) 

### Instructions for set-up

To run locally, you need a config/keys.js file. We commit it here for convenience (in practice, we should not track this file in version control).   
Start backend with "npm run server" from root.  
Start frontend with "npm start" from /client.  
Lint/run tests with "npm run test" from root.  
Generate documentation with "npm run docs" from root. 
Additionally, documentation can be found at https://cs130-nomz.herokuapp.com/docs . 
Drag and drop extension.crx into a chrome window to install the extension.

### Folder Structure:

    .
    ├── client                  # Client-side code & frontend
        ├── public
        ├── src                 # all react components & images
    ├── config                  # Config
    ├── controllers             # All controller code / recommendations 
    ├── extension               # Code for chrome extension
        ├── img 
        ├── lib 
    ├── models                  # Models / classes 
    ├── routes                  # API routes
    ├── scraper                 # Code for web scraper that populates the MongoDB database
        ├── __mocks__
    ├── tests                   # Tests for backend
        ├── cached_pages
        ├── scraper_data
    └── README.md

### Deployment:

Deployed at https://cs130-nomz.herokuapp.com/

### Team:
Chuan Chen @riverchen99
Vivian Doan @vvndn
Ben Limpanukorn @benlimpa
Samiha Rahman @samihar
Grace Yu @grace-y728
