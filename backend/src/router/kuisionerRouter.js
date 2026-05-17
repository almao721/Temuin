const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const response = require('../../utils/response');

// ✅ FIX 1: Safety check controller
const kuisionerController = require('../controller/kuisionerController');

// ✅ FIX 2: Debug & safety (akan hilangkan nanti)
console.log('kuisionerController methods:', Object.keys(kuisionerController || {}));
if (!kuisionerController) {
  console.error('❌ kuisionerController is NULL/UNDEFINED');
  process.exit(1);
}
if (!kuisionerController.create) {
  console.error('❌ kuisionerController.create is undefined!');
  process.exit(1);
}
if (!kuisionerController.getByLaporan) {
  console.error('❌ kuisionerController.getByLaporan is undefined!');
  process.exit(1);
}

// Middleware verify token biasa (siswa/pegawai)
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      return response.error(res, 'Token tidak ditemukan', 401);

    req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    response.error(res, 'Token tidak valid atau sudah kadaluarsa', 401);
  }
};

// POST /api/kuisioner         - siswa submit kuisioner setelah lapor kehilangan
router.post('/',               verifyToken, kuisionerController.create);

// GET  /api/kuisioner/:laporan_id - lihat kuisioner milik laporan sendiri
router.get('/:laporan_id',     verifyToken, kuisionerController.getByLaporan);

module.exports = router;