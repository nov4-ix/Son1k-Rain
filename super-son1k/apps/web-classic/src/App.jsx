/**
 * Super-Son1k Web Classic - App Principal
 * Interfaz clásica con componentes Qwen integrados
 */

import React, { useState } from 'react';
import './App.css';

// Componentes Qwen
import PixelConsole from './components/PixelConsole';
import NovaPostGenerator from './components/NovaPostGenerator';
import CloneStationCleaner from './components/CloneStationCleaner';
import GhostStudioAnalyzer from './components/GhostStudioAnalyzer';

const App = () => {
  const [activeTab, setActiveTab] = useState('pixel');

  const tabs = [
    { id: 'pixel', name: '🤖 Pixel', component: PixelConsole },
    { id: 'nova', name: '📱 Nova', component: NovaPostGenerator },
    { id: 'clone', name: '🎤 Clone Station', component: CloneStationCleaner },
    { id: 'ghost', name: '🎵 Ghost Studio', component: GhostStudioAnalyzer }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 Super-Son1k</h1>
          <p>Herramientas de desarrollo y creatividad con IA Qwen</p>
        </div>
        
        <nav className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-main">
        <div className="main-content">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </main>

      <footer className="app-footer">
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
    </div>
  );
};

export default App;