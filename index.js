require('dotenv').config();
const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3010;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.static('static'));


app.use(bodyParser.json());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error("Error connecting to database:", error));

const User = require('./schema');


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});


app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;

   
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Validation error: All fields are required' });
    }

    
    const user = new User({ name, email, password });
    await user.save();



  
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.message });
    }
    
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
