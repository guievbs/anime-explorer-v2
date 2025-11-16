const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const AnimeModel = require('../models/AnimeModel');
const { query, validationResult } = require('express-validator');

function requireLogin(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Login necessário' });
  next();
}

// simple in-memory cache (per-process) - kept but safe
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 2; // 2 minutes

function normalizeApiItem(anime) {
  return {
    __source: 'api',
    mal_id: anime.mal_id ?? null,
    title: anime.title || (anime.titles && anime.titles[0] && anime.titles[0].title) || null,
    title_english: anime.title_english || null,
    type: anime.type || null,
    season: anime.season || null,
    year: anime.year ?? null,
    score: anime.score ?? null,
    rating: anime.rating || anime.rated || null,
    synopsis: anime.synopsis || anime.description || null,
    image_url: anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url || anime.image_url || null,
    raw: anime
  };
}

router.get('/',
  requireLogin,
  query('q').notEmpty().withMessage('Query obrigatória'),
  async (req, res) => {
    res.set('Cache-Control', 'no-store');
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
      const jikanResp = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=30&sfw=true`);
      let jikanJson = null;
      try { jikanJson = await jikanResp.json(); } catch(e) { jikanJson = null; }

      const apiData = Array.isArray(jikanJson?.data) ? jikanJson.data.map(normalizeApiItem) : [];

      let local = [];
      try { local = await AnimeModel.listByQuery(q); } catch (e) { console.warn('Erro ao buscar local:', e); local = []; }

      const localNormalized = (local || []).map(item => ({
        __source: 'local',
        mal_id: item.mal_id ?? null,
        id: item.id ?? null,
        title: item.title,
        title_english: item.title_english || null,
        type: item.type || null,
        season: item.season || null,
        year: item.year || null,
        score: item.score ?? null,
        rating: item.rating || null,
        synopsis: item.synopsis || null,
        image_url: item.image_url || null,
        raw: item
      }));

      const payload = { api: apiData, local: localNormalized };
      cache.set(cacheKey, { ts: now, data: payload });
      console.log(`[ANIME SEARCH] q="${q}" -> api:${apiData.length} local:${localNormalized.length}`);
      res.json(payload);
    } catch (err) {
      console.error('Erro ao buscar anime:', err);
      res.status(500).json({ error: 'Erro ao buscar' });
    }
  }
);

router.get('/random', requireLogin, async (req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    const jikan = await fetch(`https://api.jikan.moe/v4/random/anime?sfw=true`);
    const json = await jikan.json();
    const apiAnime = json.data ? [normalizeApiItem(json.data)] : [];

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

    const payload = { api: apiAnime, local: localAnime ? [{ __source: 'local', id: localAnime.id, title: localAnime.title, image_url: localAnime.image_url, raw: localAnime }] : [] };
    res.json(payload);
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

// DELETE /api/anime/:id - deleta anime local pelo id
router.delete('/:id', requireLogin, async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'id inválido' });
  try {
    const existing = await AnimeModel.findById(id);
    if (!existing) return res.status(404).json({ error: 'Anime não encontrado' });

    await AnimeModel.deleteById(id);
    res.json({ message: 'Excluído', id });
  } catch (e) {
    console.error('Erro ao deletar anime', e);
    res.status(500).json({ error: 'Erro ao deletar' });
  }
});

module.exports = router;
