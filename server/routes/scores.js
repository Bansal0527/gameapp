const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/scores
// @desc    Save user score
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { score } = req.body;
    const user = await User.findById(req.user.id);

    if (score > user.highScore) {
      user.highScore = score;
      await user.save();
    }

    res.json({ msg: 'Score saved successfully', highScore: user.highScore });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/scores/high/:userId
// @desc    Get user's high score
// @access  Private
router.get('/high/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ highScore: user.highScore });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;