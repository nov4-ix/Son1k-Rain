/**
 * Suno Client - Cliente para integración con SunoAPI
 * Super-Son1k Monorepo
 */

class SunoClient {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.SUNO_API_KEY;
    this.baseUrl = config.baseUrl || 'https://api.suno.ai/v1';
    this.timeout = config.timeout || 60000; // 60s para generación musical
    this.maxRetries = config.maxRetries || 3;
  }

  /**
   * Realizar llamada HTTP con retry automático
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers
      },
      timeout: this.timeout,
      ...options
    };

    let lastError;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        console.warn(`Suno API attempt ${attempt} failed:`, error.message);
        
        if (attempt < this.maxRetries) {
          const delay = Math.pow(2, attempt) * 2000; // Exponential backoff más largo para música
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw new Error(`Suno API failed after ${this.maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Generar música desde texto (The Generator)
   */
  async generateMusic(prompt, options = {}) {
    const requestBody = {
      prompt: prompt,
      duration: options.duration || 30, // segundos
      style: options.style || 'pop',
      mood: options.mood || 'happy',
      tempo: options.tempo || 'medium',
      key: options.key || 'C',
      language: options.language || 'en',
      vocals: options.vocals !== false, // por defecto incluir vocales
      instrumental: options.instrumental || false,
      custom_style: options.customStyle || null,
      seed: options.seed || null
    };

    return await this.makeRequest('/generate', {
      body: JSON.stringify(requestBody)
    });
  }

  /**
   * Generar cover de una canción existente (Suno Cover)
   */
  async generateCover(originalSong, style, options = {}) {
    const requestBody = {
      original_song: originalSong,
      cover_style: style,
      duration: options.duration || 30,
      tempo: options.tempo || 'medium',
      key: options.key || 'C',
      language: options.language || 'en',
      vocals: options.vocals !== false,
      instrumental: options.instrumental || false,
      preserve_melody: options.preserveMelody || true,
      style_intensity: options.styleIntensity || 0.7
    };

    return await this.makeRequest('/cover', {
      body: JSON.stringify(requestBody)
    });
  }

  /**
   * Generar música con letras específicas
   */
  async generateWithLyrics(lyrics, style, options = {}) {
    const requestBody = {
      lyrics: lyrics,
      style: style,
      duration: options.duration || 30,
      tempo: options.tempo || 'medium',
      key: options.key || 'C',
      language: options.language || 'en',
      vocals: options.vocals !== false,
      instrumental: options.instrumental || false,
      rhyme_scheme: options.rhymeScheme || 'auto',
      melody_style: options.melodyStyle || 'auto'
    };

    return await this.makeRequest('/generate-with-lyrics', {
      body: JSON.stringify(requestBody)
    });
  }

  /**
   * Obtener estado de una generación en progreso
   */
  async getGenerationStatus(generationId) {
    return await this.makeRequest(`/status/${generationId}`, {
      method: 'GET'
    });
  }

  /**
   * Descargar audio generado
   */
  async downloadAudio(generationId, format = 'mp3') {
    return await this.makeRequest(`/download/${generationId}`, {
      method: 'GET',
      headers: {
        'Accept': `audio/${format}`
      }
    });
  }

  /**
   * Obtener historial de generaciones del usuario
   */
  async getGenerationHistory(limit = 20, offset = 0) {
    return await this.makeRequest('/history', {
      method: 'GET',
      body: JSON.stringify({ limit, offset })
    });
  }

  /**
   * Eliminar una generación
   */
  async deleteGeneration(generationId) {
    return await this.makeRequest(`/delete/${generationId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Obtener estilos musicales disponibles
   */
  async getAvailableStyles() {
    return await this.makeRequest('/styles', {
      method: 'GET'
    });
  }

  /**
   * Obtener información de la cuenta
   */
  async getAccountInfo() {
    return await this.makeRequest('/account', {
      method: 'GET'
    });
  }

  /**
   * Generar preview de una canción (más rápido, menor calidad)
   */
  async generatePreview(prompt, duration = 15) {
    const requestBody = {
      prompt: prompt,
      duration: duration,
      quality: 'preview',
      style: 'auto'
    };

    return await this.makeRequest('/preview', {
      body: JSON.stringify(requestBody)
    });
  }

  /**
   * Mezclar dos canciones existentes
   */
  async mixSongs(song1Id, song2Id, options = {}) {
    const requestBody = {
      song1_id: song1Id,
      song2_id: song2Id,
      mix_ratio: options.mixRatio || 0.5,
      style: options.style || 'auto',
      duration: options.duration || 30
    };

    return await this.makeRequest('/mix', {
      body: JSON.stringify(requestBody)
    });
  }

  /**
   * Extender una canción existente
   */
  async extendSong(songId, additionalDuration = 30) {
    const requestBody = {
      song_id: songId,
      additional_duration: additionalDuration,
      maintain_style: true
    };

    return await this.makeRequest('/extend', {
      body: JSON.stringify(requestBody)
    });
  }

  /**
   * Cambiar el estilo de una canción existente
   */
  async changeStyle(songId, newStyle, intensity = 0.7) {
    const requestBody = {
      song_id: songId,
      new_style: newStyle,
      intensity: intensity,
      preserve_melody: true
    };

    return await this.makeRequest('/change-style', {
      body: JSON.stringify(requestBody)
    });
  }
}

module.exports = SunoClient;