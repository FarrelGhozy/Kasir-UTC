import { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import ServiceList from './components/ServiceList';
import ReportDashboard from './components/ReportDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('kasir');

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          
          <h1 className="text-2xl font-bold"><a href="##" className='text-2xl font-bold'>🛠️ </a>Bengkel UTC System</h1>
          <div className="space-x-4">
            <button 
              onClick={() => setActiveTab('kasir')}
              className={`px-4 py-2 rounded ${activeTab === 'kasir' ? 'bg-blue-800' : 'hover:bg-blue-500'}`}
            >Kasir</button>
            <button 
              onClick={() => setActiveTab('riwayat')}
              className={`px-4 py-2 rounded ${activeTab === 'riwayat' ? 'bg-blue-800' : 'hover:bg-blue-500'}`}
            >Riwayat</button>
            <button 
              onClick={() => setActiveTab('laporan')}
              className={`px-4 py-2 rounded ${activeTab === 'laporan' ? 'bg-blue-800' : 'hover:bg-blue-500'}`}
            >Laporan</button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto p-6">
        {activeTab === 'kasir' && <TransactionForm />}
        {activeTab === 'riwayat' && <ServiceList />}
        {activeTab === 'laporan' && <ReportDashboard />}
      </main>
    </div>
  );
}

export default App;