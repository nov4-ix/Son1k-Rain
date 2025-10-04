/**
 * Nova Post Generator - Generador de contenido para redes sociales
 * Super-Son1k Web Classic
 */

import React, { useState } from 'react';
import './NovaPostGenerator.css';

const NovaPostGenerator = () => {
  const [baseText, setBaseText] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [metadata, setMetadata] = useState({
    targetAudience: '',
    tone: 'professional',
    keywords: '',
    callToAction: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  const generateContent = async () => {
    if (!baseText.trim()) {
      setError('Por favor ingresa el texto base para generar contenido');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/qwen/nova/qwen-copy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({
          baseText: baseText.trim(),
          platform: platform,
          metadata: metadata
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error generando contenido');
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

  const copyHashtags = (hashtags) => {
    const hashtagString = hashtags.join(' ');
    navigator.clipboard.writeText(hashtagString);
  };

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: '📸' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { value: 'youtube', label: 'YouTube', icon: '📺' }
  ];

  const tones = [
    { value: 'professional', label: 'Profesional' },
    { value: 'casual', label: 'Casual' },
    { value: 'funny', label: 'Divertido' },
    { value: 'inspirational', label: 'Inspiracional' },
    { value: 'urgent', label: 'Urgente' },
    { value: 'educational', label: 'Educativo' }
  ];

  return (
    <div className="nova-post-generator">
      <div className="generator-header">
        <h2>🚀 Nova Post Generator</h2>
        <p>Genera contenido optimizado para redes sociales con IA Qwen</p>
      </div>

      <div className="generator-form">
        <div className="form-section">
          <label htmlFor="base-text">Texto Base *</label>
          <textarea
            id="base-text"
            value={baseText}
            onChange={(e) => setBaseText(e.target.value)}
            placeholder="Describe tu producto, servicio o idea aquí..."
            rows={4}
            className="form-textarea"
          />
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="platform">Plataforma</label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="form-select"
            >
              {platforms.map(p => (
                <option key={p.value} value={p.value}>
                  {p.icon} {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label htmlFor="tone">Tono</label>
            <select
              id="tone"
              value={metadata.tone}
              onChange={(e) => setMetadata(prev => ({ ...prev, tone: e.target.value }))}
              className="form-select"
            >
              {tones.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="audience">Audiencia Objetivo</label>
            <input
              id="audience"
              type="text"
              value={metadata.targetAudience}
              onChange={(e) => setMetadata(prev => ({ ...prev, targetAudience: e.target.value }))}
              placeholder="ej: jóvenes de 18-25 años"
              className="form-input"
            />
          </div>

          <div className="form-section">
            <label htmlFor="keywords">Palabras Clave</label>
            <input
              id="keywords"
              type="text"
              value={metadata.keywords}
              onChange={(e) => setMetadata(prev => ({ ...prev, keywords: e.target.value }))}
              placeholder="ej: tecnología, innovación, startup"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="cta">Call to Action</label>
          <input
            id="cta"
            type="text"
            value={metadata.callToAction}
            onChange={(e) => setMetadata(prev => ({ ...prev, callToAction: e.target.value }))}
            placeholder="ej: Visita nuestro sitio web"
            className="form-input"
          />
        </div>

        <button
          onClick={generateContent}
          disabled={isLoading || !baseText.trim()}
          className="generate-btn"
        >
          {isLoading ? '🔄 Generando...' : '✨ Generar Contenido'}
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
            <h3>📱 Contenido Generado para {platforms.find(p => p.value === platform)?.label}</h3>
            <span className="platform-badge">
              {platforms.find(p => p.value === platform)?.icon} {platforms.find(p => p.value === platform)?.label}
            </span>
          </div>

          <div className="content-versions">
            {results.data?.versions?.map((version, index) => (
              <div key={index} className="version-card">
                <div className="version-header">
                  <h4>Versión {index + 1}</h4>
                  <div className="engagement-score">
                    Engagement: <span className={`score ${version.engagement_score}`}>
                      {version.engagement_score}
                    </span>
                  </div>
                </div>

                <div className="version-content">
                  <div className="title-section">
                    <h5>Título</h5>
                    <p className="title">{version.title}</p>
                    <button 
                      onClick={() => copyToClipboard(version.title)}
                      className="copy-btn"
                    >
                      📋 Copiar título
                    </button>
                  </div>

                  <div className="caption-section">
                    <h5>Caption</h5>
                    <p className="caption">{version.caption}</p>
                    <button 
                      onClick={() => copyToClipboard(version.caption)}
                      className="copy-btn"
                    >
                      📋 Copiar caption
                    </button>
                  </div>

                  {version.hashtags && version.hashtags.length > 0 && (
                    <div className="hashtags-section">
                      <h5>Hashtags</h5>
                      <div className="hashtags">
                        {version.hashtags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="hashtag">{tag}</span>
                        ))}
                      </div>
                      <button 
                        onClick={() => copyHashtags(version.hashtags)}
                        className="copy-btn"
                      >
                        📋 Copiar hashtags
                      </button>
                    </div>
                  )}

                  {version.call_to_action && (
                    <div className="cta-section">
                      <h5>Call to Action</h5>
                      <p className="cta">{version.call_to_action}</p>
                      <button 
                        onClick={() => copyToClipboard(version.call_to_action)}
                        className="copy-btn"
                      >
                        📋 Copiar CTA
                      </button>
                    </div>
                  )}

                  <div className="tone-info">
                    <small>Tono: <strong>{version.tone}</strong></small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.data?.recommendations && (
            <div className="recommendations-section">
              <h4>💡 Recomendaciones</h4>
              <p>{results.data.recommendations}</p>
            </div>
          )}

          <div className="results-meta">
            <small>
              Contenido generado: {new Date(results.timestamp).toLocaleString()}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default NovaPostGenerator;