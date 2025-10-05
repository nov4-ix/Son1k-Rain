/**
 * Ghost Studio Analyzer - Análisis musical con IA
 * Super-Son1k Web Classic
 */

import React, { useState } from 'react';
import './GhostStudioAnalyzer.css';

const GhostStudioAnalyzer = () => {
  const [audioMetadata, setAudioMetadata] = useState({
    title: '',
    artist: '',
    genre: '',
    bpm: '',
    key: '',
    duration: '',
    mood: '',
    instruments: []
  });
  const [stems, setStems] = useState([]);
  const [analysisType, setAnalysisType] = useState('full');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  const addStem = () => {
    setStems(prev => [...prev, {
      id: Date.now(),
      name: '',
      type: 'unknown',
      frequency: '',
      style: '',
      volume: 0.8
    }]);
  };

  const updateStem = (id, field, value) => {
    setStems(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const removeStem = (id) => {
    setStems(prev => prev.filter(s => s.id !== id));
  };

  const analyzeMusic = async () => {
    if (!audioMetadata.title && stems.length === 0) {
      setError('Por favor completa la metadata del audio o agrega stems');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/qwen/ghost/qwen-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({
          audioMetadata: audioMetadata,
          stems: stems.map(s => ({
            name: s.name,
            type: s.type,
            frequency: s.frequency,
            style: s.style,
            volume: s.volume
          })),
          analysisType: analysisType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error analizando música');
      }

      setResults(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Generar cover con SunoAPI
  const generateCover = async () => {
    if (!audioMetadata.title) {
      setError('Por favor completa el título del audio para generar cover');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/suno/generator/generate-cover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({
          originalSong: audioMetadata.title,
          coverStyle: audioMetadata.genre || 'pop',
          duration: 30,
          tempo: audioMetadata.bpm ? (audioMetadata.bpm > 120 ? 'fast' : audioMetadata.bpm < 80 ? 'slow' : 'medium') : 'medium',
          key: audioMetadata.key || 'C',
          language: 'en',
          vocals: true,
          instrumental: false,
          preserveMelody: true,
          styleIntensity: 0.7
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error generando cover');
      }

      // Agregar resultado de cover a los resultados existentes
      setResults(prev => ({
        ...prev,
        sunoCover: data.data
      }));

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const genres = [
    'Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical', 
    'R&B', 'Country', 'Reggae', 'Folk', 'Blues', 'Funk', 'Soul',
    'Ambient', 'Techno', 'House', 'Trance', 'Dubstep', 'Trap'
  ];

  const keys = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  ];

  const moods = [
    'Happy', 'Sad', 'Energetic', 'Calm', 'Dark', 'Bright', 
    'Aggressive', 'Peaceful', 'Melancholic', 'Uplifting', 'Mysterious'
  ];

  const instrumentTypes = [
    'Drums', 'Bass', 'Guitar', 'Piano', 'Synth', 'Strings', 
    'Brass', 'Woodwind', 'Vocals', 'Percussion', 'Unknown'
  ];

  return (
    <div className="ghost-studio-analyzer">
      <div className="analyzer-header">
        <h2>🎵 Ghost Studio Analyzer</h2>
        <p>Análisis musical inteligente con IA Qwen para producción y etiquetado</p>
      </div>

      <div className="analyzer-form">
        <div className="metadata-section">
          <h3>🎼 Metadata del Audio</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input
                id="title"
                type="text"
                value={audioMetadata.title}
                onChange={(e) => setAudioMetadata(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nombre del track"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="artist">Artista</label>
              <input
                id="artist"
                type="text"
                value={audioMetadata.artist}
                onChange={(e) => setAudioMetadata(prev => ({ ...prev, artist: e.target.value }))}
                placeholder="Nombre del artista"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="genre">Género</label>
              <select
                id="genre"
                value={audioMetadata.genre}
                onChange={(e) => setAudioMetadata(prev => ({ ...prev, genre: e.target.value }))}
                className="form-select"
              >
                <option value="">Seleccionar género</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mood">Mood</label>
              <select
                id="mood"
                value={audioMetadata.mood}
                onChange={(e) => setAudioMetadata(prev => ({ ...prev, mood: e.target.value }))}
                className="form-select"
              >
                <option value="">Seleccionar mood</option>
                {moods.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bpm">BPM</label>
              <input
                id="bpm"
                type="number"
                value={audioMetadata.bpm}
                onChange={(e) => setAudioMetadata(prev => ({ ...prev, bpm: e.target.value }))}
                placeholder="120"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="key">Key</label>
              <select
                id="key"
                value={audioMetadata.key}
                onChange={(e) => setAudioMetadata(prev => ({ ...prev, key: e.target.value }))}
                className="form-select"
              >
                <option value="">Seleccionar key</option>
                {keys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duración</label>
            <input
              id="duration"
              type="text"
              value={audioMetadata.duration}
              onChange={(e) => setAudioMetadata(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="ej: 3:45, 225s"
              className="form-input"
            />
          </div>
        </div>

        <div className="stems-section">
          <div className="section-header">
            <h3>🎛️ Stems Musicales</h3>
            <button onClick={addStem} className="add-btn">
              ➕ Agregar Stem
            </button>
          </div>

          <div className="stems-list">
            {stems.map((stem, index) => (
              <div key={stem.id} className="stem-item">
                <div className="item-header">
                  <span className="item-number">Stem #{index + 1}</span>
                  <button 
                    onClick={() => removeStem(stem.id)}
                    className="remove-btn"
                  >
                    🗑️
                  </button>
                </div>

                <div className="item-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        value={stem.name}
                        onChange={(e) => updateStem(stem.id, 'name', e.target.value)}
                        placeholder="ej: Kick Drum, Lead Synth"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Tipo de Instrumento</label>
                      <select
                        value={stem.type}
                        onChange={(e) => updateStem(stem.id, 'type', e.target.value)}
                        className="form-select"
                      >
                        {instrumentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Rango de Frecuencias</label>
                      <input
                        type="text"
                        value={stem.frequency}
                        onChange={(e) => updateStem(stem.id, 'frequency', e.target.value)}
                        placeholder="ej: 80-200Hz, High"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Estilo</label>
                      <input
                        type="text"
                        value={stem.style}
                        onChange={(e) => updateStem(stem.id, 'style', e.target.value)}
                        placeholder="ej: Analog, Digital, Acoustic"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Volumen</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={stem.volume}
                      onChange={(e) => updateStem(stem.id, 'volume', parseFloat(e.target.value))}
                      className="volume-slider"
                    />
                    <span className="volume-value">{(stem.volume * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}

            {stems.length === 0 && (
              <div className="empty-state">
                <p>No hay stems agregados</p>
                <p>Haz clic en "Agregar Stem" para comenzar</p>
              </div>
            )}
          </div>
        </div>

        <div className="analysis-options">
          <div className="form-group">
            <label htmlFor="analysis-type">Tipo de Análisis</label>
            <select
              id="analysis-type"
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="form-select"
            >
              <option value="full">Análisis Completo</option>
              <option value="stems">Solo Stems</option>
              <option value="chords">Solo Progresiones</option>
              <option value="genre">Solo Género</option>
            </select>
          </div>
        </div>

        <div className="action-buttons">
          <button
            onClick={analyzeMusic}
            disabled={isLoading || (!audioMetadata.title && stems.length === 0)}
            className="analyze-btn"
          >
            {isLoading ? '🔄 Analizando...' : '🎵 Analizar Música'}
          </button>
          
          <button
            onClick={generateCover}
            disabled={isLoading || !audioMetadata.title}
            className="cover-btn"
          >
            {isLoading ? '🔄 Generando Cover...' : '🎤 Generar Cover con SunoAPI'}
          </button>
        </div>
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
            <h3>🎼 Análisis Musical Completado</h3>
            <span className="analysis-type-badge">{analysisType}</span>
          </div>

          {results.data?.stem_analysis && (
            <div className="stem-analysis">
              <h4>🎛️ Análisis de Stems</h4>
              <div className="stems-grid">
                {results.data.stem_analysis.map((stem, index) => (
                  <div key={index} className="stem-analysis-card">
                    <h5>{stem.stem_name}</h5>
                    <div className="stem-tags">
                      {stem.tags?.map((tag, tagIndex) => (
                        <span key={tagIndex} className="tag">{tag}</span>
                      ))}
                    </div>
                    <div className="stem-info">
                      <p><strong>Tipo:</strong> {stem.instrument_type}</p>
                      <p><strong>Frecuencias:</strong> {stem.frequency_range}</p>
                      <div className="style-suggestions">
                        <strong>Estilos:</strong>
                        <ul>
                          {stem.style_suggestions?.map((style, styleIndex) => (
                            <li key={styleIndex}>{style}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.data?.chord_progressions && (
            <div className="chord-progressions">
              <h4>🎹 Progresiones de Acordes</h4>
              <div className="progressions-grid">
                {results.data.chord_progressions.map((progression, index) => (
                  <div key={index} className="progression-card">
                    <div className="progression-header">
                      <h5>{progression.progression}</h5>
                      <span className="style-badge">{progression.style}</span>
                    </div>
                    <div className="progression-info">
                      <p><strong>Complejidad:</strong> {progression.complexity}</p>
                      <p><strong>Mood:</strong> {progression.mood}</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(progression.progression)}
                      className="copy-btn"
                    >
                      📋 Copiar Progresión
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.data?.genre_analysis && (
            <div className="genre-analysis">
              <h4>🎭 Análisis de Género</h4>
              <div className="genre-card">
                <div className="genre-primary">
                  <h5>Género Principal</h5>
                  <p className="genre-name">{results.data.genre_analysis.primary_genre}</p>
                  <div className="confidence-bar">
                    <span>Confianza: {(results.data.genre_analysis.confidence * 100).toFixed(1)}%</span>
                    <div className="confidence-fill" style={{ width: `${results.data.genre_analysis.confidence * 100}%` }}></div>
                  </div>
                </div>
                {results.data.genre_analysis.secondary_genres && (
                  <div className="genre-secondary">
                    <h5>Géneros Secundarios</h5>
                    <div className="secondary-tags">
                      {results.data.genre_analysis.secondary_genres.map((genre, index) => (
                        <span key={index} className="secondary-tag">{genre}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {results.data?.production_suggestions && (
            <div className="production-suggestions">
              <h4>🎚️ Sugerencias de Producción</h4>
              <div className="suggestions-grid">
                <div className="suggestion-category">
                  <h5>Mixing</h5>
                  <ul>
                    {results.data.production_suggestions.mixing?.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                <div className="suggestion-category">
                  <h5>Mastering</h5>
                  <ul>
                    {results.data.production_suggestions.mastering?.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                <div className="suggestion-category">
                  <h5>Arrangement</h5>
                  <ul>
                    {results.data.production_suggestions.arrangement?.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {results.data?.overall_assessment && (
            <div className="overall-assessment">
              <h4>📊 Evaluación General</h4>
              <p>{results.data.overall_assessment}</p>
            </div>
          )}

          {results.sunoCover && (
            <div className="suno-cover-section">
              <h4>🎤 Cover Generado con SunoAPI</h4>
              <div className="cover-result">
                <div className="cover-info">
                  <p><strong>Género:</strong> {results.sunoCover.cover_style}</p>
                  <p><strong>Duración:</strong> {results.sunoCover.duration}s</p>
                  <p><strong>Estado:</strong> {results.sunoCover.status}</p>
                </div>
                {results.sunoCover.audio_url && (
                  <div className="cover-audio">
                    <audio controls>
                      <source src={results.sunoCover.audio_url} type="audio/mpeg" />
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  </div>
                )}
                <div className="cover-actions">
                  <button 
                    onClick={() => copyToClipboard(results.sunoCover.generation_id)}
                    className="copy-btn"
                  >
                    📋 Copiar ID
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="results-meta">
            <small>
              Análisis completado: {new Date(results.timestamp).toLocaleString()}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default GhostStudioAnalyzer;