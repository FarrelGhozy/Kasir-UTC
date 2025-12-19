import axios from 'axios';

// Konfigurasi dasar Axios
const api = axios.create({
  // Pastikan port sesuai dengan backend (5000)
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;