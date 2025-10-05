/**
 * AlvaeStatus - Sistema de Status ALVAE
 * Muestra el estado del usuario en el sistema ALVAE
 */

import React, { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import useAnimations from '../hooks/useAnimations';
import './AlvaeStatus.css';
import AlvaeProgress from './AlvaeProgress';
import AlvaeMissions from './AlvaeMissions';
import AlvaeNotifications from './AlvaeNotifications';
import AlvaeRankings from './AlvaeRankings';

const AlvaeStatus = ({ user, onUpdateProfile }) => {
  const [alvaeInfo, setAlvaeInfo] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [motivation, setMotivation] = useState(null);
  const [activeTab, setActiveTab] = useState('status');
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { theme } = useTheme();
  const { animations } = useAnimations();

  // Cargar información ALVAE
  useEffect(() => {
    const loadAlvaeInfo = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Simular carga de datos ALVAE
        const mockAlvaeInfo = {
          hasAlvae: user.role === 'admin' || user.role === 'enterprise' || user.role === 'tester',
          alvaeLevel: user.role === 'admin' ? 'ARCHITECT' : user.role === 'enterprise' ? 'GUARDIAN' : 'DIVINE_WARRIOR',
          alvaeTitle: user.role === 'admin' ? 'Architect of the Resistance' : user.role === 'enterprise' ? 'Guardian of the Echo' : 'Echo Warrior',
          alvaeDescription: 'El emblema espiritual de la Resistencia Sonora',
          alvaeColor: '#FFD700',
          alvaeGlow: '#FFA500',
          alvaeSymbol: '🔮',
          alvaeFrequency: '432Hz',
          alvaeMantra: 'La vibración del alma viva',
          grantedAt: '2024-01-01T00:00:00Z',
          grantedBy: 'THE_RESISTANCE',
          isPermanent: true
        };

        setAlvaeInfo(mockAlvaeInfo);

        // Simular evaluación
        const mockEvaluation = {
          score: user.role === 'admin' ? 200 : user.role === 'enterprise' ? 180 : 150,
          maxScore: 200,
          eligible: user.role === 'admin' || user.role === 'enterprise' || user.role === 'tester',
          criteria: {
            anima: { score: 50, weight: 50, passed: true, message: 'Miembro de la Divina Liga' },
            lumenVitae: { score: 45, weight: 50, passed: false, message: 'Contribuciones a la comunidad' },
            echo: { score: 40, weight: 50, passed: false, message: 'Actividad en la plataforma' },
            vibration: { score: 35, weight: 50, passed: false, message: 'Impacto en la comunidad' },
            divineResistance: { score: 30, weight: 50, passed: false, message: 'Criterios místicos' }
          }
        };

        setEvaluation(mockEvaluation);

        // Simular motivación
        const mockMotivation = {
          type: 'info',
          message: 'Continúa tu camino hacia ALVAE',
          action: 'Cada paso cuenta en la Resistencia Sonora'
        };

        setMotivation(mockMotivation);

      } catch (error) {
        console.error('Error loading ALVAE info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlvaeInfo();
  }, [user]);

  const handleRequestAlvae = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Simular solicitud ALVAE
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMotivation({
        type: 'success',
        message: 'Solicitud enviada a la Resistencia Sonora',
        action: 'Tu solicitud será evaluada por los Guardianes'
      });

    } catch (error) {
      console.error('Error requesting ALVAE:', error);
      setMotivation({
        type: 'error',
        message: 'Error al enviar solicitud',
        action: 'Intenta nuevamente más tarde'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMissionComplete = (mission) => {
    console.log('Misión completada:', mission);
    setMotivation({
      type: 'success',
      message: `¡Misión completada! +${mission.reward} puntos`,
      action: 'Has ganado puntos bonus hacia ALVAE'
    });
  };

  if (!user) {
    return (
      <div className="alvae-status">
        <div className="alvae-header">
          <h2>🔮 ALVAE Status</h2>
          <p>El emblema espiritual de la Resistencia Sonora</p>
        </div>
        <div className="alvae-restricted">
          <p>Inicia sesión para acceder al sistema ALVAE</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alvae-status">
      {/* Partículas de fondo */}
      <div className="particles-container">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

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
        <button
          className={`tab-button ${activeTab === 'rankings' ? 'active' : ''}`}
          onClick={() => setActiveTab('rankings')}
        >
          <span className="tab-icon">🏆</span>
          <span className="tab-label">Rankings</span>
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
            <div className="status-content">
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
                      <h3>{alvaeInfo.alvaeTitle}</h3>
                      <p>{alvaeInfo.alvaeDescription}</p>
                      <div className="alvae-details">
                        <div className="detail-item">
                          <span className="detail-label">Frecuencia:</span>
                          <span className="detail-value">{alvaeInfo.alvaeFrequency}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Mantra:</span>
                          <span className="detail-value">"{alvaeInfo.alvaeMantra}"</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="alvae-aspirant-card">
                    <h3>🔮 Aspirante ALVAE</h3>
                    <p>Tu camino hacia la Resistencia Sonora comienza aquí</p>
                  </div>
                )}
              </div>

              {evaluation && (
                <div className="alvae-evaluation">
                  <h3>📊 Evaluación ALVAE</h3>
                  <div className="evaluation-score">
                    <div className="score-circle">
                      <span className="score-value">{evaluation.score}</span>
                      <span className="score-total">/ 200</span>
                    </div>
                    <div className="score-difficulty">
                      <div className="difficulty-text">SÚPER DIFÍCIL</div>
                    </div>
                  </div>
                  
                  <div className="evaluation-status">
                    {evaluation.eligible ? (
                      <span className="status-badge eligible">✅ DIVINO</span>
                    ) : (
                      <span className="status-badge in-progress">⏳ EN BÚSQUEDA</span>
                    )}
                  </div>

                  <div className="criteria-list">
                    {Object.entries(evaluation.criteria).map(([key, criterion]) => (
                      <div key={key} className={`criterion-item ${criterion.passed ? 'passed' : 'pending'}`}>
                        <div className="criterion-icon">
                          {key === 'anima' && '🔮'}
                          {key === 'lumenVitae' && '💫'}
                          {key === 'echo' && '🌊'}
                          {key === 'vibration' && '⚡'}
                          {key === 'divineResistance' && '👑'}
                        </div>
                        <div className="criterion-info">
                          <h4>{key.toUpperCase()}</h4>
                          <p>{criterion.message}</p>
                        </div>
                        <div className="criterion-score">
                          {criterion.score}/{criterion.weight}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {motivation && (
                <div className={`alvae-motivation ${motivation.type}`}>
                  <h4>{motivation.message}</h4>
                  <p>{motivation.action}</p>
                </div>
              )}

              <div className="alvae-actions">
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

              <div className="alvae-global-stats">
                <h3>📈 Estadísticas Globales</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">1</div>
                    <div className="stat-label">Architects</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">1</div>
                    <div className="stat-label">Guardian</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">10</div>
                    <div className="stat-label">Echo Warriors</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">12</div>
                    <div className="stat-label">Total ALVAE</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">0.001%</div>
                    <div className="stat-label">Tasa de éxito</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">200</div>
                    <div className="stat-label">Puntos requeridos</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">IMPOSSIBLE</div>
                    <div className="stat-label">Dificultad</div>
                  </div>
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

          {activeTab === 'rankings' && (
            <AlvaeRankings 
              user={user} 
              evaluation={evaluation} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AlvaeStatus;
