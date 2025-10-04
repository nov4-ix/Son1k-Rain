import MatrixRain from './components/MatrixRain'
import NexusScene from './components/NexusScene'
import ConfigPanel from './components/ConfigPanel'
import GameScore from './components/GameScore'
import HackingGame from './components/HackingGame'
import './App.css'

function App() {
  return (
    <div className="App">
      {/* Lluvia Matrix de fondo */}
      <MatrixRain />
      
      {/* Overlay de barras glitch horizontales */}
      <div className="glitch-lines"></div>
      
      {/* Escena NEXUS centrada */}
      <NexusScene />
      
      {/* Panel de configuración */}
      <ConfigPanel />
      
      {/* Sistema de puntuación */}
      <GameScore />
      
      {/* Mini-juego de hacking */}
      <HackingGame />
    </div>
  )
}

export default App