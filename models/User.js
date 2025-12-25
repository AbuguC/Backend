const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: { type: String, enum: ['student', 'rep'], default: 'student' },

  deviceIP: { type: String } // used for login-binding later if needed
});

module.exports = mongoose.model('User', UserSchema);
