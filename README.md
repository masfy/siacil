# 📋 SI-ACIL

### **S**istem **A**plikasi **C**atat **I**nvoice **L**engkap

> Aplikasi Point of Sale (POS) modern berbasis web untuk pencatatan invoice dan manajemen toko.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.15-06B6D4?style=flat-square&logo=tailwindcss)
![Google Apps Script](https://img.shields.io/badge/Backend-Google%20Apps%20Script-4285F4?style=flat-square&logo=google)

---

## ✨ Tentang SI-ACIL

**SI-ACIL** adalah aplikasi Point of Sale (POS) yang dirancang untuk UMKM dan pelaku usaha kecil yang ingin mencatat transaksi penjualan dengan mudah dan praktis. Dengan tampilan modern dan responsif, SI-ACIL dapat digunakan di berbagai perangkat mulai dari smartphone hingga desktop.

### 🎯 Developed by
**Mas Alfy** - *Full Stack Developer*

---

## 🚀 Fitur Utama

### 📊 Dashboard
- Ringkasan penjualan hari ini, minggu ini, dan bulan ini
- Statistik jumlah transaksi
- Quick access ke semua fitur

### 💰 Transaksi / Kasir
- Input item belanja dengan cepat
- Autocomplete dari katalog produk
- Kalkulasi otomatis total belanjaan
- Input nama dan nomor WhatsApp pelanggan
- Simpan invoice ke database

### 📜 Riwayat Invoice
- Lihat semua riwayat transaksi
- Filter berdasarkan tanggal
- Export invoice ke PDF
- Kirim nota langsung ke WhatsApp pelanggan
- QR Code pada invoice PDF

### 📦 Katalog Produk
- Manajemen produk (tambah, edit, hapus)
- SKU otomatis
- Harga produk
- Quick access saat transaksi

### ⚙️ Pengaturan
- **Profil Pengguna**: Nama tampilan, foto avatar
- **Profil Toko**: Nama toko, alamat, logo, nomor WhatsApp
- **Keamanan**: Ubah password

---

## 🛠️ Tech Stack

### Frontend
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| [React](https://react.dev/) | 18.3.1 | Library UI untuk membangun antarmuka |
| [Vite](https://vitejs.dev/) | 6.0.1 | Build tool modern yang super cepat |
| [TailwindCSS](https://tailwindcss.com/) | 3.4.15 | Utility-first CSS framework |
| [jsPDF](https://github.com/parallax/jsPDF) | 2.5.1 | Generate invoice PDF |
| [QRCode](https://github.com/soldair/node-qrcode) | 1.5.4 | Generate QR Code pada invoice |

### Backend
| Teknologi | Deskripsi |
|-----------|-----------|
| [Google Apps Script](https://developers.google.com/apps-script) | Backend serverless gratis |
| [Google Sheets](https://sheets.google.com/) | Database gratis untuk menyimpan data |

---

## 📁 Struktur Proyek

```
Si Acil/
├── public/
│   └── logo.png              # Logo aplikasi
├── src/
│   ├── components/
│   │   ├── layout/           # Layout components (AppLayout, Navigation)
│   │   ├── ui/               # UI components (Button, Modal, Input, dll)
│   │   ├── Icons.jsx         # Icon components
│   │   └── OnboardingModal.jsx
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── pages/
│   │   ├── CatalogPage.jsx   # Halaman katalog produk
│   │   ├── DashboardPage.jsx # Halaman dashboard
│   │   ├── InvoiceHistoryPage.jsx # Halaman riwayat invoice
│   │   ├── LoginPage.jsx     # Halaman login
│   │   ├── SettingsPage.jsx  # Halaman pengaturan
│   │   └── TransactionPage.jsx # Halaman transaksi
│   ├── services/
│   │   └── api.js            # API service layer
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Root component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── Code.gs                   # Google Apps Script backend code
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Instalasi & Setup

### Prasyarat
- Node.js 18+ 
- npm atau yarn
- Akun Google (untuk backend)

### 1. Clone Repository

```bash
git clone https://github.com/username/si-acil.git
cd si-acil
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Backend (Google Apps Script)

1. **Buat Google Spreadsheet baru** di [Google Sheets](https://sheets.google.com/)

2. **Buka Apps Script**
   - Klik `Extensions` > `Apps Script`

3. **Paste kode backend**
   - Hapus semua kode default di editor
   - Copy seluruh isi file `Code.gs` dan paste ke editor

4. **Jalankan Setup**
   - Pilih fungsi `setup` dari dropdown
   - Klik tombol `Run`
   - Berikan izin akses yang diminta

5. **Deploy sebagai Web App**
   - Klik `Deploy` > `New deployment`
   - Pilih `Web app`
   - Konfigurasi:
     - Execute as: `Me`
     - Who has access: `Anyone`
   - Klik `Deploy`
   - **Copy URL yang muncul**

### 4. Konfigurasi API URL

Edit file `src/services/api.js` dan ganti URL default:

```javascript
const DEFAULT_API_URL = 'YOUR_DEPLOYMENT_URL_HERE';
```

### 5. Jalankan Aplikasi

```bash
# Development mode
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```

---

## 📱 Penggunaan

### Login Default
```
Username: admin
Password: admin
```

> ⚠️ **Penting**: Segera ubah password default setelah login pertama!

### Alur Penggunaan

1. **Login** dengan kredensial Anda
2. **Setup Profil Toko** (nama toko, alamat, logo, nomor WA)
3. **Tambah Produk** ke katalog (opsional, untuk autocomplete)
4. **Buat Transaksi** baru dari halaman kasir
5. **Simpan Invoice** dan kirim ke pelanggan via WhatsApp atau PDF

---

## 📤 Deployment

### Vercel (Recommended)

1. Push kode ke GitHub
2. Import project di [Vercel](https://vercel.com/)
3. Deploy otomatis!

### Manual Build

```bash
npm run build
```

File hasil build ada di folder `dist/`, siap untuk di-deploy ke hosting statis manapun.

---

## 🔧 Konfigurasi Tambahan

### Environment Variables

Tidak ada environment variables yang diperlukan. Semua konfigurasi dilakukan melalui file `src/services/api.js`.

### Customization

- **Logo**: Ganti file `public/logo.png`
- **Warna**: Edit `tailwind.config.js`
- **Styles**: Edit `src/index.css`

---

## 📊 Database Schema (Google Sheets)

### Sheet: Users
| Column | Description |
|--------|-------------|
| username | Username login |
| password | Password (plain text) |
| display_name | Nama tampilan |
| avatar_base64 | Foto profil (Base64) |
| store_name | Nama toko |
| address | Alamat toko |
| wa_number | Nomor WhatsApp |
| logo_base64 | Logo toko (Base64) |

### Sheet: Invoices
| Column | Description |
|--------|-------------|
| invoice_id | ID unik invoice |
| date | Tanggal transaksi |
| customer_name | Nama pelanggan |
| customer_wa | Nomor WA pelanggan |
| items_json | Detail item (JSON) |
| total_amount | Total pembayaran |

### Sheet: Products
| Column | Description |
|--------|-------------|
| sku | Stock Keeping Unit |
| product_name | Nama produk |
| price | Harga produk |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat Pull Request atau buka Issue untuk diskusi.

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Kontak

**Mas Alfy** - Developer

Project Link: [https://github.com/username/si-acil](https://github.com/username/si-acil)

---

<div align="center">

### ⭐ Jangan lupa beri bintang jika proyek ini bermanfaat!

Made with ❤️ by **Mas Alfy**

</div>
