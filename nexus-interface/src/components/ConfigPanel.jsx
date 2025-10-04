import { useState } from 'react';
import { useNexusConfig } from '../hooks/useNexusConfig';

const ConfigPanel = () => {
  const { config, updateConfig, resetConfig } = useNexusConfig();
  const [isOpen, setIsOpen] = useState(false);

  const handleConfigChange = (section, key, value) => {
    updateConfig(section, key, value);
    
    // Actualizar variables CSS en tiempo real
    if (section === 'colors') {
      document.documentElement.style.setProperty(`--${key}`, value);
    } else if (section === 'ring') {
      if (key === 'size') {
        document.documentElement.style.setProperty('--ring-size', `${value}px`);
      }
    } else if (section === 'icons') {
      if (key === 'size') {
        document.documentElement.style.setProperty('--icon-size', `${value}px`);
      } else if (key === 'fontSize') {
        document.documentElement.style.setProperty('--icon-font-size', `${value}px`);
      }
    } else if (section === 'glitchLines') {
      if (key === 'opacity') {
        document.documentElement.style.setProperty('--glitch-lines-opacity', value);
      }
    }
  };

  return (
    <>
      <button 
        className="config-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Panel de Configuración"
      >
        ⚙️
      </button>
      
      {isOpen && (
        <div className="config-panel">
          <div className="config-header">
            <h3>Configuración NEXUS</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          <div className="config-sections">
            {/* Colores */}
            <div className="config-section">
              <h4>Colores</h4>
              <div className="config-group">
                <label>Fondo:</label>
                <input 
                  type="color" 
                  value={config.colors.background}
                  onChange={(e) => handleConfigChange('colors', 'background', e.target.value)}
                />
              </div>
              <div className="config-group">
                <label>Cian:</label>
                <input 
                  type="color" 
                  value={config.colors.cyan}
                  onChange={(e) => handleConfigChange('colors', 'cyan', e.target.value)}
                />
              </div>
              <div className="config-group">
                <label>Magenta:</label>
                <input 
                  type="color" 
                  value={config.colors.magenta}
                  onChange={(e) => handleConfigChange('colors', 'magenta', e.target.value)}
                />
              </div>
            </div>

            {/* Aro */}
            <div className="config-section">
              <h4>Aro</h4>
              <div className="config-group">
                <label>Tamaño:</label>
                <input 
                  type="range" 
                  min="200" 
                  max="400" 
                  value={config.ring.size}
                  onChange={(e) => handleConfigChange('ring', 'size', parseInt(e.target.value))}
                />
                <span>{config.ring.size}px</span>
              </div>
            </div>

            {/* Íconos */}
            <div className="config-section">
              <h4>Íconos</h4>
              <div className="config-group">
                <label>Tamaño:</label>
                <input 
                  type="range" 
                  min="20" 
                  max="60" 
                  value={config.icons.size}
                  onChange={(e) => handleConfigChange('icons', 'size', parseInt(e.target.value))}
                />
                <span>{config.icons.size}px</span>
              </div>
              <div className="config-group">
                <label>Fuente:</label>
                <input 
                  type="range" 
                  min="16" 
                  max="32" 
                  value={config.icons.fontSize}
                  onChange={(e) => handleConfigChange('icons', 'fontSize', parseInt(e.target.value))}
                />
                <span>{config.icons.fontSize}px</span>
              </div>
            </div>

            {/* Barras Glitch */}
            <div className="config-section">
              <h4>Barras Glitch</h4>
              <div className="config-group">
                <label>Opacidad:</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="0.5" 
                  step="0.01"
                  value={config.glitchLines.opacity}
                  onChange={(e) => handleConfigChange('glitchLines', 'opacity', parseFloat(e.target.value))}
                />
                <span>{config.glitchLines.opacity}</span>
              </div>
            </div>

            {/* Animaciones */}
            <div className="config-section">
              <h4>Animaciones</h4>
              <div className="config-group">
                <label>Delay Micro-texto:</label>
                <input 
                  type="range" 
                  min="2000" 
                  max="10000" 
                  step="500"
                  value={config.animations.microTextDelay}
                  onChange={(e) => handleConfigChange('animations', 'microTextDelay', parseInt(e.target.value))}
                />
                <span>{config.animations.microTextDelay}ms</span>
              </div>
              <div className="config-group">
                <label>Intervalo Flash:</label>
                <input 
                  type="range" 
                  min="5000" 
                  max="30000" 
                  step="1000"
                  value={config.animations.glitchFlashInterval}
                  onChange={(e) => handleConfigChange('animations', 'glitchFlashInterval', parseInt(e.target.value))}
                />
                <span>{config.animations.glitchFlashInterval}ms</span>
              </div>
            </div>
          </div>

          <div className="config-footer">
            <button onClick={resetConfig} className="reset-btn">
              Resetear
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfigPanel;