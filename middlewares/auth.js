const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  return next();
};

module.exports = auth;
