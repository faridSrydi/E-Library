// ============================================
// GERBANG LITERASI - Data Store
// ============================================

function dateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

const INITIAL_BOOKS = [
  {
    id: 1,
    isbn: "978-602-291-001",
    judul: "Laskar Pelangi",
    penulis: "Andrea Hirata",
    penerbit: "Bentang Pustaka",
    tahun: 2005,
    kategori: "Fiksi",
    halaman: 529,
    bahasa: "Indonesia",
    rating: 4.8,
    sinopsis:
      "Novel pertama karya Andrea Hirata yang bercerita tentang kehidupan 10 anak dari keluarga miskin yang bersekolah di sebuah sekolah Muhammadiyah di Belitung. Kisah perjuangan mereka dalam menempuh pendidikan di tengah keterbatasan ekonomi telah menginspirasi jutaan pembaca di seluruh dunia.",
  },
  {
    id: 2,
    isbn: "978-602-291-002",
    judul: "Bumi Manusia",
    penulis: "Pramoedya Ananta Toer",
    penerbit: "Hasta Mitra",
    tahun: 1980,
    kategori: "Fiksi",
    halaman: 535,
    bahasa: "Indonesia",
    rating: 4.9,
    sinopsis:
      "Novel pertama dari Tetralogi Buru karya Pramoedya Ananta Toer. Mengisahkan Minke, seorang pribumi yang bersekolah di HBS dan jatuh cinta kepada Annelies Mellema, anak seorang nyai. Karya agung sastra Indonesia yang mengangkat tema kolonialisme dan perjuangan identitas.",
  },
  {
    id: 3,
    isbn: "978-602-291-003",
    judul: "Filosofi Teras",
    penulis: "Henry Manampiring",
    penerbit: "Kompas",
    tahun: 2018,
    kategori: "Non-Fiksi",
    halaman: 346,
    bahasa: "Indonesia",
    rating: 4.7,
    sinopsis:
      "Buku yang memperkenalkan filosofi Stoisisme kuno untuk menghadapi masalah hidup modern. Dengan bahasa ringan dan contoh kehidupan sehari-hari, Henry mengajarkan cara mengendalikan emosi dan menemukan ketenangan batin.",
  },
  {
    id: 4,
    isbn: "978-602-291-004",
    judul: "Atomic Habits",
    penulis: "James Clear",
    penerbit: "Gramedia",
    tahun: 2018,
    kategori: "Non-Fiksi",
    halaman: 320,
    bahasa: "Indonesia",
    rating: 4.6,
    sinopsis:
      "Panduan praktis untuk membangun kebiasaan baik dan menghancurkan kebiasaan buruk. James Clear menjelaskan bahwa perubahan besar dimulai dari kebiasaan-kebiasaan kecil yang dilakukan secara konsisten setiap hari.",
  },
  {
    id: 5,
    isbn: "978-602-291-005",
    judul: "Clean Code",
    penulis: "Robert C. Martin",
    penerbit: "Prentice Hall",
    tahun: 2008,
    kategori: "Non-Fiksi",
    halaman: 464,
    bahasa: "Inggris",
    rating: 4.5,
    sinopsis:
      "Buku wajib bagi programmer yang ingin menulis kode yang bersih, mudah dibaca, dan mudah dipelihara. Robert C. Martin memberikan prinsip-prinsip dan best practice dalam pengembangan perangkat lunak profesional.",
  },
  {
    id: 6,
    isbn: "978-602-291-006",
    judul: "Sang Pemimpi",
    penulis: "Andrea Hirata",
    penerbit: "Bentang Pustaka",
    tahun: 2006,
    kategori: "Fiksi",
    halaman: 292,
    bahasa: "Indonesia",
    rating: 4.4,
    sinopsis:
      "Sekuel dari Laskar Pelangi yang mengisahkan petualangan Ikal, Arai, dan Jimbron di SMA Negeri Manggar. Mereka bermimpi untuk pergi ke Prancis dan mengejar pendidikan tinggi di Sorbonne.",
  },
  {
    id: 7,
    isbn: "978-602-291-007",
    judul: "Negeri 5 Menara",
    penulis: "Ahmad Fuadi",
    penerbit: "Gramedia",
    tahun: 2009,
    kategori: "Fiksi",
    halaman: 424,
    bahasa: "Indonesia",
    rating: 4.6,
    sinopsis:
      "Novel inspiratif tentang kehidupan enam santri di Pondok Madani. Dengan semangat man jadda wajada (siapa bersungguh-sungguh pasti berhasil), mereka menempa diri dan akhirnya meraih kesuksesan di berbagai penjuru dunia.",
  },
  {
    id: 8,
    isbn: "978-602-291-008",
    judul: "Sapiens",
    penulis: "Yuval Noah Harari",
    penerbit: "Harvill Secker",
    tahun: 2011,
    kategori: "Non-Fiksi",
    halaman: 443,
    bahasa: "Indonesia",
    rating: 4.7,
    sinopsis:
      "Sejarah singkat umat manusia dari zaman batu hingga era modern. Yuval Noah Harari mengeksplorasi bagaimana Homo sapiens menjadi spesies dominan di Bumi melalui revolusi kognitif, pertanian, dan sains.",
  },
  {
    id: 9,
    isbn: "978-602-291-009",
    judul: "Perahu Kertas",
    penulis: "Dee Lestari",
    penerbit: "Bentang Pustaka",
    tahun: 2009,
    kategori: "Fiksi",
    halaman: 444,
    bahasa: "Indonesia",
    rating: 4.3,
    sinopsis:
      "Novel tentang Kugy, gadis tomboy yang bercita-cita menjadi penulis dongeng, dan Keenan, pemuda berbakat seni yang memilih jalur bisnis demi keluarganya. Perjalanan mereka membuktikan bahwa cinta dan mimpi selalu menemukan jalannya.",
  },
  {
    id: 10,
    isbn: "978-602-291-010",
    judul: "The Lean Startup",
    penulis: "Eric Ries",
    penerbit: "Crown Business",
    tahun: 2011,
    kategori: "Non-Fiksi",
    halaman: 336,
    bahasa: "Inggris",
    rating: 4.4,
    sinopsis:
      "Metodologi untuk mengembangkan bisnis dan produk secara efisien. Eric Ries memperkenalkan konsep build-measure-learn yang membantu startup mengurangi risiko dan menemukan model bisnis yang berkelanjutan.",
  },
];

const INITIAL_USERS = [
  {
    id: 1,
    nama: "Administrator",
    email: "admin@gerbangliterasi.id",
    password: "admin123",
    role: "admin",
    tanggal_daftar: dateOffset(-90),
  },
  {
    id: 2,
    nama: "Budi Santoso",
    email: "user@gerbangliterasi.id",
    password: "user123",
    role: "user",
    tanggal_daftar: dateOffset(-60),
  },
  {
    id: 3,
    nama: "Dewi Nurhaliza",
    email: "dewi@email.com",
    password: "dewi123",
    role: "user",
    tanggal_daftar: dateOffset(-45),
  },
  {
    id: 4,
    nama: "Ahmad Syauqi",
    email: "ahmad@email.com",
    password: "ahmad123",
    role: "user",
    tanggal_daftar: dateOffset(-30),
  },
  {
    id: 5,
    nama: "Reza Hermawan",
    email: "reza@email.com",
    password: "reza123",
    role: "user",
    tanggal_daftar: dateOffset(-20),
  },
  {
    id: 6,
    nama: "Fatimah Indah",
    email: "fatimah@email.com",
    password: "fatimah123",
    role: "user",
    tanggal_daftar: dateOffset(-15),
  },
];

function generateInitialPeminjaman() {
  return [
    {
      id: 1,
      kode: "TRX-001",
      id_user: 2,
      id_buku: 1,
      tanggal_pinjam: dateOffset(-3),
      tanggal_kembali: dateOffset(4),
      tanggal_dikembalikan: null,
      status: "dipinjam",
    },
    {
      id: 2,
      kode: "TRX-002",
      id_user: 2,
      id_buku: 4,
      tanggal_pinjam: dateOffset(-6),
      tanggal_kembali: dateOffset(1),
      tanggal_dikembalikan: null,
      status: "dipinjam",
    },
    {
      id: 3,
      kode: "TRX-003",
      id_user: 3,
      id_buku: 2,
      tanggal_pinjam: dateOffset(-2),
      tanggal_kembali: dateOffset(5),
      tanggal_dikembalikan: null,
      status: "dipinjam",
    },
    {
      id: 4,
      kode: "TRX-004",
      id_user: 4,
      id_buku: 7,
      tanggal_pinjam: dateOffset(-10),
      tanggal_kembali: dateOffset(-3),
      tanggal_dikembalikan: null,
      status: "dipinjam",
    },
    {
      id: 5,
      kode: "TRX-005",
      id_user: 5,
      id_buku: 3,
      tanggal_pinjam: dateOffset(-15),
      tanggal_kembali: dateOffset(-8),
      tanggal_dikembalikan: dateOffset(-9),
      status: "dikembalikan",
    },
    {
      id: 6,
      kode: "TRX-006",
      id_user: 6,
      id_buku: 5,
      tanggal_pinjam: dateOffset(-20),
      tanggal_kembali: dateOffset(-13),
      tanggal_dikembalikan: dateOffset(-14),
      status: "dikembalikan",
    },
    {
      id: 7,
      kode: "TRX-007",
      id_user: 2,
      id_buku: 3,
      tanggal_pinjam: dateOffset(-25),
      tanggal_kembali: dateOffset(-18),
      tanggal_dikembalikan: dateOffset(-19),
      status: "dikembalikan",
    },
    {
      id: 8,
      kode: "TRX-008",
      id_user: 2,
      id_buku: 5,
      tanggal_pinjam: dateOffset(-35),
      tanggal_kembali: dateOffset(-28),
      tanggal_dikembalikan: dateOffset(-29),
      status: "dikembalikan",
    },
  ];
}

const INITIAL_ULASAN = [
  {
    id: 1,
    id_user: 4,
    id_buku: 1,
    rating: 5,
    komentar:
      "Novel yang sangat menginspirasi! Kisah perjuangan anak-anak Belitung ini benar-benar menyentuh hati.",
    tanggal: dateOffset(-5),
  },
  {
    id: 2,
    id_user: 6,
    id_buku: 1,
    rating: 4,
    komentar:
      "Ceritanya mengharukan dan penuh motivasi. Bahasa yang digunakan sangat indah dan puitis.",
    tanggal: dateOffset(-10),
  },
  {
    id: 3,
    id_user: 5,
    id_buku: 1,
    rating: 5,
    komentar:
      "Masterpiece sastra Indonesia! Mengajarkan arti perjuangan dan persahabatan sejati.",
    tanggal: dateOffset(-15),
  },
  {
    id: 4,
    id_user: 2,
    id_buku: 2,
    rating: 5,
    komentar:
      "Karya terbaik Pramoedya. Menggambarkan era kolonial dengan sangat detail dan emosional.",
    tanggal: dateOffset(-8),
  },
  {
    id: 5,
    id_user: 3,
    id_buku: 2,
    rating: 5,
    komentar: "Wajib dibaca oleh semua orang Indonesia. Sastra kelas dunia!",
    tanggal: dateOffset(-12),
  },
  {
    id: 6,
    id_user: 2,
    id_buku: 3,
    rating: 4,
    komentar:
      "Buku yang sangat membantu menghadapi kecemasan. Stoisisme dijelaskan dengan ringan.",
    tanggal: dateOffset(-20),
  },
  {
    id: 7,
    id_user: 4,
    id_buku: 4,
    rating: 5,
    komentar:
      "Mengubah cara pandang saya tentang kebiasaan. Sangat praktis dan applicable.",
    tanggal: dateOffset(-18),
  },
  {
    id: 8,
    id_user: 5,
    id_buku: 5,
    rating: 4,
    komentar:
      "Buku wajib programmer. Kode yang bersih adalah kode yang bertanggung jawab.",
    tanggal: dateOffset(-25),
  },
];

// ===== DATA STORE =====
const Store = {
  init() {
    if (!localStorage.getItem("gl_init")) {
      localStorage.setItem("gl_books", JSON.stringify(INITIAL_BOOKS));
      localStorage.setItem("gl_users", JSON.stringify(INITIAL_USERS));
      localStorage.setItem(
        "gl_peminjaman",
        JSON.stringify(generateInitialPeminjaman()),
      );
      localStorage.setItem("gl_ulasan", JSON.stringify(INITIAL_ULASAN));
      localStorage.setItem("gl_init", "true");
    }
  },
  get(key) {
    return JSON.parse(localStorage.getItem("gl_" + key) || "[]");
  },
  set(key, data) {
    localStorage.setItem("gl_" + key, JSON.stringify(data));
  },
  getBooks() {
    return this.get("books");
  },
  getUsers() {
    return this.get("users");
  },
  getPeminjaman() {
    return this.get("peminjaman");
  },
  getUlasan() {
    return this.get("ulasan");
  },
  getUserById(id) {
    return this.getUsers().find((u) => u.id === id);
  },
  getBookById(id) {
    return this.getBooks().find((b) => b.id === id);
  },
  nextId(key) {
    const items = this.get(key);
    return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  },
};
