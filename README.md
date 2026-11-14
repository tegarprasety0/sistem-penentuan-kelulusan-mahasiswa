# Sistem Penentuan Kelulusan Mahasiswa
### Implementasi Aljabar Boolean

Project ini adalah aplikasi web sederhana untuk menentukan kelulusan mahasiswa berdasarkan tiga kriteria utama menggunakan operasi logika Aljabar Boolean. Data mahasiswa akan tersimpan secara otomatis di penyimpanan lokal browser (Local Storage), sehingga data tidak hilang saat halaman di-refresh.

## 🌐 Demo
Kamu bisa mencoba aplikasi ini secara langsung melalui tautan berikut:
👉 **[https://spklm.vercel.app/](https://spklm.vercel.app/)**

## 👥 Tim Pengembang
**Dibuat oleh Kelompok 4:**

| Nama | NIM |
| :--- | :--- |
| **Joseph Oswaldo** | 09021282530053 |
| **Aisya Safitri** | 09021282530056 |
| **Ivansius Leo Vanny** | 09021282530040 |
| **Tegar Prasetyo** | 09021282530043 |

---
*Project ini dibuat untuk memenuhi project mata kuliah Struktur Diskrit II.*

## ✨ Fitur
- **Formulir Penilaian:** Input nama, nilai ujian, nilai tugas, dan persentase kehadiran.
- **Evaluasi Boolean:** Menampilkan hasil evaluasi tiap kriteria (A, B, C) secara transparan.
- **Logika Boolean:** Menampilkan persamaan `L = A AND B AND C` dan operasi negasi `NOT L`.
- **Statistik:** Menampilkan total mahasiswa, jumlah lulus, dan jumlah tidak lulus.
- **Penyimpanan Lokal:** Data tersimpan di browser menggunakan `localStorage`.
- **Manajemen Data:** Fitur hapus per data mahasiswa dan hapus semua data.
- **Responsif:** Tampilan menyesuaikan ukuran layar desktop dan mobile.

## 🧮 Aturan Aljabar Boolean
Kelulusan ditentukan dengan tiga kondisi. Semua kondisi harus bernilai **benar (True)** agar mahasiswa dinyatakan **LULUS**.

| Simbol | Kriteria | Syarat |
| :---: | :--- | :--- |
| **A** | Nilai Ujian | ≥ 60 |
| **B** | Nilai Tugas | ≥ 60 |
| **C** | Kehadiran | ≥ 75% |

**Persamaan Logika:**
- **Lulus:** `L = A AND B AND C`
- **Tidak Lulus:** `T = NOT A OR NOT B OR NOT C`
- **Negasi:** `NOT L = !L`

## 🛠️ Teknologi yang Digunakan
- **HTML5** (Struktur)
- **CSS3** (Styling & Responsive Layout)
- **Vanilla JavaScript** (Logika Boolean & Local Storage)
- **Vercel** (Deployment / Hosting)

## 🚀 Cara Menjalankan
1. Clone repository ini atau download sebagai ZIP.
2. Buka file `index.html` di browser kamu.
3. Atau, gunakan ekstensi **Live Server** di VS Code untuk pengalaman development yang lebih baik.