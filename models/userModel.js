const db = require('../src/config/db');  // Sesuaikan path ke db.js

const userModel = {
  create: async (userData) => {
    const { nis_nip, password, role } = userData;
    const [result] = await db.execute(
      'INSERT INTO user (nis_nip, password, role, is_active) VALUES (?, ?, ?, 1)',
      [nis_nip, password, role]
    );
    return result;
  },
  
  findByNisNip: async (nis_nip) => {
    const [rows] = await db.execute(
      'SELECT user_id, nis_nip, password, role, is_active FROM user WHERE nis_nip = ?',
      [nis_nip]
    );
    return rows[0];
  },
  
  findById: async (user_id) => {
    const [rows] = await db.execute(
      'SELECT user_id, nis_nip, role, is_active, created_at FROM user WHERE user_id = ?',
      [user_id]
    );
    return rows[0];
  },
  
  getAll: async () => {
    const [rows] = await db.execute(
      'SELECT user_id, nis_nip, role, is_active, created_at FROM user ORDER BY created_at DESC'
    );
    return rows;
  },
  
  update: async (user_id, userData) => {
    const { nis_nip, role, is_active } = userData;
    const [result] = await db.execute(
      'UPDATE user SET nis_nip = ?, role = ?, is_active = ? WHERE user_id = ?',
      [nis_nip, role, is_active, user_id]
    );
    return result;
  },
  
  updatePassword: async (user_id, password) => {
    const [result] = await db.execute(
      'UPDATE user SET password = ? WHERE user_id = ?',
      [password, user_id]
    );
    return result;
  },
  
  delete: async (user_id) => {
    const [result] = await db.execute('DELETE FROM user WHERE user_id = ?', [user_id]);
    return result;
  },
  
  toggleActive: async (user_id) => {
    const [result] = await db.execute(
      'UPDATE user SET is_active = NOT is_active WHERE user_id = ?',
      [user_id]
    );
    return result;
  }
};

module.exports = userModel;