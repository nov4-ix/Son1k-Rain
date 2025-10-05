/**
 * AlvaeMissions - Sistema de Misiones ALVAE
 * Misiones especiales que dan puntos bonus para obtener ALVAE
 */

import React, { useState, useEffect } from 'react';
import './AlvaeMissions.css';

const AlvaeMissions = ({ userStats, onMissionComplete }) => {
  const [missions, setMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState(new Set());
  const [activeMissions, setActiveMissions] = useState(new Set());

  // Misiones disponibles
  const availableMissions = [
    {
      id: 'daily_generation',
      title: '🎵 Generador Diario',
      description: 'Genera al menos 5 canciones hoy',
      type: 'daily',
      reward: 10,
      requirement: { type: 'generations', value: 5 },
      icon: '🎵',
      difficulty: 'easy'
    },
    {
      id: 'viral_track',
      title: '🔥 Track Viral',
      description: 'Consigue 100 likes en una sola canción',
      type: 'special',
      reward: 25,
      requirement: { type: 'single_track_likes', value: 100 },
      icon: '🔥',
      difficulty: 'hard'
    },
    {
      id: 'collaboration_master',
      title: '🤝 Maestro de Colaboración',
      description: 'Colabora con 3 usuarios diferentes esta semana',
      type: 'weekly',
      reward: 30,
      requirement: { type: 'collaborations', value: 3 },
      icon: '🤝',
      difficulty: 'medium'
    },
    {
      id: 'divine_creator',
      title: '👑 Creador Divino',
      description: 'Crea 10 tracks perfectos (95%+ satisfacción)',
      type: 'special',
      reward: 50,
      requirement: { type: 'perfect_tracks', value: 10 },
      icon: '👑',
      difficulty: 'epic'
    },
    {
      id: 'resistance_warrior',
      title: '⚡ Guerrero de la Resistencia',
      description: 'Mantén 7 días consecutivos de actividad',
      type: 'streak',
      reward: 20,
      requirement: { type: 'consecutive_days', value: 7 },
      icon: '⚡',
      difficulty: 'medium'
    },
    {
      id: 'echo_master',
      title: '🌊 Maestro del Eco',
      description: 'Ayuda a 5 usuarios con sus proyectos',
      type: 'community',
      reward: 35,
      requirement: { type: 'community_help', value: 5 },
      icon: '🌊',
      difficulty: 'medium'
    },
    {
      id: 'divine_frequency',
      title: '🔮 Frecuencia Divina',
      description: 'Alcanza 1000 horas totales en la plataforma',
      type: 'milestone',
      reward: 40,
      requirement: { type: 'total_hours', value: 1000 },
      icon: '🔮',
      difficulty: 'hard'
    },
    {
      id: 'imperfect_perfection',
      title: '✨ Perfección Imperfecta',
      description: 'Crea un track que inspire 50 comentarios',
      type: 'special',
      reward: 30,
      requirement: { type: 'track_comments', value: 50 },
      icon: '✨',
      difficulty: 'hard'
    }
  ];

  // Verificar progreso de misiones
  useEffect(() => {
    const checkMissions = () => {
      const newCompleted = new Set();
      const newActive = new Set();

      availableMissions.forEach(mission => {
        const progress = getMissionProgress(mission, userStats);
        
        if (progress >= 100) {
          newCompleted.add(mission.id);
        } else if (progress > 0) {
          newActive.add(mission.id);
        }
      });

      setCompletedMissions(newCompleted);
      setActiveMissions(newActive);
    };

    checkMissions();
  }, [userStats]);

  const getMissionProgress = (mission, stats) => {
    if (!stats || !stats.stats) return 0;

    const { requirement } = mission;
    const currentValue = stats.stats[requirement.type] || 0;
    
    return Math.min((currentValue / requirement.value) * 100, 100);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#10B981',
      medium: '#F59E0B',
      hard: '#EF4444',
      epic: '#8B5CF6'
    };
    return colors[difficulty] || '#6B7280';
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      easy: 'FÁCIL',
      medium: 'MEDIO',
      hard: 'DIFÍCIL',
      epic: 'ÉPICO'
    };
    return labels[difficulty] || 'DESCONOCIDO';
  };

  const handleMissionClick = (mission) => {
    if (completedMissions.has(mission.id)) {
      // Reclamar recompensa
      if (onMissionComplete) {
        onMissionComplete(mission);
      }
    }
  };

  const getMissionStatus = (mission) => {
    if (completedMissions.has(mission.id)) {
      return 'completed';
    } else if (activeMissions.has(mission.id)) {
      return 'active';
    }
    return 'available';
  };

  return (
    <div className="alvae-missions-container">
      <div className="missions-header">
        <h3>🎯 Misiones de la Resistencia Sonora</h3>
        <p>Completa misiones para obtener puntos bonus hacia ALVAE</p>
      </div>

      <div className="missions-grid">
        {availableMissions.map(mission => {
          const progress = getMissionProgress(mission, userStats);
          const status = getMissionStatus(mission);
          const isCompleted = completedMissions.has(mission.id);

          return (
            <div
              key={mission.id}
              className={`mission-card ${status}`}
              onClick={() => handleMissionClick(mission)}
            >
              <div className="mission-header">
                <div className="mission-icon">
                  {mission.icon}
                </div>
                <div className="mission-info">
                  <h4>{mission.title}</h4>
                  <p>{mission.description}</p>
                </div>
                <div className="mission-reward">
                  <span className="reward-amount">+{mission.reward}</span>
                  <span className="reward-label">puntos</span>
                </div>
              </div>

              <div className="mission-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: getDifficultyColor(mission.difficulty)
                    }}
                  ></div>
                </div>
                <div className="progress-text">
                  {Math.round(progress)}% completado
                </div>
              </div>

              <div className="mission-footer">
                <div className="mission-difficulty">
                  <span
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(mission.difficulty) }}
                  >
                    {getDifficultyLabel(mission.difficulty)}
                  </span>
                </div>
                <div className="mission-status">
                  {isCompleted ? (
                    <span className="status-completed">✅ COMPLETADO</span>
                  ) : progress > 0 ? (
                    <span className="status-active">🔥 EN PROGRESO</span>
                  ) : (
                    <span className="status-available">⏳ DISPONIBLE</span>
                  )}
                </div>
              </div>

              {isCompleted && (
                <div className="mission-complete-overlay">
                  <div className="complete-animation">
                    <span className="complete-icon">🎉</span>
                    <span className="complete-text">¡MISIÓN COMPLETADA!</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="missions-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-value">{completedMissions.size}</span>
            <span className="stat-label">Completadas</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{activeMissions.size}</span>
            <span className="stat-label">En Progreso</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {Array.from(completedMissions).reduce((total, missionId) => {
                const mission = availableMissions.find(m => m.id === missionId);
                return total + (mission ? mission.reward : 0);
              }, 0)}
            </span>
            <span className="stat-label">Puntos Ganados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlvaeMissions;
