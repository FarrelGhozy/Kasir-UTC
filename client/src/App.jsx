import { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import ServiceList from './components/ServiceList';
import ReportDashboard from './components/ReportDashboard';
import Login from './components/Login'; // Import component Login yang baru dibuat

function App() {
  // State untuk menyimpan status Login (Default: false / belum login)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('kasir');

  // --- LOGIKA PROTEKSI HALAMAN ---
  // Jika belum login, tampilkan halaman Login saja
  if (!isLoggedIn) {
    return <Login onLogin={setIsLoggedIn} />;
  }

  // Jika sudah login, tampilkan Dashboard utama (kode lama kamu di sini)
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">
              <a href="./main.jsx">
                <img className="w-14 h-auto inline-block" src="../public/utc_logo.png" alt="logo" />
              </a>
            </span>
            <div>
              <h1 className="text-xl font-bold leading-none hidden sm:block">Sistem Bengkel UTC</h1>
              <p className="text-xs text-blue-200 hidden sm:block">Unida Technology Center</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Menu Navigasi */}
            <div className="flex space-x-1 sm:space-x-4 bg-blue-800/30 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('kasir')}
                className={`px-3 py-2 rounded-md transition text-sm font-medium ${
                  activeTab === 'kasir' ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                Kasir
              </button>
              <button 
                onClick={() => setActiveTab('riwayat')}
                className={`px-3 py-2 rounded-md transition text-sm font-medium ${
                  activeTab === 'riwayat' ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                Transaksi
              </button>
              <button 
                onClick={() => setActiveTab('laporan')}
                className={`px-3 py-2 rounded-md transition text-sm font-medium ${
                  activeTab === 'laporan' ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                Laporan
              </button>
            </div>

            {/* Tombol Logout */}
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-bold transition shadow"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'kasir' && (
          <div className="animate-fade-in">
            <TransactionForm />
          </div>
        )}
        {activeTab === 'riwayat' && (
          <div className="animate-fade-in">
            <ServiceList />
          </div>
        )}
        {activeTab === 'laporan' && (
          <div className="animate-fade-in">
            <ReportDashboard />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;