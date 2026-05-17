const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../../models/userModel');
const response = require('../../utils/response');

const authController = {
  login: async (req, res) => {
    try {
      const { nis_nip, password } = req.body;
      
      if (!/^\d+$/.test(nis_nip)) {
        return response.error(res, 'NIS/NIP hanya boleh berisi angka', 400);
      }
      
      const user = await UserModel.findByNisNip(nis_nip);
      
      if (!user) {
        return response.error(res, 'NIS/NIP atau password salah', 401);
      }
      
      if (user.is_active !== 1) {
        return response.error(res, 'Akun Anda tidak aktif. Hubungi administrator.', 401);
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
        user: {
          user_id: user.user_id,
          nis_nip: user.nis_nip,
          role: user.role
        }
      }, 'Login berhasil');
      
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  register: async (req, res) => {
    try {
          const { nis_nip, password, role = 'siswa' } = req.body;

      if (!/^\d+$/.test(nis_nip)) {
        return response.error(res, 'NIS/NIP hanya boleh berisi angka', 400);
}
      
      const existingUser = await UserModel.findByNisNip(nis_nip);
      if (existingUser) {
        return response.error(res, 'NIS/NIP sudah terdaftar', 409);
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = await UserModel.create({
        nis_nip,
        password: hashedPassword,
        role
      });
      
      response.success(res, { user_id: result.insertId }, 'Registrasi berhasil', 201);
      
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  }
};

module.exports = authController;