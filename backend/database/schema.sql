-- ============================================================
--  db_temuin_fix  –  Schema Lengkap
--  Jalankan file ini sekali di MySQL Anda
-- ============================================================

CREATE DATABASE IF NOT EXISTS db_temuin_fix
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE db_temuin_fix;

-- ── Tabel: user ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user (
  user_id    INT          NOT NULL AUTO_INCREMENT,
  nis_nip    VARCHAR(30)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('siswa','pegawai') NOT NULL DEFAULT 'siswa',
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  INDEX idx_nis_nip (nis_nip),
  INDEX idx_role    (role)
) ENGINE=InnoDB;

-- ── Tabel: lokasi ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lokasi (
  id          INT          NOT NULL AUTO_INCREMENT,
  nama_lokasi VARCHAR(150) NOT NULL,
  tipe_lokasi VARCHAR(100) DEFAULT NULL,
  icon        VARCHAR(100) DEFAULT NULL,
  status      TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ── Tabel: kategori ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kategori (
  id            INT          NOT NULL AUTO_INCREMENT,
  nama_kategori VARCHAR(100) NOT NULL,
  deskripsi     TEXT         DEFAULT NULL,
  icon_url      VARCHAR(255) DEFAULT NULL,
  status        TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ── Tabel: laporan (induk) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS laporan (
  id           INT      NOT NULL AUTO_INCREMENT,
  tipe_laporan ENUM('kehilangan','penemuan') NOT NULL,
  lokasi_id    INT      NOT NULL,
  user_id      INT      NOT NULL,
  kategori_id  INT      NOT NULL,
  status       ENUM('proses','selesai','ditolak') NOT NULL DEFAULT 'proses',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_tipe   (tipe_laporan),
  INDEX idx_status (status),
  INDEX idx_user   (user_id),
  FOREIGN KEY (lokasi_id)   REFERENCES lokasi   (id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id)     REFERENCES user      (user_id) ON DELETE CASCADE,
  FOREIGN KEY (kategori_id) REFERENCES kategori  (id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ── Tabel: laporan_penemuan ──────────────────────────────────
CREATE TABLE IF NOT EXISTS laporan_penemuan (
  id            INT          NOT NULL AUTO_INCREMENT,
  laporan_id    INT          NOT NULL UNIQUE,
  nama_barang   VARCHAR(200) NOT NULL,
  kategori      VARCHAR(100) DEFAULT NULL,
  deskripsi     TEXT         DEFAULT NULL,
  foto_barang   VARCHAR(255) DEFAULT NULL,
  detail_lokasi TEXT         DEFAULT NULL,
  waktu_insiden DATETIME     NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (laporan_id) REFERENCES laporan (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Tabel: laporan_kehilangan ────────────────────────────────
CREATE TABLE IF NOT EXISTS laporan_kehilangan (
  id                  INT          NOT NULL AUTO_INCREMENT,
  laporan_id          INT          NOT NULL UNIQUE,
  barang_tipe         VARCHAR(200) NOT NULL,
  keterangan_lainnya  TEXT         DEFAULT NULL,
  waktu_insiden       DATETIME     NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (laporan_id) REFERENCES laporan (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Tabel: kuisioner_laporan ─────────────────────────────────
--  Diisi siswa setelah membuat laporan kehilangan
--  (form step: jenis barang, warna, deskripsi, brand, waktu, lokasi)
CREATE TABLE IF NOT EXISTS kuisioner_laporan (
  id               INT          NOT NULL AUTO_INCREMENT,
  laporan_id       INT          NOT NULL UNIQUE,
  jenis_barang     VARCHAR(100) NOT NULL  COMMENT 'Dompet / Gelang / Cincin / Kalung / dll',
  warna_barang     VARCHAR(100) DEFAULT NULL,
  deskripsi_detail TEXT         DEFAULT NULL,
  brand_merk       VARCHAR(150) DEFAULT NULL,
  waktu_terakhir   VARCHAR(200) DEFAULT NULL  COMMENT 'Waktu terakhir terlihat (teks bebas)',
  lokasi_terakhir  VARCHAR(255) DEFAULT NULL  COMMENT 'Lokasi terakhir terlihat',
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (laporan_id) REFERENCES laporan (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
--  Seed Data
-- ============================================================

-- Lokasi default (sekolah)
INSERT IGNORE INTO lokasi (id, nama_lokasi, tipe_lokasi) VALUES
  (1, 'Kelas',          'ruangan'),
  (2, 'Kantin',         'area umum'),
  (3, 'Lapangan',       'area terbuka'),
  (4, 'Perpustakaan',   'ruangan'),
  (5, 'Toilet',         'ruangan'),
  (6, 'Parkiran',       'area terbuka'),
  (7, 'Aula',           'ruangan'),
  (8, 'Koridor',        'area umum'),
  (9, 'Lainnya',        'lainnya');

-- Kategori barang
INSERT IGNORE INTO kategori (id, nama_kategori, deskripsi) VALUES
  (1, 'Aksesoris', 'Gelang, kalung, cincin, jam tangan, dll'),
  (2, 'Elektronik','HP, laptop, earphone, charger, dll'),
  (3, 'Dompet & Tas', 'Dompet, tas, koper, dll'),
  (4, 'Buku',      'Buku pelajaran, buku tulis, dll'),
  (5, 'Pakaian',   'Seragam, jaket, topi, dll'),
  (6, 'Lainnya',   'Barang lain yang tidak terkategori');

-- Akun admin default (password: admin123)
INSERT IGNORE INTO user (nis_nip, password, role, is_active) VALUES
  ('admin001',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
   'pegawai', 1);

-- ============================================================
--  Catatan password hash di atas = bcrypt('password', 10)
--  Untuk admin001 gunakan password "password" saat testing,
--  lalu segera ganti melalui endpoint reset-password.
-- ============================================================
