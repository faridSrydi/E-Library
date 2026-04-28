// ============================================
// GERBANG LITERASI - Page Renderers
// ============================================

// ===== STATUS BADGE =====
function statusBadge(status) {
  if (status === "tersedia")
    return '<span class="badge-available">Tersedia</span>';
  if (status === "dipinjam")
    return '<span class="badge-borrowed">Dipinjam</span>';

  if (status === "dikembalikan")
    return '<span class="badge-available">Dikembalikan</span>';
  return "";
}

function starsHtml(rating) {
  let s = "";
  for (let i = 1; i <= 5; i++) s += i <= Math.round(rating) ? "★" : "☆";
  return `<span class="stars">${s}</span>`;
}

// ===== KATALOG =====
function renderKatalog() {
  const books = Store.getBooks();
  const tbody = document.getElementById("katalogBody");
  if (!tbody) return;
  tbody.innerHTML = books
    .map((b, i) => {
      const colors = [
        "#2a8fe1",
        "#2563eb",
        "#16a34a",
        "#d97706",
        "#8b5cf6",
        "#ec4899",
      ];
      const color = colors[b.id % colors.length];
      return `
    <tr class="book-row">
      <td>${i + 1}</td>
      <td><code class="isbn-code">${b.isbn}</code></td>
      <td>
        <div class="d-flex align-items-center gap-3">
          <div class="shadow-sm" style="background:${color}; width: 40px; height: 56px; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="bi bi-book text-white" style="font-size:0.8rem;"></i></div>
          <div>
            <a href="detail-buku.html?id=${b.id}" class="fw-bold book-link mb-1 d-block" style="font-size:0.9rem;">${b.judul}</a>
            <span class="text-muted" style="font-size:0.75rem;">${b.penulis}</span>
          </div>
        </div>
      </td>
      <td>${b.tahun}</td>
      <td><span class="badge-kategori ${b.kategori === "Fiksi" ? "fiksi" : "nonfiksi"}">${b.kategori}</span></td>
      <td>${statusBadge(b.status || "tersedia")}</td>
      <td><a href="detail-buku.html?id=${b.id}" class="btn btn-sm btn-outline-custom" style="padding:3px 10px;font-size:0.76rem;"><i class="bi bi-eye"></i></a></td>
    </tr>
  `;
    })
    .join("");
  document.getElementById("bookCount").textContent =
    `Menampilkan ${books.length} buku`;
}

// ===== DETAIL BUKU =====
function renderDetailBuku() {
  const params = new URLSearchParams(window.location.search);
  const bookId = parseInt(params.get("id"));
  if (!bookId) {
    window.location.href = "katalog.html";
    return;
  }
  const book = Store.getBookById(bookId);
  if (!book) {
    window.location.href = "katalog.html";
    return;
  }
  const ulasan = Store.getUlasan().filter((u) => u.id_buku === bookId);
  const peminjaman = Store.getPeminjaman()
    .filter((p) => p.id_buku === bookId)
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);
  const container = document.getElementById("bookDetailContainer");
  document.title = `${book.judul} — Gerbang Literasi`;

  const isLogged = localStorage.getItem("gl_logged") === "true";
  const uid = parseInt(localStorage.getItem("gl_uid"));
  const alreadyBorrowed = Store.getPeminjaman().find(
    (p) => p.id_user === uid && p.id_buku === bookId && p.status === "dipinjam",
  );
  const btnDisabled = book.status === "dipinjam" || alreadyBorrowed;
  const btnText = alreadyBorrowed
    ? '<i class="bi bi-check-lg me-2"></i>Sudah Dipinjam'
    : book.status === "dipinjam"
      ? '<i class="bi bi-x-circle me-2"></i>Tidak Tersedia'
      : '<i class="bi bi-bookmark-plus me-2"></i>Pinjam Buku Ini';

  container.innerHTML = `
    <a href="katalog.html" class="btn btn-outline-custom mb-4" style="padding:7px 16px;font-size:0.84rem;"><i class="bi bi-arrow-left me-1"></i> Kembali ke Katalog</a>
    <div class="row g-4">
      <div class="col-lg-4">
        <div class="book-cover-box mb-3">
          <div class="book-cover-mock"><i class="bi bi-book"></i><div class="title">${book.judul}</div><div class="author">${book.penulis}</div></div>
        </div>
        <button id="btnPinjam" class="btn btn-primary-custom w-100 mb-3" style="padding:12px;" onclick="handlePinjam(${book.id})" ${btnDisabled ? "disabled" : ""}>${btnText}</button>
        <div id="pinjamAlert" class="alert py-2 small" style="display:none;" role="alert"></div>
        <div class="card-clean">
          <div class="p-3 border-bottom"><h6 class="fw-bold mb-0"><i class="bi bi-info-circle me-2 text-primary"></i>Informasi Buku</h6></div>
          <div class="p-3">
            ${[
              ["bi-upc-scan", "ISBN", book.isbn, "blue"],
              ["bi-person", "Penulis", book.penulis, "blue"],
              ["bi-building", "Penerbit", book.penerbit, "green"],
              ["bi-calendar3", "Tahun Terbit", book.tahun, "amber"],
              [
                "bi-file-earmark-text",
                "Halaman",
                book.halaman + " halaman",
                "purple",
              ],
              ["bi-translate", "Bahasa", book.bahasa, "pink"],
              [
                "bi-check-circle",
                "Status",
                statusBadge(book.status || "tersedia"),
                "green",
              ],
            ]
              .map(
                ([icon, label, val, color]) => `
              <div class="meta-item"><div class="meta-icon ${color}"><i class="bi ${icon}"></i></div><div><div class="meta-label">${label}</div><div class="meta-value">${val}</div></div></div>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="mb-4">
          <div class="d-flex gap-2 mb-2">
            <span class="badge-kategori ${book.kategori === "Fiksi" ? "fiksi" : "nonfiksi"}">${book.kategori}</span>
          </div>
          <h3 class="fw-bold mb-1">${book.judul}</h3>
          <p class="text-muted mb-0">oleh <strong class="text-primary">${book.penulis}</strong></p>
        </div>
        <div class="card-clean mb-4">
          <div class="p-3 border-bottom"><h6 class="fw-bold mb-0"><i class="bi bi-journal-richtext me-2 text-primary"></i>Sinopsis</h6></div>
          <div class="p-3"><p style="line-height:1.8;color:var(--text-secondary);">${book.sinopsis}</p></div>
        </div>
        <div class="card-clean mb-4">
          <div class="p-3 border-bottom"><h6 class="fw-bold mb-0"><i class="bi bi-star me-2" style="color:var(--warning);"></i>Rating & Ulasan</h6></div>
          <div class="p-3">
            <div class="row g-4 mb-3">
              <div class="col-sm-4 text-center">
                <div class="rating-big">${book.rating}</div>
                <div class="stars mb-1">${starsHtml(book.rating)}</div>
                <div class="text-muted small">${ulasan.length} ulasan</div>
              </div>
              <div class="col-sm-8">
                ${[5, 4, 3, 2, 1]
                  .map((star) => {
                    const count = ulasan.filter(
                      (u) => u.rating === star,
                    ).length;
                    const pct = ulasan.length
                      ? Math.round((count / ulasan.length) * 100)
                      : 0;
                    return `<div class="d-flex align-items-center gap-2 mb-1"><span class="small text-muted" style="width:22px;">${star}★</span><div class="progress flex-grow-1" style="height:6px;"><div class="progress-bar" style="width:${pct}%;background:var(--warning);"></div></div><span class="small text-muted" style="width:32px;">${pct}%</span></div>`;
                  })
                  .join("")}
              </div>
            </div>
            ${
              ulasan
                .map((u) => {
                  const user = Store.getUserById(u.id_user);
                  return `<div class="review-card"><div class="d-flex align-items-center gap-2 mb-2"><div class="avatar avatar-sm">${user ? getInitials(user.nama) : "?"}</div><div><div class="fw-semibold small">${user ? user.nama : "Anonim"}</div><div class="text-muted" style="font-size:0.72rem;">${formatDate(u.tanggal)}</div></div><div class="ms-auto stars small">${starsHtml(u.rating)}</div></div><p class="small text-muted mb-0">${u.komentar}</p></div>`;
                })
                .join("") || '<p class="text-muted small">Belum ada ulasan.</p>'
            }
          </div>
        </div>
        <div class="card-clean">
          <div class="p-3 border-bottom"><h6 class="fw-bold mb-0"><i class="bi bi-people me-2 text-primary"></i>Peminjam Terakhir</h6></div>
          <div class="p-3">
            ${
              peminjaman.length
                ? peminjaman
                    .map((p) => {
                      const user = Store.getUserById(p.id_user);
                      return `<div class="borrower-item"><div class="avatar avatar-sm">${user ? getInitials(user.nama) : "?"}</div><div class="flex-grow-1"><div class="fw-semibold small">${user ? user.nama : "-"}</div><div class="text-muted" style="font-size:0.72rem;">Anggota</div></div><div class="text-end"><div class="small">${formatDate(p.tanggal_pinjam)} — ${formatDate(p.tanggal_kembali)}</div>${statusBadge(p.status)}</div></div>`;
                    })
                    .join("")
                : '<p class="text-muted small">Belum ada peminjam.</p>'
            }
          </div>
        </div>
      </div>
    </div>`;
}

// ===== ADMIN PREVIEW BUKU =====
function renderAdminPreviewBuku() {
  const params = new URLSearchParams(window.location.search);
  const bookId = parseInt(params.get("id"));
  if (!bookId) {
    window.location.href = "kelola-buku.html";
    return;
  }
  const book = Store.getBookById(bookId);
  if (!book) {
    window.location.href = "kelola-buku.html";
    return;
  }
  const peminjaman = Store.getPeminjaman()
    .filter((p) => p.id_buku === bookId)
    .sort((a, b) => b.id - a.id);

  const container = document.getElementById("adminPreviewContainer");
  if (!container) return;
  document.title = `Preview: ${book.judul} — Admin`;

  container.innerHTML = `
    <div class="row g-4">
      <div class="col-lg-4">
        <div class="book-cover-box mb-3">
          <div class="book-cover-mock"><i class="bi bi-book"></i><div class="title">${book.judul}</div><div class="author">${book.penulis}</div></div>
        </div>
        <div class="card-clean mb-3">
          <div class="p-3 border-bottom"><h6 class="fw-bold mb-0"><i class="bi bi-info-circle me-2 text-primary"></i>Statistik Buku</h6></div>
          <div class="p-3">
            <div class="d-flex justify-content-between mb-2 small"><span class="text-muted">Total Dipinjam</span><span class="fw-bold">${peminjaman.length} kali</span></div>
            <div class="d-flex justify-content-between mb-2 small"><span class="text-muted">Sedang Dipinjam</span><span class="fw-bold text-primary">${peminjaman.filter((p) => p.status === "dipinjam").length} user</span></div>
            <div class="d-flex justify-content-between small"><span class="text-muted">Rating Rata-rata</span><span class="fw-bold text-warning">⭐ ${book.rating}</span></div>
          </div>
        </div>
        <div class="card-clean">
          <div class="p-3 border-bottom"><h6 class="fw-bold mb-0"><i class="bi bi-list-ul me-2 text-primary"></i>Detail Buku</h6></div>
          <div class="p-3">
            ${[
              ["bi-upc-scan", "ISBN", book.isbn, "blue"],
              ["bi-person", "Penulis", book.penulis, "blue"],
              ["bi-building", "Penerbit", book.penerbit, "green"],
              ["bi-calendar3", "Tahun Terbit", book.tahun, "amber"],
              [
                "bi-file-earmark-text",
                "Halaman",
                book.halaman + " halaman",
                "purple",
              ],
              ["bi-translate", "Bahasa", book.bahasa, "pink"],
              [
                "bi-check-circle",
                "Status",
                statusBadge(book.status || "tersedia"),
                "green",
              ],
            ]
              .map(
                ([icon, label, val, color]) => `
              <div class="meta-item"><div class="meta-icon ${color}"><i class="bi ${icon}"></i></div><div><div class="meta-label">${label}</div><div class="meta-value">${val}</div></div></div>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="mb-4">
          <div class="d-flex gap-2 mb-2">
            <span class="badge-kategori ${book.kategori === "Fiksi" ? "fiksi" : "nonfiksi"}">${book.kategori}</span>
          </div>
          <h3 class="fw-bold mb-1">${book.judul}</h3>
          <p class="text-muted mb-0">oleh <strong class="text-primary">${book.penulis}</strong></p>
        </div>
        <div class="card-clean mb-4">
          <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
             <h6 class="fw-bold mb-0"><i class="bi bi-journal-richtext me-2 text-primary"></i>Sinopsis</h6>
          </div>
          <div class="p-3"><p style="line-height:1.8;color:var(--text-secondary);">${book.sinopsis}</p></div>
        </div>
        
        <div class="card-clean">
          <div class="p-3 border-bottom"><h6 class="fw-bold mb-0"><i class="bi bi-people me-2 text-primary"></i>Riwayat Peminjaman</h6></div>
          <div class="p-3">
            <div class="table-responsive">
              <table class="table table-clean mb-0">
                <thead><tr><th>Peminjam</th><th>Tgl Pinjam</th><th>Tgl Kembali</th><th>Status</th></tr></thead>
                <tbody>
                  ${
                    peminjaman.length
                      ? peminjaman
                          .map((p) => {
                            const u = Store.getUserById(p.id_user);
                            return `<tr>
                      <td><div class="d-flex align-items-center gap-2"><div class="avatar avatar-sm">${u ? getInitials(u.nama) : "?"}</div><div style="font-size:0.85rem;" class="fw-medium">${u ? u.nama : "-"}</div></div></td>
                      <td>${formatDate(p.tanggal_pinjam)}</td>
                      <td>${formatDate(p.tanggal_kembali)}</td>
                      <td>${statusBadge(p.status)}</td>
                    </tr>`;
                          })
                          .join("")
                      : '<tr><td colspan="4" class="text-center text-muted small py-3">Belum ada riwayat peminjaman.</td></tr>'
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== POPULAR BOOKS (Landing) =====
function renderPopularBooks() {
  const books = Store.getBooks()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const grid = document.getElementById("popularBooksGrid");
  if (!grid) return;
  const colors = ["#2a8fe1", "#2563eb", "#16a34a", "#d97706"];
  const bgs = [
    "linear-gradient(135deg,#deeefb,#b3d4f7)",
    "linear-gradient(135deg,#dbeafe,#bfdbfe)",
    "linear-gradient(135deg,#dcfce7,#bbf7d0)",
    "linear-gradient(135deg,#fef3c7,#fde68a)",
  ];
  grid.innerHTML = books
    .map(
      (b, i) => `
    <div class="col-lg-3 col-md-6">
      <div class="card-clean p-3 h-100">
        <div style="background:${bgs[i]};border-radius:8px;padding:1.5rem;text-align:center;margin-bottom:1rem;">
          <div style="width:90px;height:130px;margin:0 auto;background:${colors[i]};border-radius:4px;box-shadow:0 4px 12px ${colors[i]}40;display:flex;align-items:center;justify-content:center;">
            <i class="bi bi-book text-white" style="font-size:1.5rem;opacity:0.5;"></i>
          </div>
        </div>
        <h6 class="fw-bold mb-1">${b.judul}</h6>
        <p class="text-muted small mb-2">${b.penulis}</p>
        <div class="d-flex align-items-center justify-content-between">
          <span style="color:var(--warning);font-size:0.82rem;">${starsHtml(b.rating)} <span class="text-muted">${b.rating}</span></span>
          ${statusBadge(b.status || "tersedia")}
        </div>
        <a href="detail-buku.html?id=${b.id}" class="btn btn-outline-custom w-100 mt-3" style="padding:7px;font-size:0.82rem;">Lihat Detail</a>
      </div>
    </div>
  `,
    )
    .join("");
}

// ===== USER DASHBOARD =====
function renderUserDashboard() {
  const uid = parseInt(localStorage.getItem("gl_uid"));
  const allP = Store.getPeminjaman().filter((p) => p.id_user === uid);
  const active = allP.filter((p) => p.status === "dipinjam");
  const returned = allP.filter((p) => p.status === "dikembalikan");
  const minDays = active.length
    ? Math.min(...active.map((p) => daysBetween(today(), p.tanggal_kembali)))
    : 0;

  document.getElementById("statActive").textContent = active.length;
  document.getElementById("statReturned").textContent = returned.length;
  document.getElementById("statDays").textContent =
    minDays > 0 ? minDays + " Hari" : active.length ? "Hari ini!" : "-";

  const activeGrid = document.getElementById("activeBooks");
  activeGrid.innerHTML = active.length
    ? active
        .map((p) => {
          const b = Store.getBookById(p.id_buku);
          const days = daysBetween(today(), p.tanggal_kembali);
          const urgency = days <= 1 ? "amber" : days <= 3 ? "blue" : "green";
          const label = days === 0 ? "Hari ini!" : `${days} hari lagi`;
          return `<div class="col-md-6"><div class="d-flex gap-3 p-3 rounded active-book-card">
      <div class="book-mini" style="background:var(--primary);"><i class="bi bi-book text-white"></i></div>
      <div class="flex-grow-1">
        <h6 class="fw-bold mb-1 small">${b ? b.judul : "-"}</h6>
        <p class="text-muted mb-1" style="font-size:0.75rem;">${b ? b.penulis : "-"}</p>
        <p class="mb-1" style="font-size:0.75rem;">Dipinjam: <strong>${formatDate(p.tanggal_pinjam)}</strong></p>
        <p class="mb-0" style="font-size:0.75rem;">Kembali: <strong>${formatDate(p.tanggal_kembali)}</strong></p>
        <span class="badge-countdown ${urgency}">${label}</span>
      </div></div></div>`;
        })
        .join("")
    : '<div class="col-12"><p class="text-muted small text-center py-3">Tidak ada buku yang sedang dipinjam.</p></div>';

  const historyBody = document.getElementById("historyBody");
  historyBody.innerHTML =
    allP
      .sort((a, b) => b.id - a.id)
      .map((p) => {
        const b = Store.getBookById(p.id_buku);
        const colors = [
          "#2a8fe1",
          "#2563eb",
          "#16a34a",
          "#d97706",
          "#8b5cf6",
          "#ec4899",
        ];
        const color = b ? colors[b.id % colors.length] : "#ccc";
        return `<tr>
          <td>
            <div class="d-flex align-items-center gap-3">
              <div class="shadow-sm" style="background:${color}; width: 32px; height: 44px; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="bi bi-book text-white" style="font-size:0.6rem;"></i></div>
              <div>
                <div class="fw-semibold" style="font-size:0.85rem;">${b ? b.judul : "-"}</div>
                <div class="text-muted" style="font-size:0.7rem;">${b ? b.penulis : "-"}</div>
              </div>
            </div>
          </td>
          <td>${formatDate(p.tanggal_pinjam)}</td><td>${formatDate(p.tanggal_kembali)}</td><td>${statusBadge(p.status)}</td>
        </tr>`;
      })
      .join("") ||
    '<tr><td colspan="4" class="text-center text-muted">Belum ada riwayat.</td></tr>';
}

// ===== ADMIN DASHBOARD =====
function renderAdminDashboard() {
  const books = Store.getBooks();
  const users = Store.getUsers().filter((u) => u.role === "user");
  const peminjaman = Store.getPeminjaman();
  const borrowed = peminjaman.filter((p) => p.status === "dipinjam").length;

  document.getElementById("statBooks").textContent = books.length;
  document.getElementById("statMembers").textContent = users.length;
  document.getElementById("statBorrowed").textContent = borrowed;

  const tbody = document.getElementById("recentBorrows");
  const recent = peminjaman.sort((a, b) => b.id - a.id).slice(0, 5);
  tbody.innerHTML = recent
    .map((p) => {
      const u = Store.getUserById(p.id_user);
      const b = Store.getBookById(p.id_buku);
      const colors = [
        "#2a8fe1",
        "#2563eb",
        "#16a34a",
        "#d97706",
        "#8b5cf6",
        "#ec4899",
      ];
      const color = b ? colors[b.id % colors.length] : "#ccc";
      return `<tr>
        <td><div class="d-flex align-items-center gap-2"><div class="avatar avatar-sm">${u ? getInitials(u.nama) : "?"}</div><div style="font-size:0.85rem;" class="fw-medium">${u ? u.nama : "-"}</div></div></td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="shadow-sm" style="background:${color}; width: 28px; height: 38px; border-radius: 3px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="bi bi-book text-white" style="font-size:0.5rem;"></i></div>
            <div class="fw-semibold" style="font-size:0.8rem;">${b ? b.judul : "-"}</div>
          </div>
        </td>
        <td>${formatDate(p.tanggal_pinjam)}</td><td>${statusBadge(p.status)}</td>
      </tr>`;
    })
    .join("");

  const popList = document.getElementById("popularList");
  const topBooks = [...books].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const colors = ["#2a8fe1", "#2563eb", "#16a34a", "#d97706", "#dc2626"];
  popList.innerHTML = topBooks
    .map(
      (b, i) => `
    <div class="d-flex align-items-center gap-3 mb-3 p-2 rounded" style="background:var(--bg);">
      <div style="width:36px;height:48px;border-radius:4px;background:${colors[i]};display:flex;align-items:center;justify-content:center;"><i class="bi bi-book text-white" style="font-size:0.8rem;"></i></div>
      <div class="flex-grow-1"><div class="fw-semibold small">${b.judul}</div><div class="text-muted" style="font-size:0.72rem;">${b.penulis}</div></div>
      <span class="badge" style="background:#fef3c7;color:#92400e;font-size:0.7rem;">⭐ ${b.rating}</span>
    </div>
  `,
    )
    .join("");
}

// ===== ADMIN KELOLA BUKU =====
function renderKelolaBuku() {
  const books = Store.getBooks();
  const tbody = document.getElementById("kelolaBukuBody");
  tbody.innerHTML = books
    .map((b, i) => {
      const colors = [
        "#2a8fe1",
        "#2563eb",
        "#16a34a",
        "#d97706",
        "#8b5cf6",
        "#ec4899",
      ];
      const color = colors[b.id % colors.length];
      return `
    <tr class="book-row"><td>${i + 1}</td><td><code class="isbn-code">${b.isbn}</code></td>
    <td>
      <div class="d-flex align-items-center gap-3">
        <div class="shadow-sm" style="background:${color}; width: 36px; height: 50px; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="bi bi-book text-white" style="font-size:0.7rem;"></i></div>
        <div>
          <div class="fw-semibold mb-1" style="font-size:0.85rem;">${b.judul}</div>
          <div class="text-muted" style="font-size:0.72rem;">${b.penulis}</div>
        </div>
      </div>
    </td>
    <td>${b.tahun}</td>
    <td><span class="badge-kategori ${b.kategori === "Fiksi" ? "fiksi" : "nonfiksi"}">${b.kategori}</span></td>
    <td>${statusBadge(b.status || "tersedia")}</td>
    <td>
      <a href="preview-buku.html?id=${b.id}" class="btn btn-sm btn-outline-custom me-1" style="padding:3px 8px;font-size:0.74rem;" title="Preview"><i class="bi bi-eye"></i></a><button class="btn btn-sm btn-outline-custom me-1" style="padding:3px 8px;font-size:0.74rem;" onclick="editBuku(${b.id})" title="Edit"><i class="bi bi-pencil"></i></button><button class="btn btn-sm btn-delete" onclick="hapusBuku(${b.id})" title="Hapus"><i class="bi bi-trash"></i></button>
    </td></tr>
  `;
    })
    .join("");
}

function simpanBuku() {
  const isbn = document.getElementById("inputIsbn").value.trim();
  const judul = document.getElementById("inputJudul").value.trim();
  const penulis = document.getElementById("inputPenulis").value.trim();
  const tahun = parseInt(document.getElementById("inputTahun").value);
  const kategori = document.getElementById("inputKategori").value;
  const halaman = parseInt(document.getElementById("inputHalaman").value) || 0;
  const sinopsis = document.getElementById("inputSinopsis").value.trim();
  if (!isbn || !judul || !penulis || !tahun) {
    alert("Mohon isi semua field wajib!");
    return;
  }
  const books = Store.getBooks();
  const editId = document.getElementById("editBookId").value;
  if (editId) {
    const b = books.find((x) => x.id === parseInt(editId));
    if (b) {
      Object.assign(b, {
        isbn,
        judul,
        penulis,
        tahun,
        kategori,
        halaman,
        sinopsis,
      });
    }
  } else {
    books.push({
      id: Store.nextId("books"),
      isbn,
      judul,
      penulis,
      penerbit: "-",
      tahun,
      kategori,
      halaman,
      bahasa: "Indonesia",
      rating: 0,
      sinopsis,
      status: "tersedia",
    });
  }
  Store.set("books", books);
  bootstrap.Modal.getInstance(document.getElementById("modalTambah")).hide();
  renderKelolaBuku();
}

function editBuku(id) {
  const b = Store.getBookById(id);
  if (!b) return;
  document.getElementById("editBookId").value = b.id;
  document.getElementById("inputIsbn").value = b.isbn;
  document.getElementById("inputJudul").value = b.judul;
  document.getElementById("inputPenulis").value = b.penulis;
  document.getElementById("inputTahun").value = b.tahun;
  document.getElementById("inputKategori").value = b.kategori;
  document.getElementById("inputHalaman").value = b.halaman;
  document.getElementById("inputSinopsis").value = b.sinopsis || "";
  document.getElementById("modalTitle").textContent = "Edit Buku";
  new bootstrap.Modal(document.getElementById("modalTambah")).show();
}

function hapusBuku(id) {
  const p = Store.getPeminjaman().find(
    (x) => x.id_buku === id && x.status === "dipinjam",
  );
  if (p) {
    alert("Buku sedang dipinjam, tidak bisa dihapus!");
    return;
  }
  if (!confirm("Yakin ingin menghapus buku ini?")) return;
  const books = Store.getBooks().filter((b) => b.id !== id);
  Store.set("books", books);
  renderKelolaBuku();
}

function resetModal() {
  document.getElementById("editBookId").value = "";
  document.getElementById("modalTitle").textContent = "Tambah Buku Baru";
  document
    .querySelectorAll(
      "#modalTambah input, #modalTambah textarea, #modalTambah select",
    )
    .forEach((el) => {
      if (el.tagName === "SELECT") el.selectedIndex = 0;
      else el.value = "";
    });
}

// ===== ADMIN PEMINJAMAN =====
function renderPeminjaman() {
  const peminjaman = Store.getPeminjaman().sort((a, b) => b.id - a.id);
  const tbody = document.getElementById("peminjamanBody");
  const active = peminjaman.filter((p) => p.status === "dipinjam").length;
  const returned = peminjaman.filter((p) => p.status === "dikembalikan").length;
  document.getElementById("pStatActive").textContent = active;
  document.getElementById("pStatReturned").textContent = returned;
  document.getElementById("pStatTotal").textContent = peminjaman.length;

  tbody.innerHTML = peminjaman
    .map((p) => {
      const u = Store.getUserById(p.id_user);
      const b = Store.getBookById(p.id_buku);
      const canReturn = p.status === "dipinjam";
      const colors = [
        "#2a8fe1",
        "#2563eb",
        "#16a34a",
        "#d97706",
        "#8b5cf6",
        "#ec4899",
      ];
      const color = b ? colors[b.id % colors.length] : "#ccc";
      return `<tr class="book-row" data-status="${p.status}">
        <td><code class="isbn-code">${p.kode}</code></td>
        <td><div class="d-flex align-items-center gap-2"><div class="avatar avatar-sm">${u ? getInitials(u.nama) : "?"}</div><div class="fw-medium" style="font-size:0.85rem;">${u ? u.nama : "-"}</div></div></td>
        <td class="text-muted small">${u ? u.email : "-"}</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="shadow-sm" style="background:${color}; width: 32px; height: 44px; border-radius: 3px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="bi bi-book text-white" style="font-size:0.6rem;"></i></div>
            <div>
              <div class="fw-semibold" style="font-size:0.85rem;">${b ? b.judul : "-"}</div>
              <div class="text-muted" style="font-size:0.7rem;">${b ? b.penulis : "-"}</div>
            </div>
          </div>
        </td>
        <td>${formatDate(p.tanggal_pinjam)}</td><td>${formatDate(p.tanggal_kembali)}</td><td>${statusBadge(p.status)}</td>
        <td>${canReturn ? `<button class="btn btn-sm btn-return" onclick="handleKembalikan(${p.id})"><i class="bi bi-check-lg me-1"></i>Kembalikan</button>` : '<span class="text-muted small">—</span>'}</td>
      </tr>`;
    })
    .join("");
}

function filterPeminjaman(status) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  event.target.classList.add("active");
  document.querySelectorAll("#peminjamanBody tr").forEach((r) => {
    r.style.display = !status || r.dataset.status === status ? "" : "none";
  });
}
