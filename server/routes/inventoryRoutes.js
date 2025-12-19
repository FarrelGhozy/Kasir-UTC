const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// 1. SEED DATA (Reset & Isi Ulang Database Barang)
router.get('/seed', async (req, res) => {
  try {
    // Cek apakah database kosong
    const count = await Inventory.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Database Inventory sudah terisi. Gunakan node seed.js jika ingin reset total.' });
    }

    const dummyData = [
      // --- JASA ---
      { nama_barang: 'Install Ulang Windows 10/11 + Driver', tipe: 'Jasa', harga: 75000, stok: 9999 },
      { nama_barang: 'Cleaning Laptop & Ganti Thermal Paste', tipe: 'Jasa', harga: 150000, stok: 9999 },
      { nama_barang: 'Jasa Rakit PC Gaming/Office', tipe: 'Jasa', harga: 200000, stok: 9999 },
      { nama_barang: 'Basmi Virus & Malware', tipe: 'Jasa', harga: 50000, stok: 9999 },
      { nama_barang: 'Cek Kerusakan (Diagnosa)', tipe: 'Jasa', harga: 25000, stok: 9999 },

      // --- KOMPONEN ---
      { nama_barang: 'SSD 256GB SATA III', tipe: 'Komponen', harga: 350000, stok: 10 },
      { nama_barang: 'SSD NVMe 512GB Gen3', tipe: 'Komponen', harga: 650000, stok: 5 },
      { nama_barang: 'RAM DDR4 8GB 3200MHz', tipe: 'Komponen', harga: 380000, stok: 15 },
      { nama_barang: 'Thermal Paste Arctic MX-4 (Suntik)', tipe: 'Komponen', harga: 85000, stok: 20 },
      { nama_barang: 'Baterai CMOS CR2032', tipe: 'Komponen', harga: 10000, stok: 50 },
      { nama_barang: 'Keyboard & Mouse Logitech Set', tipe: 'Komponen', harga: 220000, stok: 8 },
      { nama_barang: 'Kabel HDMI 1.5m High Speed', tipe: 'Komponen', harga: 45000, stok: 25 },
      { nama_barang: 'Adaptor Laptop Universal', tipe: 'Komponen', harga: 150000, stok: 7 },
    ];
    
    await Inventory.insertMany(dummyData);
    res.json({ message: 'Seeding Inventory Berhasil!', data: dummyData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET ALL INVENTORY
router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find().sort({ tipe: 1, nama_barang: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;