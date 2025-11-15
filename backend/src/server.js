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
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan('combined'));

// Permitir múltiplas origens de frontend em dev
const FRONTEND_ORIGINS = [
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  'http://127.0.0.1:5173'
];

// CORS options: aceita as origens listadas e permite credenciais
const corsOptions = {
  origin: function(origin, callback) {
    // permitir requests sem origin (curl, server-side)
    if (!origin) return callback(null, true);
    if (FRONTEND_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error('Origin not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET','POST','OPTIONS','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','Accept']
};

// Preflight handler: responde com o origin enviado pelo browser
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin || FRONTEND_ORIGINS[0];
    res.header('Access-Control-Allow-Origin', origin);
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
app.listen(port, () => logger.info(`Backend rodando na porta ${port} (FRONTEND_ORIGINS=${FRONTEND_ORIGINS.join(',')})`));
