# 🎨 Background Remover & Image Editor

Website untuk menghapus background foto, resize/rescale gambar, dan download hasilnya.

## ✨ Fitur

- 📤 **Upload Gambar** - Drag & drop atau klik untuk upload
- ✨ **Hapus Background** - Dua mode:
  - Mode gratis dengan teknik dasar
  - Mode premium menggunakan Remove.bg API (hasil lebih akurat)
- 📐 **Resize/Rescale** - Ubah ukuran gambar dengan atau tanpa maintain aspect ratio
- 💾 **Download** - Download hasil dalam format PNG dengan transparansi

## 🚀 Cara Menggunakan

### 1. Tanpa API Key (Mode Gratis)

1. Buka `index.html` di browser
2. Upload gambar dengan klik area upload atau drag & drop
3. Klik tombol "Hapus Background"
4. (Opsional) Resize gambar jika diperlukan
5. Klik "Download Hasil" untuk menyimpan gambar

### 2. Dengan API Key (Hasil Lebih Baik)

1. Daftar di [Remove.bg API](https://www.remove.bg/api) untuk mendapatkan API key gratis
2. Masukkan API key di field yang tersedia
3. Upload dan proses gambar seperti biasa
4. Hasil akan lebih akurat dengan API

## 📋 Persyaratan

- Browser modern (Chrome, Firefox, Edge, Safari)
- Tidak perlu instalasi atau server
- Bisa dibuka langsung dari file HTML

## 🔧 Teknologi

- HTML5
- CSS3 (dengan gradient dan animasi modern)
- Vanilla JavaScript
- Canvas API untuk manipulasi gambar
- Remove.bg API (opsional)

## 📝 Catatan

- Mode gratis menggunakan teknik dasar (edge detection dan threshold)
- Untuk hasil terbaik, gunakan Remove.bg API key
- API key gratis dari Remove.bg memiliki limit tertentu
- Format output: PNG dengan transparansi
- Ukuran file maksimal: 10MB

## 🎯 Tips Penggunaan

1. **Untuk hasil terbaik**: Gunakan gambar dengan kontras tinggi antara objek dan background
2. **Mode gratis**: Cocok untuk gambar dengan background putih/terang
3. **API mode**: Memberikan hasil lebih akurat untuk semua jenis gambar
4. **Resize**: Gunakan "Maintain Aspect Ratio" untuk menjaga proporsi gambar

## 📄 Lisensi

Project ini bebas digunakan untuk keperluan pribadi dan komersial.

