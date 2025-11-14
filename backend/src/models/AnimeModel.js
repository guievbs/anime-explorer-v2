const db = require('../config/db');

class AnimeModel {
  static async insert(data) {
    const [id] = await db('animes').insert(data);
    return db('animes').where({ id }).first();
  }

  static async listByQuery(query) {
    if (!query) return db('animes').select('*').limit(50);
    return db('animes').where('title', 'like', `%${query}%`).limit(50);
  }

  static async listRandom() {
    return db('animes').orderByRaw('RANDOM()').first();
  }

  static async findById(id) {
    return db('animes').where({ id }).first();
  }
}

module.exports = AnimeModel;
