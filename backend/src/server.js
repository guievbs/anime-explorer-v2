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

// Logger simples com winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

const app = express();

// Segurança e compressão
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan('combined'));

// CORS - permitir credenciais apenas da origem do frontend
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// Preflight handler and CORS options
const corsOptions = {
  origin: function(origin, callback) {
    // origin === undefined for same-origin requests, curl, etc.
    if (!origin || origin === FRONTEND_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET','POST','OPTIONS','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','Accept']
};

// Quick preflight response for OPTIONS
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    return res.sendStatus(204);
  }
  next();
});

app.use(cors(corsOptions));

// Sessão (dev): sameSite 'lax' e secure false em HTTP local
app.use(session({
  secret: process.env.SESSION_SECRET || 'troque_essa_sessao',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,      // true somente em produção com HTTPS
    httpOnly: true,
    sameSite: 'lax'     // 'none' requer secure:true + HTTPS
  }
}));

// Rate limiter básico para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Rotas
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/anime', animeRoutes);

// Healthcheck
app.get('/api/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => logger.info(`Backend rodando na porta ${port} (FRONTEND_ORIGIN=${FRONTEND_ORIGIN})`));
