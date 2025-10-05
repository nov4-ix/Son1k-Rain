import { useState, useEffect, useRef } from 'react';
import { useGameScore } from '../hooks/useGameScore';

const HackingGame = () => {
  const { score, unlockMode, incrementInteractions } = useGameScore();
  const [isActive, setIsActive] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, playing, success, failed
  const [showGame, setShowGame] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // Secuencias de hacking predefinidas
  const hackingSequences = [
    { keys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], name: 'Matrix Code', reward: 200 },
    { keys: ['KeyA', 'KeyS', 'KeyD', 'KeyW'], name: 'WASD Pattern', reward: 150 },
    { keys: ['Digit1', 'Digit2', 'Digit3', 'Digit4'], name: 'Number Sequence', reward: 100 },
    { keys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR'], name: 'QWER Combo', reward: 180 },
    { keys: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown'], name: 'Konami Code', reward: 300 }
  ];

  // Generar nueva secuencia
  const generateSequence = () => {
    const randomSequence = hackingSequences[Math.floor(Math.random() * hackingSequences.length)];
    setSequence(randomSequence.keys);
    setUserInput([]);
    setCurrentStep(0);
    setTimeLeft(10); // 10 segundos para completar
    setGameStatus('playing');
  };

  // Iniciar juego
  const startGame = () => {
    setIsActive(true);
    setShowGame(true);
    generateSequence();
    incrementInteractions();
  };

  // Manejar teclas presionadas
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const handleKeyPress = (event) => {
      event.preventDefault();
      
      if (gameStatus === 'playing' && sequence.length > 0) {
        const expectedKey = sequence[currentStep];
        
        if (event.code === expectedKey) {
          setUserInput(prev => [...prev, event.code]);
          setCurrentStep(prev => prev + 1);
          
          // Verificar si completó la secuencia
          if (currentStep + 1 === sequence.length) {
            setGameStatus('success');
            // Recompensa basada en la secuencia completada
            const sequenceData = hackingSequences.find(s => 
              JSON.stringify(s.keys) === JSON.stringify(sequence)
            );
            if (sequenceData) {
              unlockMode(sequenceData.name);
            }
            setTimeout(() => {
              setIsActive(false);
              setShowGame(false);
              setGameStatus('waiting');
            }, 2000);
          }
        } else {
          // Tecla incorrecta
          setGameStatus('failed');
          setTimeout(() => {
            setIsActive(false);
            setShowGame(false);
            setGameStatus('waiting');
          }, 1500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStatus, currentStep, sequence, unlockMode]);

  // Timer del juego
  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStatus === 'playing') {
      setGameStatus('failed');
      setTimeout(() => {
        setIsActive(false);
        setShowGame(false);
        setGameStatus('waiting');
      }, 1500);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, gameStatus]);

  // Mostrar botón solo si el usuario tiene suficiente puntuación
  if (score < 500) {
    return (
      <button 
        className="hack-button disabled"
        disabled
        title="Necesitas 500 puntos para desbloquear el juego de hacking"
      >
        🔒 HACK
      </button>
    );
  }

  return (
    <>
      <button 
        className="hack-button"
        onClick={startGame}
        disabled={isActive}
        title="Mini-juego de hacking"
      >
        {isActive ? '🔄 HACKING...' : '💻 HACK'}
      </button>

      {/* Overlay del juego */}
      {showGame && (
        <div className="hacking-overlay">
          <div className="hacking-game">
            <div className="hacking-header">
              <h3>NEXUS HACKING GAME</h3>
              <div className="hacking-timer">
                Tiempo: {timeLeft}s
              </div>
            </div>

            <div className="sequence-display">
              <h4>Secuencia a seguir:</h4>
              <div className="sequence-keys">
                {sequence.map((key, index) => (
                  <span 
                    key={index}
                    className={`sequence-key ${index < currentStep ? 'completed' : index === currentStep ? 'current' : 'pending'}`}
                  >
                    {key.replace('Arrow', '').replace('Key', '').replace('Digit', '')}
                  </span>
                ))}
              </div>
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(currentStep / sequence.length) * 100}%` }}
              ></div>
            </div>

            <div className="game-status">
              {gameStatus === 'playing' && (
                <p>Presiona las teclas en orden...</p>
              )}
              {gameStatus === 'success' && (
                <div className="success-message">
                  <h4>🎉 ¡HACKING EXITOSO!</h4>
                  <p>Secuencia completada correctamente</p>
                </div>
              )}
              {gameStatus === 'failed' && (
                <div className="error-message">
                  <h4>❌ HACKING FALLIDO</h4>
                  <p>Secuencia incorrecta o tiempo agotado</p>
                </div>
              )}
            </div>

            <div className="hacking-instructions">
              <p>Usa las teclas mostradas arriba en el orden correcto</p>
              <p>Tienes 10 segundos para completar la secuencia</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HackingGame;