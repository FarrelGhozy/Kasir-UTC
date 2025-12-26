
# 🛠️ Sistem Informasi Manajemen Bengkel & Point of Sales (UTC)

![React](https://img.shields.io/badge/Frontend-React%20(Vite)-blue?style=for-the-badge&logo=react)
![NodeJS](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express.js-white?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Style-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css)

> Aplikasi berbasis web untuk manajemen operasional bengkel UTC, mencakup kasir (Point of Sales), manajemen stok, pelacakan servis, dan laporan keuangan.

---

## 📋 Daftar Isi
- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi)
- [Struktur Folder](#-struktur-folder)
- [Instalasi & Menjalankan](#-instalasi--menjalankan)
  - [1. Backend (Server)](#1-setup-backend-server)
  - [2. Frontend (Client)](#2-setup-frontend-client)
- [Konfigurasi API](#-konfigurasi-api)

---

## 🌟 Fitur Utama
Berdasarkan modul yang tersedia:
1.  **Kasir / Transaksi (`TransactionForm`)**: Input penjualan barang dan jasa servis, kalkulasi otomatis, dan validasi stok.
2.  **Daftar Servis (`ServiceList`)**: Monitoring status perbaikan (Pending, Selesai, Diambil).
3.  **Laporan (`ReportDashboard`)**: Rekapitulasi pendapatan dan visualisasi data bengkel.
4.  **Manajemen Inventaris**: CRUD Barang dan Jasa (via Backend API).

---

## 💻 Teknologi

**Frontend (`/client`):**
* **React.js (Vite)**: Framework UI yang cepat.
* **Tailwind CSS**: Styling modern.
* **Axios**: Komunikasi HTTP ke server.

**Backend (`/server`):**
* **Node.js**: Runtime environment.
* **Express.js**: Framework server dan routing.
* **Mongoose**: ODM untuk interaksi dengan MongoDB.

**Database:**
* **MongoDB**: Penyimpanan data NoSQL (Barang, Servis, Pelanggan).

---

## 📂 Struktur Folder
Sesuai dengan struktur proyek saat ini:

```text
root/
│
├── client/                     # FRONTEND (React + Vite)
│   ├── public/                 # Aset statis (utc_logo.png, vite.svg)
│   ├── src/
│   │   ├── api/                # Konfigurasi Axios (axiosConfig.js)
│   │   ├── assets/             # Gambar/Icon komponen
│   │   ├── components/         # Komponen UI Utama
│   │   │   ├── ReportDashboard.jsx
│   │   │   ├── ServiceList.jsx
│   │   │   └── TransactionForm.jsx
│   │   ├── App.jsx             # Routing & Layout Utama
│   │   └── main.jsx            # Entry point React
│   ├── package.json            # Dependencies Client
│   ├── tailwind.config.js      # Config Tailwind
│   └── vite.config.js          # Config Vite
│
└── server/                     # BACKEND (Node.js + Express)
    ├── models/                 # Skema Database (Mongoose)
    │   ├── Inventory.js        # Model Barang/Jasa
    │   └── Servis.js           # Model Transaksi Servis
    ├── routes/                 # Endpoint API
    ├── node_modules/           
    ├── package.json            # Dependencies Server
    ├── seed.js                 # Script isi data awal (Dummy Data)
    └── server.js               # Entry point Server (App.listen)

```

---

## 🚀 Instalasi & Menjalankan

Pastikan **Node.js** dan **MongoDB** sudah terinstall di komputer Anda.

### 1. Setup Backend (Server)

Buka terminal dan arahkan ke folder `server`:

```bash
cd server

# 1. Install Library (Express, Mongoose, Cors, dll)
npm install

# 2. (Opsional) Isi data awal/dummy ke database
node seed.js

# 3. Jalankan Server
node server.js
# Output: Server running on port 5000 (atau sesuai console log)

```

### 2. Setup Frontend (Client)

Buka terminal **baru** (biarkan terminal server tetap jalan), arahkan ke folder `client`:

```bash
cd client

# 1. Install Library (React, Tailwind, Axios)
npm install

# 2. Jalankan Aplikasi Web
npm run dev
# Output: Local: http://localhost:5173

```

> **Catatan:** Buka browser dan akses `http://localhost:5173` untuk menggunakan aplikasi.

---

## ⚙️ Konfigurasi API

Aplikasi Client terhubung ke Server melalui `client/src/api/axiosConfig.js`.
Pastikan `baseURL` di file tersebut sesuai dengan port server Anda (biasanya 5000).

```javascript
// Contoh isi client/src/api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Sesuaikan dengan server.js
});

export default api;

```

---

## 📡 Endpoint API Utama

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/inventory` | Mengambil data stok barang & jasa. |
| `POST` | `/api/inventory` | Menambah barang baru. |
| `GET` | `/api/servis` | Mengambil daftar riwayat servis. |
| `POST` | `/api/servis` | Menyimpan transaksi baru (Kasir). |

---

*Project Tugas Ujian Akhir Semester (UAS) - UTC*

