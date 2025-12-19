import { useState, useEffect } from 'react';
import { getInventory, createServis } from '../api';

export default function TransactionForm() {
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  
  // State Form Input
  const [pelanggan, setPelanggan] = useState({ nama: '', hp: '' });
  const [teknisi, setTeknisi] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  // Ambil data inventory saat halaman dimuat
  useEffect(() => {
    getInventory()
      .then(data => setInventory(data))
      .catch(err => alert("Gagal mengambil data barang. Pastikan backend nyala!"));
  }, []);

  const addToCart = () => {
    if (!selectedItem) return;
    const itemData = inventory.find(i => i._id === selectedItem);
    
    // Validasi Stok di Frontend (UX)
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
    // Reset input barang
    setSelectedItem('');
    setQty(1);
  };

  const totalBiaya = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const handleSubmit = async () => {
    if (cart.length === 0 || !teknisi || !pelanggan.nama) {
      alert("Mohon lengkapi data pelanggan, teknisi, dan barang!");
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

      await createServis(payload);
      alert('✅ Transaksi Berhasil Disimpan!');
      
      // Reset Form Total
      setCart([]);
      setPelanggan({ nama: '', hp: '' });
      setTeknisi('');
      
      // Refresh stok terbaru
      const updatedInventory = await getInventory();
      setInventory(updatedInventory);

    } catch (error) {
      const msg = error.response?.data?.message || 'Terjadi kesalahan';
      alert('❌ Gagal: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* KIRI: Form Input */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-blue-700">Data Transaksi</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nama Pelanggan</label>
            <input 
              type="text" className="border p-2 rounded w-full"
              value={pelanggan.nama} onChange={e => setPelanggan({...pelanggan, nama: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">No HP</label>
            <input 
              type="text" className="border p-2 rounded w-full"
              value={pelanggan.hp} onChange={e => setPelanggan({...pelanggan, hp: e.target.value})}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">Nama Teknisi</label>
          <input 
            type="text" className="border p-2 rounded w-full"
            value={teknisi} onChange={e => setTeknisi(e.target.value)}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded border border-blue-100">
          <h3 className="font-semibold mb-2 text-blue-800">Tambah Barang / Jasa</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <select 
              className="border p-2 rounded flex-1"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              <option value="">-- Pilih --</option>
              {inventory.map(item => (
                <option key={item._id} value={item._id}>
                  {item.nama_barang} | Rp{item.harga.toLocaleString()} 
                  {item.tipe === 'Komponen' ? ` (Stok: ${item.stok})` : ''}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input 
                type="number" min="1" className="border p-2 rounded w-20"
                value={qty} onChange={e => setQty(e.target.value)}
              />
              <button 
                onClick={addToCart} 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                + Tambah
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KANAN: Keranjang & Total */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">Keranjang Belanja</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 rounded-l">Item</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2 text-right rounded-r">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="p-2">{item.nama_barang}</td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2 text-right font-medium">Rp {item.subtotal.toLocaleString()}</td>
                  </tr>
                ))}
                {cart.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-400 italic">
                      Keranjang masih kosong...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-dashed border-gray-300">
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span>Total Bayar:</span>
            <span className="text-blue-700 text-2xl">Rp {totalBiaya.toLocaleString()}</span>
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-lg transition
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'}
            `}
          >
            {loading ? 'Menyimpan Transaksi...' : 'SIMPAN TRANSAKSI'}
          </button>
        </div>
      </div>
    </div>
  );
}