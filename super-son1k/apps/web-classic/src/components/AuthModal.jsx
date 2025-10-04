/**
 * Auth Modal - Modal de autenticación (Login/Register)
 * Super-Son1k Web Classic
 */

import React, { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import useAnimations from '../hooks/useAnimations';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' o 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const { theme } = useTheme();
  const { pulse, glow, createParticles } = useAnimations();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Reset form cuando cambia el modo
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: ''
      });
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error de autenticación');
      }

      // Guardar tokens en localStorage
      localStorage.setItem('authToken', data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      setSuccess('Inicio de sesión exitoso');
      pulse('auth-modal');
      createParticles('auth-particles', 15);

      // Llamar callback de login
      if (onLogin) {
        onLogin(data.data.user);
      }

      // Cerrar modal después de un breve delay
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      setError(err.message);
      pulse('error-message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname || formData.email.split('@')[0],
          role: 'free'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error de registro');
      }

      setSuccess('Usuario registrado exitosamente');
      pulse('auth-modal');
      createParticles('auth-particles', 15);

      // Cambiar a modo login
      setTimeout(() => {
        setMode('login');
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      }, 1500);

    } catch (err) {
      setError(err.message);
      pulse('error-message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (mode === 'login') {
      handleLogin(e);
    } else {
      handleRegister(e);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
    setSuccess(null);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="particles-container" id="auth-particles"></div>
      
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>
            {mode === 'login' ? '🔐 Iniciar Sesión' : '📝 Registrarse'}
          </h2>
          <button 
            onClick={onClose}
            className="close-btn"
          >
            ✕
          </button>
        </div>

        <div className="auth-modal-content">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">📧 Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="tu@email.com"
                className="form-input"
              />
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="nickname">👤 Nickname (Opcional)</label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  placeholder="Tu nickname personal"
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">🔒 Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Tu contraseña"
                className="form-input"
              />
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="confirmPassword">🔒 Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirma tu contraseña"
                  className="form-input"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  {mode === 'login' ? 'Iniciando sesión...' : 'Registrando...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? '🚀 Iniciar Sesión' : '📝 Registrarse'}
                  <span className="btn-glow"></span>
                </>
              )}
            </button>
          </form>

          <div className="auth-modal-footer">
            <p>
              {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button 
                onClick={switchMode}
                className="switch-mode-btn"
              >
                {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión aquí'}
              </button>
            </p>
          </div>

          {/* Cuentas de prueba */}
          <div className="test-accounts">
            <h4>🧪 Cuentas de Prueba</h4>
            <div className="test-account-list">
              <div className="test-account">
                <strong>👑 Admin:</strong> nov4-ix@sonikvers3.com
              </div>
              <div className="test-account">
                <strong>🏢 Enterprise:</strong> pro.enterprise@son1kvers3.com
              </div>
              <div className="test-account">
                <strong>⭐ Premium:</strong> pro.tester1@sonikvers3.com
              </div>
            </div>
            <p className="test-password">Contraseña: Premium!123</p>
          </div>
        </div>

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
    </div>
  );
};

export default AuthModal;