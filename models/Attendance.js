const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },

  code: { type: String, required: true },

  expiresAt: { type: Date, required: true },

  attendees: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now },
      location: {
        lat: Number,
        lng: Number,
        distance: Number
      }
    }
  ]
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
