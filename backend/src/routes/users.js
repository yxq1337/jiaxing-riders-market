const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/register', (req, res) => {
  const { phone, password, nickname } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const users = db.get('users').value() || [];
  const exists = users.find(u => u.phone === phone);
  if (exists) {
    return res.status(400).json({ error: '手机号已注册' });
  }

  const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const user = {
    id,
    phone,
    password: hashedPassword,
    nickname: nickname || phone,
    avatar: null,
    credit_score: 100,
    is_rider: 0,
    created_at: new Date().toISOString()
  };

  db.get('users').push(user).write();

  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id, phone, nickname: user.nickname } });
});

router.post('/login', (req, res) => {
  const { phone, password } = req.body;

  const users = db.get('users').value() || [];
  const user = users.find(u => u.phone === phone);
  if (!user) {
    return res.status(401).json({ error: '手机号或密码错误' });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: '手机号或密码错误' });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, phone: user.phone, nickname: user.nickname, credit_score: user.credit_score } });
});

router.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未登录' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = db.get('users').value() || [];
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: '用户不存在' });
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (e) {
    res.status(401).json({ error: 'token无效' });
  }
});

module.exports = router;
