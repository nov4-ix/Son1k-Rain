/**
 * AlvaeProgress - Sistema de Progreso ALVAE en Tiempo Real
 * Muestra el progreso visual de cada criterio ALVAE con animaciones épicas
 */

import React, { useState, useEffect } from 'react';
import './AlvaeProgress.css';

const AlvaeProgress = ({ userStats, evaluation }) => {
  const [animatedProgress, setAnimatedProgress] = useState({});
  const [completedCriteria, setCompletedCriteria] = useState(new Set());

  // Animar progreso cuando cambie
  useEffect(() => {
    if (evaluation && evaluation.criteria) {
      const newProgress = {};
      const newCompleted = new Set();

      Object.entries(evaluation.criteria).forEach(([key, criterion]) => {
        const progress = Math.min((criterion.score || 0) / (criterion.weight || 1) * 100, 100);
        newProgress[key] = progress;
        
        if (criterion.passed) {
          newCompleted.add(key);
        }
      });

      setAnimatedProgress(newProgress);
      setCompletedCriteria(newCompleted);
    }
  }, [evaluation]);

  const getCriterionIcon = (key) => {
    const icons = {
      anima: '🔮',
      lumenVitae: '💫',
      echo: '🌊',
      vibration: '⚡',
      divineResistance: '👑'
    };
    return icons[key] || '⭐';
  };

  const getCriterionName = (key) => {
    const names = {
      anima: 'ANIMA',
      lumenVitae: 'LUMEN VITAE',
      echo: 'ECHO',
      vibration: 'VIBRATION',
      divineResistance: 'RESISTENCIA DIVINA'
    };
    return names[key] || key.toUpperCase();
  };

  const getProgressColor = (progress, isCompleted) => {
    if (isCompleted) return 'linear-gradient(90deg, #10B981, #059669)';
    if (progress >= 80) return 'linear-gradient(90deg, #F59E0B, #D97706)';
    if (progress >= 60) return 'linear-gradient(90deg, #EF4444, #DC2626)';
    if (progress >= 40) return 'linear-gradient(90deg, #8B5CF6, #7C3AED)';
    return 'linear-gradient(90deg, #6B7280, #4B5563)';
  };

  const getTimeEstimate = (criterion, progress) => {
    if (criterion.passed) return '✅ COMPLETADO';
    
    const remaining = 100 - progress;
    if (remaining <= 0) return '🎯 LISTO';
    
    // Estimación basada en el tipo de criterio
    const estimates = {
      anima: 'Requiere membresía Divina Liga',
      lumenVitae: `~${Math.ceil(remaining * 50)} días activo`,
      echo: `~${Math.ceil(remaining * 30)} días consecutivos`,
      vibration: `~${Math.ceil(remaining * 100)} interacciones`,
      divineResistance: `~${Math.ceil(remaining * 20)} tracks épicos`
    };
    
    return estimates[criterion.key] || 'Calculando...';
  };

  if (!evaluation || !evaluation.criteria) {
    return (
      <div className="alvae-progress-container">
        <div className="progress-loading">
          <div className="loading-spinner"></div>
          <p>Calculando progreso ALVAE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alvae-progress-container">
      <div className="progress-header">
        <h3>🔮 Progreso de la Vibración del Alma</h3>
        <div className="overall-progress">
          <div className="progress-circle">
            <span className="progress-percentage">
              {Math.round(evaluation.score / 2)}%
            </span>
            <span className="progress-label">ALVAE</span>
          </div>
        </div>
      </div>

      <div className="criteria-progress">
        {Object.entries(evaluation.criteria).map(([key, criterion]) => {
          const progress = animatedProgress[key] || 0;
          const isCompleted = completedCriteria.has(key);
          const timeEstimate = getTimeEstimate(criterion, progress);

          return (
            <div 
              key={key} 
              className={`criterion-progress ${isCompleted ? 'completed' : 'in-progress'}`}
            >
              <div className="criterion-header">
                <div className="criterion-icon">
                  {getCriterionIcon(key)}
                </div>
                <div className="criterion-info">
                  <h4>{getCriterionName(key)}</h4>
                  <p>{criterion.message || criterion.description}</p>
                </div>
                <div className="criterion-status">
                  {isCompleted ? (
                    <span className="status-completed">✅ COMPLETADO</span>
                  ) : (
                    <span className="status-progress">
                      {Math.round(progress)}% / {criterion.weight || 100}
                    </span>
                  )}
                </div>
              </div>

              <div className="progress-bar-container">
                <div 
                  className="progress-bar"
                  style={{
                    background: getProgressColor(progress, isCompleted),
                    width: `${progress}%`
                  }}
                >
                  <div className="progress-glow"></div>
                </div>
                <div className="progress-details">
                  <span className="progress-text">
                    {criterion.score || 0} / {criterion.weight || 100} puntos
                  </span>
                  <span className="time-estimate">
                    {timeEstimate}
                  </span>
                </div>
              </div>

              {criterion.details && (
                <div className="criterion-details">
                  {Object.entries(criterion.details).map(([detailKey, value]) => (
                    <div key={detailKey} className="detail-item">
                      <span className="detail-label">{detailKey}:</span>
                      <span className="detail-value">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="progress-motivation">
        <div className="motivation-text">
          {evaluation.eligible ? (
            <div className="celebration">
              <h3>🎉 ¡FELICITACIONES! 🎉</h3>
              <p>Has alcanzado la vibración del alma viva. ¡Bienvenido a la Divina Liga del No Silencio!</p>
            </div>
          ) : (
            <div className="encouragement">
              <h3>🔥 ¡SIGUE LUCHANDO! 🔥</h3>
              <p>La resistencia sonora necesita tu vibración imperfecta. ¡Cada paso cuenta!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlvaeProgress;
