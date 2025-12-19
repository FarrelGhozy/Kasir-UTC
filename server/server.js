const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Inisialisasi App
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
// Pastikan MongoDB sudah berjalan!
mongoose.connect('mongodb://127.0.0.1:27017/bengkel_utc')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- ROUTES SETUP ---
// Menghubungkan file routes yang sudah dipisah
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/servis', require('./routes/servisRoutes'));

// Route Cek Kesehatan Server
app.get('/', (req, res) => {
  res.send('Server Bengkel UTC Running...');
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));