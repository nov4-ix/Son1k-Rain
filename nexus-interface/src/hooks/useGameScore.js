import { useState, useEffect } from 'react';

export const useGameScore = () => {
  const [score, setScore] = useState(0);
  const [easterEggsFound, setEasterEggsFound] = useState(new Set());
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState([]);
  const [gameStats, setGameStats] = useState({
    totalEasterEggs: 0,
    totalInteractions: 0,
    timeSpent: 0,
    modesUnlocked: 0
  });

  // Cargar datos del localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem('nexus-score');
    const savedEasterEggs = localStorage.getItem('nexus-easter-eggs');
    const savedLevel = localStorage.getItem('nexus-level');
    const savedAchievements = localStorage.getItem('nexus-achievements');
    const savedStats = localStorage.getItem('nexus-stats');

    if (savedScore) setScore(parseInt(savedScore));
    if (savedEasterEggs) setEasterEggsFound(new Set(JSON.parse(savedEasterEggs)));
    if (savedLevel) setLevel(parseInt(savedLevel));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    if (savedStats) setGameStats(JSON.parse(savedStats));
  }, []);

  // Guardar datos en localStorage
  useEffect(() => {
    localStorage.setItem('nexus-score', score.toString());
    localStorage.setItem('nexus-easter-eggs', JSON.stringify([...easterEggsFound]));
    localStorage.setItem('nexus-level', level.toString());
    localStorage.setItem('nexus-achievements', JSON.stringify(achievements));
    localStorage.setItem('nexus-stats', JSON.stringify(gameStats));
  }, [score, easterEggsFound, level, achievements, gameStats]);

  // Encontrar easter egg
  const foundEasterEgg = (message) => {
    if (!easterEggsFound.has(message)) {
      setEasterEggsFound(prev => new Set([...prev, message]));
      setScore(prev => prev + 100);
      setGameStats(prev => ({ ...prev, totalEasterEggs: prev.totalEasterEggs + 1 }));
      
      // Verificar logros
      checkAchievements();
      
      return true; // Nuevo easter egg encontrado
    }
    return false; // Ya encontrado antes
  };

  // Incrementar interacciones
  const incrementInteractions = () => {
    setGameStats(prev => ({ ...prev, totalInteractions: prev.totalInteractions + 1 }));
  };

  // Incrementar tiempo
  const incrementTime = (seconds) => {
    setGameStats(prev => ({ ...prev, timeSpent: prev.timeSpent + seconds }));
  };

  // Verificar logros
  const checkAchievements = () => {
    const newAchievements = [];
    
    // Primer easter egg
    if (easterEggsFound.size === 1 && !achievements.includes('first_easter_egg')) {
      newAchievements.push({
        id: 'first_easter_egg',
        title: 'Primer Contacto',
        description: 'Encontraste tu primer mensaje Matrix',
        icon: '🎯',
        points: 50
      });
    }
    
    // 5 easter eggs
    if (easterEggsFound.size === 5 && !achievements.includes('matrix_explorer')) {
      newAchievements.push({
        id: 'matrix_explorer',
        title: 'Explorador Matrix',
        description: 'Encontraste 5 mensajes ocultos',
        icon: '🔍',
        points: 200
      });
    }
    
    // 10 easter eggs
    if (easterEggsFound.size === 10 && !achievements.includes('matrix_master')) {
      newAchievements.push({
        id: 'matrix_master',
        title: 'Maestro Matrix',
        description: 'Encontraste 10 mensajes ocultos',
        icon: '👑',
        points: 500
      });
    }
    
    // Todos los easter eggs
    if (easterEggsFound.size === 20 && !achievements.includes('the_one')) {
      newAchievements.push({
        id: 'the_one',
        title: 'El Elegido',
        description: 'Encontraste todos los mensajes Matrix',
        icon: '🌟',
        points: 1000
      });
    }
    
    // 100 interacciones
    if (gameStats.totalInteractions >= 100 && !achievements.includes('active_user')) {
      newAchievements.push({
        id: 'active_user',
        title: 'Usuario Activo',
        description: 'Realizaste 100 interacciones',
        icon: '⚡',
        points: 300
      });
    }
    
    // Desbloquear todos los modos
    if (gameStats.modesUnlocked >= 4 && !achievements.includes('mode_master')) {
      newAchievements.push({
        id: 'mode_master',
        title: 'Maestro de Modos',
        description: 'Desbloqueaste todos los modos demo',
        icon: '🎨',
        points: 400
      });
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setScore(prev => prev + newAchievements.reduce((sum, ach) => sum + ach.points, 0));
    }
  };

  // Calcular nivel basado en puntuación
  useEffect(() => {
    const newLevel = Math.floor(score / 1000) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [score, level]);

  // Desbloquear modo
  const unlockMode = (modeName) => {
    setGameStats(prev => ({ ...prev, modesUnlocked: prev.modesUnlocked + 1 }));
    setScore(prev => prev + 50);
  };

  // Resetear juego
  const resetGame = () => {
    setScore(0);
    setEasterEggsFound(new Set());
    setLevel(1);
    setAchievements([]);
    setGameStats({
      totalEasterEggs: 0,
      totalInteractions: 0,
      timeSpent: 0,
      modesUnlocked: 0
    });
    localStorage.clear();
  };

  return {
    score,
    easterEggsFound,
    level,
    achievements,
    gameStats,
    foundEasterEgg,
    incrementInteractions,
    incrementTime,
    unlockMode,
    resetGame
  };
};