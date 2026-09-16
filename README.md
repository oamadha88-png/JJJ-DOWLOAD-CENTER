# JJJ Delivery Service

Aplikasi pengiriman barang dengan login admin, profile pengguna, estimasi tarif, tracking paket, dan panel admin untuk update status.

## Setup cepat

1. Install dependency:
   npm install
2. Salin file `.env.example` menjadi `.env` dan isi key sesuai kebutuhan.
3. Jalankan aplikasi:
   npm start
4. Buka browser ke http://localhost:3000

## Default akun demo

- Admin: admin@jjjdelivery.com / admin123
- Customer: customer@jjjdelivery.com / customer123

## Catatan

- Untuk Google Maps, aktifkan Maps JavaScript API, Places API, dan Directions API di Google Cloud.
- Backend saat ini menggunakan SQLite lokal untuk demo produksi ringan.
- Untuk penggunaan multi-user yang lebih besar, perlu migrasi ke PostgreSQL dan hosting cloud.

## Publish ke Render

1. Buat repository baru di GitHub, lalu upload seluruh isi folder proyek ini.
2. Di Render pilih **New +** > **Blueprint** dan hubungkan repository tersebut.
3. Render akan membaca `render.yaml`, meng-install dependency, dan menjalankan `npm start`.
4. Isi `GOOGLE_MAPS_API_KEY` pada Environment jika ingin mengaktifkan autocomplete dan rute Google Maps.
5. Setelah deploy selesai, buka URL `.onrender.com` yang diberikan Render.

`render.yaml` memakai persistent disk untuk folder `data/` agar akun dan pesanan SQLite tidak hilang saat aplikasi restart. Fitur persistent disk Render memerlukan paket berbayar.
