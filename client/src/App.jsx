import { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import ServiceList from './components/ServiceList';
import ReportDashboard from './components/ReportDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('kasir');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">💻</span>
            <div>
              <h1 className="text-xl font-bold leading-none">Sistem Bengkel UTC</h1>
              <p className="text-xs text-blue-200">Unida Technology Center</p>
            </div>
          </div>
          
          <div className="flex space-x-1 sm:space-x-4 bg-blue-800/30 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('kasir')}
              className={`px-4 py-2 rounded-md transition text-sm font-medium ${
                activeTab === 'kasir' ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              Kasir
            </button>
            <button 
              onClick={() => setActiveTab('riwayat')}
              className={`px-4 py-2 rounded-md transition text-sm font-medium ${
                activeTab === 'riwayat' ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              Riwayat
            </button>
            <button 
              onClick={() => setActiveTab('laporan')}
              className={`px-4 py-2 rounded-md transition text-sm font-medium ${
                activeTab === 'laporan' ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              Laporan
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