import MatrixRain from './components/MatrixRain'
import NexusScene from './components/NexusScene'
import ConfigPanel from './components/ConfigPanel'
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
    </div>
  )
}

export default App