import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TransactionForm() {
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  
  // Form State
  const [pelanggan, setPelanggan] = useState({ nama: '', hp: '' });
  const [teknisi, setTeknisi] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch Inventory saat load
  useEffect(() => {
    axios.get('http://localhost:5000/api/inventory')
      .then(res => setInventory(res.data))
      .catch(err => console.error(err));
  }, []);

  const addToCart = () => {
    if (!selectedItem) return;
    const itemData = inventory.find(i => i._id === selectedItem);
    
    // Cek stok di frontend (UX only, backend tetap validasi)
    if (itemData.tipe === 'Komponen' && itemData.stok < qty) {
      alert(`Stok tidak cukup! Tersedia: ${itemData.stok}`);
      return;
    }

    const newItem = {
      id: itemData._id,
      nama_barang: itemData.nama_barang,
      harga_saat_itu: itemData.harga,
      qty: parseInt(qty),
      subtotal: itemData.harga * parseInt(qty)
    };

    setCart([...cart, newItem]);
    setSelectedItem('');
    setQty(1);
  };

  const totalBiaya = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const handleSubmit = async () => {
    if (cart.length === 0 || !teknisi || !pelanggan.nama) {
      alert("Lengkapi data transaksi!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        pelanggan,
        teknisi: { nama: teknisi },
        items: cart,
        total_biaya: totalBiaya
      };

      await axios.post('http://localhost:5000/api/servis', payload);
      alert('✅ Transaksi Berhasil Disimpan!');
      
      // Reset Form
      setCart([]);
      setPelanggan({ nama: '', hp: '' });
      setTeknisi('');
    } catch (error) {
      alert('❌ Gagal: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Form Input */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Data Servis</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input 
            type="text" placeholder="Nama Pelanggan" className="border p-2 rounded w-full"
            value={pelanggan.nama} onChange={e => setPelanggan({...pelanggan, nama: e.target.value})}
          />
          <input 
            type="text" placeholder="No HP" className="border p-2 rounded w-full"
            value={pelanggan.hp} onChange={e => setPelanggan({...pelanggan, hp: e.target.value})}
          />
        </div>
        <div className="mb-4">
          <input 
            type="text" placeholder="Nama Teknisi" className="border p-2 rounded w-full"
            value={teknisi} onChange={e => setTeknisi(e.target.value)}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold mb-2">Input Item / Jasa</h3>
          <div className="flex gap-2">
            <select 
              className="border p-2 rounded flex-1"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              <option value="">-- Pilih Barang/Jasa --</option>
              {inventory.map(item => (
                <option key={item._id} value={item._id}>
                  {item.nama_barang} ({item.tipe}) - Rp{item.harga.toLocaleString()} 
                  {item.tipe === 'Komponen' ? ` [Stok: ${item.stok}]` : ''}
                </option>
              ))}
            </select>
            <input 
              type="number" min="1" className="border p-2 rounded w-20"
              value={qty} onChange={e => setQty(e.target.value)}
            />
            <button onClick={addToCart} className="bg-green-600 text-white px-4 rounded hover:bg-green-700">
              +
            </button>
          </div>
        </div>
      </div>

      {/* Keranjang & Total */}
      <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Keranjang Servis</h2>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Item</th>
                <th className="p-2">Qty</th>
                <th className="p-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{item.nama_barang}</td>
                  <td className="p-2">{item.qty}</td>
                  <td className="p-2 text-right">Rp {item.subtotal.toLocaleString()}</td>
                </tr>
              ))}
              {cart.length === 0 && <tr><td colSpan="3" className="p-4 text-center text-gray-500">Keranjang kosong</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span>Total Biaya:</span>
            <span className="text-blue-600">Rp {totalBiaya.toLocaleString()}</span>
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className={`w-full py-3 rounded text-white font-bold text-lg ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Menyimpan...' : 'SIMPAN SERVIS'}
          </button>
        </div>
      </div>
    </div>
  );
}