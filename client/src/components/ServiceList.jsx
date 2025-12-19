import { useEffect, useState } from 'react';
import { getRiwayatServis } from '../api';

export default function ServiceList() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getRiwayatServis()
      .then(data => setHistory(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Riwayat Servis</h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
          {history.length} Transaksi
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-600 uppercase text-xs">
              <th className="p-3 rounded-tl-lg">Waktu</th>
              <th className="p-3">Pelanggan</th>
              <th className="p-3">Teknisi</th>
              <th className="p-3">Detail Item</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-center rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {history.map(servis => (
              <tr key={servis._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 text-gray-500">
                  <div className="font-medium text-gray-700">{new Date(servis.tanggal).toLocaleDateString('id-ID')}</div>
                  <div className="text-xs">{new Date(servis.tanggal).toLocaleTimeString('id-ID')}</div>
                </td>
                <td className="p-3">
                  <div className="font-bold text-gray-800">{servis.pelanggan?.nama}</div>
                  <div className="text-xs text-gray-500">{servis.pelanggan?.hp}</div>
                </td>
                <td className="p-3 text-gray-700">{servis.teknisi?.nama}</td>
                <td className="p-3">
                  <ul className="list-disc pl-4 text-xs text-gray-600">
                    {servis.items.map((i, idx) => (
                      <li key={idx}>{i.nama_barang} <span className="text-gray-400">(x{i.qty})</span></li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 text-right font-bold text-blue-700">
                  Rp {servis.total_biaya.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
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