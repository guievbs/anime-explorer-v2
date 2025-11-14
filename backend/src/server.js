const express = require('express');
const session = require('express-session');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const animeRoutes = require('./routes/anime.routes');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan('combined'));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'troque_essa_sessao',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/anime', animeRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => logger.info('Backend rodando na porta ' + port));
