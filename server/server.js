// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
// Ganti URI ini dengan string koneksi MongoDB lokal atau Atlas Anda
mongoose.connect('mongodb://127.0.0.1:27017/bengkel_utc')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// --- MONGOOSE SCHEMAS & MODELS ---

// 1. Inventory Schema
const InventorySchema = new mongoose.Schema({
  nama_barang: { type: String, required: true },
  tipe: { type: String, enum: ['Jasa', 'Komponen'], required: true },
  harga: { type: Number, required: true },
  stok: { type: Number, default: 0 } // Jasa bisa diset stok 9999 atau diabaikan logicnya
});
const Inventory = mongoose.model('Inventory', InventorySchema);

// 2. Servis Schema (Transaksi)
const ServisSchema = new mongoose.Schema({
  pelanggan: {
    nama: String,
    hp: String
  },
  teknisi: {
    nama: String
  },
  tanggal: { type: Date, default: Date.now },
  status: { type: String, enum: ['Proses', 'Selesai'], default: 'Proses' },
  items: [{
    nama_barang: String,
    harga_saat_itu: Number, // Snapshot harga
    qty: Number,
    subtotal: Number
  }],
  total_biaya: Number
});
const Servis = mongoose.model('Servis', ServisSchema);

// --- ROUTES ---

// 1. Seeding Data (Isi data awal)
app.get('/api/seed', async (req, res) => {
  try {
    const count = await Inventory.countDocuments();
    if (count > 0) return res.json({ message: 'Database sudah terisi' });

    const dummyData = [
      { nama_barang: 'Ganti Oli Mesin', tipe: 'Jasa', harga: 50000, stok: 9999 },
      { nama_barang: 'Tune Up Ringan', tipe: 'Jasa', harga: 75000, stok: 9999 },
      { nama_barang: 'Oli MPX2', tipe: 'Komponen', harga: 65000, stok: 20 },
      { nama_barang: 'Kampas Rem Depan', tipe: 'Komponen', harga: 45000, stok: 15 },
      { nama_barang: 'Busi Standar', tipe: 'Komponen', harga: 25000, stok: 30 },
    ];
    await Inventory.insertMany(dummyData);
    res.json({ message: 'Seeding berhasil!', data: dummyData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get Inventory (Untuk Dropdown/Pilihan)
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await Inventory.find().sort({ nama_barang: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Create Servis (Transaksi & Validasi Stok)
app.post('/api/servis', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { pelanggan, teknisi, items, total_biaya } = req.body;

    // Validasi & Kurangi Stok
    for (const item of items) {
      const dbItem = await Inventory.findOne({ nama_barang: item.nama_barang }).session(session);
      
      if (!dbItem) throw new Error(`Barang ${item.nama_barang} tidak ditemukan`);

      if (dbItem.tipe === 'Komponen') {
        if (dbItem.stok < item.qty) {
          throw new Error(`Stok ${item.nama_barang} tidak cukup! Sisa: ${dbItem.stok}`);
        }
        // Atomic Update: Kurangi stok
        await Inventory.updateOne(
          { _id: dbItem._id },
          { $inc: { stok: -item.qty } }
        ).session(session);
      }
    }

    // Simpan Transaksi
    const newServis = new Servis({
      pelanggan,
      teknisi,
      items, // Data items di sini sudah berisi snapshot harga
      total_biaya,
      status: 'Selesai' // Langsung selesai untuk kasus kasir sederhana
    });

    await newServis.save({ session });
    await session.commitTransaction();
    
    res.status(201).json({ message: 'Transaksi berhasil disimpan', data: newServis });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// 4. Get History Servis
app.get('/api/servis', async (req, res) => {
  try {
    const history = await Servis.find().sort({ tanggal: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Laporan (Aggregation)
app.get('/api/laporan', async (req, res) => {
  try {
    const report = await Servis.aggregate([
      {
        $group: {
          _id: "$teknisi.nama", // Group by nama teknisi
          totalOmzet: { $sum: "$total_biaya" },
          jumlahServis: { $sum: 1 }
        }
      },
      { $sort: { totalOmzet: -1 } }
    ]);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));