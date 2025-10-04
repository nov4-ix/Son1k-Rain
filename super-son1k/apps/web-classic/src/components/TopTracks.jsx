/**
 * Top Tracks - Componente de Top 10 tracks más populares
 * Super-Son1k Web Classic
 */

import React, { useState, useEffect } from 'react';
import TrackPlayer from './TrackPlayer';
import useTheme from '../hooks/useTheme';
import useAnimations from '../hooks/useAnimations';
import './TopTracks.css';

const TopTracks = ({ compact = false }) => {
  const [topTracks, setTopTracks] = useState([]);
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('popularity');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  
  const { theme } = useTheme();
  const { 
    createAnimatedRef, 
    getAnimationClass, 
    pulse, 
    glow,
    createParticles 
  } = useAnimations();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  const categories = [
    { id: 'popularity', name: 'Más Populares', icon: '🔥' },
    { id: 'plays', name: 'Más Escuchados', icon: '👁️' },
    { id: 'likes', name: 'Más Likeados', icon: '❤️' },
    { id: 'shares', name: 'Más Compartidos', icon: '📤' },
    { id: 'trending', name: 'Trending', icon: '📈' }
  ];

  // Cargar tracks iniciales
  useEffect(() => {
    loadTopTracks();
  }, []);

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadTopTracks();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadTopTracks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/tracks/top`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error cargando tracks');
      }

      setTopTracks(data.data.topTracks || []);
      setTrendingTracks(data.data.trendingTracks || []);
      setIsLoading(false);

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleTrackPlay = (trackId) => {
    setPlayingTrackId(trackId);
    pulse('top-tracks-section');
  };

  const handleLike = async (trackId, isLiked) => {
    try {
      const response = await fetch(`${API_BASE}/tracks/${trackId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({ liked: isLiked })
      });

      if (response.ok) {
        // Actualizar el track en la lista local
        setTopTracks(prev => prev.map(track => 
          track.id === trackId 
            ? { 
                ...track, 
                stats: { 
                  ...track.stats, 
                  likes: track.stats.likes + (isLiked ? 1 : -1) 
                } 
              }
            : track
        ));
        
        if (isLiked) {
          createParticles('like-particles', 8);
        }
      }
    } catch (err) {
      console.error('Error liking track:', err);
    }
  };

  const handleShare = async (trackId) => {
    try {
      const response = await fetch(`${API_BASE}/tracks/${trackId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({ platform: 'web' })
      });

      if (response.ok) {
        // Actualizar el track en la lista local
        setTopTracks(prev => prev.map(track => 
          track.id === trackId 
            ? { 
                ...track, 
                stats: { 
                  ...track.stats, 
                  shares: track.stats.shares + 1 
                } 
              }
            : track
        ));
        
        createParticles('share-particles', 6);
        
        // Copiar URL al portapapeles
        const trackUrl = `${window.location.origin}/track/${trackId}`;
        navigator.clipboard.writeText(trackUrl);
      }
    } catch (err) {
      console.error('Error sharing track:', err);
    }
  };

  const handleDownload = async (trackId) => {
    try {
      const response = await fetch(`${API_BASE}/tracks/${trackId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `track-${trackId}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        createParticles('download-particles', 4);
      }
    } catch (err) {
      console.error('Error downloading track:', err);
    }
  };

  const getCurrentTracks = () => {
    if (selectedCategory === 'trending') {
      return trendingTracks;
    }
    return topTracks.filter(track => track.category === selectedCategory);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  if (isLoading) {
    return (
      <div className="top-tracks loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando tracks más populares...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="top-tracks error">
        <div className="error-message">
          <h3>❌ Error cargando tracks</h3>
          <p>{error}</p>
          <button onClick={loadTopTracks} className="retry-btn">
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  const currentTracks = getCurrentTracks();

  return (
    <div 
      id="top-tracks-section"
      className={`top-tracks ${compact ? 'compact' : ''}`}
    >
      <div className="particles-container" id="like-particles"></div>
      <div className="particles-container" id="share-particles"></div>
      <div className="particles-container" id="download-particles"></div>
      
      {/* Header */}
      <div 
        className={`tracks-header ${getAnimationClass('tracks-header', 'fadeInDown')}`}
        ref={createAnimatedRef('fadeInDown')}
      >
        <h3>🎵 Top Tracks</h3>
        <p>Los tracks más populares de la plataforma</p>
        
        {!compact && (
          <div className="category-tabs">
            {categories.map((category, index) => (
              <button
                key={category.id}
                className={`category-tab ${selectedCategory === category.id ? 'active' : ''} ${getAnimationClass(`category-tab-${index}`, 'scaleIn')}`}
                onClick={() => setSelectedCategory(category.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="tab-icon">{category.icon}</span>
                <span className="tab-name">{category.name}</span>
                <div className="tab-glow"></div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tracks List */}
      <div 
        className={`tracks-list ${getAnimationClass('tracks-list', 'fadeInUp')}`}
        ref={createAnimatedRef('fadeInUp')}
      >
        {currentTracks.length === 0 ? (
          <div className="empty-tracks">
            <span className="empty-icon">🎵</span>
            <p>No hay tracks disponibles</p>
          </div>
        ) : (
          currentTracks.map((track, index) => (
            <div 
              key={track.id}
              className={`track-item ${getAnimationClass(`track-item-${index}`, 'fadeInLeft')}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rank */}
              <div className="track-rank">
                <span className="rank-icon">{getRankIcon(index + 1)}</span>
              </div>

              {/* Track Player */}
              <div className="track-player-container">
                <TrackPlayer
                  track={track}
                  compact={compact}
                  onLike={handleLike}
                  onShare={handleShare}
                  onDownload={handleDownload}
                />
              </div>

              {/* Stats */}
              {!compact && (
                <div className="track-stats">
                  <div className="stat-item">
                    <span className="stat-icon">👁️</span>
                    <span className="stat-value">{formatNumber(track.stats?.plays || 0)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">❤️</span>
                    <span className="stat-value">{formatNumber(track.stats?.likes || 0)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">📤</span>
                    <span className="stat-value">{formatNumber(track.stats?.shares || 0)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">📥</span>
                    <span className="stat-value">{formatNumber(track.stats?.downloads || 0)}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {!compact && (
        <div 
          className={`tracks-footer ${getAnimationClass('tracks-footer', 'fadeInUp')}`}
          ref={createAnimatedRef('fadeInUp')}
        >
          <div className="footer-stats">
            <span className="footer-stat">
              <span className="stat-number">{currentTracks.length}</span>
              <span className="stat-label">Tracks</span>
            </span>
            <span className="footer-stat">
              <span className="stat-number">{formatNumber(currentTracks.reduce((sum, track) => sum + (track.stats?.plays || 0), 0))}</span>
              <span className="stat-label">Total Plays</span>
            </span>
            <span className="footer-stat">
              <span className="stat-number">{formatNumber(currentTracks.reduce((sum, track) => sum + (track.stats?.likes || 0), 0))}</span>
              <span className="stat-label">Total Likes</span>
            </span>
          </div>
          
          <button 
            onClick={loadTopTracks}
            className="refresh-btn"
          >
            🔄 Actualizar
          </button>
        </div>
      )}
    </div>
  );
};

export default TopTracks;