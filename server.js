// app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const menuItemsRoute = require('./routes/api/menuItems');

const PORT = process.env.PORT || 8080;


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));


app.use('/api/menuItems', menuItemsRoute);
app.get('/hello', (req, res) => res.send('Hello world!'));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// old code
/*
mongoose.connect(dbString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(`DB Connection Error: ${err}`));

app.listen(port, () => console.log(`Server running on port ${port}`));
*/


// adapted from https://www.johnvincent.io/mongo/mongoose-integration-testing/
let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
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
  const DB_URI = process.env.MONGODB_URI || require('./config/keys').mongoURI; // eslint-disable-line
  runServer(DB_URI).catch((err) => console.error(err));
}

module.exports = { app, runServer, closeServer };
