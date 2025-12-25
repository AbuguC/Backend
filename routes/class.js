const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Class = require('../models/Class');

// CREATE CLASS
router.post('/', auth, async (req, res) => {
  const { name, memberIds} = req.body;

  try {
    const cls = new Class({
      name,
      rep: req.user.id,
      members: memberIds,
    });

    await cls.save();
    res.json(cls);

  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// LIST ALL CLASSES (user sees only ones they belong to)
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const classes = await Class.find({
      $or: [
        { rep: userId },
        { members: userId }
      ]
    })
    .populate('rep', 'name email')
    .populate('members', 'name email');

    res.json(classes);

  } catch (err) {
    res.status(500).send('Server error');
  }
});

// GET CLASS DETAILS
router.get('/:id', auth, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id)
      .populate('rep', 'name email')
      .populate('members', 'name email');

    if (!cls) return res.status(404).json({ msg: 'Class not found' });

    res.json(cls);

  } catch (err) {
    res.status(500).send('Server error');
  }
});



module.exports = router;
