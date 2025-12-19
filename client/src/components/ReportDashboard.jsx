import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReportDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/laporan')
      .then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Laporan Kinerja Teknisi</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-500 uppercase">Teknisi</h3>
            <div className="text-3xl font-bold text-gray-800 my-2">{item._id}</div>
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-xs text-gray-400">Total Servis</p>
                <p className="font-bold">{item.jumlahServis} Transaksi</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Total Omzet</p>
                <p className="text-xl font-bold text-green-600">Rp {item.totalOmzet.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}