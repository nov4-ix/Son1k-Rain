import MatrixRain from './components/MatrixRain'
import NexusScene from './components/NexusScene'
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
    </div>
  )
}

export default App