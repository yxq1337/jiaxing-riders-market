const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未登录' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { orderId, rating, content } = req.body;

    const order = db.data.orders.find(o => o.id === Number(orderId));
    if (!order) return res.status(404).json({ error: '订单不存在' });

    if (order.buyer_id !== decoded.id && order.seller_id !== decoded.id) {
      return res.status(403).json({ error: '无权评价此订单' });
    }

    const actualToUserId = order.buyer_id === decoded.id ? order.seller_id : order.buyer_id;

    const id = db.data.reviews.length + 1;
    const review = {
      id,
      order_id: Number(orderId),
      from_user_id: decoded.id,
      to_user_id: actualToUserId,
      rating: Number(rating),
      content: content || '',
      created_at: new Date().toISOString()
    };
    db.data.reviews.push(review);

    const userReviews = db.data.reviews.filter(r => r.to_user_id === actualToUserId);
    if (userReviews.length > 0) {
      const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
      const user = db.data.users.find(u => u.id === actualToUserId);
      if (user) {
        user.credit_score = Math.round(avgRating * 20);
      }
    }
    db.write();

    res.json({ id, message: '评价成功' });
  } catch (e) {
    res.status(401).json({ error: 'token无效' });
  }
});

router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  const reviews = db.data.reviews
    .filter(r => r.to_user_id === Number(userId))
    .map(r => {
      const fromUser = db.data.users.find(u => u.id === r.from_user_id);
      return { ...r, from_user_name: fromUser?.nickname || '' };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(reviews);
});

module.exports = router;
