import { useState, useEffect } from 'react';
// Import fungsi API untuk mengambil data barang dan mengirim transaksi ke Backend
import { getInventory, createServis } from '../api';

export default function TransactionForm() {
  // =================================================================
  // 1. DEKLARASI STATE (TEMPAT PENYIMPANAN DATA SEMENTARA)
  // =================================================================
  
  // Menyimpan daftar semua barang/jasa yang diambil dari Database
  const [inventory, setInventory] = useState([]);
  
  // Menyimpan daftar item yang sedang dipilih user (Keranjang Belanja)
  const [cart, setCart] = useState([]);
  
  // Menyimpan data lengkap pelanggan dalam satu object agar rapi
  const [pelanggan, setPelanggan] = useState({ 
    nama: '', 
    hp: '', 
    email: '', 
    alamat: '', 
    date: '', // Tanggal transaksi
    status: '', // Status pengerjaan (Selesai/Belum)
    keterangan_biaya: '' // Catatan tambahan (opsional)
  });

  // Menyimpan nama teknisi yang menangani
  const [teknisi, setTeknisi] = useState('');
  
  // --- State untuk Kontrol Form Input Barang/Jasa ---
  const [layanan, setLayanan] = useState(''); // Menentukan mode: 'barang' atau 'jasa'
  const [selectedItem, setSelectedItem] = useState(''); // ID barang yang dipilih di dropdown
  const [qty, setQty] = useState(1); // Jumlah barang
  const [estimasiWaktu, setEstimasiWaktu] = useState(0); // Khusus untuk jasa (hari)

  // State untuk UX (User Experience) agar tombol disable saat loading
  const [loading, setLoading] = useState(false);

  // =================================================================
  // 2. USE EFFECT (DIJALANKAN SAAT HALAMAN PERTAMA KALI DIBUKA)
  // =================================================================
  useEffect(() => {
    // Panggil API ke Backend untuk minta data barang terbaru
    getInventory()
      .then(data => {
        // Jika sukses, simpan data ke state 'inventory'
        setInventory(data);
      })
      .catch(err => {
        // Jika backend mati atau error, beri peringatan
        alert("Gagal mengambil data barang. Pastikan backend nyala!");
      });
  }, []); // Array kosong [] artinya hanya dijalankan 1x saat mount

  // =================================================================
  // 3. FUNGSI LOGIKA (HANDLERS)
  // =================================================================

  // Fungsi untuk memasukkan barang/jasa ke keranjang (cart)
  const addToCart = () => {
    // Cek: Jangan jalan kalau user belum pilih barang
    if (!selectedItem) return;

    // Cari data lengkap barang berdasarkan ID yang dipilih
    const itemData = inventory.find(i => i._id === selectedItem);
    
    // --- Validasi Stok (PENTING) ---
    // Jika tipe barang adalah 'Komponen' (Fisik) dan stok kurang dari permintaan
    if (itemData.tipe === 'Komponen' && itemData.stok < qty) {
      alert(`Stok tidak cukup! Tersedia: ${itemData.stok}`);
      return; // Batalkan proses
    }

    // Buat object item baru untuk dimasukkan ke keranjang
    const newItem = {
      id: itemData._id,
      nama_barang: itemData.nama_barang,
      harga_saat_itu: itemData.harga, // Simpan harga saat ini (agar aman jika harga berubah nanti)
      qty: parseInt(qty), // Pastikan qty berupa angka integer
      subtotal: itemData.harga * parseInt(qty), // Hitung subtotal otomatis
      tipe: layanan, // Simpan info apakah ini Barang atau Jasa
      estimasi: layanan === 'jasa' ? estimasiWaktu : 0 // Simpan estimasi jika jasa
    };

    // Update state keranjang (tambahkan item baru ke array lama)
    setCart([...cart, newItem]);
    
    // Reset/Kosongkan form input kecil setelah berhasil tambah
    setSelectedItem('');
    setQty(1);
    setEstimasiWaktu(0);
  };

  // Fungsi untuk menghapus item dari keranjang (tombol 'x')
  const removeFromCart = (index) => {
    // Copy array cart dulu (karena state React tidak boleh diedit langsung)
    const newCart = [...cart];
    // Hapus 1 item pada posisi index tersebut
    newCart.splice(index, 1);
    // Simpan perubahan ke state
    setCart(newCart);
  };

  // Menghitung Total Biaya Belanjaan secara Real-time
  // reduce() menjumlahkan property 'subtotal' dari semua item di array cart
  const totalBiaya = cart.reduce((acc, item) => acc + item.subtotal, 0);

  // Fungsi saat tombol "SIMPAN TRANSAKSI" ditekan
  const handleSubmit = async () => {
    // --- Validasi Data Wajib ---
    if (cart.length === 0 || !teknisi || !pelanggan.nama) {
      alert("Mohon lengkapi data pelanggan, teknisi, dan barang!");
      return;
    }

    // Aktifkan mode loading (tombol jadi abu-abu)
    setLoading(true);

    try {
      // Siapkan paket data (Payload) yang akan dikirim ke Backend
      const payload = {
        pelanggan: pelanggan, // Kirim seluruh object pelanggan
        teknisi: { nama: teknisi },
        items: cart, // Kirim isi keranjang
        total_biaya: totalBiaya,
        tanggal_masuk: pelanggan.date || new Date(), // Pakai tanggal input atau sekarang
        jenis_layanan: layanan
      };

      // Kirim ke Backend via API
      await createServis(payload);
      
      // Jika sukses sampai sini, tampilkan pesan sukses
      alert('✅ Transaksi Berhasil Disimpan!');
      
      // --- Reset Form Kembali ke Awal (Bersih-bersih) ---
      setCart([]); // Kosongkan keranjang
      setPelanggan({ 
        nama: '', hp: '', email: '', 
        alamat: '', date: '', status: '', 
        keterangan_biaya: '' 
      });
      setTeknisi('');
      setLayanan('');
      
      // Ambil stok terbaru dari server (karena stok baru saja berkurang)
      const updatedInventory = await getInventory();
      setInventory(updatedInventory);

    } catch (error) {
      // Tangkap error jika backend menolak atau mati
      const msg = error.response?.data?.message || 'Terjadi kesalahan sistem';
      alert('❌ Gagal: ' + msg);
    } finally {
      // Matikan mode loading (baik sukses maupun gagal)
      setLoading(false);
    }
  };

  // =================================================================
  // 4. TAMPILAN (JSX / HTML)
  // =================================================================
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* --- KOLOM KIRI: INPUT FORM --- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-blue-700">Data Transaksi</h2>
        
        {/* Input Nama & HP Pelanggan */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nama Pelanggan</label>
            <input 
              type="text" className="border p-2 rounded w-full"
              // Value diambil dari state, onChange mengupdate state
              value={pelanggan.nama} 
              onChange={e => setPelanggan({...pelanggan, nama: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">No HP</label>
            <input 
              type="text" className="border p-2 rounded w-full"
              value={pelanggan.hp} 
              onChange={e => setPelanggan({...pelanggan, hp: e.target.value})}
            />
          </div>
        </div>

        {/* Input Email & Alamat */}
        <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input 
              type="email" placeholder="contoh@email.com" className="border p-2 rounded w-full"
              value={pelanggan.email} 
              onChange={e => setPelanggan({...pelanggan, email: e.target.value})}
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Alamat</label>
            <input 
              type="text" className="border p-2 rounded w-full"
              value={pelanggan.alamat} 
              onChange={e => setPelanggan({...pelanggan, alamat: e.target.value})}
            />
        </div>

        {/* Input Tanggal & Pilihan Jenis Layanan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          <div>
              <label className="block text-sm text-gray-600 mb-1">Waktu/Tanggal Masuk</label>
              <input 
                type="datetime-local" className="border p-2 rounded w-full"
                value={pelanggan.date} 
                onChange={e => setPelanggan({...pelanggan, date: e.target.value})}
              />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Pilih Jenis Layanan</label>
            <select
              value={layanan}
              // Saat diganti, ubah state 'layanan' yang akan memicu perubahan tampilan di bawah
              onChange={(e) => setLayanan(e.target.value)}
              className="w-full border p-2 rounded outline-none"
            >
              <option value="">-- Pilih Layanan --</option>
              <option value="barang">Pembelian Barang</option>
              <option value="jasa">Penyediaan Jasa</option>
            </select>
          </div>
        </div>

        {/* --- KONDISIONAL RENDERING: FORM BARANG --- */}
        {/* Hanya muncul jika state layanan === 'barang' */}
        {layanan === "barang" && (
          <div className="p-4 bg-blue-50 rounded-lg mb-4 border border-blue-100">
            <h3 className="font-semibold text-blue-700 mb-2 text-sm">Input Barang</h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                {/* Dropdown Filter Barang */}
                <select 
                  className="border p-2 rounded flex-1"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                >
                  <option value="">-- Pilih Barang --</option>
                  {/* Filter hanya menampilkan item tipe 'Komponen' */}
                  {inventory.filter(i => i.tipe === 'Komponen').map(item => (
                    <option key={item._id} value={item._id}>
                      {item.nama_barang} | Rp{item.harga.toLocaleString()} (Stok: {item.stok})
                    </option>
                  ))}
                </select>
                <input 
                  type="number" min="1" className="border p-2 rounded w-20"
                  value={qty} onChange={e => setQty(e.target.value)}
                />
              </div>
              
              <button 
                onClick={addToCart} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
              >
                + Masukkan Keranjang
              </button>

              <div className="mt-2">
                <label className="block text-sm text-gray-600 mb-1">Catatan Biaya (Opsional)</label>
                <input 
                  type="text" placeholder='Misal: Biaya pasang 50rb' className="border p-2 rounded w-full"
                  value={pelanggan.keterangan_biaya} 
                  onChange={e => setPelanggan({...pelanggan, keterangan_biaya: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {/* --- KONDISIONAL RENDERING: FORM JASA --- */}
        {/* Hanya muncul jika state layanan === 'jasa' */}
        {layanan === "jasa" && (
          <div className="p-4 bg-green-50 rounded-lg mb-4 border border-green-100">
            <h3 className="font-semibold text-green-700 mb-2 text-sm">Input Jasa/Service</h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                {/* Dropdown Filter Jasa */}
                <select 
                  className="border p-2 rounded flex-1"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                >
                  <option value="">-- Pilih Jasa --</option>
                  {/* Filter hanya menampilkan item tipe 'Jasa' */}
                  {inventory.filter(i => i.tipe === 'Jasa').map(item => (
                    <option key={item._id} value={item._id}>
                      {item.nama_barang} | Rp{item.harga.toLocaleString()}
                    </option>
                  ))}
                </select>
                <input 
                  type="number" min="1" className="border p-2 rounded w-20"
                  value={qty} onChange={e => setQty(e.target.value)}
                />
              </div>

              <button 
                onClick={addToCart} 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
              >
                + Tambahkan Jasa
              </button>

              <div className="mt-2">
                <label className="block text-xs font-semibold uppercase text-gray-500">Estimasi Waktu (Hari)</label>
                <input 
                  type="number" className="w-full mt-1 border p-2 rounded text-sm" placeholder="0"
                  value={estimasiWaktu}
                  onChange={(e) => setEstimasiWaktu(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Input Status & Teknisi */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm text-gray-600 mb-1">Status Pengerjaan</label>
                <select
                  value={pelanggan.status}
                  onChange={(e) => setPelanggan({...pelanggan, status: e.target.value})}
                  className="w-full border p-2 rounded outline-none"
                >
                  <option value="">-- Pilih Status --</option>
                  <option value="Belum Selesai">Belum Selesai</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nama Teknisi</label>
              <input 
                type="text" className="border p-2 rounded w-full"
                value={teknisi} onChange={e => setTeknisi(e.target.value)}
              />
            </div>
        </div>

      </div>

      {/* --- KOLOM KANAN: KERANJANG & TOTAL --- */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-fit sticky top-4">
        <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">Keranjang Belanja</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 rounded-l">Item</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2 text-right">Subtotal</th>
                  <th className="p-2 rounded-r">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {/* Looping cart untuk menampilkan baris tabel */}
                {cart.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-2">
                        <div className="font-medium">{item.nama_barang}</div>
                        <div className="text-xs text-gray-500">{item.tipe}</div>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2 text-right font-medium">Rp {item.subtotal.toLocaleString()}</td>
                    <td className="p-2 text-center">
                        {/* Tombol Hapus Item */}
                        <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-700">x</button>
                    </td>
                  </tr>
                ))}
                {/* Pesan jika keranjang kosong */}
                {cart.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-400 italic">
                      Keranjang masih kosong...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bagian Total Bayar & Tombol Simpan */}
        <div className="mt-6 pt-4 border-t border-dashed border-gray-300">
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span>Total Bayar:</span>
            {/* toLocaleString() membuat format angka jadi rupiah (cth: 100.000) */}
            <span className="text-blue-700 text-2xl">Rp {totalBiaya.toLocaleString()}</span>
          </div>
          
          <button 
            onClick={handleSubmit} 
            disabled={loading} // Tombol mati saat loading
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