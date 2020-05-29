const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Post = require('../../models/Post');

const serverError = (err, res) => {
  console.error(err.message);
  res.status(500).send('Server Error');
};
//@route post api/posts
//@desc  Create Post
//@access private

router.post(
  '/',
  auth,
  [check('text', 'Post text is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      const post = new Post(newPost);
      await post.save();
      return res.json(post);
    } catch (error) {
      serverError(error);
    }
  }
);
router.delete('/', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.body._id);

    if (req.user.id !== post.user.toString()) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await Post.findByIdAndRemove(req.body._id);
    return res.json({ msg: 'Post removed' });
  } catch (error) {
    serverError(error);
  }
});
// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//@route get api/posts/post
//@desc  get post
//access private

router.post('/post', auth, async (req, res) => {
  try {
    const id = req.body._id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'There is no profile with this user' });
    }
    const posts = await Post.findById(req.body._id);
    if (!posts) {
      res.status(404).json({ msg: 'Post Not Found' });
    }
    res.json(posts);
  } catch (error) {
    serverError(error, res);
  }
});
//@route get api/posts/post
//@desc  get post
//access private

router.delete('/post', auth, async (req, res) => {
  try {
    if (req.body.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await Post.findByIdAndRemove(req.body._id);
    res.json({ msg: 'Post deleted' });
  } catch (error) {
    serverError(error, res);
  }
});
//@ route PUT api/posts/likes
//@ desc Like a post
//@ access Private

router.put('/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.body._id);

    const isAlreadyLiked =
      post.likes.filter((like) => like.user.toString() === req.user.id).length > 0;
    if (isAlreadyLiked) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    serverError(error, res);
  }
});
router.put('/unlike', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.body._id);

    const isAlreadyLiked =
      post.likes.filter((like) => like.user.toString() === req.user.id).length > 0;
    if (!isAlreadyLiked) {
      return res.status(400).json({ msg: 'Post not liked' });
    }
    post.likes = post.likes.filter((like) => like.user.toString() !== req.user.id);
    await post.save();
    res.status(201).json({ msg: 'Post Unliked' });
  } catch (error) {
    serverError(error, res);
  }
});

//@route post api/posts/comment
//@desc  Create comment
//@access private

router.post(
  '/comment',
  [auth, [check('text', 'Post text is required').not().isEmpty()]],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.body._id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.push(newComment);
      await post.save();
      return res.json(post.comments);
    } catch (error) {
      serverError(error);
    }
  }
);

//@route delete api/posts/post
//@desc  delete comment
//access private

router.put('/comment', auth, async (req, res) => {
  try {
    if (req.body.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    const post = await Post.findById(req.body._id);

    post.comments.forEach((e, i) => {
      if (e._id.toString() === req.body.commentID) {
        post.comments[i].text = req.body.text;
      }
    });
    await post.save();
    res.json(post.comments);
  } catch (error) {
    serverError(error, res);
  }
});

//@route PUT api/posts/post
//@desc  edit comment
//access private

router.delete('/comment', auth, async (req, res) => {
  try {
    if (req.body.comment.user !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    const post = await Post.findById(req.body.postId);
    post.comments = post.comments.filter((e) => e._id.toString() !== req.body.comment._id);
    post.save();
    res.json({ msg: 'comment deleted' });
  } catch (error) {
    serverError(error, res);
  }
});
module.exports = router;
