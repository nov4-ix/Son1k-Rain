/**
 * Metrics Routes - Endpoints para métricas en tiempo real
 * Super-Son1k Backend
 */

const express = require('express');
const router = express.Router();
const metricsService = require('../../services/metricsService');
const { trackMetricsEndpoint } = require('../middleware/metricsMiddleware');

// Aplicar middleware específico para métricas
router.use(trackMetricsEndpoint);

/**
 * Middleware de autenticación para métricas
 */
const authenticateMetrics = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token && process.env.REQUIRE_AUTH === 'true') {
    return res.status(401).json({ error: 'Token de autorización requerido para métricas' });
  }
  next();
};

/**
 * GET /metrics/current
 * Obtener métricas actuales
 */
router.get('/metrics/current', authenticateMetrics, async (req, res) => {
  try {
    const metrics = metricsService.getMetrics();
    
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /metrics/current:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo métricas',
      message: error.message
    });
  }
});

/**
 * GET /metrics/trends
 * Obtener tendencias y análisis
 */
router.get('/metrics/trends', authenticateMetrics, async (req, res) => {
  try {
    const trends = metricsService.getTrends();
    
    res.json({
      success: true,
      data: trends,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /metrics/trends:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo tendencias',
      message: error.message
    });
  }
});

/**
 * GET /metrics/period/:period
 * Obtener métricas por período
 */
router.get('/metrics/period/:period', authenticateMetrics, async (req, res) => {
  try {
    const { period } = req.params;
    const validPeriods = ['hour', 'day', 'week'];
    
    if (!validPeriods.includes(period)) {
      return res.status(400).json({
        error: `Período no válido. Opciones: ${validPeriods.join(', ')}`
      });
    }

    const metrics = metricsService.getMetricsByPeriod(period);
    
    res.json({
      success: true,
      data: metrics,
      period: period,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /metrics/period:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo métricas por período',
      message: error.message
    });
  }
});

/**
 * GET /metrics/alerts
 * Obtener alertas del sistema
 */
router.get('/metrics/alerts', authenticateMetrics, async (req, res) => {
  try {
    const alerts = metricsService.getAlerts();
    
    res.json({
      success: true,
      data: alerts,
      count: alerts.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /metrics/alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo alertas',
      message: error.message
    });
  }
});

/**
 * POST /metrics/track
 * Registrar evento de métrica
 */
router.post('/metrics/track', authenticateMetrics, async (req, res) => {
  try {
    const { 
      toolName, 
      success, 
      responseTime, 
      error, 
      userId, 
      action 
    } = req.body;

    if (!toolName || success === undefined || !responseTime) {
      return res.status(400).json({
        error: 'Campos requeridos: toolName, success, responseTime'
      });
    }

    // Registrar uso de herramienta
    metricsService.recordToolUsage(toolName, success, responseTime, error);
    
    // Registrar usuario activo si se proporciona
    if (userId && action) {
      metricsService.recordActiveUser(userId, action);
    }

    res.json({
      success: true,
      message: 'Métrica registrada exitosamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /metrics/track:', error);
    res.status(500).json({
      success: false,
      error: 'Error registrando métrica',
      message: error.message
    });
  }
});

/**
 * POST /metrics/api-usage
 * Registrar uso de API
 */
router.post('/metrics/api-usage', authenticateMetrics, async (req, res) => {
  try {
    const { 
      apiName, 
      success, 
      responseTime, 
      error 
    } = req.body;

    if (!apiName || success === undefined || !responseTime) {
      return res.status(400).json({
        error: 'Campos requeridos: apiName, success, responseTime'
      });
    }

    metricsService.recordAPIUsage(apiName, success, responseTime, error);

    res.json({
      success: true,
      message: 'Uso de API registrado exitosamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /metrics/api-usage:', error);
    res.status(500).json({
      success: false,
      error: 'Error registrando uso de API',
      message: error.message
    });
  }
});

/**
 * GET /metrics/health
 * Health check específico para métricas
 */
router.get('/metrics/health', async (req, res) => {
  try {
    const metrics = metricsService.getMetrics();
    const alerts = metricsService.getAlerts();
    
    const healthStatus = {
      status: alerts.length === 0 ? 'healthy' : 'warning',
      metrics: {
        uptime: metrics.uptime,
        memoryUsage: metrics.memoryUsage,
        cpuUsage: metrics.cpuUsage,
        totalGenerations: metrics.totalGenerations,
        activeUsers: metrics.activeUsers,
        concurrentUsers: metrics.concurrentUsers
      },
      alerts: alerts.length,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: healthStatus
    });

  } catch (error) {
    console.error('Error en /metrics/health:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo health check de métricas',
      message: error.message
    });
  }
});

/**
 * DELETE /metrics/reset
 * Reset métricas (solo para desarrollo)
 */
router.delete('/metrics/reset', authenticateMetrics, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        error: 'Reset de métricas no permitido en producción'
      });
    }

    metricsService.resetMetrics();

    res.json({
      success: true,
      message: 'Métricas reseteadas exitosamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /metrics/reset:', error);
    res.status(500).json({
      success: false,
      error: 'Error reseteando métricas',
      message: error.message
    });
  }
});

/**
 * GET /metrics/dashboard
 * Endpoint específico para dashboard con datos completos
 */
router.get('/metrics/dashboard', authenticateMetrics, async (req, res) => {
  try {
    const metrics = metricsService.getMetrics();
    const trends = metricsService.getTrends();
    const alerts = metricsService.getAlerts();
    
    const dashboardData = {
      overview: {
        totalGenerations: metrics.totalGenerations,
        generationsPerHour: metrics.generationsPerHour,
        activeUsers: metrics.activeUsers,
        concurrentUsers: metrics.concurrentUsers,
        uptime: metrics.uptime,
        systemHealth: metrics.systemHealth
      },
      tools: {
        pixel: metrics.pixelUsage,
        nova: metrics.novaUsage,
        clone: metrics.cloneUsage,
        ghost: metrics.ghostUsage,
        generator: metrics.generatorUsage
      },
      apis: {
        qwen: metrics.qwenAPI,
        suno: metrics.sunoAPI
      },
      system: {
        memoryUsage: metrics.memoryUsage,
        cpuUsage: metrics.cpuUsage,
        userSatisfaction: metrics.userSatisfaction
      },
      trends: trends,
      alerts: alerts,
      hourlyData: metrics.hourlyData,
      dailyData: metrics.dailyData,
      lastUpdated: metrics.lastUpdated
    };

    res.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /metrics/dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo datos del dashboard',
      message: error.message
    });
  }
});

module.exports = router;