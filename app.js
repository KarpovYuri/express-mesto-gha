const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post(
  '/signup',
  // celebrate({
  //   body: Joi.object().keys({
  //     // email: Joi.string().required().email(),
  //     // password: Joi.string().required().min(8),
  //     // name: Joi.string().min(2).max(30),
  //     // about: Joi.string().min(2).max(30),
  //     // avatar: Joi.string().custom(validationForLink),
  //   }),
  // }),
  createUser,
);

app.use(auth);

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

app.listen(PORT, () => { });
