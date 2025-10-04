/**
 * Metrics Dashboard - Dashboard de métricas en tiempo real
 * Super-Son1k Web Classic
 */

import React, { useState, useEffect, useRef } from 'react';
import useTheme from '../hooks/useTheme';
import useAnimations from '../hooks/useAnimations';
import TopTracks from './TopTracks';
import './MetricsDashboard.css';

const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('hour');
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const intervalRef = useRef(null);
  
  const { theme } = useTheme();
  const { 
    createAnimatedRef, 
    getAnimationClass, 
    pulse, 
    glow,
    createParticles 
  } = useAnimations();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Cargar métricas iniciales
  useEffect(() => {
    loadMetrics();
  }, []);

  // Auto-refresh cada 5 segundos
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        loadMetrics();
      }, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh]);

  const loadMetrics = async () => {
    try {
      const [metricsRes, trendsRes, alertsRes] = await Promise.all([
        fetch(`${API_BASE}/metrics/dashboard`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
          }
        }),
        fetch(`${API_BASE}/metrics/trends`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
          }
        }),
        fetch(`${API_BASE}/metrics/alerts`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
          }
        })
      ]);

      const [metricsData, trendsData, alertsData] = await Promise.all([
        metricsRes.json(),
        trendsRes.json(),
        alertsRes.json()
      ]);

      if (metricsData.success) {
        setMetrics(metricsData.data);
        pulse('metrics-overview');
      }

      if (trendsData.success) {
        setTrends(trendsData.data);
      }

      if (alertsData.success) {
        setAlerts(alertsData.data);
        if (alertsData.data.length > 0) {
          pulse('alerts-section');
        }
      }

      setIsLoading(false);
      setError(null);

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const loadPeriodMetrics = async (period) => {
    try {
      const response = await fetch(`${API_BASE}/metrics/period/${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });

      const data = await response.json();
      if (data.success) {
        // Actualizar métricas con datos del período
        setMetrics(prev => ({
          ...prev,
          hourlyData: data.data
        }));
      }
    } catch (err) {
      console.error('Error cargando métricas por período:', err);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'healthy': return '#059669';
      case 'warning': return '#d97706';
      case 'error': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return '❌';
      case 'memory': return '💾';
      case 'cpu': return '⚡';
      case 'performance': return '🐌';
      default: return '⚠️';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <div className="metrics-dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando métricas en tiempo real...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="metrics-dashboard error">
        <div className="error-message">
          <h3>❌ Error cargando métricas</h3>
          <p>{error}</p>
          <button onClick={loadMetrics} className="retry-btn">
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="metrics-dashboard" id="metrics-dashboard">
      <div className="particles-container" id="metrics-particles"></div>
      
      {/* Header */}
      <div 
        className={`dashboard-header ${getAnimationClass('dashboard-header', 'fadeInDown')}`}
        ref={createAnimatedRef('fadeInDown')}
      >
        <div className="header-content">
          <h2>📊 Dashboard de Métricas</h2>
          <p>Monitoreo en tiempo real de Super-Son1k</p>
          <div className="header-controls">
            <div className="refresh-control">
              <label>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                🔄 Auto-refresh
              </label>
            </div>
            <div className="period-selector">
              <label>Período:</label>
              <select
                value={selectedPeriod}
                onChange={(e) => {
                  setSelectedPeriod(e.target.value);
                  loadPeriodMetrics(e.target.value);
                }}
              >
                <option value="hour">Última hora</option>
                <option value="day">Último día</option>
                <option value="week">Última semana</option>
              </select>
            </div>
            <button 
              onClick={loadMetrics}
              className="refresh-btn"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div 
        id="metrics-overview"
        className={`overview-section ${getAnimationClass('overview-section', 'fadeInUp')}`}
        ref={createAnimatedRef('fadeInUp')}
      >
        <h3>📈 Resumen General</h3>
        <div className="overview-cards">
          <div className="metric-card">
            <div className="metric-icon">🎵</div>
            <div className="metric-content">
              <h4>Total Generaciones</h4>
              <span className="metric-value">{formatNumber(metrics?.overview?.totalGenerations || 0)}</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">⏰</div>
            <div className="metric-content">
              <h4>Por Hora</h4>
              <span className="metric-value">{formatNumber(metrics?.overview?.generationsPerHour || 0)}</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <h4>Usuarios Activos</h4>
              <span className="metric-value">{formatNumber(metrics?.overview?.activeUsers || 0)}</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">🔄</div>
            <div className="metric-content">
              <h4>Concurrentes</h4>
              <span className="metric-value">{formatNumber(metrics?.overview?.concurrentUsers || 0)}</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">⏱️</div>
            <div className="metric-content">
              <h4>Uptime</h4>
              <span className="metric-value">{formatUptime(metrics?.overview?.uptime || 0)}</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">💚</div>
            <div className="metric-content">
              <h4>Estado del Sistema</h4>
              <span 
                className="metric-value health-status"
                style={{ color: getHealthColor(metrics?.overview?.systemHealth) }}
              >
                {metrics?.overview?.systemHealth || 'unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Usage */}
      <div 
        className={`tools-section ${getAnimationClass('tools-section', 'fadeInLeft')}`}
        ref={createAnimatedRef('fadeInLeft')}
      >
        <h3>🛠️ Uso por Herramienta</h3>
        <div className="tools-grid">
          {Object.entries(metrics?.tools || {}).map(([toolName, toolData]) => (
            <div key={toolName} className="tool-card">
              <div className="tool-header">
                <h4>{toolName.charAt(0).toUpperCase() + toolName.slice(1)}</h4>
                <span className="tool-icon">
                  {toolName === 'pixel' && '🤖'}
                  {toolName === 'nova' && '📱'}
                  {toolName === 'clone' && '🎤'}
                  {toolName === 'ghost' && '🎵'}
                  {toolName === 'generator' && '🎵'}
                </span>
              </div>
              <div className="tool-metrics">
                <div className="metric-row">
                  <span>Total:</span>
                  <span className="metric-number">{formatNumber(toolData.count)}</span>
                </div>
                <div className="metric-row">
                  <span>Éxito:</span>
                  <span className="metric-number success">{formatNumber(toolData.success)}</span>
                </div>
                <div className="metric-row">
                  <span>Errores:</span>
                  <span className="metric-number error">{formatNumber(toolData.errors)}</span>
                </div>
                <div className="metric-row">
                  <span>Tiempo Promedio:</span>
                  <span className="metric-number">{(toolData.avgTime / 1000).toFixed(1)}s</span>
                </div>
              </div>
              <div className="tool-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill success"
                    style={{ width: `${toolData.count > 0 ? (toolData.success / toolData.count) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {toolData.count > 0 ? ((toolData.success / toolData.count) * 100).toFixed(1) : 0}% éxito
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Usage */}
      <div 
        className={`apis-section ${getAnimationClass('apis-section', 'fadeInRight')}`}
        ref={createAnimatedRef('fadeInRight')}
      >
        <h3>🔌 Uso de APIs</h3>
        <div className="apis-grid">
          {Object.entries(metrics?.apis || {}).map(([apiName, apiData]) => (
            <div key={apiName} className="api-card">
              <div className="api-header">
                <h4>{apiName.toUpperCase()} API</h4>
                <span className="api-icon">
                  {apiName === 'qwen' && '🤖'}
                  {apiName === 'suno' && '🎵'}
                </span>
              </div>
              <div className="api-metrics">
                <div className="metric-row">
                  <span>Requests:</span>
                  <span className="metric-number">{formatNumber(apiData.requests)}</span>
                </div>
                <div className="metric-row">
                  <span>Éxito:</span>
                  <span className="metric-number success">{formatNumber(apiData.success)}</span>
                </div>
                <div className="metric-row">
                  <span>Errores:</span>
                  <span className="metric-number error">{formatNumber(apiData.errors)}</span>
                </div>
                <div className="metric-row">
                  <span>Tiempo Promedio:</span>
                  <span className="metric-number">{(apiData.avgResponseTime / 1000).toFixed(1)}s</span>
                </div>
              </div>
              <div className="api-status">
                <div className="status-indicator">
                  <span 
                    className="status-dot"
                    style={{ 
                      backgroundColor: apiData.errors > apiData.success * 0.1 ? '#dc2626' : '#059669' 
                    }}
                  ></span>
                  <span className="status-text">
                    {apiData.errors > apiData.success * 0.1 ? 'Problemas' : 'Saludable'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Metrics */}
      <div 
        className={`system-section ${getAnimationClass('system-section', 'scaleIn')}`}
        ref={createAnimatedRef('scaleIn')}
      >
        <h3>💻 Métricas del Sistema</h3>
        <div className="system-grid">
          <div className="system-card">
            <h4>💾 Memoria</h4>
            <div className="system-metric">
              <span className="metric-value">{metrics?.system?.memoryUsage || 0} MB</span>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ 
                    width: `${Math.min((metrics?.system?.memoryUsage || 0) / 10, 100)}%`,
                    backgroundColor: (metrics?.system?.memoryUsage || 0) > 500 ? '#dc2626' : '#059669'
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="system-card">
            <h4>⚡ CPU</h4>
            <div className="system-metric">
              <span className="metric-value">{(metrics?.system?.cpuUsage || 0).toFixed(1)}%</span>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ 
                    width: `${metrics?.system?.cpuUsage || 0}%`,
                    backgroundColor: (metrics?.system?.cpuUsage || 0) > 80 ? '#dc2626' : '#059669'
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="system-card">
            <h4>😊 Satisfacción</h4>
            <div className="system-metric">
              <span className="metric-value">{(metrics?.system?.userSatisfaction || 0).toFixed(1)}%</span>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ 
                    width: `${metrics?.system?.userSatisfaction || 0}%`,
                    backgroundColor: (metrics?.system?.userSatisfaction || 0) > 80 ? '#059669' : '#d97706'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div 
          id="alerts-section"
          className={`alerts-section ${getAnimationClass('alerts-section', 'shake')}`}
          ref={createAnimatedRef('shake')}
        >
          <h3>🚨 Alertas del Sistema</h3>
          <div className="alerts-list">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`alert-item ${alert.severity}`}
              >
                <div className="alert-icon">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="alert-content">
                  <h4>{alert.message}</h4>
                  <p>Tipo: {alert.type} | Severidad: {alert.severity}</p>
                  <small>{new Date(alert.timestamp).toLocaleString()}</small>
                </div>
                <div 
                  className="alert-severity"
                  style={{ backgroundColor: getSeverityColor(alert.severity) }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trends */}
      {trends && (
        <div 
          className={`trends-section ${getAnimationClass('trends-section', 'fadeInUp')}`}
          ref={createAnimatedRef('fadeInUp')}
        >
          <h3>📈 Tendencias</h3>
          <div className="trends-grid">
            <div className="trend-card">
              <h4>Crecimiento de Uso</h4>
              <span className={`trend-value ${trends.usageGrowth >= 0 ? 'positive' : 'negative'}`}>
                {trends.usageGrowth >= 0 ? '↗️' : '↘️'} {trends.usageGrowth.toFixed(1)}%
              </span>
            </div>
            
            <div className="trend-card">
              <h4>Tasa de Error</h4>
              <span className={`trend-value ${trends.errorRate < 5 ? 'positive' : 'negative'}`}>
                {trends.errorRate.toFixed(1)}%
              </span>
            </div>
            
            <div className="trend-card">
              <h4>Herramienta Popular</h4>
              <span className="trend-value">
                {trends.popularTools[0]?.name || 'N/A'}
              </span>
            </div>
            
            <div className="trend-card">
              <h4>Horas Pico</h4>
              <span className="trend-value">
                {trends.peakHours.join(', ') || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Tracks Section */}
      <div 
        className={`top-tracks-section ${getAnimationClass('top-tracks-section', 'fadeInUp')}`}
        ref={createAnimatedRef('fadeInUp')}
      >
        <TopTracks compact={false} />
      </div>

      {/* Last Updated */}
      <div className="last-updated">
        <small>
          Última actualización: {metrics?.lastUpdated ? new Date(metrics.lastUpdated).toLocaleString() : 'N/A'}
        </small>
      </div>
    </div>
  );
};

export default MetricsDashboard;