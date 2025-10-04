import React from 'react';

const NexusScene = () => {
  // Íconos para colocar alrededor del aro (6 posiciones equidistantes)
  const icons = [
    { symbol: '⚡', label: 'Energy' },
    { symbol: '🔒', label: 'Security' },
    { symbol: '🌐', label: 'Network' },
    { symbol: '💾', label: 'Data' },
    { symbol: '🔑', label: 'Access' },
    { symbol: '⚙️', label: 'System' }
  ];

  // Calcular posiciones de los íconos alrededor del círculo
  const iconPositions = icons.map((icon, index) => {
    const angle = (index * 60) * (Math.PI / 180); // 60 grados entre cada ícono
    const radius = 120; // Radio del círculo donde se colocan los íconos
    return {
      ...icon,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      angle: angle
    };
  });

  return (
    <div className="nexus-scene">
      {/* Aro morado único con efectos glitch */}
      <div className="ring-container">
        <div className="ring"></div>
      </div>

      {/* Contenido centrado */}
      <div className="nexus-center">
        <h1 className="nexus-title">NEXUS ACTIVADO</h1>
        <p className="nexus-sub">¡Bienvenido a la Resistencia!</p>
      </div>

      {/* Íconos alrededor del aro */}
      <div className="icons-container">
        {iconPositions.map((icon, index) => (
          <div
            key={index}
            className="nexus-icon"
            style={{
              position: 'absolute',
              left: `calc(50% + ${icon.x}px)`,
              top: `calc(50% + ${icon.y}px)`,
              transform: 'translate(-50%, -50%)'
            }}
            title={icon.label}
          >
            <span className="icon-symbol">{icon.symbol}</span>
            <span className="icon-glow"></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NexusScene;