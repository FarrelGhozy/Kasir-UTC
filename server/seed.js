const mongoose = require('mongoose');
const Inventory = require('./models/Inventory');
const Servis = require('./models/Servis');

mongoose.connect('mongodb://127.0.0.1:27017/bengkel_utc')
  .then(() => console.log('✅ Connected for Seeding'));

const seedDB = async () => {
  try {
    // 1. Bersihkan Data Lama
    await Inventory.deleteMany({});
    await Servis.deleteMany({});
    console.log('🗑️ Data lama dihapus...');

    // 2. Data Inventory (Sama seperti di routes)
    const items = [
      { nama_barang: 'Install Ulang Windows 10/11', tipe: 'Jasa', harga: 75000, stok: 9999 },
      { nama_barang: 'Jasa Rakit PC', tipe: 'Jasa', harga: 200000, stok: 9999 },
      { nama_barang: 'SSD 256GB SATA', tipe: 'Komponen', harga: 350000, stok: 10 },
      { nama_barang: 'RAM 8GB DDR4', tipe: 'Komponen', harga: 380000, stok: 15 },
      { nama_barang: 'Thermal Paste', tipe: 'Komponen', harga: 85000, stok: 20 }
    ];
    await Inventory.insertMany(items);
    console.log('📦 Inventory berhasil diisi');

    // 3. Data Dummy Servis (Contoh)
    const servises = [
      {
        pelanggan: { nama: 'Test User', hp: '08123' },
        teknisi: { nama: 'Teknisi A' },
        items: [{ nama_barang: 'SSD 256GB SATA', harga_saat_itu: 350000, qty: 1, subtotal: 350000 }],
        total_biaya: 350000,
        status: 'Selesai'
      }
    ];
    await Servis.insertMany(servises);
    console.log('📝 Servis dummy berhasil diisi');

    console.log('✅ DONE!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedDB();