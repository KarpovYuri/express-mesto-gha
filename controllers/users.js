const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

// Создание пользоателя
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
          } else {
            res.status(500).send({ message: 'Ошибка по умолчанию' });
          }
        });
    });
};

// Получить данные о пользователе
const getUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

// Получить данные пользователя по id
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при поиске пользователя' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

// Обновление пользователя
const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

// Обновление аватара
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

// Вход пользователя
const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.send({ message: 'Вход выполнен успешно' });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(401).send({ message: 'Неверный логин или пароль' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

// Экспорт модулей
module.exports = {
  getUsers,
  getUser,
  createUser,
  getUserById,
  updateUser,
  updateAvatar,
  login,
};
