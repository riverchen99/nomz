// app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");


const menuItems = require("./routes/api/menuItems");


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/menuItems", menuItems)


const db = require("./config/keys").mongoURI;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => console.log("MongoDB successfully connected"))
		.catch(err => console.log(`DB Connection Error: ${err}`));



app.get('/', (req, res) => res.send('Hello world!'));





const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));