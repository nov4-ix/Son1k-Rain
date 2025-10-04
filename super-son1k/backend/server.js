/**
 * Super-Son1k Backend Server
 * Servidor principal para el monorepo Super-Son1k
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar rutas
const qwenRoutes = require('./routes/qwenRoutes');
const sunoRoutes = require('./routes/sunoRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de seguridad
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173'
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por ventana
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
  }
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check básico
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Super-Son1k Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/qwen', qwenRoutes);
app.use('/api/suno', sunoRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Super-Son1k Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      qwen: '/api/qwen',
      suno: '/api/suno',
      pixel: '/api/qwen/pixel/qwen-analyze',
      nova: '/api/qwen/nova/qwen-copy',
      clone: '/api/qwen/clone/qwen-clean',
      ghost: '/api/qwen/ghost/qwen-analyze',
      generator: '/api/suno/generator/generate-music'
    },
    documentation: '/docs'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler global
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  
  res.status(error.status || 500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Super-Son1k Backend corriendo en puerto ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base: http://localhost:${PORT}/api`);
  console.log(`🤖 Qwen integration: http://localhost:${PORT}/api/qwen`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n📋 Endpoints disponibles:`);
    console.log(`   GET  /health`);
    console.log(`   GET  /api/qwen/status`);
    console.log(`   GET  /api/qwen/health`);
    console.log(`   POST /api/qwen/pixel/qwen-analyze`);
    console.log(`   POST /api/qwen/nova/qwen-copy`);
    console.log(`   POST /api/qwen/clone/qwen-clean`);
    console.log(`   POST /api/qwen/ghost/qwen-analyze`);
    console.log(`   POST /api/suno/generator/generate-music`);
    console.log(`   POST /api/suno/generator/generate-lyrics`);
    console.log(`   POST /api/suno/generator/generate-style-prompt`);
  }
});

module.exports = app;