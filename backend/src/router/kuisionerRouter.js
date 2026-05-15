const express = require('express');
const router  = express.Router();

const kuisionerController = require('../controller/kuisionerController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/kuisioner            - siswa submit kuisioner
router.post('/',                verifyToken, kuisionerController.create);

// GET /api/kuisioner/:laporan_id - lihat kuisioner milik laporan sendiri
router.get('/:laporan_id',      verifyToken, kuisionerController.getByLaporan);

// PUT /api/kuisioner/:id         - update kuisioner
router.put('/:id',              verifyToken, kuisionerController.update);

module.exports = router;
