const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum : ['admin', 'user'],
    default: 'user'
  },
});

module.exports = model('User', userSchema);
