const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

router.get('/conversations', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const messages = db.get('messages').value() || [];
    const users = db.get('users').value() || [];
    const products = db.get('products').value() || [];

    const userMessages = messages.filter(
      m => m.from_user_id === userId || m.to_user_id === userId
    );

    const conversations = {};
    userMessages.forEach(m => {
      const otherUserId = m.from_user_id === userId ? m.to_user_id : m.from_user_id;
      if (!conversations[otherUserId] || new Date(m.created_at) > new Date(conversations[otherUserId].last_message_time)) {
        const otherUser = users.find(u => u.id === otherUserId);
        const product = m.product_id ? products.find(p => p.id === m.product_id) : null;
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
    console.error(e);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/conversation/:userId', authenticateToken, (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const userId = req.user.id;
    const messages = db.get('messages').value() || [];
    const users = db.get('users').value() || [];

    messages.forEach(m => {
      if (m.from_user_id === Number(otherUserId) && m.to_user_id === userId) {
        db.get('messages').find({ id: m.id }).assign({ is_read: 1 }).write();
      }
    });

    const conversation = messages
      .filter(m =>
        (m.from_user_id === userId && m.to_user_id === Number(otherUserId)) ||
        (m.from_user_id === Number(otherUserId) && m.to_user_id === userId)
      )
      .map(m => {
        const fromUser = users.find(u => u.id === m.from_user_id);
        const toUser = users.find(u => u.id === m.to_user_id);
        return {
          ...m,
          from_user_name: fromUser?.nickname || '',
          to_user_name: toUser?.nickname || ''
        };
      })
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    res.json(conversation);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const { toUserId, productId, content } = req.body;
    const messages = db.get('messages').value() || [];

    const id = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
    const message = {
      id,
      from_user_id: req.user.id,
      to_user_id: Number(toUserId),
      product_id: productId ? Number(productId) : null,
      content,
      is_read: 0,
      created_at: new Date().toISOString()
    };
    db.get('messages').push(message).write();

    res.json({ id, message: '消息发送成功' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
