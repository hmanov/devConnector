const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

//@route GET api/profile/me
//@desc  Get current user profile
//access Private
const serverError = (err, res) => {
  console.error(err.message);
  res.status(500).send('Server Error');
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
    serverError(error, res);
  }
});
//@route POST api/profile
//@ desc Create or Update user profile
//access Private

router.post(
  '/',

  auth,
  [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
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

    profileFields.skills =
      typeof req.body.skills === 'string' ? req.body.skills.split(/[,\W]+/g) : req.body.skills;

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
      serverError(error, res);
    }
  }
);

//@route GET api/profile
//@desc  Get all profiles
//@access Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    res.json(profiles);
  } catch (error) {
    serverError(error, res);
  }
});
//@route GET api/profile/user/user_id
//@desc  Get user profile
//@access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const id = req.params.user_id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'There is no profile with this user' });
    }

    const profile = await Profile.findOne({ user: id }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile with this user' });
    }
    res.json(profile);
  } catch (error) {
    serverError(error, res);
  }
});
//@route DELETE api/profile/
//@desc  Get user profile
//@access Public
router.delete('/', auth, async (req, res) => {
  await Post.deleteMany({ user: req.user.id });
  //Remove profile
  await Profile.findOneAndRemove({ user: req.user.id });
  //Remove user
  await User.findOneAndRemove({ _id: req.user.id });
  res.json({ msg: 'User deleted' });
});

//@route POST api/profile
//@ desc edit experience
//access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newExp = {};
    Object.entries(req.body).map(([field, value]) =>
      field !== '_id' ? (newExp[field] = value) : ''
    );
    try {
      const profile = await Profile.findOneAndUpdate({ user: req.user.id });
      const updated = [...profile.experience, req.body];
      profile.experience = updated;
      await profile.save();
      return res.json(profile);
    } catch (error) {
      serverError(error, res);
    }
  }
);

router.delete('/experience', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const profile = await Profile.findOneAndUpdate({ user: req.user.id });
    const updated = profile.experience.filter((e) => e._id != req.body.id);

    profile.experience = updated;
    await profile.save();

    return res.status(200).json(profile);
  } catch (error) {
    serverError(error, res);
  }
});
router.post(
  '/education',
  [
    auth,
    [
      check('school', 'Title is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study  is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newExp = {};
    Object.entries(req.body).map(([field, value]) => (newExp[field] = value));
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newExp);
      await profile.save();
      return res.json(profile);
    } catch (error) {
      serverError(error, res);
    }
  }
);
//@route POST api/profile
//@ desc edit education
//access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'Title is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study  is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newExp = {};
    Object.entries(req.body).map(([field, value]) =>
      field !== '_id' ? (newExp[field] = value) : ''
    );
    try {
      const profile = await Profile.findOneAndUpdate({ user: req.user.id });
      const updated = profile.education.map((e) => (e._id == req.body._id ? req.body : e));
      profile.education = updated;
      await profile.save();
      return res.json(profile);
    } catch (error) {
      serverError(error, res);
    }
  }
);

router.delete('/education', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const profile = await Profile.findOneAndUpdate({ user: req.user.id });
    const updated = profile.education.filter((e) => e._id != req.body.id);
    profile.education = updated;
    await profile.save();
    return res.status(200).json(profile);
  } catch (error) {
    serverError(error, res);
  }
});

//@route Get api/profile/github
//@ desc get repos
//access Public
router.post('/github', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.body.username}/repos?per_page=5&sort=created:asc`,
      method: 'GET',
      headers: {
        'user-agent': 'node.js',
        auth: {
          user: 'username',
          password: 'token',
        },
      },
    };
    request(options, (err, response, body) => {
      if (err) {
        console.error(err);
      }

      if (JSON.parse(body).length === 0) {
        return res.status(404).json({ msg: 'No github profile found' });
      }
      res.json(JSON.parse(body));
    });
  } catch (error) {
    serverError(error, res);
  }
});
module.exports = router;
