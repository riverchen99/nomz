// app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const apiRoutes = require('./routes/api/routes');
const scraper = require('./scraper/scraper');

const PORT = process.env.PORT || 8080;

let DB_URI;
try {
  const keys = require('./config/keys'); // eslint-disable-line
  DB_URI = keys.mongoURI;
} catch (ex) {
  DB_URI = process.env.MONGODB_URI;
}

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use('/docs', express.static('docs'));

app.use('/api', apiRoutes);
app.get('/hello', (req, res) => res.send('Hello world!'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.post('/updateMenu', (req, res) => {
  if (req.body.date === undefined) {
    res.send('Date required.');
  } else {
    scraper.updateMenu(req.body.date).then(() => res.send(`Updated menu for ${req.body.date}`));
  }
});

// app.post('/createRestaurants', (req, res) => scraper.createBlankRestaurants());

// old code
/*
mongoose.connect(dbString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(`DB Connection Error: ${err}`));

app.listen(port, () => console.log(`Server running on port ${port}`));
*/


// adapted from https://www.johnvincent.io/mongo/mongoose-integration-testing/
let server;

function runServer(databaseUrl = DB_URI, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }, (err) => {
      if (err) {
        reject(err);
        return;
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', (serverErr) => {
          mongoose.disconnect();
          reject(serverErr);
        });
    });
  });
}


function closeServer() {
  return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  }));
}

if (require.main === module) {
  runServer().catch((err) => console.error(err));
}

module.exports = { app, runServer, closeServer };
