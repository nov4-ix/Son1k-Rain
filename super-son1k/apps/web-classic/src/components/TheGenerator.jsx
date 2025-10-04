/**
 * The Generator - Herramienta de generación básica de texto a audio
 * Super-Son1k Web Classic
 */

import React, { useState, useRef, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import useAnimations from '../hooks/useAnimations';
import './TheGenerator.css';

const TheGenerator = () => {
  const [lyrics, setLyrics] = useState('');
  const [style, setStyle] = useState('');
  const [stylePrompt, setStylePrompt] = useState('');
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  const [isGeneratingStyle, setIsGeneratingStyle] = useState(false);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [generationStatus, setGenerationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [generationHistory, setGenerationHistory] = useState([]);
  
  const lyricsTextareaRef = useRef(null);
  const styleTextareaRef = useRef(null);
  
  const { theme } = useTheme();
  const { 
    createAnimatedRef, 
    getAnimationClass, 
    pulse, 
    glow,
    createParticles 
  } = useAnimations();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Opciones de configuración
  const [config, setConfig] = useState({
    duration: 30,
    mood: 'happy',
    tempo: 'medium',
    key: 'C',
    language: 'en',
    vocals: true,
    instrumental: false,
    includeMetaphors: true,
    includePersonification: false,
    includeHyperbole: false,
    rhymeScheme: 'auto',
    length: 'medium'
  });

  const moods = [
    'happy', 'sad', 'energetic', 'calm', 'romantic', 'melancholic', 
    'uplifting', 'dark', 'peaceful', 'aggressive', 'mysterious', 'nostalgic'
  ];

  const tempos = [
    'slow', 'medium', 'fast', 'very-slow', 'very-fast'
  ];

  const keys = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' }
  ];

  const rhymeSchemes = [
    'auto', 'AABB', 'ABAB', 'ABCB', 'AAAA', 'ABBA', 'free'
  ];

  const lengths = [
    'short', 'medium', 'long', 'very-short', 'very-long'
  ];

  // Generar letras con IA Qwen
  const generateLyrics = async () => {
    if (!lyrics.trim()) {
      setError('Por favor ingresa un prompt para generar letras');
      pulse('lyrics-section');
      return;
    }

    setIsGeneratingLyrics(true);
    setError(null);
    glow('generate-lyrics-btn');

    try {
      const response = await fetch(`${API_BASE}/suno/generator/generate-lyrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({
          prompt: lyrics.trim(),
          style: 'song',
          mood: config.mood,
          language: config.language,
          length: config.length,
          rhymeScheme: config.rhymeScheme,
          includeMetaphors: config.includeMetaphors,
          includePersonification: config.includePersonification,
          includeHyperbole: config.includeHyperbole
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error generando letras');
      }

      setLyrics(data.data.lyrics);
      pulse('lyrics-result');
      createParticles('lyrics-particles', 10);

    } catch (err) {
      setError(err.message);
      pulse('error-message');
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  // Generar prompt de estilo con IA Qwen
  const generateStylePrompt = async () => {
    if (!style.trim()) {
      setError('Por favor ingresa una descripción del estilo musical');
      pulse('style-section');
      return;
    }

    setIsGeneratingStyle(true);
    setError(null);
    glow('generate-style-btn');

    try {
      const response = await fetch(`${API_BASE}/suno/generator/generate-style-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({
          description: style.trim(),
          mood: config.mood,
          tempo: config.tempo,
          complexity: 'medium'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error generando prompt de estilo');
      }

      setStylePrompt(data.data.prompt);
      pulse('style-result');
      createParticles('style-particles', 10);

    } catch (err) {
      setError(err.message);
      pulse('error-message');
    } finally {
      setIsGeneratingStyle(false);
    }
  };

  // Generar música con SunoAPI
  const generateMusic = async () => {
    if (!lyrics.trim() && !stylePrompt.trim()) {
      setError('Por favor genera letras o un estilo musical primero');
      pulse('generator-section');
      return;
    }

    setIsGeneratingMusic(true);
    setError(null);
    setGenerationStatus({ status: 'generating', progress: 0 });
    glow('generate-music-btn');

    try {
      const response = await fetch(`${API_BASE}/suno/generator/generate-music`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({
          lyrics: lyrics.trim(),
          prompt: stylePrompt.trim(),
          style: 'auto',
          duration: config.duration,
          mood: config.mood,
          tempo: config.tempo,
          key: config.key,
          language: config.language,
          vocals: config.vocals,
          instrumental: config.instrumental
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error generando música');
      }

      setGenerationStatus({
        status: 'completed',
        generationId: data.data.generation_id,
        audioUrl: data.data.audio_url,
        duration: data.data.duration
      });

      // Agregar a historial
      setGenerationHistory(prev => [{
        id: data.data.generation_id,
        lyrics: lyrics.trim(),
        style: stylePrompt.trim(),
        timestamp: new Date().toISOString(),
        status: 'completed'
      }, ...prev.slice(0, 9)]);

      pulse('music-result');
      createParticles('music-particles', 20);

    } catch (err) {
      setError(err.message);
      setGenerationStatus({ status: 'error', error: err.message });
      pulse('error-message');
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  // Limpiar todo
  const clearAll = () => {
    setLyrics('');
    setStyle('');
    setStylePrompt('');
    setGenerationStatus(null);
    setError(null);
    lyricsTextareaRef.current?.focus();
  };

  // Copiar al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Descargar audio
  const downloadAudio = async (generationId) => {
    try {
      const response = await fetch(`${API_BASE}/suno/generator/download/${generationId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `generated-music-${generationId}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError('Error descargando audio');
    }
  };

  return (
    <div className="the-generator" id="the-generator">
      <div className="particles-container" id="lyrics-particles"></div>
      <div className="particles-container" id="style-particles"></div>
      <div className="particles-container" id="music-particles"></div>
      
      <div 
        className={`generator-header ${getAnimationClass('generator-header', 'fadeInUp')}`}
        ref={createAnimatedRef('fadeInUp')}
      >
        <h2>🎵 The Generator</h2>
        <p>Herramienta de generación básica de texto a audio con IA Qwen + SunoAPI</p>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">Conectado a SunoAPI</span>
        </div>
      </div>

      <div className="generator-content">
        {/* Sección de Letras */}
        <div 
          id="lyrics-section"
          className={`lyrics-section ${getAnimationClass('lyrics-section', 'fadeInLeft')}`}
          ref={createAnimatedRef('fadeInLeft')}
        >
          <div className="section-header">
            <h3>📝 Generación de Letras</h3>
            <p>Escribe un prompt o genera letras automáticamente con IA</p>
          </div>

          <div className="input-group">
            <label htmlFor="lyrics-input">Prompt para letras:</label>
            <textarea
              id="lyrics-input"
              ref={lyricsTextareaRef}
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Ej: Una canción sobre superar obstáculos, con metáforas sobre volar..."
              className="lyrics-textarea"
              rows={6}
            />
            <button
              id="generate-lyrics-btn"
              onClick={generateLyrics}
              disabled={isGeneratingLyrics || !lyrics.trim()}
              className={`generate-btn ${isGeneratingLyrics ? 'loading' : ''}`}
            >
              {isGeneratingLyrics ? (
                <>
                  <span className="loading-spinner"></span>
                  Generando letras...
                </>
              ) : (
                <>
                  ✨ Generar Letras con IA
                  <span className="btn-glow"></span>
                </>
              )}
            </button>
          </div>

          {lyrics && (
            <div 
              id="lyrics-result"
              className="result-section"
            >
              <h4>Letras Generadas:</h4>
              <div className="result-content">
                <pre className="lyrics-display">{lyrics}</pre>
                <button 
                  onClick={() => copyToClipboard(lyrics)}
                  className="copy-btn"
                >
                  📋 Copiar Letras
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sección de Estilo Musical */}
        <div 
          id="style-section"
          className={`style-section ${getAnimationClass('style-section', 'fadeInRight')}`}
          ref={createAnimatedRef('fadeInRight')}
        >
          <div className="section-header">
            <h3>🎼 Estilo Musical</h3>
            <p>Describe el estilo o genera un prompt creativo automáticamente</p>
          </div>

          <div className="input-group">
            <label htmlFor="style-input">Descripción del estilo:</label>
            <textarea
              id="style-input"
              ref={styleTextareaRef}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="Ej: Rock alternativo con influencias electrónicas, tempo medio, atmosférico..."
              className="style-textarea"
              rows={4}
            />
            <button
              id="generate-style-btn"
              onClick={generateStylePrompt}
              disabled={isGeneratingStyle || !style.trim()}
              className={`generate-btn ${isGeneratingStyle ? 'loading' : ''}`}
            >
              {isGeneratingStyle ? (
                <>
                  <span className="loading-spinner"></span>
                  Generando estilo...
                </>
              ) : (
                <>
                  🎨 Generar Prompt de Estilo
                  <span className="btn-glow"></span>
                </>
              )}
            </button>
          </div>

          {stylePrompt && (
            <div 
              id="style-result"
              className="result-section"
            >
              <h4>Prompt de Estilo Generado:</h4>
              <div className="result-content">
                <p className="style-display">{stylePrompt}</p>
                <button 
                  onClick={() => copyToClipboard(stylePrompt)}
                  className="copy-btn"
                >
                  📋 Copiar Prompt
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Configuración Avanzada */}
        <div 
          className={`config-section ${getAnimationClass('config-section', 'scaleIn')}`}
          ref={createAnimatedRef('scaleIn')}
        >
          <h3>⚙️ Configuración Avanzada</h3>
          <div className="config-grid">
            <div className="config-group">
              <label>Duración (segundos):</label>
              <input
                type="number"
                value={config.duration}
                onChange={(e) => setConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                min="15"
                max="120"
                className="config-input"
              />
            </div>

            <div className="config-group">
              <label>Mood:</label>
              <select
                value={config.mood}
                onChange={(e) => setConfig(prev => ({ ...prev, mood: e.target.value }))}
                className="config-select"
              >
                {moods.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>

            <div className="config-group">
              <label>Tempo:</label>
              <select
                value={config.tempo}
                onChange={(e) => setConfig(prev => ({ ...prev, tempo: e.target.value }))}
                className="config-select"
              >
                {tempos.map(tempo => (
                  <option key={tempo} value={tempo}>{tempo}</option>
                ))}
              </select>
            </div>

            <div className="config-group">
              <label>Key:</label>
              <select
                value={config.key}
                onChange={(e) => setConfig(prev => ({ ...prev, key: e.target.value }))}
                className="config-select"
              >
                {keys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>

            <div className="config-group">
              <label>Idioma:</label>
              <select
                value={config.language}
                onChange={(e) => setConfig(prev => ({ ...prev, language: e.target.value }))}
                className="config-select"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <div className="config-group">
              <label>Esquema de rima:</label>
              <select
                value={config.rhymeScheme}
                onChange={(e) => setConfig(prev => ({ ...prev, rhymeScheme: e.target.value }))}
                className="config-select"
              >
                {rhymeSchemes.map(scheme => (
                  <option key={scheme} value={scheme}>{scheme}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="config-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={config.vocals}
                onChange={(e) => setConfig(prev => ({ ...prev, vocals: e.target.checked }))}
              />
              Incluir vocales
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={config.instrumental}
                onChange={(e) => setConfig(prev => ({ ...prev, instrumental: e.target.checked }))}
              />
              Solo instrumental
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={config.includeMetaphors}
                onChange={(e) => setConfig(prev => ({ ...prev, includeMetaphors: e.target.checked }))}
              />
              Incluir metáforas
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={config.includePersonification}
                onChange={(e) => setConfig(prev => ({ ...prev, includePersonification: e.target.checked }))}
              />
              Incluir personificación
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={config.includeHyperbole}
                onChange={(e) => setConfig(prev => ({ ...prev, includeHyperbole: e.target.checked }))}
              />
              Incluir hipérbole
            </label>
          </div>
        </div>

        {/* Generación de Música */}
        <div 
          id="generator-section"
          className={`music-generation-section ${getAnimationClass('music-generation-section', 'fadeInUp')}`}
          ref={createAnimatedRef('fadeInUp')}
        >
          <div className="section-header">
            <h3>🎵 Generación de Música</h3>
            <p>Genera música completa usando las letras y estilo configurados</p>
          </div>

          <button
            id="generate-music-btn"
            onClick={generateMusic}
            disabled={isGeneratingMusic || (!lyrics.trim() && !stylePrompt.trim())}
            className={`generate-music-btn ${isGeneratingMusic ? 'loading' : ''}`}
          >
            {isGeneratingMusic ? (
              <>
                <span className="loading-spinner"></span>
                Generando música con SunoAPI...
              </>
            ) : (
              <>
                🚀 Generar Música Completa
                <span className="btn-glow"></span>
              </>
            )}
          </button>

          {generationStatus && (
            <div 
              id="music-result"
              className="generation-status"
            >
              {generationStatus.status === 'generating' && (
                <div className="status-generating">
                  <h4>🎵 Generando música...</h4>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${generationStatus.progress}%` }}></div>
                  </div>
                  <p>Esto puede tomar varios minutos...</p>
                </div>
              )}

              {generationStatus.status === 'completed' && (
                <div className="status-completed">
                  <h4>✅ Música generada exitosamente!</h4>
                  <div className="audio-player">
                    <audio controls>
                      <source src={generationStatus.audioUrl} type="audio/mpeg" />
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  </div>
                  <div className="audio-actions">
                    <button 
                      onClick={() => downloadAudio(generationStatus.generationId)}
                      className="download-btn"
                    >
                      📥 Descargar Audio
                    </button>
                    <button 
                      onClick={() => copyToClipboard(generationStatus.generationId)}
                      className="copy-btn"
                    >
                      📋 Copiar ID
                    </button>
                  </div>
                </div>
              )}

              {generationStatus.status === 'error' && (
                <div className="status-error">
                  <h4>❌ Error en la generación</h4>
                  <p>{generationStatus.error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Historial */}
        {generationHistory.length > 0 && (
          <div 
            className={`history-section ${getAnimationClass('history-section', 'fadeInUp')}`}
            ref={createAnimatedRef('fadeInUp')}
          >
            <h3>📚 Historial de Generaciones</h3>
            <div className="history-list">
              {generationHistory.map((item, index) => (
                <div 
                  key={item.id}
                  className={`history-item ${getAnimationClass(`history-item-${index}`, 'scaleIn')}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="history-content">
                    <span className="history-id">ID: {item.id}</span>
                    <span className="history-time">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                    <span className="history-status">{item.status}</span>
                  </div>
                  <div className="history-preview">
                    <p><strong>Letras:</strong> {item.lyrics.substring(0, 100)}...</p>
                    <p><strong>Estilo:</strong> {item.style.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="actions-section">
          <button 
            onClick={clearAll}
            className="clear-btn"
          >
            🗑️ Limpiar Todo
          </button>
        </div>
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
    </div>
  );
};

export default TheGenerator;