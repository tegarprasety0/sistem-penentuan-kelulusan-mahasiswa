# Sistem Penentuan Kelulusan Mahasiswa
### Implementasi Aljabar Boolean

Project ini adalah aplikasi web sederhana untuk menentukan status lulus atau tidak lulus mahasiswa dari **nilai ujian, nilai tugas, dan persentase kehadiran** menggunakan operasi logika Aljabar Boolean (**AND**, **OR**, dan **NOT**). Data mahasiswa tersimpan otomatis di penyimpanan lokal browser (`localStorage`), sehingga tidak hilang saat halaman di-refresh.

## 🌐 Demo
Kamu bisa mencoba aplikasi ini secara langsung melalui tautan berikut:
👉 **[https://spklm-kelompok4.vercel.app/](https://spklm-kelompok4.vercel.app/)**

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
- **Formulir Input:** Nama mahasiswa, nilai ujian, nilai tugas, dan kehadiran (%). Setiap nilai bisa diisi lewat **slider** maupun **kolom angka** (keduanya sinkron, rentang 0–100).
- **Validasi:** Nama wajib diisi dan setiap nilai harus berada pada rentang 0–100. Pesan error muncul di bawah kolom yang bermasalah.
- **Evaluasi Real-time:** Status kelulusan langsung diperbarui setiap kali input berubah, tanpa perlu menekan tombol.
- **Tabel Atom (A–F):** Menampilkan pernyataan, nilai input, dan bit kebenaran (`1` / `0`) dari tiap atom.
- **Perhitungan Jalur:** Menampilkan operasi `J₁ = A ∧ B ∧ C`, `J₂ = D ∧ E ∧ F`, hasil akhir `L = J₁ ∨ J₂`, serta negasinya `¬L`.
- **Penjelasan Hasil:** Catatan otomatis yang menyebutkan jalur mana yang terpenuhi, atau atom mana yang gagal beserta nilainya (mis. `A (ujian 65 < 70)`).
- **Arsip Mahasiswa:** Tombol **Simpan Data** menyimpan hasil evaluasi ke tabel arsip (nomor, nama + waktu simpan, nilai, bit `L`, dan status).
- **Ringkasan Arsip:** Menampilkan jumlah data, jumlah lulus, dan jumlah tidak lulus.
- **Manajemen Data:**
  - **Muat** — memuat kembali data arsip ke formulir.
  - **Hapus** — menghapus satu data (klik dua kali: tombol berubah menjadi "Yakin?").
  - **Hapus semua** — mengosongkan arsip (klik dua kali: tombol berubah menjadi "Klik lagi").
- **Penyimpanan Lokal:** Data disimpan di `localStorage` dengan kunci `aljabar-boolean-kelulusan-v1`. Jika penyimpanan tidak tersedia, aplikasi menampilkan peringatan.
- **Responsif:** Tampilan menyesuaikan layar desktop dan mobile (tabel arsip bisa digeser horizontal di layar kecil).
- **Aksesibilitas:** Mendukung `prefers-reduced-motion` dan fokus keyboard yang jelas.

## 🧮 Aturan Aljabar Boolean
Mahasiswa dinyatakan **LULUS** jika memenuhi **salah satu** dari dua jalur kelulusan. Setiap jalur terdiri dari tiga atom yang semuanya harus bernilai **benar (True)**.

### Atom

| Atom | Kriteria | Syarat | Jalur |
| :---: | :--- | :--- | :---: |
| **A** | Nilai Ujian | ≥ 70 | J₁ |
| **B** | Nilai Tugas | ≥ 60 | J₁ |
| **C** | Kehadiran | ≥ 75% | J₁ |
| **D** | Nilai Ujian | ≥ 85 | J₂ |
| **E** | Nilai Tugas | ≥ 80 | J₂ |
| **F** | Kehadiran | ≥ 70% | J₂ |

Jalur **J₂** adalah jalur untuk mahasiswa dengan nilai ujian dan tugas tinggi, dengan syarat kehadiran yang sedikit lebih ringan.

### Persamaan Logika
- **Jalur 1:** `J₁ = A ∧ B ∧ C`
- **Jalur 2:** `J₂ = D ∧ E ∧ F`
- **Lulus:** `L = J₁ ∨ J₂ = (A ∧ B ∧ C) ∨ (D ∧ E ∧ F)`
- **Tidak Lulus:** `¬L = ¬J₁ ∧ ¬J₂ = (¬A ∨ ¬B ∨ ¬C) ∧ (¬D ∨ ¬E ∨ ¬F)` (Hukum De Morgan)

### Contoh

| Ujian | Tugas | Hadir | J₁ | J₂ | L | Status |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| 76 | 70 | 78 | 1 | 0 | 1 | Lulus |
| 90 | 85 | 72 | 0 | 1 | 1 | Lulus |
| 90 | 85 | 60 | 0 | 0 | 0 | Tidak lulus |
| 65 | 80 | 90 | 0 | 0 | 0 | Tidak lulus |

## 🛠️ Teknologi yang Digunakan
- **HTML5** (Struktur)
- **CSS3** (Styling, variabel CSS, Grid/Flexbox, dan layout responsif)
- **Vanilla JavaScript** (Logika Boolean, validasi, dan `localStorage`)
- **Vercel** (Deployment / Hosting)

## 📁 Struktur Project
```
.
├── index.html   # Struktur halaman (formulir, evaluasi, arsip)
├── style.css    # Tampilan dan responsivitas
├── script.js    # Logika Boolean, validasi, dan penyimpanan data
└── README.md
```

## 🚀 Cara Menjalankan
1. Clone repository ini atau download sebagai ZIP.
2. Buka file `index.html` di browser kamu.
3. Atau, gunakan ekstensi **Live Server** di VS Code untuk pengalaman development yang lebih baik.