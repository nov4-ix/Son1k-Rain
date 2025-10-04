import { useState } from 'react';

const NexusScene = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const icons = [
    { id: 1, symbol: '⚡', label: 'Energía' },
    { id: 2, symbol: '🔮', label: 'Cristal' },
    { id: 3, symbol: '🌌', label: 'Portal' },
    { id: 4, symbol: '⚙️', label: 'Sistema' },
    { id: 5, symbol: '🔬', label: 'Análisis' },
    { id: 6, symbol: '🛡️', label: 'Protección' }
  ];

  return (
    <div className="nexus-center">
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
                textShadow: hoveredIcon === icon.id ? '0 0 15px #00FFE7' : '0 0 8px #00FFE7',
                transform: hoveredIcon === icon.id ? 'scale(1.1)' : 'scale(1)'
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
  );
};

export default NexusScene;