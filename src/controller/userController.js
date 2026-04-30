const bcrypt = require('bcryptjs');
const UserModel = require('../../models/userModel');
const response = require('../../utils/response');

const userController = {
  // Get all users (admin only)
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getAll();
      response.success(res, users, 'Berhasil mengambil data user');
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      
      if (!user) {
        return response.error(res, 'User tidak ditemukan', 404);
      }
      
      response.success(res, user, 'Berhasil mengambil data user');
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  // Create user (admin only)
  createUser: async (req, res) => {
    try {
      const { nis_nip, password, role } = req.body;
      
      if (!nis_nip || !password || !role) {
        return response.error(res, 'NIS/NIP, password, dan role wajib diisi', 400);
      }
      
      const existingUser = await UserModel.findByNisNip(nis_nip);
      if (existingUser) {
        return response.error(res, 'NIS/NIP sudah terdaftar', 409);
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = await UserModel.create({ nis_nip, password: hashedPassword, role });
      response.success(res, { user_id: result.insertId }, 'User berhasil dibuat', 201);
      
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  // Update user (admin only)
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { nis_nip, role, is_active } = req.body;
      
      const user = await UserModel.findById(id);
      if (!user) {
        return response.error(res, 'User tidak ditemukan', 404);
      }
      
      await UserModel.update(id, {
        nis_nip: nis_nip || user.nis_nip,
        role: role || user.role,
        is_active: is_active !== undefined ? is_active : user.is_active
      });
      
      response.success(res, null, 'User berhasil diupdate');
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  // Delete user (admin only)
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      
      if (!user) {
        return response.error(res, 'User tidak ditemukan', 404);
      }
      
      await UserModel.delete(id);
      response.success(res, null, 'User berhasil dihapus');
      
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  // Toggle active status (admin only)
  toggleActive: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      
      if (!user) {
        return response.error(res, 'User tidak ditemukan', 404);
      }
      
      await UserModel.toggleActive(id);
      response.success(res, null, 'Status user berhasil diubah');
      
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  }
};

module.exports = userController;