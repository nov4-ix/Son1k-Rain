/**
 * useTheme Hook - Sistema de temas avanzado
 * Super-Son1k Web Classic
 */

import { useState, useEffect, useCallback } from 'react';

const themes = {
  pragmatic: {
    name: 'Pragmatic',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#06b6d4',
      background: '#f8fafc',
      surface: '#ffffff',
      surfaceElevated: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      textMuted: '#9ca3af',
      border: '#e2e8f0',
      borderLight: '#f1f5f9',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#2563eb'
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.07)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
      glow: '0 0 20px rgba(30, 64, 175, 0.3)'
    },
    animations: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },
  cyberpunk: {
    name: 'Cyberpunk',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#06b6d4',
      background: '#0f0f23',
      surface: '#1a1a2e',
      surfaceElevated: '#16213e',
      text: '#e2e8f0',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      border: '#334155',
      borderLight: '#475569',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.6)',
      glow: '0 0 20px rgba(124, 58, 237, 0.5)'
    },
    animations: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },
  minimal: {
    name: 'Minimal',
    colors: {
      primary: '#000000',
      secondary: '#374151',
      accent: '#6b7280',
      background: '#ffffff',
      surface: '#ffffff',
      surfaceElevated: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
      textMuted: '#9ca3af',
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#2563eb'
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.07)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
      glow: '0 0 20px rgba(0, 0, 0, 0.1)'
    },
    animations: {
      duration: '0.2s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  }
};

const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('pragmatic');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Aplicar tema al DOM
  const applyTheme = useCallback((themeName) => {
    const theme = themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    
    // Aplicar colores CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Aplicar sombras CSS variables
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Aplicar animaciones CSS variables
    Object.entries(theme.animations).forEach(([key, value]) => {
      root.style.setProperty(`--animation-${key}`, value);
    });

    // Aplicar clase de tema
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${themeName}`);

    // Guardar en localStorage
    localStorage.setItem('super-son1k-theme', themeName);
  }, []);

  // Cambiar tema
  const changeTheme = useCallback((themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      applyTheme(themeName);
    }
  }, [applyTheme]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newDarkMode = !prev;
      localStorage.setItem('super-son1k-dark-mode', newDarkMode.toString());
      return newDarkMode;
    });
  }, []);

  // Toggle animations
  const toggleAnimations = useCallback(() => {
    setAnimationsEnabled(prev => {
      const newAnimations = !prev;
      localStorage.setItem('super-son1k-animations', newAnimations.toString());
      document.documentElement.style.setProperty('--animations-enabled', newAnimations ? '1' : '0');
      return newAnimations;
    });
  }, []);

  // Inicializar tema desde localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('super-son1k-theme') || 'pragmatic';
    const savedDarkMode = localStorage.getItem('super-son1k-dark-mode') === 'true';
    const savedAnimations = localStorage.getItem('super-son1k-animations') !== 'false';

    setCurrentTheme(savedTheme);
    setIsDarkMode(savedDarkMode);
    setAnimationsEnabled(savedAnimations);

    applyTheme(savedTheme);
    document.documentElement.style.setProperty('--animations-enabled', savedAnimations ? '1' : '0');
  }, [applyTheme]);

  return {
    currentTheme,
    theme: themes[currentTheme],
    themes: Object.keys(themes),
    isDarkMode,
    animationsEnabled,
    changeTheme,
    toggleDarkMode,
    toggleAnimations,
    applyTheme
  };
};

export default useTheme;