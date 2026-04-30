const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', (req, res) => {
  const { category, minPrice, maxPrice, condition: cond, search, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let products = db.get('products').value() || [];
  products = products.filter(p => p.status === 'active');

  if (category) {
    products = products.filter(p => p.category === category);
  }
  if (cond) {
    products = products.filter(p => p.condition === cond);
  }
  if (minPrice) {
    products = products.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    products = products.filter(p => p.price <= Number(maxPrice));
  }
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(p =>
      p.title.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }

  products = products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  products = products.slice(Number(offset), Number(offset) + Number(limit));

  res.json(products);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const product = db.get('products').find({ id: Number(id) }).value();
  if (!product) return res.status(404).json({ error: '商品不存在' });

  const newViewCount = (product.view_count || 0) + 1;
  db.get('products').find({ id: Number(id) }).assign({ view_count: newViewCount }).write();

  res.json({ ...product, view_count: newViewCount });
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, description, price, category, condition, images, location } = req.body;

    if (!title || !price || !category || !condition) {
      return res.status(400).json({ error: '缺少必要信息' });
    }

    const products = db.get('products').value() || [];
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const product = {
      id,
      user_id: req.user.id,
      title,
      description: description || '',
      price: Number(price),
      category,
      condition,
      images: images || '',
      status: 'active',
      view_count: 0,
      location: location || '',
      created_at: new Date().toISOString()
    };

    db.get('products').push(product).write();
    res.json({ id, message: '发布成功' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '发布失败' });
  }
});

router.get('/my/list', authenticateToken, (req, res) => {
  try {
    const products = db.get('products').value() || [];
    const myProducts = products
      .filter(p => p.user_id === req.user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(myProducts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '加载失败' });
  }
});

module.exports = router;
