const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');

// POST /api/auth/register
// cria usuário (username único). Retorna 201 com user (sem password_hash)
router.post('/register', async (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username e password são obrigatórios' });
  try {
    const existing = await UserModel.findByUsername(username);
    if (existing) return res.status(409).json({ error: 'Usuário já existe' });
    const created = await UserModel.create(username, password, name || null);
    // não enviar password_hash
    delete created.password_hash;
    res.status(201).json({ user: { id: created.id, username: created.username, name: created.name } });
  } catch (err) {
    console.error('register error', err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuário e senha obrigatórios' });

  try {
    const user = await UserModel.findByUsername(username);
    const ok = await UserModel.validatePassword(user, password);
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

    req.session.user = { id: user.id, username: user.username, name: user.name, role: user.role };
    res.json({ message: 'Login OK', user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao autenticar' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Erro ao encerrar sessão' });
    res.json({ message: 'Logout realizado' });
  });
});

router.get('/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Não autenticado' });
  res.json({ user: req.session.user });
});

module.exports = router;
