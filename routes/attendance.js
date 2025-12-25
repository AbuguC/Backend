const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Class = require('../models/Class');

// REP CREATES ATTENDANCE
router.post('/create', auth, async (req, res) => {
  const { classId, code } = req.body;

  try {
    const expiresAt = new Date(Date.now() + 60000); // 60 seconds

    const att = new Attendance({
      class: classId,
      code,
      expiresAt
    });

    await att.save();
    res.json(att);

  } catch (err) {
    res.status(500).send('Server error');
  }
});

// STUDENT TICKS ATTENDANCE
router.post('/tick', auth, async (req, res) => {
  const { classId, code, location } = req.body;

  try {
    const att = await Attendance.findOne({
      class: classId,
      code
    });

    if (!att) return res.status(400).json({ msg: 'Invalid code' });

    if (new Date() > att.expiresAt)
      return res.status(400).json({ msg: 'Attendance closed' });

    // distance measure
    const cls = await Class.findById(classId);
    const R = 6371000; 
    const toRad = deg => (deg * Math.PI) / 180;

    const dLat = toRad(location.lat - cls.location.lat);
    const dLng = toRad(location.lng - cls.location.lng);

    const a =
      Math.sin(dLat/2)**2 +
      Math.cos(toRad(cls.location.lat)) *
      Math.cos(toRad(location.lat)) *
      Math.sin(dLng/2)**2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    att.attendees.push({
      student: req.user.id,
      location: {
        lat: location.lat,
        lng: location.lng,
        distance
      }
    });

    await att.save();

    res.json({ msg: 'Attendance marked', distance });

  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// GET ALL ATTENDANCE RECORDS FOR A CLASS
router.get('/class/:classId', auth, async (req, res) => {
  try {
    const att = await Attendance.find({ class: req.params.classId })
      .populate('attendees.student', 'name email');

    res.json(att);

  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
