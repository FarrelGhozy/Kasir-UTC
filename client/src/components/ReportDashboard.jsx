import { useEffect, useState } from 'react';
import { getLaporanTeknisi } from '../api';

export default function ReportDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getLaporanTeknisi()
      .then(res => setData(res))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Laporan Kinerja Teknisi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Nama Teknisi</h3>
                <div className="text-2xl font-bold text-gray-800 mt-1">{item._id}</div>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-2xl">👨‍🔧</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500">Jumlah Servis</p>
                <p className="font-bold text-gray-700">{item.jumlahServis} unit</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Omzet</p>
                <p className="text-xl font-bold text-green-600">Rp {item.totalOmzet.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}