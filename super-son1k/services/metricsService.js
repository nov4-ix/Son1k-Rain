/**
 * Metrics Service - Servicio de métricas en tiempo real
 * Super-Son1k Monorepo
 */

class MetricsService {
  constructor() {
    this.metrics = {
      // Métricas de uso
      totalGenerations: 0,
      generationsPerHour: 0,
      activeUsers: 0,
      concurrentUsers: 0,
      
      // Métricas por herramienta
      pixelUsage: { count: 0, success: 0, errors: 0, avgTime: 0 },
      novaUsage: { count: 0, success: 0, errors: 0, avgTime: 0 },
      cloneUsage: { count: 0, success: 0, errors: 0, avgTime: 0 },
      ghostUsage: { count: 0, success: 0, errors: 0, avgTime: 0 },
      generatorUsage: { count: 0, success: 0, errors: 0, avgTime: 0 },
      
      // Métricas de APIs
      qwenAPI: { requests: 0, success: 0, errors: 0, avgResponseTime: 0 },
      sunoAPI: { requests: 0, success: 0, errors: 0, avgResponseTime: 0 },
      
      // Métricas de sistema
      systemHealth: 'healthy',
      memoryUsage: 0,
      cpuUsage: 0,
      uptime: 0,
      
      // Métricas de contenido
      popularPrompts: [],
      trendingStyles: [],
      userSatisfaction: 0,
      
      // Timestamps
      lastUpdated: new Date(),
      startTime: new Date()
    };
    
    this.hourlyData = [];
    this.dailyData = [];
    this.realTimeConnections = new Set();
    
    this.startMetricsCollection();
  }

  /**
   * Iniciar recolección de métricas
   */
  startMetricsCollection() {
    // Actualizar métricas cada 5 segundos
    setInterval(() => {
      this.updateSystemMetrics();
      this.broadcastMetrics();
    }, 5000);

    // Limpiar datos antiguos cada hora
    setInterval(() => {
      this.cleanupOldData();
    }, 3600000);

    // Calcular métricas por hora
    setInterval(() => {
      this.calculateHourlyMetrics();
    }, 3600000);
  }

  /**
   * Registrar uso de herramienta
   */
  recordToolUsage(toolName, success, responseTime, error = null) {
    const tool = this.metrics[`${toolName}Usage`];
    if (!tool) return;

    tool.count++;
    tool.avgTime = (tool.avgTime * (tool.count - 1) + responseTime) / tool.count;
    
    if (success) {
      tool.success++;
    } else {
      tool.errors++;
    }

    this.metrics.totalGenerations++;
    this.metrics.lastUpdated = new Date();
  }

  /**
   * Registrar uso de API
   */
  recordAPIUsage(apiName, success, responseTime, error = null) {
    const api = this.metrics[`${apiName}API`];
    if (!api) return;

    api.requests++;
    api.avgResponseTime = (api.avgResponseTime * (api.requests - 1) + responseTime) / api.requests;
    
    if (success) {
      api.success++;
    } else {
      api.errors++;
    }
  }

  /**
   * Registrar usuario activo
   */
  recordActiveUser(userId, action) {
    this.metrics.activeUsers++;
    this.metrics.lastUpdated = new Date();
    
    // Trackear acciones específicas
    this.trackUserAction(userId, action);
  }

  /**
   * Trackear acción de usuario
   */
  trackUserAction(userId, action) {
    const actionData = {
      userId,
      action,
      timestamp: new Date(),
      tool: action.tool,
      success: action.success,
      duration: action.duration
    };

    // Agregar a datos por hora
    this.hourlyData.push(actionData);
  }

  /**
   * Actualizar métricas del sistema
   */
  updateSystemMetrics() {
    const memUsage = process.memoryUsage();
    this.metrics.memoryUsage = Math.round(memUsage.heapUsed / 1024 / 1024); // MB
    this.metrics.uptime = process.uptime();
    
    // Simular CPU usage (en producción usar os.cpus())
    this.metrics.cpuUsage = Math.random() * 100;
    
    // Calcular usuarios concurrentes
    this.metrics.concurrentUsers = this.realTimeConnections.size;
    
    // Calcular generaciones por hora
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);
    const recentGenerations = this.hourlyData.filter(
      data => data.timestamp > oneHourAgo
    );
    this.metrics.generationsPerHour = recentGenerations.length;
  }

  /**
   * Calcular métricas por hora
   */
  calculateHourlyMetrics() {
    const hourlySnapshot = {
      timestamp: new Date(),
      totalGenerations: this.metrics.totalGenerations,
      activeUsers: this.metrics.activeUsers,
      toolUsage: {
        pixel: { ...this.metrics.pixelUsage },
        nova: { ...this.metrics.novaUsage },
        clone: { ...this.metrics.cloneUsage },
        ghost: { ...this.metrics.ghostUsage },
        generator: { ...this.metrics.generatorUsage }
      },
      apiUsage: {
        qwen: { ...this.metrics.qwenAPI },
        suno: { ...this.metrics.sunoAPI }
      },
      systemHealth: this.metrics.systemHealth,
      memoryUsage: this.metrics.memoryUsage,
      cpuUsage: this.metrics.cpuUsage
    };

    this.dailyData.push(hourlySnapshot);
    
    // Mantener solo últimos 24 horas
    if (this.dailyData.length > 24) {
      this.dailyData.shift();
    }
  }

  /**
   * Limpiar datos antiguos
   */
  cleanupOldData() {
    const oneHourAgo = new Date(Date.now() - 3600000);
    this.hourlyData = this.hourlyData.filter(
      data => data.timestamp > oneHourAgo
    );
  }

  /**
   * Obtener métricas actuales
   */
  getMetrics() {
    return {
      ...this.metrics,
      hourlyData: this.hourlyData.slice(-60), // Últimos 60 minutos
      dailyData: this.dailyData,
      realTimeConnections: this.realTimeConnections.size
    };
  }

  /**
   * Obtener métricas por período
   */
  getMetricsByPeriod(period = 'hour') {
    const now = new Date();
    let startTime;
    
    switch (period) {
      case 'hour':
        startTime = new Date(now.getTime() - 3600000);
        break;
      case 'day':
        startTime = new Date(now.getTime() - 86400000);
        break;
      case 'week':
        startTime = new Date(now.getTime() - 604800000);
        break;
      default:
        startTime = new Date(now.getTime() - 3600000);
    }

    return this.hourlyData.filter(data => data.timestamp > startTime);
  }

  /**
   * Obtener tendencias
   */
  getTrends() {
    const trends = {
      usageGrowth: this.calculateGrowthRate(),
      popularTools: this.getPopularTools(),
      peakHours: this.getPeakHours(),
      errorRate: this.calculateErrorRate(),
      userSatisfaction: this.calculateUserSatisfaction()
    };

    return trends;
  }

  /**
   * Calcular tasa de crecimiento
   */
  calculateGrowthRate() {
    if (this.dailyData.length < 2) return 0;
    
    const current = this.dailyData[this.dailyData.length - 1];
    const previous = this.dailyData[this.dailyData.length - 2];
    
    return ((current.totalGenerations - previous.totalGenerations) / previous.totalGenerations) * 100;
  }

  /**
   * Obtener herramientas populares
   */
  getPopularTools() {
    const tools = ['pixel', 'nova', 'clone', 'ghost', 'generator'];
    return tools
      .map(tool => ({
        name: tool,
        usage: this.metrics[`${tool}Usage`].count,
        success: this.metrics[`${tool}Usage`].success,
        errors: this.metrics[`${tool}Usage`].errors
      }))
      .sort((a, b) => b.usage - a.usage);
  }

  /**
   * Obtener horas pico
   */
  getPeakHours() {
    const hourCounts = new Array(24).fill(0);
    
    this.hourlyData.forEach(data => {
      const hour = data.timestamp.getHours();
      hourCounts[hour]++;
    });

    const maxCount = Math.max(...hourCounts);
    const peakHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .filter(item => item.count === maxCount)
      .map(item => item.hour);

    return peakHours;
  }

  /**
   * Calcular tasa de error
   */
  calculateErrorRate() {
    const totalRequests = Object.values(this.metrics)
      .filter(metric => typeof metric === 'object' && metric.errors !== undefined)
      .reduce((sum, metric) => sum + metric.errors, 0);
    
    const totalSuccess = Object.values(this.metrics)
      .filter(metric => typeof metric === 'object' && metric.success !== undefined)
      .reduce((sum, metric) => sum + metric.success, 0);

    const total = totalRequests + totalSuccess;
    return total > 0 ? (totalRequests / total) * 100 : 0;
  }

  /**
   * Calcular satisfacción del usuario
   */
  calculateUserSatisfaction() {
    // Basado en éxito de generaciones y tiempo de respuesta
    const successRate = this.calculateSuccessRate();
    const avgResponseTime = this.calculateAvgResponseTime();
    
    // Fórmula simple de satisfacción
    let satisfaction = successRate;
    
    // Penalizar por tiempos de respuesta altos
    if (avgResponseTime > 10000) { // > 10 segundos
      satisfaction -= 10;
    } else if (avgResponseTime > 5000) { // > 5 segundos
      satisfaction -= 5;
    }

    return Math.max(0, Math.min(100, satisfaction));
  }

  /**
   * Calcular tasa de éxito
   */
  calculateSuccessRate() {
    const totalSuccess = Object.values(this.metrics)
      .filter(metric => typeof metric === 'object' && metric.success !== undefined)
      .reduce((sum, metric) => sum + metric.success, 0);
    
    const totalErrors = Object.values(this.metrics)
      .filter(metric => typeof metric === 'object' && metric.errors !== undefined)
      .reduce((sum, metric) => sum + metric.errors, 0);

    const total = totalSuccess + totalErrors;
    return total > 0 ? (totalSuccess / total) * 100 : 100;
  }

  /**
   * Calcular tiempo promedio de respuesta
   */
  calculateAvgResponseTime() {
    const totalTime = Object.values(this.metrics)
      .filter(metric => typeof metric === 'object' && metric.avgTime !== undefined)
      .reduce((sum, metric) => sum + metric.avgTime, 0);
    
    const count = Object.values(this.metrics)
      .filter(metric => typeof metric === 'object' && metric.avgTime !== undefined)
      .length;

    return count > 0 ? totalTime / count : 0;
  }

  /**
   * Agregar conexión en tiempo real
   */
  addRealTimeConnection(connectionId) {
    this.realTimeConnections.add(connectionId);
  }

  /**
   * Remover conexión en tiempo real
   */
  removeRealTimeConnection(connectionId) {
    this.realTimeConnections.delete(connectionId);
  }

  /**
   * Broadcast métricas a conexiones en tiempo real
   */
  broadcastMetrics() {
    const metricsData = this.getMetrics();
    
    // En una implementación real, esto enviaría a WebSocket connections
    // Por ahora, solo actualizamos el estado
    this.metrics.lastUpdated = new Date();
  }

  /**
   * Obtener alertas
   */
  getAlerts() {
    const alerts = [];
    
    // Alerta por alta tasa de error
    if (this.calculateErrorRate() > 10) {
      alerts.push({
        type: 'error',
        message: 'Alta tasa de errores detectada',
        severity: 'high',
        timestamp: new Date()
      });
    }
    
    // Alerta por uso alto de memoria
    if (this.metrics.memoryUsage > 500) { // > 500MB
      alerts.push({
        type: 'memory',
        message: 'Uso alto de memoria',
        severity: 'medium',
        timestamp: new Date()
      });
    }
    
    // Alerta por CPU alto
    if (this.metrics.cpuUsage > 80) {
      alerts.push({
        type: 'cpu',
        message: 'Uso alto de CPU',
        severity: 'medium',
        timestamp: new Date()
      });
    }
    
    // Alerta por tiempo de respuesta alto
    if (this.calculateAvgResponseTime() > 15000) { // > 15 segundos
      alerts.push({
        type: 'performance',
        message: 'Tiempo de respuesta alto',
        severity: 'high',
        timestamp: new Date()
      });
    }

    return alerts;
  }

  /**
   * Reset métricas
   */
  resetMetrics() {
    this.metrics = {
      totalGenerations: 0,
      generationsPerHour: 0,
      activeUsers: 0,
      concurrentUsers: 0,
      pixelUsage: { count: 0, success: 0, errors: 0, avgTime: 0 },
      novaUsage: { count: 0, success: 0, errors: 0, avgTime: 0 },
      cloneUsage: { count: 0, success: 0, errors: 0, avgTime: 0 },
      ghostUsage: { count: 0, success: 0, errors: 0, avgTime: 0 },
      generatorUsage: { count: 0, success: 0, errors: 0, avgTime: 0 },
      qwenAPI: { requests: 0, success: 0, errors: 0, avgResponseTime: 0 },
      sunoAPI: { requests: 0, success: 0, errors: 0, avgResponseTime: 0 },
      systemHealth: 'healthy',
      memoryUsage: 0,
      cpuUsage: 0,
      uptime: 0,
      popularPrompts: [],
      trendingStyles: [],
      userSatisfaction: 0,
      lastUpdated: new Date(),
      startTime: new Date()
    };
    
    this.hourlyData = [];
    this.dailyData = [];
  }
}

// Singleton instance
const metricsService = new MetricsService();

module.exports = metricsService;