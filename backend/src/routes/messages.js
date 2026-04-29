const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.get('/conversations', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未登录' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const userMessages = db.data.messages.filter(
      m => m.from_user_id === userId || m.to_user_id === userId
    );

    const conversations = {};
    userMessages.forEach(m => {
      const otherUserId = m.from_user_id === userId ? m.to_user_id : m.from_user_id;
      if (!conversations[otherUserId] || new Date(m.created_at) > new Date(conversations[otherUserId].last_message_time)) {
        const otherUser = db.data.users.find(u => u.id === otherUserId);
        const product = m.product_id ? db.data.products.find(p => p.id === m.product_id) : null;
        conversations[otherUserId] = {
          other_user_id: otherUserId,
          other_user_name: otherUser?.nickname || '未知用户',
          product_title: product?.title || '',
          last_message: m.content,
          last_message_time: m.created_at
        };
      }
    });

    const result = Object.values(conversations)
      .sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
    res.json(result);
  } catch (e) {
    res.status(401).json({ error: 'token无效' });
  }
});

router.get('/conversation/:userId', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未登录' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { userId: otherUserId } = req.params;
    const userId = decoded.id;

    db.data.messages.forEach(m => {
      if (m.from_user_id === Number(otherUserId) && m.to_user_id === userId) {
        m.is_read = 1;
      }
    });
    db.write();

    const messages = db.data.messages
      .filter(m =>
        (m.from_user_id === userId && m.to_user_id === Number(otherUserId)) ||
        (m.from_user_id === Number(otherUserId) && m.to_user_id === userId)
      )
      .map(m => {
        const fromUser = db.data.users.find(u => u.id === m.from_user_id);
        const toUser = db.data.users.find(u => u.id === m.to_user_id);
        return {
          ...m,
          from_user_name: fromUser?.nickname || '',
          to_user_name: toUser?.nickname || ''
        };
      })
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    res.json(messages);
  } catch (e) {
    res.status(401).json({ error: 'token无效' });
  }
});

router.post('/', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未登录' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { toUserId, productId, content } = req.body;

    const id = db.data.messages.length + 1;
    const message = {
      id,
      from_user_id: decoded.id,
      to_user_id: Number(toUserId),
      product_id: productId ? Number(productId) : null,
      content,
      is_read: 0,
      created_at: new Date().toISOString()
    };
    db.data.messages.push(message);
    db.write();

    res.json({ id, message: '消息发送成功' });
  } catch (e) {
    res.status(401).json({ error: 'token无效' });
  }
});

module.exports = router;
