const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new Error('Authorization required');
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'secret');
  } catch (err) {
    if (err.message === 'Authorization required') {
      res.status(401).send({ message: 'Необходима авторизация' });
    }
  }
  req.user = payload;
  next();
};

module.exports = auth;
