const db = require('../config/db');
const bcrypt = require('bcrypt');

class UserModel {
  static async findByUsername(username) {
    return db('users').where({ username }).first();
  }

  static async findById(id) {
    return db('users').where({ id }).first();
  }

  static async validatePassword(user, plainPassword) {
    if (!user) return false;
    return bcrypt.compare(plainPassword, user.password_hash);
  }

  static async create(username, plainPassword, name = null) {
    const hash = await bcrypt.hash(plainPassword, 10);
    const [id] = await db('users').insert({ username, password_hash: hash, name });
    return this.findById(id);
  }
}

module.exports = UserModel;
