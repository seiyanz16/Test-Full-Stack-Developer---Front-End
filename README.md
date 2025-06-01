# 🧪 Test Full Stack Developer - Front End

Repositori ini berisi aplikasi frontend berbasis web untuk mengelola pengguna dan transaksi. Dibangun dengan **HTML, CSS, dan JavaScript (React.js)**, aplikasi ini menyediakan halaman **login** untuk autentikasi dan dua menu utama: **Manajemen User** dan **Manajemen Transaksi**. Kedua menu menampilkan data dalam tabel interaktif dengan fungsionalitas **add, edit, dan delete**. Aplikasi ini berkomunikasi dengan API *backend* terpisah untuk semua operasi data.

---

## ✅ Fitur Utama

- **Halaman Login**: Autentikasi pengguna menggunakan email dan password.
- **Manajemen Pengguna**: 
   - Menampilkan daftar pengguna dalam bentuk tabel.
   - Fungsionalitas CRUD (Create, Read, Update, Delete) untuk data pengguna.
- **Manajemen Transaksi**: 
   - Menampilkan daftar transaksi dalam bentuk tabel.
   - Fungsionalitas CRUD (Create, Read, Update, Delete) untuk data transaksi.
   - Perhitungan dan tampilan total transaksi (otomatis berdasarkan amount dan discount).
- **Antarmuka Pengguna Interaktif**: Penggunaan komponen UI yang reusable dan responsif.
- **Integrasi API**: Berkomunikasi dengan API RESTful untuk semua operasi data.

---

## 💻 Persyaratan Sistem

Pastikan sistem Anda memiliki prasyarat berikut:

- **Node.js** (disarankan versi 18 atau lebih baru)
- **npm** atau **Yarn**

---

## 🧰 Instalasi

```bash
# Clone repositori
git clone https://github.com/seiyanz16/Test-Full-Stack-Developer---Front-End.git
cd Test-Full-Stack-Developer---Front-End

# Install dependensi
npm install
# atau
yarn install
```

---

## ⚙️ Konfigurasi
Konfigurasikan variabel lingkungan Anda di file .env (buat jika belum ada).
### 1. Salin File Environment
```bash
cp .env.example .env
```
### 2. Konfigurasi Endpoint Backend
```bash
VITE_BASE_URL= http://127.0.0.1:8000/api # Ganti dengan URL backend Anda
```
### 3. Ganti Port Jadi 3000
```bash
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
```
---
## 🚀 Menjalankan Aplikasi
Jalankan server local development:

```bash
npm run dev
# atau
yarn dev
```
Aplikasi API akan berjalan di:
`http://127.0.0.1:3000`

---