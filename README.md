


# 🛠️ Sistem Informasi Manajemen Bengkel & Point of Sales (UTC)

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Backend-Flask-yellow?style=for-the-badge&logo=python)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Style-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css)

> Aplikasi berbasis web untuk manajemen operasional bengkel komputer, mencakup penjualan *sparepart* (Retail), pelacakan servis, manajemen stok inventaris, dan penugasan teknisi.

---

## 📋 Daftar Isi
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Project](#-struktur-project)
- [Prasyarat Instalasi](#-prasyarat-instalasi)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
  - [1. Setup Database (MongoDB)](#1-setup-database-mongodb)
  - [2. Setup Backend (Python Flask)](#2-setup-backend-python-flask)
  - [3. Setup Frontend (React)](#3-setup-frontend-react)
- [Dokumentasi API](#-dokumentasi-api-singkat)
- [Kontributor](#-kontributor)

---

## 🌟 Fitur Utama

### 1. 🛒 Point of Sales (Kasir)
- **Multi-Layanan:** Mendukung transaksi penjualan barang fisik (*sparepart*) dan jasa servis.
- **Keranjang Belanja:** Menambahkan banyak item sekaligus dalam satu transaksi.
- **Kalkulasi Otomatis:** Menghitung subtotal dan total biaya secara *real-time*.
- **Validasi Stok:** Mencegah penjualan barang melebihi stok yang tersedia.

### 2. 📦 Manajemen Inventaris
- **CRUD Barang:** Tambah, lihat, ubah, dan hapus data barang/jasa.
- **Upload Gambar:** Fitur upload foto produk (*sparepart*) agar mudah dikenali.
- **Kategori:** Pemisahan otomatis antara 'Komponen' dan 'Jasa'.

### 3. 🔧 Manajemen Servis
- **Data Pelanggan:** Mencatat nama, HP, alamat, dan email pelanggan.
- **Status Servis:** Pelacakan status (Belum Selesai, Selesai, Dibatalkan).
- **Penugasan Teknisi:** Mencatat teknisi yang bertanggung jawab atas servis.
- **Estimasi Waktu:** Input estimasi hari pengerjaan untuk jasa servis.

---

## 💻 Teknologi yang Digunakan

### Frontend (Client-Side)
- **React.js (Vite):** Framework UI utama.
- **Tailwind CSS:** Styling framework untuk desain responsif.
- **Axios:** Melakukan request HTTP ke Backend.
- **React Hooks:** Manajemen state (`useState`, `useEffect`).

### Backend (Server-Side)
- **Python:** Bahasa pemrograman utama.
- **Flask:** Microframework untuk membuat REST API.
- **Flask-CORS:** Menangani izin akses dari Frontend ke Backend.
- **PyMongo:** Driver untuk menghubungkan Python dengan MongoDB.
- **Werkzeug:** Utilitas untuk penanganan upload file yang aman.

### Database
- **MongoDB:** Database NoSQL (Document-based) untuk fleksibilitas struktur data transaksi dan produk.

---

## 📂 Struktur Project

```bash
bengkel-project/
│
├── backend/                   # Folder Backend (Python)
│   ├── app.py                 # Entry point server Flask
│   ├── api.py                 # (Opsional) File routing terpisah
│   ├── requirements.txt       # Daftar library Python
│   └── static/
│       └── uploads/           # Tempat penyimpanan file gambar fisik
│
├── frontend/                  # Folder Frontend (React)
│   ├── src/
│   │   ├── components/        # Komponen UI (TransactionForm, ProductList)
│   │   ├── api.js             # Konfigurasi Axios
│   │   ├── App.jsx            # Main Component
│   │   └── main.jsx           # Entry point React
│   ├── public/
│   ├── package.json           # Dependencies Node.js
│   └── tailwind.config.js     # Konfigurasi Tailwind
│
└── README.md                  # Dokumentasi ini

```

---

## ⚙️ Prasyarat Instalasi

Sebelum memulai, pastikan komputer Anda sudah terinstall:

1. **Node.js & NPM** (Untuk menjalankan React).
2. **Python 3.x** (Untuk menjalankan Flask).
3. **MongoDB Community Server** (Pastikan service MongoDB sudah berjalan di background).
4. **MongoDB Compass** (Opsional, untuk melihat data visual).

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Setup Database (MongoDB)

Pastikan MongoDB berjalan di port default `27017`.

* Buka terminal/CMD dan ketik: `mongod` (jika belum jalan otomatis).
* Atau cek via MongoDB Compass dengan koneksi string: `mongodb://localhost:27017/`.

### 2. Setup Backend (Python Flask)

Buka terminal baru, arahkan ke folder `backend`:

```bash
cd backend

```

**Buat Virtual Environment (Disarankan):**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate

```

**Install Dependencies:**
Buat file `requirements.txt` isinya:

```text
flask
flask-cors
pymongo

```

Lalu jalankan:

```bash
pip install -r requirements.txt

```

**Jalankan Server:**

```bash
python app.py

```

*Output: Running on https://www.google.com/search?q=http://127.0.0.1:5000*

### 3. Setup Frontend (React)

Buka terminal **baru** (biarkan terminal backend tetap jalan), arahkan ke folder `frontend`:

```bash
cd frontend

```

**Install Library:**

```bash
npm install
npm install axios react-router-dom

```

**Jalankan Aplikasi:**

```bash
npm run dev

```

*Buka browser dan akses alamat yang muncul (biasanya http://localhost:5173)*

---

## 📡 Dokumentasi API Singkat

Berikut adalah endpoint utama yang tersedia di Backend Flask:

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| `GET` | `/inventory` | Mengambil semua daftar barang & jasa. |
| `POST` | `/inventory` | Menambah barang baru (termasuk upload gambar). |
| `POST` | `/transaksi` | Menyimpan transaksi baru (Servis/Penjualan). |
| `POST` | `/upload` | Upload file gambar ke server. |

### Contoh JSON Request (POST /transaksi)

```json
{
  "pelanggan": {
    "nama": "Farrel",
    "hp": "08123456789",
    "status": "Belum Selesai"
  },
  "teknisi": { "nama": "Ahmad" },
  "items": [
    {
      "id": "65a...",
      "nama_barang": "RAM 8GB",
      "qty": 2,
      "subtotal": 600000
    }
  ],
  "total_biaya": 600000,
  "jenis_layanan": "barang"
}

```

---

## ⚠️ Troubleshooting (Masalah Umum)

**1. Gambar tidak muncul di React?**

* Pastikan backend Flask menyajikan folder static.
* Cek URL gambar di database, harusnya format: `http://localhost:5000/static/uploads/namafile.jpg`.

**2. Error CORS (Access-Control-Allow-Origin)?**

* Pastikan di `app.py` sudah ada kode:
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

```



**3. MongoDB Connection Refused?**

* Pastikan service MongoDB sudah menyala di komputer Anda.

---

## 👨‍💻 Kontributor

Proyek ini dibuat untuk memenuhi **Tugas Ujian Akhir Semester (UAS) Basis Data**.

* **Nama:** [Nama Anda]
* **NIM:** [NIM Anda]
* **Kampus:** Universitas Darussalam Gontor

---

*Dibuat dengan ❤️ menggunakan MERN Logic (MongoDB, Express/Flask, React, Node).*

```

### Cara Menggunakan File Ini:
1.  Buat file baru bernama `README.md` di root folder proyek Anda.
2.  Copy kode di atas dan Paste ke dalamnya.
3.  Simpan file.
4.  Jika Anda upload ke GitHub, tampilannya akan otomatis rapi dengan badge dan format tabel.

```

