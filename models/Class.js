const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rep: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  location: {
    lat: Number,
    lng: Number,
  }
});

module.exports = mongoose.model('Class', ClassSchema);
