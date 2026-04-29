const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, (req, res) => {
  try {
    const { productId } = req.body;

    const products = db.get('products').value() || [];
    const product = products.find(p => p.id === Number(productId));
    if (!product) return res.status(404).json({ error: '商品不存在' });
    if (product.user_id === req.user.id) return res.status(400).json({ error: '不能购买自己的商品' });

    const orders = db.get('orders').value() || [];
    const id = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;

    const order = {
      id,
      buyer_id: req.user.id,
      seller_id: product.user_id,
      product_id: Number(productId),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    db.get('orders').push(order).write();

    db.get('products').find({ id: Number(productId) }).assign({ status: 'sold' }).write();

    res.json({ id, message: '订单创建成功' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/my', authenticateToken, (req, res) => {
  try {
    const orders = db.get('orders').value() || [];
    const products = db.get('products').value() || [];
    const users = db.get('users').value() || [];

    const myOrders = orders
      .filter(o => o.buyer_id === req.user.id || o.seller_id === req.user.id)
      .map(o => {
        const product = products.find(p => p.id === o.product_id);
        const buyer = users.find(u => u.id === o.buyer_id);
        const seller = users.find(u => u.id === o.seller_id);
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
    res.json(myOrders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.put('/:id/status', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = db.get('orders').find({ id: Number(id) }).value();
    if (!order) return res.status(404).json({ error: '订单不存在' });

    if (order.buyer_id !== req.user.id && order.seller_id !== req.user.id) {
      return res.status(403).json({ error: '无权操作此订单' });
    }

    db.get('orders').find({ id: Number(id) }).assign({ status }).write();
    res.json({ message: '订单状态更新成功' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
