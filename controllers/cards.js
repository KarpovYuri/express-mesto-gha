const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

const deleteCardById = (req, res) => {
  const { userId } = req.params;
  Card.findByIdAndRemove(userId)
    .then((card) => {
      res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
};
