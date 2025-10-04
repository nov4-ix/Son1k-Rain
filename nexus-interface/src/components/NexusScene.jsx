import { useState, useEffect } from 'react';
import { useNexusConfig } from '../hooks/useNexusConfig';

const NexusScene = () => {
  const { config } = useNexusConfig();
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [alternateMode, setAlternateMode] = useState(false);
  const [showMicroText, setShowMicroText] = useState(false);
  const [glitchFlash, setGlitchFlash] = useState(false);

  const icons = [
    { id: 1, symbol: '⚡', label: 'Energía' },
    { id: 2, symbol: '🔮', label: 'Cristal' },
    { id: 3, symbol: '🌌', label: 'Portal' },
    { id: 4, symbol: '⚙️', label: 'Sistema' },
    { id: 5, symbol: '🔬', label: 'Análisis' },
    { id: 6, symbol: '🛡️', label: 'Protección' }
  ];

  // Sonido de activación
  const playActivationSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(config.audio.activationFrequency, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + config.audio.activationDuration / 1000);
    
    gainNode.gain.setValueAtTime(config.audio.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.audio.activationDuration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + config.audio.activationDuration / 1000);
  };

  // Micro-texto tras tiempo configurado
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMicroText(true);
      setTimeout(() => setShowMicroText(false), config.animations.microTextDuration);
    }, config.animations.microTextDelay);
    
    return () => clearTimeout(timer);
  }, [config]);

  // Flash de glitch cada tiempo configurado
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchFlash(true);
      setTimeout(() => setGlitchFlash(false), config.animations.glitchFlashDuration);
    }, config.animations.glitchFlashInterval);
    
    return () => clearInterval(interval);
  }, [config]);

  const toggleAlternateMode = () => {
    setAlternateMode(!alternateMode);
    playActivationSound();
  };

  return (
    <>
      <div className={`nexus-center ${alternateMode ? 'alternate-mode' : ''}`}>
        {/* Aro morado con efectos glitch */}
        <div className="ring">
          {/* Íconos alrededor del aro */}
          <div className="nexus-icons">
            {icons.map((icon) => (
              <div
                key={icon.id}
                className="nexus-icon"
                onMouseEnter={() => setHoveredIcon(icon.id)}
                onMouseLeave={() => setHoveredIcon(null)}
                title={icon.label}
                style={{
                  color: hoveredIcon === icon.id ? '#00FFE7' : '#00FFE7',
                  textShadow: hoveredIcon === icon.id ? '0 0 15px #00FFE7' : '0 0 8px #00FFE7'
                }}
              >
                {icon.symbol}
              </div>
            ))}
          </div>
        </div>

        {/* Textos centrados */}
        <div className="nexus-text">
          <h1 className="nexus-title">NEXUS ACTIVADO</h1>
          <p className="nexus-sub">¡Bienvenido a la Resistencia!</p>
        </div>
      </div>

      {/* Botón secreto */}
      <button 
        className="secret-button"
        onClick={toggleAlternateMode}
        title="Modo Alterno"
      >
        ⚡
      </button>

      {/* Micro-texto glitchado */}
      {showMicroText && (
        <div className="micro-text">
          NEXUS sincronizado
        </div>
      )}

      {/* Flash de glitch */}
      {glitchFlash && <div className="glitch-flash"></div>}
    </>
  );
};

export default NexusScene;