/**** Script para criar DB SQLite e seed de usuário ****/
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const knex = require('knex');

const dbfile = path.resolve(__dirname, './data/app.db');
const dbdir = path.dirname(dbfile);
if (!fs.existsSync(dbdir)) fs.mkdirSync(dbdir, { recursive: true });

const db = knex({
  client: 'sqlite3',
  connection: { filename: dbfile },
  useNullAsDefault: true,
});

async function setup() {
  const hasUsers = await db.schema.hasTable('users');
  if (!hasUsers) {
    await db.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('username').unique().notNullable();
      table.string('password_hash').notNullable();
      table.string('name');
      table.string('role').defaultTo('user');
    });
    console.log('Tabela users criada');
  }

  const hasAnimes = await db.schema.hasTable('animes');
  if (!hasAnimes) {
    await db.schema.createTable('animes', table => {
      table.increments('id').primary();
      table.integer('mal_id');
      table.string('title').notNullable();
      table.string('title_english');
      table.string('type');
      table.string('season');
      table.integer('year');
      table.float('score');
      table.string('rating');
      table.text('synopsis');
      table.string('image_url');
      table.integer('created_by').references('users.id');
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('Tabela animes criada');
  }

  // seed user
  const exists = await db('users').where({ username: 'student1' }).first();
  if (!exists) {
    const hash = await bcrypt.hash('senha123', 10);
    await db('users').insert({ username: 'student1', password_hash: hash, name: 'Student One' });
    console.log('Usuário seed inserido: student1 / senha123');
  } else {
    console.log('Usuário seed já existe');
  }

  await db.destroy();
  console.log('Setup finalizado');
}

setup().catch(err => { console.error(err); process.exit(1); });
