/**
 * Metrics Middleware - Middleware para tracking automático de métricas
 * Super-Son1k Backend
 */

const metricsService = require('../../services/metricsService');

/**
 * Middleware para tracking automático de métricas
 */
const trackMetrics = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  // Interceptar la respuesta
  res.send = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Determinar el tipo de herramienta basado en la ruta
    let toolName = 'unknown';
    let apiName = 'unknown';
    
    if (req.path.includes('/pixel/')) {
      toolName = 'pixel';
      apiName = 'qwen';
    } else if (req.path.includes('/nova/')) {
      toolName = 'nova';
      apiName = 'qwen';
    } else if (req.path.includes('/clone/')) {
      toolName = 'clone';
      apiName = 'qwen';
    } else if (req.path.includes('/ghost/')) {
      toolName = 'ghost';
      apiName = 'qwen';
    } else if (req.path.includes('/generator/')) {
      toolName = 'generator';
      apiName = 'suno';
    }

    // Determinar si fue exitoso
    const success = res.statusCode >= 200 && res.statusCode < 400;
    
    // Registrar métricas de herramienta
    if (toolName !== 'unknown') {
      metricsService.recordToolUsage(toolName, success, responseTime);
    }
    
    // Registrar métricas de API
    if (apiName !== 'unknown') {
      metricsService.recordAPIUsage(apiName, success, responseTime);
    }

    // Registrar usuario activo si hay token
    const userId = req.headers.authorization ? 'authenticated_user' : 'anonymous_user';
    if (userId) {
      metricsService.recordActiveUser(userId, {
        tool: toolName,
        success: success,
        duration: responseTime,
        endpoint: req.path,
        method: req.method
      });
    }

    // Llamar al método original
    originalSend.call(this, data);
  };

  next();
};

/**
 * Middleware específico para endpoints de métricas
 */
const trackMetricsEndpoint = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Registrar métricas del endpoint de métricas
    metricsService.recordToolUsage('metrics', res.statusCode < 400, responseTime);
    
    originalSend.call(this, data);
  };

  next();
};

module.exports = {
  trackMetrics,
  trackMetricsEndpoint
};