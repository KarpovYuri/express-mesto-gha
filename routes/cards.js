const cardRouter = require('express').Router();
const { getCards, deleteCardById, createCard } = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.get('/cards/:cardId', deleteCardById);
cardRouter.post('/cards', createCard);

module.exports = cardRouter;
