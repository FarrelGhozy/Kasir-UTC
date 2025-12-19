const express = require('express');
const router = express.Router();
const Servis = require('../models/Servis');
const Inventory = require('../models/Inventory');

// 1. POST (Buat Transaksi Baru & Kurangi Stok)
router.post('/', async (req, res) => {
  try {
    const { pelanggan, teknisi, items, total_biaya } = req.body;

    // Validasi Data
    if (!pelanggan || !teknisi || !items || items.length === 0) {
      return res.status(400).json({ message: 'Data transaksi tidak lengkap!' });
    }

    // Loop validasi stok & pengurangan stok
    for (const item of items) {
      // Cari barang di database
      const dbItem = await Inventory.findOne({ nama_barang: item.nama_barang });
      
      if (!dbItem) {
        return res.status(404).json({ message: `Barang ${item.nama_barang} tidak ditemukan di database` });
      }

      // Jika tipe Komponen, cek stok
      if (dbItem.tipe === 'Komponen') {
        if (dbItem.stok < item.qty) {
          return res.status(400).json({ message: `Stok ${item.nama_barang} tidak cukup! Sisa: ${dbItem.stok}` });
        }
        
        // Kurangi stok (Atomic Update)
        await Inventory.updateOne(
          { _id: dbItem._id },
          { $inc: { stok: -item.qty } }
        );
      }
    }

    // Simpan Transaksi
    const newServis = new Servis({
      pelanggan,
      teknisi,
      items, 
      total_biaya,
      status: 'Selesai'
    });

    await newServis.save();
    
    res.status(201).json({ message: 'Transaksi berhasil disimpan', data: newServis });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server: ' + error.message });
  }
});

// 2. GET (Ambil Riwayat Transaksi)
router.get('/', async (req, res) => {
  try {
    const history = await Servis.find().sort({ tanggal: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. GET LAPORAN (Agregasi Pendapatan Teknisi)
router.get('/laporan', async (req, res) => {
  try {
    const report = await Servis.aggregate([
      {
        $group: {
          _id: "$teknisi.nama", // Group berdasarkan nama teknisi
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

module.exports = router;