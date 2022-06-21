const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.send({ message: 'Произошла ошибка' }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => res.status(404).send({ message: 'Пользователь по указанному _id не найден' }))
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((users) => res.send(users))
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateAvatar,
};
