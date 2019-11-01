// app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const menuItemsRoute = require('./routes/api/menuItems');

const dbString = process.env.MONGODB_URI || require('./config/keys').mongoURI; // eslint-disable-line global-require

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/menuItems', menuItemsRoute);
app.use(express.static(path.join(__dirname, 'client', 'build')));


mongoose.connect(dbString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(`DB Connection Error: ${err}`));


app.get('/hello', (req, res) => res.send('Hello world!'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
