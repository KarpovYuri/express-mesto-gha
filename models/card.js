const mongoose = require('mongoose');

// Опишем схему:
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: String,
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
