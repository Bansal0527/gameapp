const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if(!username|| !password) {
  return res.status(500).json({
    success: false,
    message: "All Fields are required",
  })
  }

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username,
      password
    });

    await user.save();

    // const payload = {
    //   user: {
    //     id: user._id
    //   }
    // };

    // jwt.sign(
    //   payload,
    //   process.env.JWT_SECRET || 'your_jwt_secret',
    //   { expiresIn: 3600 },
    //   (err, token) => {
    //     if (err) throw err;
    //     res.json({ token, user: { id: user.id, username: user.username } });
    //   }
    // );

     res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    })

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
  }
});


// login

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: "24h" },
    );

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: `User Login Success`,
    })

  } catch (err) {
    console.error(err.message);
    return res.status(401).json({
      success: false,
      message: `Password is incorrect`,
    })
  }
});



// user 
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;