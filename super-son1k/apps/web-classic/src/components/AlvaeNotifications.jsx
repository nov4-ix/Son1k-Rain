/**
 * AlvaeNotifications - Sistema de Notificaciones ALVAE
 * Alertas inteligentes cuando se acerca a un criterio ALVAE
 */

import React, { useState, useEffect } from 'react';
import './AlvaeNotifications.css';

const AlvaeNotifications = ({ userStats, evaluation }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Generar notificaciones basadas en el progreso
  useEffect(() => {
    if (!evaluation || !evaluation.criteria) return;

    const newNotifications = [];
    const now = new Date();

    // Notificaciones de progreso
    Object.entries(evaluation.criteria).forEach(([key, criterion]) => {
      const progress = (criterion.score || 0) / (criterion.weight || 1) * 100;
      
      // Notificación de criterio completado
      if (criterion.passed && !criterion.notified) {
        newNotifications.push({
          id: `completed_${key}`,
          type: 'success',
          title: '🎉 ¡Criterio Completado!',
          message: `Has completado ${key.toUpperCase()} - ¡Sigue así!`,
          timestamp: now,
          priority: 'high',
          icon: '🎉'
        });
      }
      
      // Notificación de progreso significativo
      else if (progress >= 80 && progress < 100) {
        newNotifications.push({
          id: `progress_${key}`,
          type: 'warning',
          title: '🔥 ¡Casi Listo!',
          message: `Te faltan solo ${Math.round(100 - progress)}% para completar ${key.toUpperCase()}`,
          timestamp: now,
          priority: 'medium',
          icon: '🔥'
        });
      }
      
      // Notificación de progreso medio
      else if (progress >= 50 && progress < 80) {
        newNotifications.push({
          id: `halfway_${key}`,
          type: 'info',
          title: '⚡ ¡Buen Progreso!',
          message: `Has completado ${Math.round(progress)}% de ${key.toUpperCase()} - ¡Sigue luchando!`,
          timestamp: now,
          priority: 'low',
          icon: '⚡'
        });
      }
    });

    // Notificaciones de hitos especiales
    if (userStats && userStats.stats) {
      const stats = userStats.stats;
      
      // Hito de generaciones
      if (stats.totalGenerations >= 1000 && stats.totalGenerations % 500 === 0) {
        newNotifications.push({
          id: `milestone_generations_${stats.totalGenerations}`,
          type: 'celebration',
          title: '🎵 ¡Hito Musical!',
          message: `¡Has generado ${stats.totalGenerations} canciones! La resistencia sonora te necesita.`,
          timestamp: now,
          priority: 'high',
          icon: '🎵'
        });
      }
      
      // Hito de tracks
      if (stats.totalTracks >= 500 && stats.totalTracks % 250 === 0) {
        newNotifications.push({
          id: `milestone_tracks_${stats.totalTracks}`,
          type: 'celebration',
          title: '🎶 ¡Hito de Tracks!',
          message: `¡Has creado ${stats.totalTracks} tracks! Tu eco resuena en la plataforma.`,
          timestamp: now,
          priority: 'high',
          icon: '🎶'
        });
      }
      
      // Hito de likes
      if (stats.totalLikes >= 1000 && stats.totalLikes % 500 === 0) {
        newNotifications.push({
          id: `milestone_likes_${stats.totalLikes}`,
          type: 'celebration',
          title: '❤️ ¡Hito de Amor!',
          message: `¡Has recibido ${stats.totalLikes} likes! Tu vibración conecta con otros.`,
          timestamp: now,
          priority: 'high',
          icon: '❤️'
        });
      }
    }

    // Notificaciones de motivación
    if (evaluation && evaluation.score < 50) {
      newNotifications.push({
        id: 'motivation_start',
        type: 'motivation',
        title: '🌟 ¡Comienza tu Viaje!',
        message: 'Cada gran guerrero de la resistencia comenzó con un solo paso. ¡Tú puedes!',
        timestamp: now,
        priority: 'low',
        icon: '🌟'
      });
    } else if (evaluation && evaluation.score >= 50 && evaluation.score < 100) {
      newNotifications.push({
        id: 'motivation_halfway',
        type: 'motivation',
        title: '🔥 ¡Estás en el Camino!',
        message: 'Has recorrido la mitad del camino hacia ALVAE. ¡La resistencia te necesita!',
        timestamp: now,
        priority: 'medium',
        icon: '🔥'
      });
    } else if (evaluation && evaluation.score >= 100 && evaluation.score < 150) {
      newNotifications.push({
        id: 'motivation_close',
        type: 'motivation',
        title: '⚡ ¡Tan Cerca!',
        message: 'Estás muy cerca de ALVAE. ¡Un último esfuerzo y serás parte de la Divina Liga!',
        timestamp: now,
        priority: 'high',
        icon: '⚡'
      });
    }

    setNotifications(newNotifications);
  }, [userStats, evaluation]);

  const getNotificationIcon = (type) => {
    const icons = {
      success: '✅',
      warning: '⚠️',
      info: 'ℹ️',
      celebration: '🎉',
      motivation: '💪'
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (type) => {
    const colors = {
      success: '#10B981',
      warning: '#F59E0B',
      info: '#3B82F6',
      celebration: '#8B5CF6',
      motivation: '#EF4444'
    };
    return colors[type] || '#6B7280';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const handleNotificationClick = (notification) => {
    // Marcar como leída
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id 
          ? { ...n, read: true }
          : n
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="alvae-notifications-container">
      <div className="notifications-header">
        <h3>🔔 Notificaciones ALVAE</h3>
        <div className="notifications-controls">
          <button
            className="notifications-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            {showNotifications ? 'Ocultar' : 'Mostrar'} ({unreadCount})
          </button>
        </div>
      </div>

      {showNotifications && (
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <div className="no-notifications-icon">🔕</div>
              <p>No hay notificaciones nuevas</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  {notification.icon}
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h4>{notification.title}</h4>
                    <span className="notification-time">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                  <p>{notification.message}</p>
                </div>
                <div className="notification-priority">
                  <div
                    className="priority-indicator"
                    style={{ backgroundColor: getNotificationColor(notification.type) }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {unreadCount > 0 && (
        <div className="notifications-badge">
          <span className="badge-count">{unreadCount}</span>
        </div>
      )}
    </div>
  );
};

export default AlvaeNotifications;
