const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  nama_barang: { 
    type: String, 
    required: true 
  },
  tipe: { 
    type: String, 
    enum: ['Jasa', 'Komponen'], 
    required: true 
  },
  harga: { 
    type: Number, 
    required: true 
  },
  stok: { 
    type: Number, 
    default: 0 
  }
});

module.exports = mongoose.model('Inventory', InventorySchema);