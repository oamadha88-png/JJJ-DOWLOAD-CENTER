require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getOne, getAll, runSql, initializeDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'jjj-delivery-secret';

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

  if (!token) {
    return res.status(401).json({ message: 'Token autentikasi diperlukan.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await getOne('SELECT id, email, name FROM users WHERE id = ?', [payload.id]);
    if (!user) {
      return res.status(401).json({ message: 'User tidak valid.' });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'JJJ Delivery Service', timestamp: new Date().toISOString() });
});

app.get('/api/config', (_req, res) => {
  res.json({
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'MASUKKAN_API_KEY_GOOGLE_MAPS',
    brand: 'JJJ Delivery Service',
    subBrand: 'Jujoys Group',
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role = 'customer' } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
  }

  try {
    const existingUser = await getOne('SELECT * FROM users WHERE email = ?', [String(email).trim().toLowerCase()]);
    if (existingUser) {
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const created = await runSql(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      [String(email).trim().toLowerCase(), passwordHash, String(name).trim(), role === 'admin' ? 'admin' : 'customer']
    );

    const user = { id: created.id, email: String(email).trim().toLowerCase(), name: String(name).trim(), role: role === 'admin' ? 'admin' : 'customer' };
    return res.status(201).json({ token: createToken(user), user });
  } catch (error) {
    return res.status(500).json({ message: 'Registrasi gagal.', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi.' });
  }

  try {
    const user = await getOne('SELECT * FROM users WHERE email = ?', [String(email).trim().toLowerCase()]);
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const isValidPassword = await bcrypt.compare(String(password), user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const safeUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    return res.json({ token: createToken(safeUser), user: safeUser });
  } catch (error) {
    return res.status(500).json({ message: 'Login gagal.', error: error.message });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  const profile = await getOne('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
  return res.json({ user: req.user, profile });
});

app.get('/api/profile', requireAuth, async (req, res) => {
  const profile = await getOne('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
  return res.json({ profile });
});

app.post('/api/profile', requireAuth, async (req, res) => {
  const { fullName, phone, address, favoriteFleet } = req.body || {};

  if (!fullName || !phone || !address) {
    return res.status(400).json({ message: 'Nama lengkap, nomor HP, dan alamat wajib diisi.' });
  }

  try {
    const existing = await getOne('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);

    if (existing) {
      await runSql(
        `UPDATE profiles SET full_name = ?, phone = ?, address = ?, favorite_fleet = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
        [String(fullName).trim(), String(phone).trim(), String(address).trim(), favoriteFleet || existing.favorite_fleet || null, req.user.id]
      );

      const updated = await getOne('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
      return res.json({ message: 'Profil berhasil diperbarui.', profile: updated });
    }

    await runSql(
      'INSERT INTO profiles (user_id, full_name, phone, address, favorite_fleet) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, String(fullName).trim(), String(phone).trim(), String(address).trim(), favoriteFleet || null]
    );

    const created = await getOne('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
    return res.status(201).json({ message: 'Profil berhasil dibuat.', profile: created });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menyimpan profil.', error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const payload = req.body || {};
  const requiredFields = [
    'pickupAddress',
    'destinationAddress',
    'packageType',
    'packageWeight',
    'fleet',
    'estimatedDistance',
    'totalPrice',
  ];

  const missing = requiredFields.find((field) => !payload[field] && payload[field] !== 0);
  if (missing) {
    return res.status(400).json({ message: `Field ${missing} wajib diisi.` });
  }

  const trackingNumber = `KML-${String(Date.now()).slice(-6)}`;
  const createdAt = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  const status = 'Menunggu pickup';
  const history = [{
    status,
    location: String(payload.pickupAddress).trim(),
    note: 'Pesanan dibuat oleh pelanggan dan menunggu pickup kurir.',
    time: createdAt,
  }];

  try {
    await runSql(
      `INSERT INTO shipments (
        tracking_number,
        customer_name,
        customer_phone,
        pickup_address,
        destination_address,
        package_type,
        package_weight,
        package_size,
        fragile,
        fleet,
        estimated_distance,
        total_price,
        status,
        current_location,
        history
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trackingNumber,
        payload.customerName || 'Pelanggan',
        payload.customerPhone || '-',
        String(payload.pickupAddress).trim(),
        String(payload.destinationAddress).trim(),
        String(payload.packageType).trim(),
        Number(payload.packageWeight),
        payload.packageSize || 'medium',
        payload.fragile ? 1 : 0,
        payload.fleet,
        Number(payload.estimatedDistance),
        Number(payload.totalPrice),
        status,
        String(payload.pickupAddress).trim(),
        JSON.stringify(history),
      ]
    );

    return res.status(201).json({
      trackingNumber,
      status,
      message: 'Pesanan berhasil dibuat.',
      shipment: {
        tracking_number: trackingNumber,
        status,
        current_location: payload.pickupAddress,
        history,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal membuat pesanan.', error: error.message });
  }
});

app.get('/api/shipments', async (_req, res) => {
  try {
    const rows = await getAll('SELECT * FROM shipments ORDER BY updated_at DESC LIMIT 20');
    const shipments = rows.map((shipment) => ({
      tracking_number: shipment.tracking_number,
      status: shipment.status,
      location: shipment.current_location,
      fleet: shipment.fleet,
      total_price: shipment.total_price,
      estimated_distance: shipment.estimated_distance,
      pickup_address: shipment.pickup_address,
      destination_address: shipment.destination_address,
      package_type: shipment.package_type,
      package_weight: shipment.package_weight,
      updated_at: shipment.updated_at,
      history: JSON.parse(shipment.history || '[]'),
    }));

    return res.json({ shipments });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil daftar kiriman.', error: error.message });
  }
});

app.get('/api/shipments/:trackingNumber', async (req, res) => {
  const { trackingNumber } = req.params;

  try {
    const shipment = await getOne('SELECT * FROM shipments WHERE tracking_number = ?', [trackingNumber.toUpperCase()]);
    if (!shipment) {
      return res.status(404).json({ message: 'Nomor resi tidak ditemukan.' });
    }

    const result = {
      tracking_number: shipment.tracking_number,
      status: shipment.status,
      location: shipment.current_location,
      history: JSON.parse(shipment.history || '[]'),
      pickup_address: shipment.pickup_address,
      destination_address: shipment.destination_address,
      fleet: shipment.fleet,
      total_price: shipment.total_price,
      estimated_distance: shipment.estimated_distance,
      package_type: shipment.package_type,
      package_weight: shipment.package_weight,
      package_size: shipment.package_size,
      fragile: Boolean(shipment.fragile),
    };

    return res.json({ shipment: result });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil data kiriman.', error: error.message });
  }
});

app.patch('/api/shipments/:trackingNumber/status', requireAuth, async (req, res) => {
  const { trackingNumber } = req.params;
  const { status, location, note } = req.body || {};

  if (!status || !location || !note) {
    return res.status(400).json({ message: 'Status, lokasi, dan catatan wajib diisi.' });
  }

  try {
    const shipment = await getOne('SELECT * FROM shipments WHERE tracking_number = ?', [trackingNumber.toUpperCase()]);
    if (!shipment) {
      return res.status(404).json({ message: 'Nomor resi tidak ditemukan.' });
    }

    const history = JSON.parse(shipment.history || '[]');
    history.unshift({
      status,
      location,
      note,
      time: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
    });

    await runSql(
      'UPDATE shipments SET status = ?, current_location = ?, history = ?, updated_at = CURRENT_TIMESTAMP WHERE tracking_number = ?',
      [String(status), String(location).trim(), JSON.stringify(history), trackingNumber.toUpperCase()]
    );

    const updated = await getOne('SELECT * FROM shipments WHERE tracking_number = ?', [trackingNumber.toUpperCase()]);
    return res.json({
      message: 'Status kiriman berhasil diperbarui.',
      shipment: {
        tracking_number: updated.tracking_number,
        status: updated.status,
        location: updated.current_location,
        history: JSON.parse(updated.history || '[]'),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui status kiriman.', error: error.message });
  }
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  return res.sendFile(path.join(__dirname, 'index.html'));
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`JJJ Delivery Service running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
