const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/users');

const {
  getUsers,
  createUser,
  getUserById,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', routes);

app.listen(PORT, () => { });
