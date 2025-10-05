/**
 * User Profile - Componente de perfil de usuario con símbolo ALVAE
 * Super-Son1k Web Classic
 */

import React, { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import useAnimations from '../hooks/useAnimations';
import './UserProfile.css';

const UserProfile = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    bio: '',
    location: '',
    website: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const { theme } = useTheme();
  const { pulse, glow, createParticles } = useAnimations();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || '',
        bio: user.profile?.bio || '',
        location: user.profile?.location || '',
        website: user.profile?.website || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nickname: formData.nickname,
          profile: {
            bio: formData.bio,
            location: formData.location,
            website: formData.website
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error actualizando perfil');
      }

      setSuccess('Perfil actualizado exitosamente');
      pulse('profile-success');
      createParticles('profile-particles', 10);

      if (onUpdateProfile) {
        onUpdateProfile(data.data.user);
      }

      setIsEditing(false);

    } catch (err) {
      setError(err.message);
      pulse('error-message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      nickname: user.nickname || '',
      bio: user.profile?.bio || '',
      location: user.profile?.location || '',
      website: user.profile?.website || ''
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const getRoleIcon = (role) => {
    const roleIcons = {
      admin: '👑',
      enterprise: '🏢',
      pro: '🚀',
      premium: '⭐',
      free: '🆓',
      tester: '🧪'
    };
    return roleIcons[role] || '👤';
  };

  const getRoleColor = (role) => {
    const roleColors = {
      admin: '#FFD700',
      enterprise: '#8b5cf6',
      pro: '#3b82f6',
      premium: '#f59e0b',
      free: '#6b7280',
      tester: '#10b981'
    };
    return roleColors[role] || '#6b7280';
  };

  const getRoleName = (role) => {
    const roleNames = {
      admin: 'Administrator',
      enterprise: 'Enterprise',
      pro: 'Pro',
      premium: 'Premium',
      free: 'Free',
      tester: 'Tester'
    };
    return roleNames[role] || 'User';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="user-profile-loading">
        <div className="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="particles-container" id="profile-particles"></div>
      
      {/* Header del perfil */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.profile?.avatar ? (
            <img src={user.profile.avatar} alt="Avatar" />
          ) : (
            <div className="avatar-placeholder">
              {getRoleIcon(user.role)}
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <div className="profile-name">
            {user.isFounder && (
              <span className="alvae-symbol" title="Founder Member">
                ✨
              </span>
            )}
            <span className="nickname">
              {isEditing ? (
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="nickname-input"
                  placeholder="Tu nickname"
                />
              ) : (
                user.nickname || user.email.split('@')[0]
              )}
            </span>
          </div>
          
          <div className="profile-role">
            <span 
              className="role-badge"
              style={{ color: getRoleColor(user.role) }}
            >
              {getRoleIcon(user.role)} {getRoleName(user.role)}
            </span>
            {user.isFounder && (
              <span className="founder-badge">
                🏆 Founder
              </span>
            )}
          </div>
          
          <div className="profile-email">
            📧 {user.email}
          </div>
        </div>
        
        <div className="profile-actions">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="edit-profile-btn"
            >
              ✏️ Editar Perfil
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="save-btn"
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Guardando...
                  </>
                ) : (
                  '💾 Guardar'
                )}
              </button>
              <button 
                onClick={handleCancelEdit}
                className="cancel-btn"
              >
                ❌ Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contenido del perfil */}
      <div className="profile-content">
        {/* Información básica */}
        <div className="profile-section">
          <h3>📋 Información Básica</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>👤 Nickname:</label>
              <span>{user.nickname || 'No establecido'}</span>
            </div>
            <div className="info-item">
              <label>📧 Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>🎭 Rol:</label>
              <span style={{ color: getRoleColor(user.role) }}>
                {getRoleIcon(user.role)} {getRoleName(user.role)}
              </span>
            </div>
            <div className="info-item">
              <label>📅 Miembro desde:</label>
              <span>{formatDate(user.createdAt)}</span>
            </div>
            <div className="info-item">
              <label>🕐 Último acceso:</label>
              <span>{formatDate(user.lastLogin)}</span>
            </div>
            <div className="info-item">
              <label>🏆 Status:</label>
              <span className={user.isActive ? 'active' : 'inactive'}>
                {user.isActive ? '✅ Activo' : '❌ Inactivo'}
              </span>
            </div>
          </div>
        </div>

        {/* Perfil personal */}
        <div className="profile-section">
          <h3>👤 Perfil Personal</h3>
          <div className="profile-fields">
            <div className="field-group">
              <label htmlFor="bio">📝 Biografía:</label>
              {isEditing ? (
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Cuéntanos sobre ti..."
                  className="bio-textarea"
                />
              ) : (
                <p className="bio-text">
                  {user.profile?.bio || 'No hay biografía disponible'}
                </p>
              )}
            </div>
            
            <div className="field-group">
              <label htmlFor="location">📍 Ubicación:</label>
              {isEditing ? (
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Tu ubicación"
                  className="location-input"
                />
              ) : (
                <span>{user.profile?.location || 'No especificada'}</span>
              )}
            </div>
            
            <div className="field-group">
              <label htmlFor="website">🌐 Sitio web:</label>
              {isEditing ? (
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://tu-sitio.com"
                  className="website-input"
                />
              ) : (
                <span>
                  {user.profile?.website ? (
                    <a href={user.profile.website} target="_blank" rel="noopener noreferrer">
                      {user.profile.website}
                    </a>
                  ) : (
                    'No especificado'
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="profile-section">
          <h3>📊 Estadísticas</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🎵</div>
              <div className="stat-info">
                <div className="stat-value">{user.stats?.totalGenerations || 0}</div>
                <div className="stat-label">Generaciones</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎤</div>
              <div className="stat-info">
                <div className="stat-value">{user.stats?.totalTracks || 0}</div>
                <div className="stat-label">Tracks</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">▶️</div>
              <div className="stat-info">
                <div className="stat-value">{user.stats?.totalPlays || 0}</div>
                <div className="stat-label">Reproducciones</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">❤️</div>
              <div className="stat-info">
                <div className="stat-value">{user.stats?.totalLikes || 0}</div>
                <div className="stat-label">Likes</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📤</div>
              <div className="stat-info">
                <div className="stat-value">{user.stats?.totalShares || 0}</div>
                <div className="stat-label">Compartidos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferencias */}
        <div className="profile-section">
          <h3>⚙️ Preferencias</h3>
          <div className="preferences-grid">
            <div className="preference-item">
              <label>🎨 Tema:</label>
              <span>{user.preferences?.theme || 'pragmatic'}</span>
            </div>
            <div className="preference-item">
              <label>🌍 Idioma:</label>
              <span>{user.preferences?.language || 'es'}</span>
            </div>
            <div className="preference-item">
              <label>🔔 Notificaciones:</label>
              <span>{user.preferences?.notifications ? '✅ Activadas' : '❌ Desactivadas'}</span>
            </div>
            <div className="preference-item">
              <label>💾 Auto-guardado:</label>
              <span>{user.preferences?.autoSave ? '✅ Activado' : '❌ Desactivado'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div 
          id="error-message"
          className="error-message"
        >
          <span className="error-icon">❌</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          <span className="success-text">{success}</span>
        </div>
      )}
    </div>
  );
};

export default UserProfile;