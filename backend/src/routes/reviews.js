const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, (req, res) => {
  try {
    const { orderId, rating, content } = req.body;

    const orders = db.get('orders').value() || [];
    const order = orders.find(o => o.id === Number(orderId));
    if (!order) return res.status(404).json({ error: '订单不存在' });

    if (order.buyer_id !== req.user.id && order.seller_id !== req.user.id) {
      return res.status(403).json({ error: '无权评价此订单' });
    }

    const actualToUserId = order.buyer_id === req.user.id ? order.seller_id : order.buyer_id;

    const reviews = db.get('reviews').value() || [];
    const id = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
    const review = {
      id,
      order_id: Number(orderId),
      from_user_id: req.user.id,
      to_user_id: actualToUserId,
      rating: Number(rating),
      content: content || '',
      created_at: new Date().toISOString()
    };
    db.get('reviews').push(review).write();

    const users = db.get('users').value() || [];
    const userReviews = reviews.filter(r => r.to_user_id === actualToUserId);
    if (userReviews.length > 0) {
      const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
      db.get('users').find({ id: actualToUserId }).assign({ credit_score: Math.round(avgRating * 20) }).write();
    }

    res.json({ id, message: '评价成功' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const reviews = db.get('reviews').value() || [];
  const users = db.get('users').value() || [];

  const userReviews = reviews
    .filter(r => r.to_user_id === Number(userId))
    .map(r => {
      const fromUser = users.find(u => u.id === r.from_user_id);
      return { ...r, from_user_name: fromUser?.nickname || '' };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(userReviews);
});

module.exports = router;
