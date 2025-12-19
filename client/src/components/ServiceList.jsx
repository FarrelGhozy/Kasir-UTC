import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ServiceList() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/servis')
      .then(res => setHistory(res.data));
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Riwayat Servis</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">Tanggal</th>
              <th className="p-3">Pelanggan</th>
              <th className="p-3">Teknisi</th>
              <th className="p-3">Items</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map(servis => (
              <tr key={servis._id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-600">
                  {new Date(servis.tanggal).toLocaleDateString()} <br/>
                  {new Date(servis.tanggal).toLocaleTimeString()}
                </td>
                <td className="p-3">
                  <div className="font-bold">{servis.pelanggan?.nama}</div>
                  <div className="text-xs text-gray-500">{servis.pelanggan?.hp}</div>
                </td>
                <td className="p-3">{servis.teknisi?.nama}</td>
                <td className="p-3 text-sm">
                  <ul className="list-disc pl-4">
                    {servis.items.map((i, idx) => (
                      <li key={idx}>{i.nama_barang} (x{i.qty})</li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 text-right font-bold text-blue-600">
                  Rp {servis.total_biaya.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    servis.status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {servis.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}