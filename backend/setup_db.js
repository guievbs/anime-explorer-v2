/**** Script para criar DB SQLite e seed de usuário + anime real ****/
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

  // seed admin user (substitui student1)
  const adminUser = await db('users').where({ username: 'admin' }).first();
  if (!adminUser) {
    const hash = await bcrypt.hash('senha123', 10);
    const [id] = await db('users').insert({ username: 'admin', password_hash: hash, name: 'Admin', role: 'admin' });
    console.log('Usuário seed inserido: admin / senha123 (role=admin)');
  } else {
    console.log('Usuário admin já existe');
  }

  // ensure admin id
  const admin = await db('users').where({ username: 'admin' }).first();

  // remove old test anime(s) with title like 'Teste Local' if exist
  await db('animes').where('title', 'Teste Local').del();

  // insert a real anime seed (if not exists). Using Fullmetal Alchemist: Brotherhood as example
  const existsAnime = await db('animes').where({ title: 'Fullmetal Alchemist: Brotherhood' }).first();
  if (!existsAnime) {
    await db('animes').insert({
      mal_id: 5114,
      title: 'Fullmetal Alchemist: Brotherhood',
      title_english: 'Fullmetal Alchemist: Brotherhood',
      type: 'TV',
      season: 'Spring',
      year: 2009,
      score: 9.2,
      rating: 'R',
      synopsis: 'Two brothers search for a Philosopher\'s Stone after an attempt to revive their dead mother goes horribly wrong.',
      image_url: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg',
      created_by: admin.id
    });
    console.log('Anime seed inserido: Fullmetal Alchemist: Brotherhood');
  } else {
    console.log('Anime seed já existe');
  }

  await db.destroy();
  console.log('Setup finalizado');
}

setup().catch(err => { console.error(err); process.exit(1); });
