const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(path.join(dataDir, 'jjj_delivery.db'));

const runSql = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function onRun(err) {
    if (err) {
      reject(err);
      return;
    }
    resolve({ id: this.lastID, changes: this.changes });
  });
});

const getOne = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(row || null);
  });
});

const getAll = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(rows || []);
  });
});

async function initializeDatabase() {
  await runSql(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      full_name TEXT,
      phone TEXT,
      address TEXT,
      favorite_fleet TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS shipments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_number TEXT UNIQUE NOT NULL,
      customer_name TEXT,
      customer_phone TEXT,
      pickup_address TEXT NOT NULL,
      destination_address TEXT NOT NULL,
      package_type TEXT NOT NULL,
      package_weight REAL NOT NULL,
      package_size TEXT,
      fragile INTEGER DEFAULT 0,
      fleet TEXT NOT NULL,
      estimated_distance INTEGER DEFAULT 0,
      total_price INTEGER DEFAULT 0,
      status TEXT NOT NULL,
      current_location TEXT,
      history TEXT DEFAULT '[]',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const admin = await getOne('SELECT * FROM users WHERE email = ?', ['admin@jjjdelivery.com']);
  if (!admin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await runSql(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      ['admin@jjjdelivery.com', passwordHash, 'Admin JJJ', 'admin']
    );
  }

  const demoCustomer = await getOne('SELECT * FROM users WHERE email = ?', ['customer@jjjdelivery.com']);
  if (!demoCustomer) {
    const passwordHash = await bcrypt.hash('customer123', 10);
    await runSql(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      ['customer@jjjdelivery.com', passwordHash, 'Pelanggan JJJ', 'customer']
    );
  }

  return db;
}

module.exports = {
  db,
  getOne,
  getAll,
  runSql,
  initializeDatabase,
};
