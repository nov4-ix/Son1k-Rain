/**
 * AlvaeEvents - Sistema de Eventos ALVAE
 * Eventos especiales que dan puntos bonus para obtener ALVAE
 */

import React, { useState, useEffect } from 'react';
import './AlvaeEvents.css';

const AlvaeEvents = ({ user, onEventJoin }) => {
  const [events, setEvents] = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('active');
  const [isLoading, setIsLoading] = useState(true);

  // Filtros de eventos
  const eventFilters = [
    { id: 'active', name: '🔥 Activos', icon: '🔥' },
    { id: 'upcoming', name: '⏰ Próximos', icon: '⏰' },
    { id: 'past', name: '📜 Pasados', icon: '📜' },
    { id: 'all', name: '🌟 Todos', icon: '🌟' }
  ];

  // Generar eventos simulados (en producción vendría del backend)
  useEffect(() => {
    const generateEvents = () => {
      const now = new Date();
      const mockEvents = [
        {
          id: 'resistance_week',
          title: '🔥 Semana de la Resistencia',
          description: 'Genera música que inspire la lucha contra el ruido algorítmico',
          type: 'special',
          status: 'active',
          startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
          endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 días adelante
          reward: 100,
          participants: 1247,
          maxParticipants: 2000,
          difficulty: 'epic',
          requirements: {
            minGenerations: 10,
            minTracks: 5,
            theme: 'resistencia'
          },
          icon: '🔥',
          color: '#EF4444',
          glow: '#DC2626',
          isJoined: false,
          progress: 0
        },
        {
          id: 'divine_collaboration',
          title: '🤝 Colaboración Divina',
          description: 'Colabora con otros guerreros para crear música épica',
          type: 'collaboration',
          status: 'active',
          startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
          endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 días adelante
          reward: 75,
          participants: 892,
          maxParticipants: 1000,
          difficulty: 'hard',
          requirements: {
            minCollaborations: 3,
            minTracks: 2
          },
          icon: '🤝',
          color: '#8B5CF6',
          glow: '#7C3AED',
          isJoined: true,
          progress: 60
        },
        {
          id: 'viral_challenge',
          title: '📈 Desafío Viral',
          description: 'Crea contenido que se vuelva viral en la plataforma',
          type: 'challenge',
          status: 'upcoming',
          startDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 día adelante
          endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 días adelante
          reward: 150,
          participants: 0,
          maxParticipants: 500,
          difficulty: 'epic',
          requirements: {
            minLikes: 1000,
            minShares: 500
          },
          icon: '📈',
          color: '#10B981',
          glow: '#059669',
          isJoined: false,
          progress: 0
        },
        {
          id: 'echo_mastery',
          title: '🌊 Maestría del Eco',
          description: 'Domina el arte del eco en tus creaciones musicales',
          type: 'mastery',
          status: 'upcoming',
          startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 días adelante
          endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 días adelante
          reward: 120,
          participants: 0,
          maxParticipants: 300,
          difficulty: 'hard',
          requirements: {
            minPerfectTracks: 5,
            minInnovationScore: 80
          },
          icon: '🌊',
          color: '#3B82F6',
          glow: '#2563EB',
          isJoined: false,
          progress: 0
        },
        {
          id: 'divine_frequency',
          title: '🔮 Frecuencia Divina',
          description: 'Alcanza la frecuencia perfecta en tus composiciones',
          type: 'spiritual',
          status: 'past',
          startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 días atrás
          endDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
          reward: 200,
          participants: 456,
          maxParticipants: 500,
          difficulty: 'epic',
          requirements: {
            minSpiritualMoments: 10,
            minPerfectTracks: 8
          },
          icon: '🔮',
          color: '#8B5CF6',
          glow: '#7C3AED',
          isJoined: true,
          progress: 100
        },
        {
          id: 'imperfect_perfection',
          title: '✨ Perfección Imperfecta',
          description: 'Celebra la belleza de la imperfección en el arte',
          type: 'philosophical',
          status: 'past',
          startDate: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), // 21 días atrás
          endDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 días atrás
          reward: 80,
          participants: 678,
          maxParticipants: 1000,
          difficulty: 'medium',
          requirements: {
            minTracks: 3,
            minComments: 50
          },
          icon: '✨',
          color: '#F59E0B',
          glow: '#D97706',
          isJoined: false,
          progress: 0
        }
      ];

      return mockEvents;
    };

    const mockEvents = generateEvents();
    setEvents(mockEvents);
    
    // Filtrar eventos por estado
    setActiveEvents(mockEvents.filter(e => e.status === 'active'));
    setUpcomingEvents(mockEvents.filter(e => e.status === 'upcoming'));
    setPastEvents(mockEvents.filter(e => e.status === 'past'));
    
    setIsLoading(false);
  }, []);

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

  const getStatusColor = (status) => {
    const colors = {
      active: '#10B981',
      upcoming: '#3B82F6',
      past: '#6B7280'
    };
    return colors[status] || '#6B7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'ACTIVO',
      upcoming: 'PRÓXIMO',
      past: 'FINALIZADO'
    };
    return labels[status] || 'DESCONOCIDO';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTimeRemaining = (endDate) => {
    const now = new Date();
    const diff = endDate - now;
    
    if (diff <= 0) return 'Finalizado';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Finalizando';
  };

  const handleJoinEvent = (event) => {
    if (event.isJoined) return;
    
    // Simular unirse al evento
    const updatedEvents = events.map(e => 
      e.id === event.id 
        ? { ...e, isJoined: true, participants: e.participants + 1 }
        : e
    );
    
    setEvents(updatedEvents);
    
    if (onEventJoin) {
      onEventJoin(event);
    }
  };

  const getFilteredEvents = () => {
    switch (selectedFilter) {
      case 'active':
        return activeEvents;
      case 'upcoming':
        return upcomingEvents;
      case 'past':
        return pastEvents;
      default:
        return events;
    }
  };

  if (isLoading) {
    return (
      <div className="alvae-events-container">
        <div className="events-loading">
          <div className="loading-spinner"></div>
          <p>Cargando eventos de la Resistencia Sonora...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alvae-events-container">
      <div className="events-header">
        <h3>🎪 Eventos de la Resistencia Sonora</h3>
        <p>Participa en eventos especiales para obtener puntos bonus hacia ALVAE</p>
      </div>

      {/* Filtros */}
      <div className="events-filters">
        {eventFilters.map(filter => (
          <button
            key={filter.id}
            className={`event-filter ${selectedFilter === filter.id ? 'active' : ''}`}
            onClick={() => setSelectedFilter(filter.id)}
          >
            <span className="filter-icon">{filter.icon}</span>
            <span className="filter-label">{filter.name}</span>
          </button>
        ))}
      </div>

      {/* Lista de eventos */}
      <div className="events-list">
        {getFilteredEvents().length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">🎭</div>
            <p>No hay eventos disponibles en esta categoría</p>
          </div>
        ) : (
          getFilteredEvents().map(event => (
            <div
              key={event.id}
              className={`event-card ${event.status} ${event.isJoined ? 'joined' : ''}`}
            >
              <div className="event-header">
                <div className="event-icon" style={{ color: event.color }}>
                  {event.icon}
                </div>
                <div className="event-info">
                  <h4 className="event-title">{event.title}</h4>
                  <p className="event-description">{event.description}</p>
                </div>
                <div className="event-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(event.status) }}
                  >
                    {getStatusLabel(event.status)}
                  </span>
                </div>
              </div>

              <div className="event-details">
                <div className="event-dates">
                  <div className="date-item">
                    <span className="date-label">Inicio:</span>
                    <span className="date-value">{formatDate(event.startDate)}</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Fin:</span>
                    <span className="date-value">{formatDate(event.endDate)}</span>
                  </div>
                  {event.status === 'active' && (
                    <div className="date-item">
                      <span className="date-label">Tiempo restante:</span>
                      <span className="date-value time-remaining">
                        {formatTimeRemaining(event.endDate)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="event-stats">
                  <div className="stat-item">
                    <span className="stat-icon">👥</span>
                    <span className="stat-value">
                      {event.participants}/{event.maxParticipants}
                    </span>
                    <span className="stat-label">Participantes</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">🎁</span>
                    <span className="stat-value">+{event.reward}</span>
                    <span className="stat-label">Puntos</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">⚡</span>
                    <span 
                      className="stat-value difficulty"
                      style={{ color: getDifficultyColor(event.difficulty) }}
                    >
                      {getDifficultyLabel(event.difficulty)}
                    </span>
                  </div>
                </div>

                {event.isJoined && (
                  <div className="event-progress">
                    <div className="progress-header">
                      <span className="progress-label">Tu Progreso</span>
                      <span className="progress-percentage">{event.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${event.progress}%`,
                          backgroundColor: event.color
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="event-requirements">
                  <h5>Requisitos:</h5>
                  <ul>
                    {Object.entries(event.requirements).map(([key, value]) => (
                      <li key={key}>
                        <span className="requirement-key">{key}:</span>
                        <span className="requirement-value">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="event-actions">
                {event.status === 'active' && !event.isJoined && (
                  <button
                    className="join-event-btn"
                    onClick={() => handleJoinEvent(event)}
                    style={{
                      background: `linear-gradient(135deg, ${event.color}, ${event.glow})`,
                      boxShadow: `0 0 20px ${event.color}40`
                    }}
                  >
                    <span className="btn-icon">🚀</span>
                    <span className="btn-text">Unirse al Evento</span>
                  </button>
                )}
                
                {event.isJoined && (
                  <div className="joined-status">
                    <span className="joined-icon">✅</span>
                    <span className="joined-text">Participando</span>
                  </div>
                )}
                
                {event.status === 'upcoming' && (
                  <div className="upcoming-status">
                    <span className="upcoming-icon">⏰</span>
                    <span className="upcoming-text">Próximamente</span>
                  </div>
                )}
                
                {event.status === 'past' && (
                  <div className="past-status">
                    <span className="past-icon">📜</span>
                    <span className="past-text">Finalizado</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Estadísticas de eventos */}
      <div className="events-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <div className="stat-value">{activeEvents.length}</div>
              <div className="stat-label">Eventos Activos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-info">
              <div className="stat-value">{upcomingEvents.length}</div>
              <div className="stat-label">Próximos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📜</div>
            <div className="stat-info">
              <div className="stat-value">{pastEvents.length}</div>
              <div className="stat-label">Finalizados</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎁</div>
            <div className="stat-info">
              <div className="stat-value">
                {events.reduce((total, event) => total + event.reward, 0)}
              </div>
              <div className="stat-label">Puntos Totales</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlvaeEvents;
