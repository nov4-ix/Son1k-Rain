/**
 * Pixel Console - Consola para consultas a Pixel/Qwen
 * Super-Son1k Web Classic
 */

import React, { useState, useRef, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import useAnimations from '../hooks/useAnimations';
import './PixelConsole.css';

const PixelConsole = () => {
  const [input, setInput] = useState('');
  const [analysisType, setAnalysisType] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  
  const { theme } = useTheme();
  const { 
    createAnimatedRef, 
    getAnimationClass, 
    typewriter, 
    pulse, 
    glow,
    createParticles 
  } = useAnimations();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  const analyzeWithPixel = async () => {
    if (!input.trim()) {
      setError('Por favor ingresa algún contenido para analizar');
      pulse('pixel-console');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Efecto visual de análisis iniciado
    glow('analyze-btn');

    try {
      const response = await fetch(`${API_BASE}/qwen/pixel/qwen-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({
          input: input.trim(),
          type: analysisType,
          context: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el análisis');
      }

      setResults(data);
      
      // Efecto visual de éxito
      pulse('results-section');
      createParticles('particles-container', 15);
      
      // Agregar a historial
      setHistory(prev => [{
        id: Date.now(),
        input: input.trim(),
        type: analysisType,
        result: data,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]); // Mantener solo 10 elementos

    } catch (err) {
      setError(err.message);
      pulse('error-message');
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto de escritura automática en el placeholder
  useEffect(() => {
    const placeholders = [
      "Ingresa tu consulta aquí...",
      "Logs de error para debugging",
      "Código para revisión técnica", 
      "Prompt para optimizar",
      "Cualquier problema técnico"
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (textareaRef.current && !input) {
        setIsTyping(true);
        typewriter(placeholders[currentIndex], 50).then(() => {
          setIsTyping(false);
          currentIndex = (currentIndex + 1) % placeholders.length;
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [input, typewriter]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      analyzeWithPixel();
    }
  };

  const clearConsole = () => {
    setInput('');
    setResults(null);
    setError(null);
    textareaRef.current?.focus();
  };

  const loadFromHistory = (historyItem) => {
    setInput(historyItem.input);
    setAnalysisType(historyItem.type);
    setResults(historyItem.result);
    setError(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="pixel-console" id="pixel-console">
      <div className="particles-container" id="particles-container"></div>
      
      <div 
        className={`console-header ${getAnimationClass('console-header', 'fadeInUp')}`}
        ref={createAnimatedRef('fadeInUp')}
      >
        <h2>🤖 Pixel Console</h2>
        <p>Asistente técnico con IA Qwen - Análisis de código, logs y debugging</p>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">Conectado a Qwen AI</span>
        </div>
      </div>

      <div 
        className={`console-controls ${getAnimationClass('console-controls', 'fadeInLeft')}`}
        ref={createAnimatedRef('fadeInLeft')}
      >
        <div className="input-section">
          <div className="input-header">
            <label htmlFor="analysis-type">Tipo de análisis:</label>
            <select
              id="analysis-type"
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="analysis-select"
            >
              <option value="general">🔍 General</option>
              <option value="logs">📋 Logs/Debugging</option>
              <option value="code">💻 Análisis de código</option>
              <option value="prompt">⚡ Optimización de prompts</option>
            </select>
          </div>

          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ingresa tu consulta aquí...

Ejemplos:
• Logs de error para debugging
• Código para revisión técnica
• Prompt para optimizar
• Cualquier problema técnico

Ctrl+Enter para analizar`}
              className={`console-input ${isTyping ? 'typing' : ''}`}
              rows={8}
            />
            <div className="input-overlay">
              <div className="typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          </div>

          <div className="input-actions">
            <button 
              id="analyze-btn"
              onClick={analyzeWithPixel}
              disabled={isLoading || !input.trim()}
              className={`analyze-btn ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Analizando...
                </>
              ) : (
                <>
                  🚀 Analizar con Pixel
                  <span className="btn-glow"></span>
                </>
              )}
            </button>
            
            <button 
              onClick={clearConsole}
              className="clear-btn"
            >
              🗑️ Limpiar
            </button>
          </div>
        </div>

        {history.length > 0 && (
          <div 
            className={`history-section ${getAnimationClass('history-section', 'fadeInRight')}`}
            ref={createAnimatedRef('fadeInRight')}
          >
            <h3>📚 Historial</h3>
            <div className="history-list">
              {history.map((item, index) => (
                <div 
                  key={item.id}
                  className={`history-item ${getAnimationClass(`history-item-${index}`, 'scaleIn')}`}
                  onClick={() => loadFromHistory(item)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="history-type">{item.type}</span>
                  <span className="history-preview">
                    {item.input.substring(0, 50)}...
                  </span>
                  <span className="history-time">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                  <div className="history-glow"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div 
          id="error-message"
          className={`error-message ${getAnimationClass('error-message', 'shake')}`}
          ref={createAnimatedRef('shake')}
        >
          <h4>❌ Error</h4>
          <p>{error}</p>
        </div>
      )}

      {results && (
        <div 
          id="results-section"
          className={`results-section ${getAnimationClass('results-section', 'fadeInUp')}`}
          ref={createAnimatedRef('fadeInUp')}
        >
          <div className="results-header">
            <h3>📊 Resultados del Análisis</h3>
            <span className="analysis-type-badge">{analysisType}</span>
            <div className="success-indicator">
              <span className="success-icon">✅</span>
              <span className="success-text">Análisis completado</span>
            </div>
          </div>

          <div className="results-content">
            {results.data?.problems && (
              <div className="result-block">
                <h4>🚨 Problemas Identificados</h4>
                <ul>
                  {results.data.problems.map((problem, index) => (
                    <li key={index} className={`problem-item severity-${problem.severity}`}>
                      <strong>{problem.severity?.toUpperCase()}:</strong> {problem.description}
                      {problem.solution && (
                        <div className="solution">
                          <strong>Solución:</strong> {problem.solution}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.data?.suggestions && (
              <div className="result-block">
                <h4>💡 Sugerencias</h4>
                <ul>
                  {results.data.suggestions.map((suggestion, index) => (
                    <li key={index} className="suggestion-item">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.data?.recommendations && (
              <div className="result-block">
                <h4>🎯 Recomendaciones</h4>
                <ul>
                  {results.data.recommendations.map((rec, index) => (
                    <li key={index} className="recommendation-item">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.data?.code_examples && (
              <div className="result-block">
                <h4>💻 Ejemplos de Código</h4>
                {results.data.code_examples.map((example, index) => (
                  <div key={index} className="code-example">
                    <pre>
                      <code>{example}</code>
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(example)}
                      className="copy-btn"
                    >
                      📋 Copiar
                    </button>
                  </div>
                ))}
              </div>
            )}

            {results.data?.versions && (
              <div className="result-block">
                <h4>📝 Versiones Generadas</h4>
                {results.data.versions.map((version, index) => (
                  <div key={index} className="version-item">
                    <h5>{version.title}</h5>
                    <p>{version.caption}</p>
                    <div className="hashtags">
                      {version.hashtags?.map((tag, tagIndex) => (
                        <span key={tagIndex} className="hashtag">{tag}</span>
                      ))}
                    </div>
                    <p className="cta">{version.call_to_action}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="results-meta">
              <small>
                Análisis completado: {new Date(results.timestamp).toLocaleString()}
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PixelConsole;