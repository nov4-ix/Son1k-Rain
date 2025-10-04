/**
 * ALVAE Status - El símbolo más exclusivo de la plataforma
 * Super-Son1k Web Classic
 */

import React, { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import useAnimations from '../hooks/useAnimations';
import './AlvaeStatus.css';

const AlvaeStatus = ({ user, onUpdateProfile }) => {
  const [alvaeInfo, setAlvaeInfo] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [motivation, setMotivation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const { theme } = useTheme();
  const { pulse, glow, createParticles } = useAnimations();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    if (user) {
      loadAlvaeStatus();
    }
  }, [user]);

  const loadAlvaeStatus = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      // Verificar si tiene ALVAE
      const alvaeResponse = await fetch(`${API_BASE}/alvae/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (alvaeResponse.ok) {
        const alvaeData = await alvaeResponse.json();
        setAlvaeInfo(alvaeData.data.alvaeInfo);
      }

      // Evaluar elegibilidad
      const evalResponse = await fetch(`${API_BASE}/alvae/evaluate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (evalResponse.ok) {
        const evalData = await evalResponse.json();
        setEvaluation(evalData.data.evaluation);
        setMotivation(evalData.data.motivation);
      }

    } catch (error) {
      console.error('Error loading ALVAE status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAlvae = async () => {
    if (!evaluation?.eligible) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE}/alvae/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: 'User meets all ALVAE criteria',
          evaluation: evaluation
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAlvaeInfo(data.data.alvaeInfo);
        pulse('alvae-success');
        createParticles('alvae-particles', 30);
      }

    } catch (error) {
      console.error('Error requesting ALVAE:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="alvae-status-restricted">
        <div className="restricted-content">
          <h2>🔒 Acceso Restringido</h2>
          <p>Inicia sesión para ver tu estado ALVAE</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alvae-status">
      <div className="particles-container" id="alvae-particles"></div>
      
      {/* Header ALVAE */}
      <div className="alvae-header">
        <h2>✨ ALVAE Status</h2>
        <p>El símbolo más exclusivo de Super-Son1k</p>
        <div className="alvae-subtitle">
          Solo los verdaderos warriors del silencio pueden obtenerlo
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Evaluando tu elegibilidad ALVAE...</p>
        </div>
      ) : (
        <>
          {/* Status actual */}
          <div className="alvae-current-status">
            {alvaeInfo ? (
              <div className="alvae-member-card">
                <div className="alvae-symbol-large">
                  <span 
                    className="alvae-symbol"
                    style={{ 
                      color: alvaeInfo.alvaeColor,
                      textShadow: `0 0 20px ${alvaeInfo.alvaeGlow}`
                    }}
                  >
                    {alvaeInfo.alvaeSymbol}
                  </span>
                </div>
                <div className="alvae-member-info">
                  <h3 className="alvae-title">{alvaeInfo.alvaeTitle}</h3>
                  <p className="alvae-description">{alvaeInfo.alvaeDescription}</p>
                  <div className="alvae-level">
                    <span className="level-badge">{alvaeInfo.alvaeLevel}</span>
                  </div>
                  <div className="alvae-details">
                    <span>Otorgado: {new Date(alvaeInfo.grantedAt).toLocaleDateString()}</span>
                    <span>Por: {alvaeInfo.grantedBy}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alvae-non-member">
                <div className="alvae-placeholder">
                  <span className="placeholder-symbol">❓</span>
                </div>
                <div className="alvae-placeholder-info">
                  <h3>Sin ALVAE</h3>
                  <p>Tu símbolo ALVAE te espera</p>
                  <div className="alvae-status-badge">
                    <span className="status-text">PENDIENTE</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Evaluación de elegibilidad */}
          {evaluation && (
            <div className="alvae-evaluation">
              <h3>📊 Evaluación de Elegibilidad</h3>
              <div className="evaluation-score">
                <div className="score-circle">
                  <span className="score-value">{evaluation.score}</span>
                  <span className="score-max">/ {evaluation.maxScore}</span>
                </div>
                <div className="score-status">
                  <span className={`status-badge ${evaluation.eligible ? 'eligible' : 'not-eligible'}`}>
                    {evaluation.eligible ? '✅ ELEGIBLE' : '⏳ EN PROGRESO'}
                  </span>
                </div>
              </div>

              <div className="criteria-grid">
                {Object.entries(evaluation.criteria).map(([key, criterion]) => (
                  <div 
                    key={key}
                    className={`criterion-item ${criterion.passed ? 'passed' : 'pending'}`}
                  >
                    <div className="criterion-header">
                      <span className="criterion-icon">
                        {criterion.passed ? '✅' : '⏳'}
                      </span>
                      <span className="criterion-name">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                      <span className="criterion-score">
                        {criterion.score?.toFixed(1) || 0}/{criterion.weight}
                      </span>
                    </div>
                    <div className="criterion-message">
                      {criterion.message}
                    </div>
                    {criterion.details && (
                      <div className="criterion-details">
                        {Object.entries(criterion.details).map(([detailKey, value]) => (
                          <span key={detailKey} className="detail-item">
                            {detailKey}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Botón de solicitud */}
              {evaluation.eligible && !alvaeInfo && (
                <div className="alvae-request-section">
                  <button 
                    onClick={handleRequestAlvae}
                    disabled={isLoading}
                    className="request-alvae-btn"
                  >
                    {isLoading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        ✨ Solicitar ALVAE
                        <span className="btn-glow"></span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mensaje de motivación */}
          {motivation && (
            <div className={`alvae-motivation ${motivation.type}`}>
              <div className="motivation-icon">
                {motivation.type === 'success' && '🎉'}
                {motivation.type === 'info' && '✨'}
                {motivation.type === 'warning' && '🏆'}
                {motivation.type === 'motivation' && '🚀'}
              </div>
              <div className="motivation-content">
                <h4>{motivation.title}</h4>
                <p>{motivation.message}</p>
                <div className="motivation-action">
                  {motivation.action}
                </div>
              </div>
            </div>
          )}

          {/* Recomendaciones */}
          {evaluation && evaluation.recommendations.length > 0 && (
            <div className="alvae-recommendations">
              <h3>💡 Recomendaciones para obtener ALVAE</h3>
              <ul className="recommendations-list">
                {evaluation.recommendations.map((recommendation, index) => (
                  <li key={index} className="recommendation-item">
                    <span className="recommendation-icon">🎯</span>
                    <span className="recommendation-text">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Estadísticas ALVAE globales */}
          <div className="alvae-global-stats">
            <h3>🌍 Estadísticas ALVAE Globales</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👑</div>
                <div className="stat-info">
                  <div className="stat-value">2</div>
                  <div className="stat-label">Grand Masters</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Masters</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✨</div>
                <div className="stat-info">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Members</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <div className="stat-value">0.02%</div>
                  <div className="stat-label">Tasa de éxito</div>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="alvae-info">
            <h3>ℹ️ Sobre ALVAE</h3>
            <div className="info-content">
              <p>
                <strong>ALVAE</strong> es el símbolo más exclusivo de Super-Son1k. 
                Solo los miembros más valiosos de la comunidad pueden obtenerlo.
              </p>
              <ul>
                <li>✨ <strong>Exclusividad:</strong> Solo 0.02% de los usuarios lo obtienen</li>
                <li>🏆 <strong>Reconocimiento:</strong> Demuestra tu valor real en la comunidad</li>
                <li>🎵 <strong>Legado:</strong> Tu contribución al universo musical</li>
                <li>🔊 <strong>Silencio:</strong> Rompe el silencio con excelencia</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AlvaeStatus;