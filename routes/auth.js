const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// SIGNUP
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Email exists' });

    const hashed = await bcrypt.hash(password, 10);

    user = new User({
      name, email, password: hashed, role
    });

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, 'jwtSecretKey123', { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });


    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, 'jwtSecretKey123', { expiresIn: '7d' });

    res.json({ token });

  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// GET ALL USERS
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
