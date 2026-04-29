const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未登录' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'token无效' });
  }
};

router.get('/', async (req, res) => {
  const { section, page = 1, limit = 20 } = req.query;
  const start = (page - 1) * limit;

  let posts = [...db.data.posts];
  if (section && section !== '首页') {
    posts = posts.filter(p => p.section === section);
  }

  posts = posts
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(start, start + parseInt(limit));

  const postsWithUsers = posts.map(post => {
    const author = db.data.users.find(u => u.id === post.user_id);
    return {
      ...post,
      author: author ? {
        id: author.id,
        nickname: author.nickname,
        phone: author.phone,
        credit_score: author.credit_score
      } : null
    };
  });

  res.json(postsWithUsers);
});

router.get('/:id', async (req, res) => {
  const post = db.data.posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: '帖子不存在' });

  const author = db.data.users.find(u => u.id === post.user_id);

  const replies = db.data.postReplies
    .filter(r => r.post_id === post.id)
    .map(reply => {
      const replyAuthor = db.data.users.find(u => u.id === reply.user_id);
      return {
        ...reply,
        author: replyAuthor ? {
          id: replyAuthor.id,
          nickname: replyAuthor.nickname
        } : null
      };
    });

  res.json({
    post: {
      ...post,
      author: author ? {
        id: author.id,
        nickname: author.nickname,
        phone: author.phone,
        credit_score: author.credit_score
      } : null
    },
    replies
  });
});

router.post('/', authenticate, async (req, res) => {
  const { title, content, section, images = '', location = '' } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: '标题和内容不能为空' });
  }

  const id = db.data.posts.length > 0
    ? Math.max(...db.data.posts.map(p => p.id)) + 1
    : 1;

  const post = {
    id,
    user_id: req.user.id,
    title,
    content,
    section: section || '闲聊灌水',
    images,
    location,
    likes: 0,
    replies_count: 0,
    stars: 0,
    created_at: new Date().toISOString()
  };

  db.data.posts.push(post);
  await db.write();

  const author = db.data.users.find(u => u.id === req.user.id);
  res.json({
    ...post,
    author: author ? {
      id: author.id,
      nickname: author.nickname
    } : null
  });
});

router.post('/:id/like', authenticate, async (req, res) => {
  const post = db.data.posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: '帖子不存在' });

  post.likes = (post.likes || 0) + 1;
  await db.write();

  res.json({ success: true, likes: post.likes });
});

router.post('/:id/reply', authenticate, async (req, res) => {
  const post = db.data.posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: '帖子不存在' });

  const { content } = req.body;
  if (!content) return res.status(400).json({ error: '回复内容不能为空' });

  const replyId = db.data.postReplies.length > 0
    ? Math.max(...db.data.postReplies.map(r => r.id)) + 1
    : 1;

  const reply = {
    id: replyId,
    post_id: post.id,
    user_id: req.user.id,
    content,
    likes: 0,
    created_at: new Date().toISOString()
  };

  db.data.postReplies.push(reply);
  post.replies_count = (post.replies_count || 0) + 1;
  await db.write();

  const author = db.data.users.find(u => u.id === req.user.id);
  res.json({
    ...reply,
    author: author ? {
      id: author.id,
      nickname: author.nickname
    } : null
  });
});

module.exports = router;
