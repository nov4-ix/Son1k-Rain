/**
 * No Silence League - La Liga del No Silencio
 * Super-Son1k Web Classic
 */

import React, { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import useAnimations from '../hooks/useAnimations';
import './NoSilenceLeague.css';

const NoSilenceLeague = ({ user }) => {
  const [activeTab, setActiveTab] = useState('members');
  const [members, setMembers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { theme } = useTheme();
  const { 
    createAnimatedRef, 
    getAnimationClass, 
    pulse, 
    glow,
    createParticles 
  } = useAnimations();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    loadLeagueData();
  }, []);

  const loadLeagueData = async () => {
    setIsLoading(true);
    try {
      // Simular carga de datos de la liga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos mock de miembros
      setMembers([
        {
          id: 'nov4-ix',
          nickname: 'Nova IX',
          email: 'nov4-ix@sonikvers3.com',
          role: 'admin',
          isFounder: true,
          joinDate: '2024-01-01',
          achievements: 15,
          rank: 'Grand Master',
          status: 'online'
        },
        {
          id: 'josue-enterprise',
          nickname: 'Josué Enterprise',
          email: 'pro.enterprise@son1kvers3.com',
          role: 'enterprise',
          isFounder: true,
          joinDate: '2024-01-01',
          achievements: 12,
          rank: 'Master',
          status: 'online'
        },
        {
          id: 'tester1',
          nickname: 'Tester1',
          email: 'pro.tester1@sonikvers3.com',
          role: 'pro',
          isFounder: true,
          joinDate: '2024-01-15',
          achievements: 8,
          rank: 'Expert',
          status: 'away'
        },
        {
          id: 'tester2',
          nickname: 'Tester2',
          email: 'pro.tester2@sonikvers3.com',
          role: 'pro',
          isFounder: true,
          joinDate: '2024-01-15',
          achievements: 6,
          rank: 'Expert',
          status: 'offline'
        },
        {
          id: 'tester3',
          nickname: 'Tester3',
          email: 'pro.tester3@sonikvers3.com',
          role: 'pro',
          isFounder: true,
          joinDate: '2024-01-15',
          achievements: 5,
          rank: 'Expert',
          status: 'online'
        }
      ]);

      // Datos mock de logros
      setAchievements([
        {
          id: 'first-generation',
          name: 'Primera Generación',
          description: 'Generaste tu primera canción',
          icon: '🎵',
          rarity: 'common',
          unlocked: true
        },
        {
          id: 'founder-member',
          name: 'Miembro Fundador',
          description: 'Eres parte del equipo fundador',
          icon: '🏆',
          rarity: 'legendary',
          unlocked: true
        },
        {
          id: 'silence-breaker',
          name: 'Rompe Silencios',
          description: 'Generaste 100 canciones',
          icon: '🔊',
          rarity: 'epic',
          unlocked: false
        },
        {
          id: 'music-master',
          name: 'Maestro Musical',
          description: 'Dominaste todas las herramientas',
          icon: '🎼',
          rarity: 'legendary',
          unlocked: false
        },
        {
          id: 'community-leader',
          name: 'Líder Comunitario',
          description: 'Ayudaste a 50 usuarios',
          icon: '👑',
          rarity: 'epic',
          unlocked: false
        }
      ]);

      // Datos mock de eventos
      setEvents([
        {
          id: 'league-launch',
          title: 'Lanzamiento de La Liga',
          description: 'Celebración del lanzamiento oficial de La Liga del No Silencio',
          date: '2024-01-01',
          type: 'celebration',
          status: 'completed'
        },
        {
          id: 'first-concert',
          title: 'Primer Concierto Virtual',
          description: 'Concierto virtual con las mejores creaciones de la liga',
          date: '2024-02-15',
          type: 'concert',
          status: 'upcoming'
        },
        {
          id: 'collaboration-week',
          title: 'Semana de Colaboración',
          description: 'Semana especial para colaboraciones entre miembros',
          date: '2024-03-01',
          type: 'collaboration',
          status: 'upcoming'
        }
      ]);

    } catch (error) {
      console.error('Error loading league data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    const roleIcons = {
      admin: '👑',
      enterprise: '🏢',
      pro: '🚀',
      premium: '⭐',
      free: '🆓'
    };
    return roleIcons[role] || '👤';
  };

  const getRoleColor = (role) => {
    const roleColors = {
      admin: '#FFD700',
      enterprise: '#8b5cf6',
      pro: '#3b82f6',
      premium: '#f59e0b',
      free: '#6b7280'
    };
    return roleColors[role] || '#6b7280';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      online: '#10b981',
      away: '#f59e0b',
      offline: '#6b7280'
    };
    return statusColors[status] || '#6b7280';
  };

  const getRarityColor = (rarity) => {
    const rarityColors = {
      common: '#6b7280',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#FFD700'
    };
    return rarityColors[rarity] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user || !user.isFounder) {
    return (
      <div className="no-silence-league-restricted">
        <div className="restricted-content">
          <h2>🔒 Acceso Restringido</h2>
          <p>La Liga del No Silencio es exclusiva para miembros fundadores.</p>
          <div className="upgrade-prompt">
            <h3>🚀 Únete a la Liga</h3>
            <p>Conviértete en miembro fundador y accede a:</p>
            <ul>
              <li>✨ Comunidad exclusiva de founders</li>
              <li>🏆 Sistema de logros especiales</li>
              <li>🎵 Eventos y conciertos virtuales</li>
              <li>👑 Rangos y reconocimientos</li>
              <li>🔊 Rompe el silencio con nosotros</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="no-silence-league">
      <div className="particles-container" id="league-particles"></div>
      
      {/* Header de la Liga */}
      <div 
        className={`league-header ${getAnimationClass('league-header', 'fadeInDown')}`}
        ref={createAnimatedRef('fadeInDown')}
      >
        <div className="league-title">
          <h1>🔊 La Liga del No Silencio</h1>
          <p>Donde la música nunca se detiene</p>
        </div>
        
        <div className="league-stats">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-value">{members.length}</div>
              <div className="stat-label">Miembros</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <div className="stat-value">{achievements.filter(a => a.unlocked).length}</div>
              <div className="stat-label">Logros</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎵</div>
            <div className="stat-info">
              <div className="stat-value">∞</div>
              <div className="stat-label">Canciones</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div 
        className={`league-tabs ${getAnimationClass('league-tabs', 'fadeInUp')}`}
        ref={createAnimatedRef('fadeInUp')}
      >
        <button 
          className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          👥 Miembros
        </button>
        <button 
          className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Logros
        </button>
        <button 
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          🎵 Eventos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rankings' ? 'active' : ''}`}
          onClick={() => setActiveTab('rankings')}
        >
          📊 Rankings
        </button>
      </div>

      {/* Contenido de las tabs */}
      <div 
        className={`league-content ${getAnimationClass('league-content', 'fadeInUp')}`}
        ref={createAnimatedRef('fadeInUp')}
      >
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando datos de la liga...</p>
          </div>
        ) : (
          <>
            {/* Tab: Miembros */}
            {activeTab === 'members' && (
              <div className="members-tab">
                <h3>👥 Miembros de La Liga</h3>
                <div className="members-grid">
                  {members.map((member, index) => (
                    <div 
                      key={member.id}
                      className={`member-card ${getAnimationClass(`member-${index}`, 'scaleIn')}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="member-avatar">
                        <div className="avatar-icon">
                          {getRoleIcon(member.role)}
                        </div>
                        <div 
                          className="status-indicator"
                          style={{ backgroundColor: getStatusColor(member.status) }}
                        ></div>
                      </div>
                      
                      <div className="member-info">
                        <div className="member-name">
                          <span className="alvae-symbol">✨</span>
                          <span className="nickname">{member.nickname}</span>
                        </div>
                        <div className="member-role">
                          <span 
                            className="role-badge"
                            style={{ color: getRoleColor(member.role) }}
                          >
                            {getRoleIcon(member.role)} {member.role.toUpperCase()}
                          </span>
                        </div>
                        <div className="member-rank">
                          <span className="rank-badge">{member.rank}</span>
                        </div>
                        <div className="member-stats">
                          <span className="stat">🏆 {member.achievements} logros</span>
                          <span className="stat">📅 {formatDate(member.joinDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Logros */}
            {activeTab === 'achievements' && (
              <div className="achievements-tab">
                <h3>🏆 Logros de La Liga</h3>
                <div className="achievements-grid">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={achievement.id}
                      className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} ${getAnimationClass(`achievement-${index}`, 'scaleIn')}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="achievement-icon">
                        {achievement.icon}
                      </div>
                      <div className="achievement-info">
                        <h4 className="achievement-name">{achievement.name}</h4>
                        <p className="achievement-description">{achievement.description}</p>
                        <div className="achievement-rarity">
                          <span 
                            className="rarity-badge"
                            style={{ color: getRarityColor(achievement.rarity) }}
                          >
                            {achievement.rarity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="achievement-status">
                        {achievement.unlocked ? (
                          <span className="unlocked-icon">✅</span>
                        ) : (
                          <span className="locked-icon">🔒</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Eventos */}
            {activeTab === 'events' && (
              <div className="events-tab">
                <h3>🎵 Eventos de La Liga</h3>
                <div className="events-list">
                  {events.map((event, index) => (
                    <div 
                      key={event.id}
                      className={`event-card ${event.status} ${getAnimationClass(`event-${index}`, 'fadeInLeft')}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="event-icon">
                        {event.type === 'celebration' && '🎉'}
                        {event.type === 'concert' && '🎵'}
                        {event.type === 'collaboration' && '🤝'}
                      </div>
                      <div className="event-info">
                        <h4 className="event-title">{event.title}</h4>
                        <p className="event-description">{event.description}</p>
                        <div className="event-date">
                          📅 {formatDate(event.date)}
                        </div>
                      </div>
                      <div className="event-status">
                        <span className={`status-badge ${event.status}`}>
                          {event.status === 'completed' && '✅ Completado'}
                          {event.status === 'upcoming' && '⏰ Próximo'}
                          {event.status === 'ongoing' && '🔄 En curso'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Rankings */}
            {activeTab === 'rankings' && (
              <div className="rankings-tab">
                <h3>📊 Rankings de La Liga</h3>
                <div className="rankings-list">
                  {members
                    .sort((a, b) => b.achievements - a.achievements)
                    .map((member, index) => (
                      <div 
                        key={member.id}
                        className={`ranking-item ${getAnimationClass(`ranking-${index}`, 'fadeInRight')}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="ranking-position">
                          <span className="position-number">#{index + 1}</span>
                        </div>
                        <div className="ranking-member">
                          <div className="member-avatar-small">
                            {getRoleIcon(member.role)}
                          </div>
                          <div className="member-details">
                            <span className="member-name">
                              <span className="alvae-symbol">✨</span>
                              {member.nickname}
                            </span>
                            <span className="member-role">
                              {getRoleIcon(member.role)} {member.role.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ranking-stats">
                          <div className="stat-item">
                            <span className="stat-value">{member.achievements}</span>
                            <span className="stat-label">Logros</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-value">{member.rank}</span>
                            <span className="stat-label">Rango</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer de la Liga */}
      <div 
        className={`league-footer ${getAnimationClass('league-footer', 'fadeInUp')}`}
        ref={createAnimatedRef('fadeInUp')}
      >
        <div className="league-motto">
          <h3>🔊 "El silencio no existe donde hay música"</h3>
          <p>La Liga del No Silencio - Donde cada nota cuenta</p>
        </div>
        
        <div className="league-actions">
          <button 
            className="league-action-btn"
            onClick={() => createParticles('league-particles', 20)}
          >
            🎵 Generar Música
          </button>
          <button 
            className="league-action-btn"
            onClick={() => createParticles('league-particles', 15)}
          >
            🏆 Ver Logros
          </button>
          <button 
            className="league-action-btn"
            onClick={() => createParticles('league-particles', 25)}
          >
            👥 Invitar Amigos
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoSilenceLeague;