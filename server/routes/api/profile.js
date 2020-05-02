const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

//@route GET api/profile/me
//@desc  Get current user profile
//access Private
const serverError = (err) => {
  console.err(err.message);
  res.send(500).send('Server Error');
};

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
      'name',
      'avatar',
    ]);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (error) {
    serverError(error);
  }
});
//@route POST api/profile
//@ desc Create or Update user profile
//access Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const profileFields = {};
    profileFields.social = {};
    const { facebook, twitter, linkedin, youtube } = req.body;
    const social = { facebook, twitter, linkedin, youtube };
    Object.entries(social).map(([key, value]) =>
      value !== undefined ? (profileFields.social[key] = value) : null
    );
    Object.entries(req.body).forEach(([key, value]) => (profileFields[key] = value));

    profileFields.skills = req.body.skills.split(/[,\W]+/gm);

    try {
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      if (profile) {
        return res.json(profile);
      }
      //Create
      profile = new Profile({ user: req.user.id, ...profileFields });
      await profile.save();
      return res.json(profile);
    } catch (error) {
      serverError(error);
    }
  }
);

module.exports = router;
