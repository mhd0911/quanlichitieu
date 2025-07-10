const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'secret123';

app.use(cors());
app.use(bodyParser.json());

// Kết nối MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Maidung0911', // Nhập mật khẩu MySQL của bạn (nếu có)
  database: 'chi_tieu'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Kết nối database thành công!');
});

// API Đăng ký
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 8);

  const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(sql, [email, hashed], (err) => {
    if (err) return res.status(500).json({ message: 'Đăng ký thất bại' });
    res.json({ message: 'Đăng ký thành công' });
  });
});

// API Đăng nhập
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'Sai tài khoản' });

    const user = results[0];
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Đăng nhập thành công', token });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
app.get('/api/transactions', (req, res) => {
  const userId = req.query.user_id;
  const sql = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn' });
    res.json(results);
  });
});
app.post('/api/transactions', (req, res) => {
  const { user_id, category, type, amount, note, date } = req.body;
  const sql = 'INSERT INTO transactions (user_id, category, type, amount, note, date) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [user_id, category, type, amount, note, date], (err) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi thêm giao dịch' });
    res.json({ message: 'Thêm giao dịch thành công' });
  });
});
app.post('/api/transactions', (req, res) => {
  const { user_id, category, type, amount, note, date } = req.body;

  const sql = 'INSERT INTO transactions (user_id, category, type, amount, note, date) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [user_id, category, type, amount, note, date], (err) => {
    if (err) {
      console.error("❌ Lỗi khi thêm giao dịch:", err); // ← THÊM DÒNG NÀY
      return res.status(500).json({ message: 'Lỗi khi thêm giao dịch' });
    }
    res.json({ message: 'Thêm giao dịch thành công' });
  });
});
