const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const categories = ['电动车', '头盔', '骑手服', '餐箱', '手机支架', '充电宝', '其他'];
const conditions = ['全新', '几乎全新', '九成新', '七成新', '五成新以下'];

router.get('/', (req, res) => {
  const { category, minPrice, maxPrice, condition: cond, search, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let products = db.data.products.filter(p => p.status === 'active');

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

  products = products.map(p => {
    const seller = db.data.users.find(u => u.id === p.user_id);
    return { ...p, seller_name: seller?.nickname || '未知用户' };
  });

  res.json(products);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const product = db.data.products.find(p => p.id === Number(id));
  if (!product) return res.status(404).json({ error: '商品不存在' });

  product.view_count = (product.view_count || 0) + 1;
  db.write();

  const seller = db.data.users.find(u => u.id === product.user_id);
  res.json({ ...product, seller_name: seller?.nickname || '未知用户', seller_credit: seller?.credit_score || 0 });
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const decoded = req.user;
    const { title, description, price, category, condition, images, location } = req.body;

    if (!title || !price || !category || !condition) {
      return res.status(400).json({ error: '缺少必要信息' });
    }

    const id = db.data.products.length + 1;
    const product = {
      id,
      user_id: decoded.id,
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
    db.data.products.push(product);
    db.write();

    res.json({ id, message: '发布成功' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '发布失败' });
  }
});

router.get('/my/list', authenticateToken, (req, res) => {
  try {
    const decoded = req.user;
    const products = db.data.products
      .filter(p => p.user_id === decoded.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(products);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '加载失败' });
  }
});

module.exports = router;
