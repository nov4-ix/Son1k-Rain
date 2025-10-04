/**
 * Super-Son1k Web Classic - App Principal
 * Interfaz clásica con componentes Qwen integrados
 */

import React, { useState } from 'react';
import './App.css';
import './styles/globals.css';

// Componentes Qwen
import PixelConsole from './components/PixelConsole';
import NovaPostGenerator from './components/NovaPostGenerator';
import CloneStationCleaner from './components/CloneStationCleaner';
import GhostStudioAnalyzer from './components/GhostStudioAnalyzer';
import TheGenerator from './components/TheGenerator';
import MetricsDashboard from './components/MetricsDashboard';
import ThemeConfig from './components/ThemeConfig';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import NoSilenceLeague from './components/NoSilenceLeague';
import SubscriptionPlans from './components/SubscriptionPlans';

// Hooks
import useTheme from './hooks/useTheme';
import useAnimations from './hooks/useAnimations';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { theme } = useTheme();
  const { createAnimatedRef, getAnimationClass } = useAnimations();

  // Verificar si hay usuario logueado al cargar
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const tabs = [
    { id: 'dashboard', name: '📊 Dashboard', component: MetricsDashboard, icon: '📊' },
    { id: 'pixel', name: '🤖 Pixel', component: PixelConsole, icon: '🤖' },
    { id: 'nova', name: '📱 Nova', component: NovaPostGenerator, icon: '📱' },
    { id: 'clone', name: '🎤 Clone Station', component: CloneStationCleaner, icon: '🎤' },
    { id: 'ghost', name: '🎵 Ghost Studio', component: GhostStudioAnalyzer, icon: '🎵' },
    { id: 'generator', name: '🎵 The Generator', component: TheGenerator, icon: '🎵' },
    { id: 'profile', name: '👤 Perfil', component: UserProfile, icon: '👤' },
    { id: 'league', name: '🔊 La Liga', component: NoSilenceLeague, icon: '🔊' },
    { id: 'plans', name: '💎 Planes', component: SubscriptionPlans, icon: '💎' }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="app">
      <ThemeConfig />
      
      <header 
        className={`app-header ${getAnimationClass('app-header', 'slideInDown')}`}
        ref={createAnimatedRef('slideInDown')}
      >
        <div className="header-content">
          <div className="header-left">
            <h1>🚀 Super-Son1k</h1>
            <p>Herramientas de desarrollo y creatividad con IA Qwen</p>
            <div className="header-stats">
              <span className="stat-item">
                <span className="stat-number">{tabs.length}</span>
                <span className="stat-label">Herramientas</span>
              </span>
              <span className="stat-item">
                <span className="stat-number">∞</span>
                <span className="stat-label">Posibilidades</span>
              </span>
            </div>
          </div>
          
          <div className="header-right">
            {user ? (
              <div className="user-info">
                <div className="user-details">
                  {user.isFounder && (
                    <span className="alvae-symbol" title="Founder Member">✨</span>
                  )}
                  <span className="user-nickname">{user.nickname}</span>
                  <span className="user-role">{user.role.toUpperCase()}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  🚪 Salir
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="login-btn"
                >
                  🔐 Iniciar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
        
        <nav className="nav-tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''} ${getAnimationClass(`nav-tab-${index}`, 'scaleIn')}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-name">{tab.name}</span>
              <div className="tab-glow"></div>
            </button>
          ))}
        </nav>
      </header>

      <main 
        className={`app-main ${getAnimationClass('app-main', 'fadeInUp')}`}
        ref={createAnimatedRef('fadeInUp')}
      >
        <div className="main-content">
          {ActiveComponent && (
            <ActiveComponent 
              user={user}
              onUpdateProfile={setUser}
            />
          )}
        </div>
      </main>

      <footer 
        className={`app-footer ${getAnimationClass('app-footer', 'fadeInUp')}`}
        ref={createAnimatedRef('fadeInUp')}
      >
        <div className="footer-content">
          <p>Super-Son1k v1.0.0 - Powered by Qwen AI</p>
          <div className="footer-links">
            <a href="http://localhost:3001/api/qwen/health" target="_blank" rel="noopener noreferrer">
              🔍 Health Check
            </a>
            <a href="http://localhost:3001/api/qwen/status" target="_blank" rel="noopener noreferrer">
              📊 API Status
            </a>
            <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer">
              🌌 Nexus Visual
            </a>
          </div>
        </div>
      </footer>

      {/* Modal de autenticación */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default App;