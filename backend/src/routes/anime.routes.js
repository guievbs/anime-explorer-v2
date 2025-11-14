const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const AnimeModel = require('../models/AnimeModel');
const { query, validationResult } = require('express-validator');

function requireLogin(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Login necessário' });
  next();
}

// simple in-memory cache (per-process)
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 2; // 2 minutes

router.get('/',
  requireLogin,
  query('q').notEmpty().withMessage('Query obrigatória'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const q = req.query.q;
    const cacheKey = `search:${q}`;
    const now = Date.now();
    if (cache.has(cacheKey)) {
      const entry = cache.get(cacheKey);
      if (now - entry.ts < CACHE_TTL) return res.json(entry.data);
      else cache.delete(cacheKey);
    }

    try {
      const jikan = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=30&sfw=true`);
      const json = await jikan.json();
      const data = json.data || [];

      const nq = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const filtered = data.filter(anime => {
        const titles = [anime.title, anime.title_english, ...(anime.titles?.map(t => t.title)||[])].filter(Boolean);
        return titles.some(t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(nq));
      });

      const local = await AnimeModel.listByQuery(q);
      const payload = { api: filtered, local };
      cache.set(cacheKey, { ts: now, data: payload });
      res.json(payload);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar' });
    }
  }
);

router.get('/random', requireLogin, async (req, res) => {
  try {
    const jikan = await fetch(`https://api.jikan.moe/v4/random/anime?sfw=true`);
    const json = await jikan.json();
    const apiAnime = json.data ? [json.data] : [];

    let localAnime = null;
    try {
      localAnime = await AnimeModel.listRandom ? await AnimeModel.listRandom() : null;
      if (!localAnime) {
        const localAll = await AnimeModel.listByQuery('');
        if (localAll && localAll.length) {
          localAnime = localAll[Math.floor(Math.random() * localAll.length)];
        }
      }
    } catch (e) {
      console.warn('Erro ao obter local random', e);
    }

    res.json({ api: apiAnime, local: localAnime ? [localAnime] : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar aleatório' });
  }
});

router.post('/', requireLogin, async (req, res) => {
  const payload = req.body;
  if (!payload.title) return res.status(400).json({ error: 'title é obrigatório' });

  try {
    const record = {
      mal_id: payload.mal_id || null,
      title: payload.title,
      title_english: payload.title_english || null,
      type: payload.type || null,
      season: payload.season || null,
      year: payload.year || null,
      score: payload.score || null,
      rating: payload.rating || null,
      synopsis: payload.synopsis || null,
      image_url: payload.image_url || null,
      created_by: req.session.user.id
    };
    const inserted = await AnimeModel.insert(record);
    res.status(201).json(inserted);
  } catch(err){
    console.error(err);
    res.status(500).json({ error: 'Erro ao inserir' });
  }
});

module.exports = router;
