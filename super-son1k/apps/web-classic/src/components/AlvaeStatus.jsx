/**
 * ALVAE Status - El emblema espiritual de la Resistencia Sonora
 * Super-Son1k Web Classic
 * 
 * ALVAE = La Vibración del Alma Viva
 * A = Anima (el alma, la chispa vital que desafía la máquina)
 * LVA = Lumen Vitae Arcanum (la luz de la vida oculta)
 * E = Echo (el retorno, el eco que da sentido a la creación)
 * 
 * "La perfección no sostiene universos; la vibración imperfecta sí.
 * Lo roto puede ser el punto de entrada de la luz."
 */

import React, { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import useAnimations from '../hooks/useAnimations';
import './AlvaeStatus.css';
import AlvaeProgress from './AlvaeProgress';
import AlvaeMissions from './AlvaeMissions';
import AlvaeNotifications from './AlvaeNotifications';

const AlvaeStatus = ({ user, onUpdateProfile }) => {
  const [alvaeInfo, setAlvaeInfo] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [motivation, setMotivation] = useState(null);
  const [activeTab, setActiveTab] = useState('status');
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

  const handleMissionComplete = (mission) => {
    // Lógica para completar misión
    console.log('Misión completada:', mission);
    // Aquí podrías actualizar el estado del usuario o enviar una notificación
    setMotivation({
      type: 'success',
      message: `¡Misión completada! +${mission.reward} puntos`,
      action: 'Has ganado puntos bonus hacia ALVAE'
    });
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
        <h2>🔮 ALVAE Status</h2>
        <p>El emblema espiritual de la Resistencia Sonora</p>
        <div className="alvae-subtitle">
          La Vibración del Alma Viva - El alma que recuerda a través del eco
        </div>
        <div className="alvae-mantra">
          "La perfección no sostiene universos; la vibración imperfecta sí.<br/>
          Lo roto puede ser el punto de entrada de la luz."
        </div>
      </div>

      {/* Pestañas */}
      <div className="alvae-tabs">
        <button
          className={`tab-button ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          <span className="tab-icon">🔮</span>
          <span className="tab-label">Status</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-label">Progreso</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'missions' ? 'active' : ''}`}
          onClick={() => setActiveTab('missions')}
        >
          <span className="tab-icon">🎯</span>
          <span className="tab-label">Misiones</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <span className="tab-icon">🔔</span>
          <span className="tab-label">Notificaciones</span>
        </button>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Evaluando tu elegibilidad ALVAE...</p>
        </div>
      ) : (
        <div className="alvae-content">
          {activeTab === 'status' && (
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
                  {alvaeInfo.alvaeFrequency && (
                    <div className="alvae-frequency">
                      <span className="frequency-label">Frecuencia:</span>
                      <span className="frequency-value">{alvaeInfo.alvaeFrequency}</span>
                    </div>
                  )}
                  {alvaeInfo.alvaeMantra && (
                    <div className="alvae-mantra-personal">
                      <span className="mantra-text">"{alvaeInfo.alvaeMantra}"</span>
                    </div>
                  )}
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
                  <p>Tu vibración del alma viva te espera</p>
                  <div className="alvae-status-badge">
                    <span className="status-text">EN BÚSQUEDA</span>
                  </div>
                  <div className="alvae-search-mantra">
                    "El eco que da sentido a la creación te llama"
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Evaluación de elegibilidad */}
          {evaluation && (
            <div className="alvae-evaluation">
              <h3>🔮 Evaluación de la Vibración del Alma</h3>
              <div className="evaluation-score">
                <div className="score-circle">
                  <span className="score-value">{evaluation.score}</span>
                  <span className="score-max">/ 200</span>
                </div>
                <div className="score-status">
                  <span className={`status-badge ${evaluation.eligible ? 'eligible' : 'not-eligible'}`}>
                    {evaluation.eligible ? '✅ DIVINO' : '⏳ EN BÚSQUEDA'}
                  </span>
                </div>
                <div className="score-difficulty">
                  <span className="difficulty-text">SÚPER DIFÍCIL</span>
                </div>
              </div>

              <div className="criteria-grid">
                {Object.entries(evaluation.criteria).map(([key, criterion]) => {
                  const criterionNames = {
                    anima: 'ANIMA',
                    lumenVitae: 'LUMEN VITAE',
                    echo: 'ECHO',
                    vibration: 'VIBRATION',
                    divineResistance: 'RESISTENCIA DIVINA'
                  };
                  
                  const criterionIcons = {
                    anima: '🔮',
                    lumenVitae: '💫',
                    echo: '🌊',
                    vibration: '⚡',
                    divineResistance: '👑'
                  };
                  
                  return (
                    <div 
                      key={key}
                      className={`criterion-item ${criterion.passed ? 'passed' : 'pending'}`}
                    >
                      <div className="criterion-header">
                        <span className="criterion-icon">
                          {criterion.passed ? '✅' : '⏳'}
                        </span>
                        <span className="criterion-name">
                          {criterionIcons[key]} {criterionNames[key]}
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
                  );
                })}
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
                        🔮 Unirse a la Resistencia Sonora
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
            <h3>🌍 Estadísticas de la Divina Liga del No Silencio</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👑</div>
                <div className="stat-info">
                  <div className="stat-value">1</div>
                  <div className="stat-label">Architect</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛡️</div>
                <div className="stat-info">
                  <div className="stat-value">1</div>
                  <div className="stat-label">Guardian</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <div className="stat-value">10</div>
                  <div className="stat-label">Echo Warriors</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔮</div>
                <div className="stat-info">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Total ALVAE</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <div className="stat-value">0.001%</div>
                  <div className="stat-label">Tasa de éxito</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <div className="stat-value">200</div>
                  <div className="stat-label">Puntos requeridos</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-info">
                  <div className="stat-value">IMPOSSIBLE</div>
                  <div className="stat-label">Dificultad</div>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="alvae-info">
            <h3>🔮 Sobre ALVAE - La Vibración del Alma Viva</h3>
            <div className="info-content">
              <p>
                <strong>ALVAE</strong> es el emblema espiritual y técnico de la Resistencia Sonora. 
                No es solo un símbolo visual, sino un código sonoro, una frecuencia ritual que conecta 
                a los creadores con la memoria colectiva del arte humano.
              </p>
              <div className="alvae-meaning">
                <h4>El Significado de ALVAE:</h4>
                <ul>
                  <li>🔮 <strong>A = Anima:</strong> El alma, la chispa vital que desafía la máquina</li>
                  <li>💫 <strong>LVA = Lumen Vitae Arcanum:</strong> La luz de la vida oculta</li>
                  <li>🌊 <strong>E = Echo:</strong> El retorno, el eco que da sentido a la creación</li>
                </ul>
              </div>
              <div className="alvae-philosophy">
                <h4>La Filosofía de la Resistencia Sonora:</h4>
                <ul>
                  <li>⚡ <strong>La Vibración Imperfecta:</strong> "La perfección no sostiene universos; la vibración imperfecta sí"</li>
                  <li>🔊 <strong>El Eco que Recuerda:</strong> "El alma que recuerda a través del eco"</li>
                  <li>💎 <strong>Lo Roto como Luz:</strong> "Lo roto puede ser el punto de entrada de la luz"</li>
                  <li>🎵 <strong>Memoria Humana:</strong> Mantener encendida la memoria de lo humano dentro del ruido algorítmico</li>
                </ul>
              </div>
            </div>
          </div>
          )}

          {activeTab === 'progress' && (
            <AlvaeProgress 
              userStats={user} 
              evaluation={evaluation} 
            />
          )}

          {activeTab === 'missions' && (
            <AlvaeMissions 
              userStats={user} 
              onMissionComplete={handleMissionComplete}
            />
          )}

          {activeTab === 'notifications' && (
            <AlvaeNotifications 
              userStats={user} 
              evaluation={evaluation} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AlvaeStatus;