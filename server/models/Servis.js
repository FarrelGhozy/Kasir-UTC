const mongoose = require('mongoose');

const ServisSchema = new mongoose.Schema({
  pelanggan: {
    nama: { type: String, required: true },
    hp: { type: String, required: true }
  },
  teknisi: {
    nama: { type: String, required: true }
  },
  tanggal: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['Proses', 'Selesai'], 
    default: 'Proses' 
  },
  items: [{
    nama_barang: String,
    harga_saat_itu: Number,
    qty: Number,
    subtotal: Number
  }],
  total_biaya: { type: Number, required: true }
});

module.exports = mongoose.model('Servis', ServisSchema);