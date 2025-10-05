/**
 * Track Player - Reproductor integrado de tracks
 * Super-Son1k Web Classic
 */

import React, { useState, useRef, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import useAnimations from '../hooks/useAnimations';
import './TrackPlayer.css';

const TrackPlayer = ({ track, onLike, onShare, onDownload, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  
  const { theme } = useTheme();
  const { pulse, glow, createParticles } = useAnimations();

  // Inicializar audio
  useEffect(() => {
    if (track?.audioUrl && audioRef.current) {
      setIsLoading(true);
      setError(null);
      
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
        setIsLoading(false);
      });
      
      audioRef.current.addEventListener('error', () => {
        setError('Error cargando el audio');
        setIsLoading(false);
      });
    }
  }, [track?.audioUrl]);

  // Manejar reproducción
  const togglePlay = () => {
    if (!audioRef.current || !track?.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          pulse('play-button');
          createParticles('track-particles', 8);
        })
        .catch(err => {
          setError('Error reproduciendo el audio');
          console.error('Play error:', err);
        });
    }
  };

  // Manejar tiempo actualizado
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Manejar fin de reproducción
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Manejar cambio de volumen
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Manejar click en barra de progreso
  const handleProgressClick = (e) => {
    if (!audioRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Manejar like
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onLike) {
      onLike(track.id, !isLiked);
    }
    pulse('like-button');
    if (!isLiked) {
      createParticles('like-particles', 5);
    }
  };

  // Manejar share
  const handleShare = () => {
    if (onShare) {
      onShare(track.id);
    }
    pulse('share-button');
    createParticles('share-particles', 6);
  };

  // Manejar download
  const handleDownload = () => {
    if (onDownload) {
      onDownload(track.id);
    }
    pulse('download-button');
    createParticles('download-particles', 4);
  };

  // Formatear tiempo
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Formatear duración del track
  const formatDuration = (duration) => {
    if (duration < 60) {
      return `${Math.floor(duration)}s`;
    } else {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  if (!track) {
    return (
      <div className="track-player empty">
        <div className="empty-state">
          <span className="empty-icon">🎵</span>
          <p>No hay track seleccionado</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`track-player ${compact ? 'compact' : ''}`}>
      <div className="particles-container" id="track-particles"></div>
      <div className="particles-container" id="like-particles"></div>
      <div className="particles-container" id="share-particles"></div>
      <div className="particles-container" id="download-particles"></div>
      
      {/* Audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Track Info */}
      <div className="track-info">
        <div className="track-cover">
          {track.coverUrl ? (
            <img src={track.coverUrl} alt={track.title} />
          ) : (
            <div className="default-cover">
              <span className="cover-icon">🎵</span>
            </div>
          )}
        </div>
        
        <div className="track-details">
          <h4 className="track-title">{track.title}</h4>
          <p className="track-artist">{track.artist}</p>
          <div className="track-meta">
            <span className="track-genre">{track.genre}</span>
            <span className="track-duration">{formatDuration(track.duration)}</span>
            {track.tool && (
              <span className="track-tool">
                {track.tool === 'generator' && '🎵'}
                {track.tool === 'ghost' && '🎵'}
                {track.tool === 'pixel' && '🤖'}
                {track.tool === 'nova' && '📱'}
                {track.tool === 'clone' && '🎤'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="track-controls">
        <button
          id="play-button"
          onClick={togglePlay}
          disabled={isLoading || error}
          className={`play-btn ${isPlaying ? 'playing' : ''}`}
        >
          {isLoading ? (
            <span className="loading-spinner"></span>
          ) : error ? (
            '❌'
          ) : isPlaying ? (
            '⏸️'
          ) : (
            '▶️'
          )}
        </button>

        {!compact && (
          <>
            {/* Progress Bar */}
            <div className="progress-container">
              <span className="time-display">{formatTime(currentTime)}</span>
              <div 
                ref={progressRef}
                className="progress-bar"
                onClick={handleProgressClick}
              >
                <div 
                  className="progress-fill"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
                <div 
                  className="progress-handle"
                  style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="time-display">{formatTime(duration)}</span>
            </div>

            {/* Volume Control */}
            <div className="volume-container">
              <span className="volume-icon">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="track-actions">
        <button
          id="like-button"
          onClick={handleLike}
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
          title={isLiked ? 'Quitar like' : 'Dar like'}
        >
          {isLiked ? '❤️' : '🤍'}
          {!compact && <span>{track.stats?.likes || 0}</span>}
        </button>

        <button
          id="share-button"
          onClick={handleShare}
          className="action-btn share-btn"
          title="Compartir"
        >
          📤
          {!compact && <span>{track.stats?.shares || 0}</span>}
        </button>

        <button
          id="download-button"
          onClick={handleDownload}
          className="action-btn download-btn"
          title="Descargar"
        >
          📥
          {!compact && <span>{track.stats?.downloads || 0}</span>}
        </button>

        {!compact && (
          <div className="track-stats">
            <span className="stat-item">
              👁️ {track.stats?.plays || 0}
            </span>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Cargando audio...</span>
        </div>
      )}
    </div>
  );
};

export default TrackPlayer;