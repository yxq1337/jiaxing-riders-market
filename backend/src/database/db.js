const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'db.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, {
  users: [],
  products: [],
  orders: [],
  messages: [],
  reviews: [],
  favorites: []
});

db.read();

module.exports = db;
