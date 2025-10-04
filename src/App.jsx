import React from 'react';
import MatrixRain from './components/MatrixRain';
import NexusScene from './components/NexusScene';

function App() {
  return (
    <div className="App">
      {/* Canvas de Matrix Rain */}
      <MatrixRain 
        color="#00FFE7"
        fontSize={18}
        stepMs={34}
        settleAfterMs={5000}
        transitionMs={1000}
        trailInitial={0.12}
        trailCalm={0.06}
        glyphAlphaInitial={1.0}
        glyphAlphaCalm={0.65}
      />
      
      {/* Overlay de barras glitch horizontales */}
      <div className="glitch-lines"></div>
      
      {/* Escena NEXUS con aro morado y contenido */}
      <NexusScene />
    </div>
  );
}

export default App;