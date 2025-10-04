/**
 * Qwen Routes - Endpoints para integración con Qwen API
 * Super-Son1k Backend
 */

const express = require('express');
const router = express.Router();
const QwenClient = require('../../services/qwenClient');
const { trackMetrics } = require('../middleware/metricsMiddleware');

// Aplicar middleware de métricas a todas las rutas
router.use(trackMetrics);

// Inicializar cliente Qwen
const qwenClient = new QwenClient({
  apiKey: process.env.QWEN_API_KEY,
  baseUrl: process.env.QWEN_BASE_URL || 'https://api.qwen.com/v1'
});

/**
 * Middleware de autenticación (opcional)
 */
const authenticate = (req, res, next) => {
  // Implementar autenticación según necesidades
  const token = req.headers.authorization;
  if (!token && process.env.REQUIRE_AUTH === 'true') {
    return res.status(401).json({ error: 'Token de autorización requerido' });
  }
  next();
};

/**
 * POST /pixel/qwen-analyze
 * Análisis técnico para Pixel (QA, logs, diffs)
 */
router.post('/pixel/qwen-analyze', authenticate, async (req, res) => {
  try {
    const { input, type = 'general', context = {} } = req.body;

    if (!input) {
      return res.status(400).json({ 
        error: 'Campo "input" es requerido' 
      });
    }

    let result;
    switch (type) {
      case 'logs':
        result = await qwenClient.analyzeLogs(input, context);
        break;
      case 'code':
        result = await qwenClient.analyzeTechnical(input);
        break;
      case 'prompt':
        result = await qwenClient.generateOptimizedPrompt(context.task, input);
        break;
      default:
        result = await qwenClient.analyzeTechnical(input);
    }

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      type: type
    });

  } catch (error) {
    console.error('Error en /pixel/qwen-analyze:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * POST /nova/qwen-copy
 * Generación de contenido para Nova Post Pilot
 */
router.post('/nova/qwen-copy', authenticate, async (req, res) => {
  try {
    const { 
      baseText, 
      platform, 
      metadata = {},
      count = 3 
    } = req.body;

    if (!baseText || !platform) {
      return res.status(400).json({ 
        error: 'Campos "baseText" y "platform" son requeridos' 
      });
    }

    const validPlatforms = ['tiktok', 'instagram', 'twitter', 'youtube'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      return res.status(400).json({ 
        error: `Plataforma no válida. Opciones: ${validPlatforms.join(', ')}` 
      });
    }

    const result = await qwenClient.generateSocialContent(
      baseText, 
      platform.toLowerCase(), 
      metadata
    );

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      platform: platform.toLowerCase()
    });

  } catch (error) {
    console.error('Error en /nova/qwen-copy:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * POST /clone/qwen-clean
 * Limpieza de datasets para Clone Station
 */
router.post('/clone/qwen-clean', authenticate, async (req, res) => {
  try {
    const { 
      transcriptions, 
      metadata = {},
      options = {} 
    } = req.body;

    if (!transcriptions || !Array.isArray(transcriptions)) {
      return res.status(400).json({ 
        error: 'Campo "transcriptions" debe ser un array' 
      });
    }

    const result = await qwenClient.cleanAudioDataset(transcriptions, metadata);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      processed_count: transcriptions.length
    });

  } catch (error) {
    console.error('Error en /clone/qwen-clean:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * POST /ghost/qwen-analyze
 * Análisis musical para Ghost Studio
 */
router.post('/ghost/qwen-analyze', authenticate, async (req, res) => {
  try {
    const { 
      audioMetadata, 
      stems = [],
      analysisType = 'full' 
    } = req.body;

    if (!audioMetadata) {
      return res.status(400).json({ 
        error: 'Campo "audioMetadata" es requerido' 
      });
    }

    const result = await qwenClient.analyzeMusic(audioMetadata, stems);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      analysis_type: analysisType,
      stems_count: stems.length
    });

  } catch (error) {
    console.error('Error en /ghost/qwen-analyze:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * GET /qwen/health
 * Health check del servicio Qwen
 */
router.get('/qwen/health', async (req, res) => {
  try {
    // Test básico de conectividad
    const testResult = await qwenClient.makeRequest('/models', {
      method: 'GET'
    });

    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      qwen_api: 'connected',
      available_models: testResult.data?.map(m => m.id) || []
    });

  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: 'Qwen API no disponible',
      message: error.message
    });
  }
});

/**
 * GET /qwen/status
 * Estado del servicio y configuración
 */
router.get('/qwen/status', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      service: 'Qwen Integration',
      version: '1.0.0',
      endpoints: {
        pixel: '/pixel/qwen-analyze',
        nova: '/nova/qwen-copy',
        clone: '/clone/qwen-clean',
        ghost: '/ghost/qwen-analyze',
        health: '/qwen/health'
      },
      configuration: {
        base_url: process.env.QWEN_BASE_URL || 'https://api.qwen.com/v1',
        timeout: 30000,
        max_retries: 3,
        auth_required: process.env.REQUIRE_AUTH === 'true'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estado del servicio',
      message: error.message
    });
  }
});

module.exports = router;