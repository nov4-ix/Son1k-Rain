import { useState, useEffect } from 'react';
import { useGameScore } from '../hooks/useGameScore';

const GameScore = () => {
  const { score, level, achievements, gameStats, easterEggsFound } = useGameScore();
  const [showPanel, setShowPanel] = useState(false);
  const [showAchievement, setShowAchievement] = useState(null);

  // Mostrar logro cuando se desbloquea
  useEffect(() => {
    if (achievements.length > 0) {
      const latestAchievement = achievements[achievements.length - 1];
      setShowAchievement(latestAchievement);
      
      setTimeout(() => {
        setShowAchievement(null);
      }, 3000);
    }
  }, [achievements]);

  return (
    <>
      {/* Botón de puntuación */}
      <button 
        className="score-toggle"
        onClick={() => setShowPanel(!showPanel)}
        title="Puntuación y Logros"
      >
        🏆 {score}
      </button>

      {/* Panel de puntuación */}
      {showPanel && (
        <div className="score-panel">
          <div className="score-header">
            <h3>NEXUS Score</h3>
            <button onClick={() => setShowPanel(false)}>✕</button>
          </div>
          
          <div className="score-stats">
            <div className="stat-item">
              <span className="stat-label">Puntuación:</span>
              <span className="stat-value">{score.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Nivel:</span>
              <span className="stat-value">{level}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Easter Eggs:</span>
              <span className="stat-value">{easterEggsFound.size}/20</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Logros:</span>
              <span className="stat-value">{achievements.length}</span>
            </div>
          </div>

          <div className="score-details">
            <h4>Estadísticas</h4>
            <div className="detail-item">
              <span>Interacciones:</span>
              <span>{gameStats.totalInteractions}</span>
            </div>
            <div className="detail-item">
              <span>Tiempo:</span>
              <span>{Math.floor(gameStats.timeSpent / 60)}m {gameStats.timeSpent % 60}s</span>
            </div>
            <div className="detail-item">
              <span>Modos:</span>
              <span>{gameStats.modesUnlocked}/4</span>
            </div>
          </div>

          <div className="achievements-section">
            <h4>Logros</h4>
            <div className="achievements-list">
              {achievements.map((achievement, index) => (
                <div key={achievement.id} className="achievement-item">
                  <span className="achievement-icon">{achievement.icon}</span>
                  <div className="achievement-info">
                    <span className="achievement-title">{achievement.title}</span>
                    <span className="achievement-desc">{achievement.description}</span>
                  </div>
                  <span className="achievement-points">+{achievement.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notificación de logro */}
      {showAchievement && (
        <div className="achievement-notification">
          <div className="achievement-popup">
            <span className="achievement-icon-large">{showAchievement.icon}</span>
            <div className="achievement-text">
              <h4>{showAchievement.title}</h4>
              <p>{showAchievement.description}</p>
              <span className="achievement-points-large">+{showAchievement.points} puntos</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameScore;