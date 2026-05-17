const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../../models/userModel');
const response = require('../../utils/response');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { nis_nip, password } = req.body;
    
    if (!nis_nip || !password) {
      return response.error(res, 'NIS/NIP dan password wajib diisi', 400);
    }
    
    const user = await UserModel.findByNisNip(nis_nip);
    if (!user) {
      return response.error(res, 'NIS/NIP atau password salah', 401);
    }
    
    if (user.is_active !== 1) {
      return response.error(res, 'Akun Anda tidak aktif', 401);
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.error(res, 'NIS/NIP atau password salah', 401);
    }
    
    const token = jwt.sign(
      { user_id: user.user_id, nis_nip: user.nis_nip, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    response.success(res, {
      token,
      user: { user_id: user.user_id, nis_nip: user.nis_nip, role: user.role }
    }, 'Login berhasil');
    
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

module.exports = router;