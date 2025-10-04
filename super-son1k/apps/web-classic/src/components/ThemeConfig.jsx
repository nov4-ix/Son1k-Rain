/**
 * Theme Config - Configurador de temas avanzado
 * Super-Son1k Web Classic
 */

import React, { useState } from 'react';
import useTheme from '../hooks/useTheme';
import './ThemeConfig.css';

const ThemeConfig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    currentTheme, 
    theme, 
    themes, 
    isDarkMode, 
    animationsEnabled,
    changeTheme, 
    toggleDarkMode, 
    toggleAnimations 
  } = useTheme();

  const themeOptions = [
    { id: 'pragmatic', name: 'Pragmatic', icon: '⚡', description: 'Sobrio y profesional' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌆', description: 'Futurista y vibrante' },
    { id: 'minimal', name: 'Minimal', icon: '◯', description: 'Limpio y minimalista' }
  ];

  return (
    <>
      <button 
        className="theme-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Configurar tema"
      >
        <span className="theme-icon">
          {themeOptions.find(t => t.id === currentTheme)?.icon}
        </span>
        <span className="theme-name">{theme.name}</span>
        <span className={`toggle-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="theme-config-overlay" onClick={() => setIsOpen(false)}>
          <div className="theme-config-panel" onClick={(e) => e.stopPropagation()}>
            <div className="config-header">
              <h3>🎨 Configuración de Tema</h3>
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="config-content">
              <div className="theme-section">
                <h4>Paleta de Colores</h4>
                <div className="theme-options">
                  {themeOptions.map(option => (
                    <button
                      key={option.id}
                      className={`theme-option ${currentTheme === option.id ? 'active' : ''}`}
                      onClick={() => changeTheme(option.id)}
                    >
                      <span className="option-icon">{option.icon}</span>
                      <div className="option-info">
                        <span className="option-name">{option.name}</span>
                        <span className="option-desc">{option.description}</span>
                      </div>
                      <div className="option-preview">
                        <div 
                          className="preview-color" 
                          style={{ backgroundColor: themes[option.id].colors.primary }}
                        ></div>
                        <div 
                          className="preview-color" 
                          style={{ backgroundColor: themes[option.id].colors.secondary }}
                        ></div>
                        <div 
                          className="preview-color" 
                          style={{ backgroundColor: themes[option.id].colors.accent }}
                        ></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-section">
                <h4>Configuración</h4>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Modo Oscuro</span>
                    <span className="setting-desc">Interfaz con colores oscuros</span>
                  </div>
                  <button
                    className={`toggle-switch ${isDarkMode ? 'active' : ''}`}
                    onClick={toggleDarkMode}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Animaciones</span>
                    <span className="setting-desc">Efectos visuales y transiciones</span>
                  </div>
                  <button
                    className={`toggle-switch ${animationsEnabled ? 'active' : ''}`}
                    onClick={toggleAnimations}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>
              </div>

              <div className="preview-section">
                <h4>Vista Previa</h4>
                <div className="theme-preview">
                  <div className="preview-header">
                    <div className="preview-title">Super-Son1k</div>
                    <div className="preview-subtitle">Herramientas con IA</div>
                  </div>
                  <div className="preview-content">
                    <div className="preview-card">
                      <div className="preview-card-header">Pixel Console</div>
                      <div className="preview-card-body">
                        <div className="preview-button">Analizar</div>
                        <div className="preview-text">Análisis técnico con IA</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="config-footer">
              <button 
                className="apply-btn"
                onClick={() => setIsOpen(false)}
              >
                Aplicar Configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeConfig;