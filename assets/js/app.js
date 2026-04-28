// ============================================
// GERBANG LITERASI - Core Application Logic
// ============================================

// ===== UTILITY =====
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function daysBetween(d1, d2) {
  const a = new Date(d1),
    b = new Date(d2);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.ceil((b - a) / 86400000);
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function showAlert(el, msg, type) {
  if (!el) return;
  el.className = `alert alert-${type} py-2 small fade show`;
  el.innerHTML = msg;
  el.style.display = "block";
}

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

// ===== AUTO UPDATE STATUS =====
function autoUpdateStatus() {
  const peminjaman = Store.getPeminjaman();
  const books = Store.getBooks();
  const now = today();
  peminjaman.forEach((p) => {
    if (p.status === "dipinjam" && now > p.tanggal_kembali) {
      p.status = "dikembalikan";
      p.tanggal_dikembalikan = p.tanggal_kembali;
    }
  });
  books.forEach((b) => {
    const active = peminjaman.find(
      (p) => p.id_buku === b.id && p.status === "dipinjam",
    );
    b.status = active ? "dipinjam" : "tersedia";
  });
  Store.set("peminjaman", peminjaman);
  Store.set("books", books);
}

// ===== AUTH =====
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value;
  const alertBox = document.getElementById("loginAlert");
  if (!email || !pass) {
    showAlert(alertBox, "Mohon isi semua field!", "danger");
    return;
  }
  const users = Store.getUsers();
  const user = users.find((u) => u.email === email && u.password === pass);
  if (user) {
    showAlert(
      alertBox,
      '<i class="bi bi-check-circle me-1"></i>Login berhasil! Mengalihkan...',
      "success",
    );
    localStorage.setItem("gl_logged", "true");
    localStorage.setItem("gl_uid", user.id);
    localStorage.setItem("gl_role", user.role);
    localStorage.setItem("gl_name", user.nama);
    setTimeout(() => {
      window.location.href =
        user.role === "admin" ? "admin/dashboard.html" : "user/dashboard.html";
    }, 800);
  } else {
    showAlert(
      alertBox,
      '<i class="bi bi-x-circle me-1"></i>Email atau password salah!',
      "danger",
    );
    const card = document.querySelector(".login-form-inner");
    if (card) {
      card.style.animation = "none";
      card.offsetHeight;
      card.style.animation = "shake 0.5s ease";
    }
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const pass = document.getElementById("regPassword").value;
  const confirm = document.getElementById("regConfirm").value;
  const alertBox = document.getElementById("regAlert");
  if (!name || !email || !pass || !confirm) {
    showAlert(alertBox, "Mohon isi semua field!", "danger");
    return;
  }
  if (pass.length < 6) {
    showAlert(alertBox, "Password minimal 6 karakter!", "danger");
    return;
  }
  if (pass !== confirm) {
    showAlert(alertBox, "Password tidak cocok!", "danger");
    return;
  }
  const users = Store.getUsers();
  if (users.find((u) => u.email === email)) {
    showAlert(alertBox, "Email sudah terdaftar!", "danger");
    return;
  }
  users.push({
    id: Store.nextId("users"),
    nama: name,
    email,
    password: pass,
    role: "user",
    tanggal_daftar: today(),
  });
  Store.set("users", users);
  showAlert(
    alertBox,
    '<i class="bi bi-check-circle me-1"></i>Registrasi berhasil! Silakan login.',
    "success",
  );
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}

function checkAuth(role) {
  if (localStorage.getItem("gl_logged") !== "true") {
    window.location.href = role === "admin" ? "../login.html" : "../login.html";
    return false;
  }
  if (role && localStorage.getItem("gl_role") !== role) {
    window.location.href = "../login.html";
    return false;
  }
  return true;
}

function handleLogout(e) {
  e.preventDefault();
  ["gl_logged", "gl_uid", "gl_role", "gl_name"].forEach((k) =>
    localStorage.removeItem(k),
  );
  window.location.href =
    localStorage.getItem("gl_role") === "admin"
      ? "../index.html"
      : "../index.html";
}

function togglePassword() {
  const input = document.getElementById("loginPassword");
  const icon = document.querySelector(".password-toggle i");
  if (input && icon) {
    input.type = input.type === "password" ? "text" : "password";
    icon.className =
      input.type === "password" ? "bi bi-eye" : "bi bi-eye-slash";
  }
}

// ===== PEMINJAMAN LOGIC =====
function handlePinjam(bookId) {
  const alertBox = document.getElementById("pinjamAlert");
  if (localStorage.getItem("gl_logged") !== "true") {
    showAlert(
      alertBox,
      '<i class="bi bi-exclamation-triangle me-1"></i>Silakan <a href="login.html"><strong>login</strong></a> terlebih dahulu.',
      "warning",
    );
    return;
  }
  if (localStorage.getItem("gl_role") === "admin") {
    showAlert(
      alertBox,
      '<i class="bi bi-info-circle me-1"></i>Admin tidak dapat meminjam buku.',
      "info",
    );
    return;
  }
  const uid = parseInt(localStorage.getItem("gl_uid"));
  const peminjaman = Store.getPeminjaman();
  const books = Store.getBooks();
  const book = books.find((b) => b.id === bookId);
  const activeCount = peminjaman.filter(
    (p) => p.id_user === uid && p.status === "dipinjam",
  ).length;
  if (activeCount >= 3) {
    showAlert(
      alertBox,
      '<i class="bi bi-x-circle me-1"></i>Batas maksimal 3 buku bersamaan.',
      "danger",
    );
    return;
  }
  if (book.status === "dipinjam") {
    showAlert(
      alertBox,
      '<i class="bi bi-x-circle me-1"></i>Buku sedang dipinjam orang lain.',
      "danger",
    );
    return;
  }
  const newId = Store.nextId("peminjaman");
  peminjaman.push({
    id: newId,
    kode: "TRX-" + String(newId).padStart(3, "0"),
    id_user: uid,
    id_buku: bookId,
    tanggal_pinjam: today(),
    tanggal_kembali: dateOffset(7),
    tanggal_dikembalikan: null,
    status: "dipinjam",
  });
  book.status = "dipinjam";
  Store.set("peminjaman", peminjaman);
  Store.set("books", books);
  showAlert(
    alertBox,
    '<i class="bi bi-check-circle me-1"></i>Peminjaman berhasil! Masa pinjam 7 hari. Cek di <a href="user/dashboard.html"><strong>Dashboard</strong></a>.',
    "success",
  );
  const btn = document.getElementById("btnPinjam");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Sudah Dipinjam';
  }
}

function handleKembalikan(peminjamanId) {
  const peminjaman = Store.getPeminjaman();
  const books = Store.getBooks();
  const p = peminjaman.find((x) => x.id === peminjamanId);
  if (!p) return;
  p.tanggal_dikembalikan = today();
  p.status = "dikembalikan";
  const book = books.find((b) => b.id === p.id_buku);
  const stillActive = peminjaman.find(
    (x) => x.id !== p.id && x.id_buku === p.id_buku && x.status === "dipinjam",
  );
  if (book && !stillActive) book.status = "tersedia";
  Store.set("peminjaman", peminjaman);
  Store.set("books", books);
  location.reload();
}

// ===== SIDEBAR =====
function toggleSidebar() {
  const s = document.querySelector(".sidebar");
  const o = document.querySelector(".sidebar-overlay");
  if (s) s.classList.toggle("show");
  if (o) o.classList.toggle("show");
}

// ===== SEARCH =====
function searchBooks() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll(".book-row");
  rows.forEach((r) => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? "" : "none";
  });
}

// ===== SET USER INFO =====
function setUserInfo() {
  const n = document.getElementById("userName");
  const r = document.getElementById("userRole");
  if (n) n.textContent = localStorage.getItem("gl_name") || "User";
  if (r)
    r.textContent =
      localStorage.getItem("gl_role") === "admin" ? "Admin" : "Anggota";
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  Store.init();
  autoUpdateStatus();
  setUserInfo();
  // Shake animation
  const style = document.createElement("style");
  style.textContent =
    "@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}";
  document.head.appendChild(style);
  // Page-specific rendering
  if (document.getElementById("katalogBody")) renderKatalog();
  if (document.getElementById("bookDetailContainer")) renderDetailBuku();
  if (document.getElementById("userDashboard")) renderUserDashboard();
  if (document.getElementById("adminDashboard")) renderAdminDashboard();
  if (document.getElementById("kelolaBukuBody")) renderKelolaBuku();
  if (document.getElementById("peminjamanBody")) renderPeminjaman();
  if (document.getElementById("popularBooksGrid")) renderPopularBooks();
  if (document.getElementById("adminPreviewContainer"))
    renderAdminPreviewBuku();
});
