/**
 * AlvaeRankings - Sistema de Rankings ALVAE
 * Top 100 usuarios más cerca de obtener ALVAE con competencia épica
 */

import React, { useState, useEffect } from 'react';
import './AlvaeRankings.css';

const AlvaeRankings = ({ user, evaluation }) => {
  const [rankings, setRankings] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [timeFilter, setTimeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Categorías de ranking
  const categories = [
    { id: 'overall', name: '🏆 General', icon: '🏆' },
    { id: 'generations', name: '🎵 Generaciones', icon: '🎵' },
    { id: 'tracks', name: '🎶 Tracks', icon: '🎶' },
    { id: 'likes', name: '❤️ Likes', icon: '❤️' },
    { id: 'activity', name: '⚡ Actividad', icon: '⚡' },
    { id: 'collaborations', name: '🤝 Colaboraciones', icon: '🤝' }
  ];

  // Filtros de tiempo
  const timeFilters = [
    { id: 'all', name: 'Todo el tiempo' },
    { id: 'month', name: 'Este mes' },
    { id: 'week', name: 'Esta semana' },
    { id: 'day', name: 'Hoy' }
  ];

  // Generar datos de ranking simulados (en producción vendría del backend)
  useEffect(() => {
    const generateRankings = () => {
      const mockUsers = [];
      
      // Generar 100 usuarios de ejemplo
      for (let i = 1; i <= 100; i++) {
        const isCurrentUser = user && i === 1; // Simular que el usuario actual está en posición 1
        
        mockUsers.push({
          id: `user_${i}`,
          nickname: isCurrentUser ? user.nickname : `Usuario${i}`,
          email: isCurrentUser ? user.email : `user${i}@example.com`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
          rank: i,
          score: Math.max(200 - i * 1.5, 0), // Puntuación decreciente
          progress: Math.max(100 - i, 0), // Progreso decreciente
          stats: {
            generations: Math.floor(Math.random() * 5000) + (100 - i) * 50,
            tracks: Math.floor(Math.random() * 2500) + (100 - i) * 25,
            likes: Math.floor(Math.random() * 10000) + (100 - i) * 100,
            shares: Math.floor(Math.random() * 5000) + (100 - i) * 50,
            downloads: Math.floor(Math.random() * 2000) + (100 - i) * 20,
            collaborations: Math.floor(Math.random() * 100) + (100 - i),
            daysActive: Math.floor(Math.random() * 180) + (100 - i),
            consecutiveDays: Math.floor(Math.random() * 30) + (100 - i)
          },
          alvaeLevel: i <= 5 ? 'DIVINE_WARRIOR' : i <= 20 ? 'MASTER' : i <= 50 ? 'ADVANCED' : 'ASPIRANT',
          isCurrentUser,
          lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          badges: generateBadges(i)
        });
      }
      
      return mockUsers;
    };

    const generateBadges = (rank) => {
      const badges = [];
      if (rank <= 10) badges.push('👑');
      if (rank <= 25) badges.push('🏆');
      if (rank <= 50) badges.push('🥇');
      if (rank <= 75) badges.push('🥈');
      if (rank <= 100) badges.push('🥉');
      return badges;
    };

    const mockRankings = generateRankings();
    setRankings(mockRankings);
    
    // Encontrar el ranking del usuario actual
    const currentUserRank = mockRankings.find(u => u.isCurrentUser);
    setUserRank(currentUserRank);
    
    setIsLoading(false);
  }, [user]);

  const getRankingIcon = (rank) => {
    if (rank <= 3) return ['🥇', '🥈', '🥉'][rank - 1];
    if (rank <= 10) return '🏆';
    if (rank <= 25) return '🥇';
    if (rank <= 50) return '🥈';
    if (rank <= 75) return '🥉';
    return '⭐';
  };

  const getRankingColor = (rank) => {
    if (rank <= 3) return '#FFD700';
    if (rank <= 10) return '#C0C0C0';
    if (rank <= 25) return '#CD7F32';
    if (rank <= 50) return '#8B5CF6';
    return '#6B7280';
  };

  const getAlvaeLevelColor = (level) => {
    const colors = {
      'DIVINE_WARRIOR': '#FFD700',
      'MASTER': '#8B5CF6',
      'ADVANCED': '#10B981',
      'ASPIRANT': '#6B7280'
    };
    return colors[level] || '#6B7280';
  };

  const getAlvaeLevelLabel = (level) => {
    const labels = {
      'DIVINE_WARRIOR': 'Guerrero Divino',
      'MASTER': 'Maestro',
      'ADVANCED': 'Avanzado',
      'ASPIRANT': 'Aspirante'
    };
    return labels[level] || 'Desconocido';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getCategoryValue = (user, category) => {
    switch (category) {
      case 'generations':
        return user.stats.generations;
      case 'tracks':
        return user.stats.tracks;
      case 'likes':
        return user.stats.likes;
      case 'activity':
        return user.stats.daysActive;
      case 'collaborations':
        return user.stats.collaborations;
      default:
        return user.score;
    }
  };

  const sortedRankings = [...rankings].sort((a, b) => {
    const aValue = getCategoryValue(a, selectedCategory);
    const bValue = getCategoryValue(b, selectedCategory);
    return bValue - aValue;
  });

  if (isLoading) {
    return (
      <div className="alvae-rankings-container">
        <div className="rankings-loading">
          <div className="loading-spinner"></div>
          <p>Calculando rankings de la Resistencia Sonora...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alvae-rankings-container">
      <div className="rankings-header">
        <h3>🏆 Rankings de la Resistencia Sonora</h3>
        <p>Los guerreros más cerca de obtener ALVAE</p>
      </div>

      {/* Filtros */}
      <div className="rankings-filters">
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="filter-icon">{category.icon}</span>
              <span className="filter-label">{category.name}</span>
            </button>
          ))}
        </div>
        
        <div className="time-filters">
          {timeFilters.map(filter => (
            <button
              key={filter.id}
              className={`time-filter ${timeFilter === filter.id ? 'active' : ''}`}
              onClick={() => setTimeFilter(filter.id)}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Ranking del usuario actual */}
      {userRank && (
        <div className="user-rank-card">
          <div className="user-rank-header">
            <h4>Tu Posición en la Resistencia</h4>
            <div className="user-rank-badge">
              <span className="rank-icon">{getRankingIcon(userRank.rank)}</span>
              <span className="rank-number">#{userRank.rank}</span>
            </div>
          </div>
          <div className="user-rank-stats">
            <div className="stat-item">
              <span className="stat-label">Puntuación ALVAE</span>
              <span className="stat-value">{userRank.score.toFixed(1)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Progreso</span>
              <span className="stat-value">{userRank.progress}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Nivel</span>
              <span 
                className="stat-value alvae-level"
                style={{ color: getAlvaeLevelColor(userRank.alvaeLevel) }}
              >
                {getAlvaeLevelLabel(userRank.alvaeLevel)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Rankings */}
      <div className="rankings-list">
        <div className="rankings-list-header">
          <h4>Top 100 Guerreros de la Resistencia</h4>
          <div className="rankings-stats">
            <span className="total-users">{rankings.length} guerreros</span>
          </div>
        </div>

        <div className="rankings-table">
          {sortedRankings.slice(0, 50).map((user, index) => {
            const actualRank = index + 1;
            const categoryValue = getCategoryValue(user, selectedCategory);
            
            return (
              <div
                key={user.id}
                className={`ranking-item ${user.isCurrentUser ? 'current-user' : ''} ${actualRank <= 3 ? 'top-three' : ''}`}
              >
                <div className="rank-position">
                  <span className="rank-icon">{getRankingIcon(actualRank)}</span>
                  <span className="rank-number">#{actualRank}</span>
                </div>

                <div className="user-info">
                  <div className="user-avatar">
                    <img src={user.avatar} alt={user.nickname} />
                    {user.badges.map((badge, idx) => (
                      <span key={idx} className="user-badge">{badge}</span>
                    ))}
                  </div>
                  <div className="user-details">
                    <h5 className="user-nickname">
                      {user.nickname}
                      {user.isCurrentUser && <span className="current-user-indicator">(Tú)</span>}
                    </h5>
                    <div className="user-level">
                      <span 
                        className="level-badge"
                        style={{ 
                          backgroundColor: getAlvaeLevelColor(user.alvaeLevel),
                          color: 'white'
                        }}
                      >
                        {getAlvaeLevelLabel(user.alvaeLevel)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-stats">
                  <div className="stat-value">
                    {formatNumber(categoryValue)}
                  </div>
                  <div className="stat-label">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </div>
                </div>

                <div className="user-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${user.progress}%`,
                        backgroundColor: getRankingColor(actualRank)
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">{user.progress}%</span>
                </div>

                <div className="user-actions">
                  <button className="action-btn">
                    <span>👁️</span>
                  </button>
                  <button className="action-btn">
                    <span>💬</button>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estadísticas globales */}
      <div className="rankings-global-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👑</div>
            <div className="stat-info">
              <div className="stat-value">{rankings.filter(u => u.rank <= 10).length}</div>
              <div className="stat-label">Top 10</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <div className="stat-value">{rankings.filter(u => u.alvaeLevel === 'DIVINE_WARRIOR').length}</div>
              <div className="stat-label">Guerreros Divinos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-info">
              <div className="stat-value">{rankings.filter(u => u.progress >= 80).length}</div>
              <div className="stat-label">Cerca de ALVAE</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <div className="stat-value">{rankings.filter(u => u.stats.daysActive >= 30).length}</div>
              <div className="stat-label">Activos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlvaeRankings;
