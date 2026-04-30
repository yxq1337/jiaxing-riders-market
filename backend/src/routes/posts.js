const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', (req, res) => {
  const { section, page = 1, limit = 20 } = req.query;
  const start = (page - 1) * limit;

  let posts = db.get('posts').value();
  if (!posts) posts = [];

  if (section && section !== '首页') {
    posts = posts.filter(p => p.section === section);
  }

  posts = posts
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(start, start + parseInt(limit));

  res.json(posts);
});

router.get('/:id', (req, res) => {
  const post = db.get('posts').find({ id: parseInt(req.params.id) }).value();
  if (!post) return res.status(404).json({ error: '帖子不存在' });

  const replies = db.get('postReplies').filter({ post_id: post.id }).value() || [];

  res.json({
    post,
    replies: replies.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  });
});

router.post('/', authenticateToken, (req, res) => {
  const { title, content, section, images, location } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: '标题和内容不能为空' });
  }

  const posts = db.get('posts').value() || [];
  const id = posts.length > 0
    ? Math.max(...posts.map(p => p.id)) + 1
    : 1;

  const users = db.get('users').value() || [];
  const author = users.find(u => u.id === req.user.id);

  const post = {
    id,
    user_id: req.user.id,
    title,
    content,
    section: section || '闲聊灌水',
    images: images || '',
    location: location || '',
    authorName: author?.nickname || author?.phone || '匿名',
    likes: 0,
    replies_count: 0,
    created_at: new Date().toISOString()
  };

  db.get('posts').push(post).write();
  res.json({ id, message: '发布成功' });
});

router.post('/:id/like', authenticateToken, (req, res) => {
  const post = db.get('posts').find({ id: parseInt(req.params.id) }).value();
  if (!post) return res.status(404).json({ error: '帖子不存在' });

  const newLikes = (post.likes || 0) + 1;
  db.get('posts').find({ id: parseInt(req.params.id) }).assign({ likes: newLikes }).write();

  res.json({ success: true, likes: newLikes });
});

router.post('/:id/reply', authenticateToken, (req, res) => {
  const postId = parseInt(req.params.id);
  const post = db.get('posts').find({ id: postId }).value();
  if (!post) return res.status(404).json({ error: '帖子不存在' });

  const { content } = req.body;
  if (!content) return res.status(400).json({ error: '回复内容不能为空' });

  const replies = db.get('postReplies').value() || [];
  const replyId = replies.length > 0
    ? Math.max(...replies.map(r => r.id)) + 1
    : 1;

  const users = db.get('users').value() || [];
  const author = users.find(u => u.id === req.user.id);

  const reply = {
    id: replyId,
    post_id: postId,
    user_id: req.user.id,
    authorName: author?.nickname || author?.phone || '匿名',
    content,
    likes: 0,
    created_at: new Date().toISOString()
  };

  db.get('postReplies').push(reply).write();

  const newRepliesCount = (post.replies_count || 0) + 1;
  db.get('posts').find({ id: postId }).assign({ replies_count: newRepliesCount }).write();

  res.json({ message: '回复成功' });
});

module.exports = router;
