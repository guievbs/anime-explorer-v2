const knex = require('knex');
const path = require('path');

const db = knex({
  client: 'sqlite3',
  connection: { filename: path.resolve(__dirname, '../../data/app.db') },
  useNullAsDefault: true,
});

module.exports = db;
