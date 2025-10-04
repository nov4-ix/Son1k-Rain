/**
 * Pixel Console - Consola para consultas a Pixel/Qwen
 * Super-Son1k Web Classic
 */

import React, { useState, useRef } from 'react';
import './PixelConsole.css';

const PixelConsole = () => {
  const [input, setInput] = useState('');
  const [analysisType, setAnalysisType] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const textareaRef = useRef(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  const analyzeWithPixel = async () => {
    if (!input.trim()) {
      setError('Por favor ingresa algún contenido para analizar');
      return;
    }

    setIsLoading(true);
    setError(null);

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
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="pixel-console">
      <div className="console-header">
        <h2>🤖 Pixel Console</h2>
        <p>Asistente técnico con IA Qwen - Análisis de código, logs y debugging</p>
      </div>

      <div className="console-controls">
        <div className="input-section">
          <div className="input-header">
            <label htmlFor="analysis-type">Tipo de análisis:</label>
            <select
              id="analysis-type"
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
            >
              <option value="general">General</option>
              <option value="logs">Logs/Debugging</option>
              <option value="code">Análisis de código</option>
              <option value="prompt">Optimización de prompts</option>
            </select>
          </div>

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
            className="console-input"
            rows={8}
          />

          <div className="input-actions">
            <button 
              onClick={analyzeWithPixel}
              disabled={isLoading || !input.trim()}
              className="analyze-btn"
            >
              {isLoading ? '🔄 Analizando...' : '🚀 Analizar con Pixel'}
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
          <div className="history-section">
            <h3>📚 Historial</h3>
            <div className="history-list">
              {history.map((item) => (
                <div 
                  key={item.id}
                  className="history-item"
                  onClick={() => loadFromHistory(item)}
                >
                  <span className="history-type">{item.type}</span>
                  <span className="history-preview">
                    {item.input.substring(0, 50)}...
                  </span>
                  <span className="history-time">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <h4>❌ Error</h4>
          <p>{error}</p>
        </div>
      )}

      {results && (
        <div className="results-section">
          <div className="results-header">
            <h3>📊 Resultados del Análisis</h3>
            <span className="analysis-type-badge">{analysisType}</span>
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