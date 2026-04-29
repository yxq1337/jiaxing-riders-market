const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'db.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);

db.defaults({
  users: [],
  products: [],
  orders: [],
  messages: [],
  reviews: [],
  favorites: [],
  posts: [],
  postReplies: []
}).write();

module.exports = db;
