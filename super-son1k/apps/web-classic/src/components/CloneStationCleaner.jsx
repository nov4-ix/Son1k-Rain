/**
 * Clone Station Cleaner - Limpieza de datasets de audio
 * Super-Son1k Web Classic
 */

import React, { useState } from 'react';
import './CloneStationCleaner.css';

const CloneStationCleaner = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [metadata, setMetadata] = useState({
    speaker: '',
    language: 'es',
    audioQuality: 'high',
    duration: '',
    purpose: 'voice_cloning'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  const addTranscription = () => {
    setTranscriptions(prev => [...prev, {
      id: Date.now(),
      text: '',
      timestamp: '',
      confidence: 0.95,
      speaker: metadata.speaker
    }]);
  };

  const updateTranscription = (id, field, value) => {
    setTranscriptions(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const removeTranscription = (id) => {
    setTranscriptions(prev => prev.filter(t => t.id !== id));
  };

  const cleanDataset = async () => {
    if (transcriptions.length === 0) {
      setError('Por favor agrega al menos una transcripción');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/qwen/clone/qwen-clean`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({
          transcriptions: transcriptions.map(t => ({
            text: t.text,
            timestamp: t.timestamp,
            confidence: t.confidence,
            speaker: t.speaker
          })),
          metadata: metadata
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error limpiando dataset');
      }

      setResults(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const exportDataset = () => {
    if (!results) return;
    
    const exportData = {
      original_transcriptions: transcriptions,
      cleaned_transcriptions: results.data.cleaned_transcriptions,
      analysis: results.data.dataset_analysis,
      metadata: metadata,
      timestamp: results.timestamp
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clone-station-dataset-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="clone-station-cleaner">
      <div className="cleaner-header">
        <h2>🎤 Clone Station Dataset Cleaner</h2>
        <p>Limpia y optimiza datasets de audio para entrenamiento de modelos de voz</p>
      </div>

      <div className="cleaner-form">
        <div className="metadata-section">
          <h3>📋 Metadata del Dataset</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="speaker">Speaker/Voz</label>
              <input
                id="speaker"
                type="text"
                value={metadata.speaker}
                onChange={(e) => setMetadata(prev => ({ ...prev, speaker: e.target.value }))}
                placeholder="ej: Voz Masculina, Ana, etc."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="language">Idioma</label>
              <select
                id="language"
                value={metadata.language}
                onChange={(e) => setMetadata(prev => ({ ...prev, language: e.target.value }))}
                className="form-select"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quality">Calidad de Audio</label>
              <select
                id="quality"
                value={metadata.audioQuality}
                onChange={(e) => setMetadata(prev => ({ ...prev, audioQuality: e.target.value }))}
                className="form-select"
              >
                <option value="high">Alta (48kHz+)</option>
                <option value="medium">Media (44.1kHz)</option>
                <option value="low">Baja (<44.1kHz)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duración Total</label>
              <input
                id="duration"
                type="text"
                value={metadata.duration}
                onChange={(e) => setMetadata(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="ej: 2h 30m, 150min"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Propósito</label>
            <select
              id="purpose"
              value={metadata.purpose}
              onChange={(e) => setMetadata(prev => ({ ...prev, purpose: e.target.value }))}
              className="form-select"
            >
              <option value="voice_cloning">Voice Cloning</option>
              <option value="tts">Text-to-Speech</option>
              <option value="voice_conversion">Voice Conversion</option>
              <option value="speech_recognition">Speech Recognition</option>
            </select>
          </div>
        </div>

        <div className="transcriptions-section">
          <div className="section-header">
            <h3>📝 Transcripciones</h3>
            <button onClick={addTranscription} className="add-btn">
              ➕ Agregar Transcripción
            </button>
          </div>

          <div className="transcriptions-list">
            {transcriptions.map((transcription, index) => (
              <div key={transcription.id} className="transcription-item">
                <div className="item-header">
                  <span className="item-number">#{index + 1}</span>
                  <button 
                    onClick={() => removeTranscription(transcription.id)}
                    className="remove-btn"
                  >
                    🗑️
                  </button>
                </div>

                <div className="item-content">
                  <div className="form-group">
                    <label>Texto Original</label>
                    <textarea
                      value={transcription.text}
                      onChange={(e) => updateTranscription(transcription.id, 'text', e.target.value)}
                      placeholder="Texto transcrito del audio..."
                      rows={3}
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Timestamp</label>
                      <input
                        type="text"
                        value={transcription.timestamp}
                        onChange={(e) => updateTranscription(transcription.id, 'timestamp', e.target.value)}
                        placeholder="ej: 00:01:30"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Confianza</label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={transcription.confidence}
                        onChange={(e) => updateTranscription(transcription.id, 'confidence', parseFloat(e.target.value))}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {transcriptions.length === 0 && (
              <div className="empty-state">
                <p>No hay transcripciones agregadas</p>
                <p>Haz clic en "Agregar Transcripción" para comenzar</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={cleanDataset}
          disabled={isLoading || transcriptions.length === 0}
          className="clean-btn"
        >
          {isLoading ? '🔄 Limpiando Dataset...' : '🧹 Limpiar Dataset'}
        </button>
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
            <h3>✨ Dataset Limpiado</h3>
            <button onClick={exportDataset} className="export-btn">
              📥 Exportar Dataset
            </button>
          </div>

          <div className="analysis-summary">
            <h4>📊 Análisis del Dataset</h4>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Calidad General:</span>
                <span className={`value quality-${results.data.dataset_analysis?.quality_score}`}>
                  {results.data.dataset_analysis?.quality_score}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Duración Total:</span>
                <span className="value">{results.data.dataset_analysis?.total_duration}</span>
              </div>
              <div className="summary-item">
                <span className="label">Listo para Entrenar:</span>
                <span className={`value readiness-${results.data.dataset_analysis?.training_readiness}`}>
                  {results.data.dataset_analysis?.training_readiness}
                </span>
              </div>
            </div>

            {results.data.dataset_analysis?.recommendations && (
              <div className="recommendations">
                <h5>💡 Recomendaciones:</h5>
                <ul>
                  {results.data.dataset_analysis.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="cleaned-transcriptions">
            <h4>🧹 Transcripciones Limpias</h4>
            <div className="transcriptions-comparison">
              {results.data.cleaned_transcriptions?.map((cleaned, index) => (
                <div key={index} className="comparison-item">
                  <div className="original">
                    <h5>Original #{index + 1}</h5>
                    <p>{transcriptions[index]?.text}</p>
                    <button 
                      onClick={() => copyToClipboard(transcriptions[index]?.text)}
                      className="copy-btn"
                    >
                      📋 Copiar
                    </button>
                  </div>

                  <div className="arrow">→</div>

                  <div className="cleaned">
                    <h5>Limpio #{index + 1}</h5>
                    <p>{cleaned.cleaned}</p>
                    <div className="cleaned-meta">
                      <span className="confidence">
                        Confianza: {(cleaned.confidence * 100).toFixed(1)}%
                      </span>
                      <span className={`quality quality-${cleaned.quality_score}`}>
                        {cleaned.quality_score}
                      </span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(cleaned.cleaned)}
                      className="copy-btn"
                    >
                      📋 Copiar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {results.data.suggestions && (
            <div className="suggestions-section">
              <h4>💭 Sugerencias Adicionales</h4>
              <p>{results.data.suggestions}</p>
            </div>
          )}

          <div className="results-meta">
            <small>
              Dataset procesado: {new Date(results.timestamp).toLocaleString()}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloneStationCleaner;