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
    const { productId } = req.body;

    const product = db.data.products.find(p => p.id === Number(productId));
    if (!product) return res.status(404).json({ error: '商品不存在' });
    if (product.user_id === decoded.id) return res.status(400).json({ error: '不能购买自己的商品' });

    const id = db.data.orders.length + 1;
    const order = {
      id,
      buyer_id: decoded.id,
      seller_id: product.user_id,
      product_id: Number(productId),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    db.data.orders.push(order);

    product.status = 'sold';
    db.write();

    res.json({ id, message: '订单创建成功' });
  } catch (e) {
    res.status(401).json({ error: 'token无效' });
  }
});

router.get('/my', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未登录' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const orders = db.data.orders
      .filter(o => o.buyer_id === decoded.id || o.seller_id === decoded.id)
      .map(o => {
        const product = db.data.products.find(p => p.id === o.product_id);
        const buyer = db.data.users.find(u => u.id === o.buyer_id);
        const seller = db.data.users.find(u => u.id === o.seller_id);
        return {
          ...o,
          title: product?.title || '',
          price: product?.price || 0,
          images: product?.images || '',
          buyer_name: buyer?.nickname || '',
          seller_name: seller?.nickname || ''
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(orders);
  } catch (e) {
    res.status(401).json({ error: 'token无效' });
  }
});

router.put('/:id/status', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未登录' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { status } = req.body;
    const { id } = req.params;

    const order = db.data.orders.find(o => o.id === Number(id));
    if (!order) return res.status(404).json({ error: '订单不存在' });

    if (order.buyer_id !== decoded.id && order.seller_id !== decoded.id) {
      return res.status(403).json({ error: '无权操作此订单' });
    }

    order.status = status;
    db.write();
    res.json({ message: '订单状态更新成功' });
  } catch (e) {
    res.status(401).json({ error: 'token无效' });
  }
});

module.exports = router;
