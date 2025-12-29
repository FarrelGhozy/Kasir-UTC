import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // --- SIMULASI LOGIN SEDERHANA ---
    // Nanti bisa diganti dengan API call ke backend
    if (username === 'admin' && password === '12345') {
      onLogin(true); // Panggil fungsi dari App.jsx untuk set status login
    } else {
      setError('Username atau Password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-blue-600">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <img 
            src="../public/utc_logo.png" 
            alt="UTC Logo" 
            className="w-20 h-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Sistem Bengkel UTC</h1>
          <p className="text-gray-500 text-sm">Silakan login untuk melanjutkan</p>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg"
          >
            MASUK
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; 2025 Unida Technology Center
        </div>
      </div>
    </div>
  );
}