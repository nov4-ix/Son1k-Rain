/**
 * Suno Routes - Endpoints para integración con SunoAPI
 * Super-Son1k Backend
 */

const express = require('express');
const router = express.Router();
const SunoClient = require('../../services/sunoClient');

// Inicializar cliente Suno
const sunoClient = new SunoClient({
  apiKey: process.env.SUNO_API_KEY,
  baseUrl: process.env.SUNO_BASE_URL || 'https://api.suno.ai/v1'
});

/**
 * Middleware de autenticación (opcional)
 */
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token && process.env.REQUIRE_AUTH === 'true') {
    return res.status(401).json({ error: 'Token de autorización requerido' });
  }
  next();
};

/**
 * POST /generator/generate-music
 * Generar música desde texto (The Generator)
 */
router.post('/generator/generate-music', authenticate, async (req, res) => {
  try {
    const { 
      prompt, 
      lyrics, 
      style, 
      duration = 30,
      mood = 'happy',
      tempo = 'medium',
      key = 'C',
      language = 'en',
      vocals = true,
      instrumental = false,
      customStyle = null,
      seed = null
    } = req.body;

    if (!prompt && !lyrics) {
      return res.status(400).json({ 
        error: 'Se requiere "prompt" o "lyrics" para generar música' 
      });
    }

    let result;
    if (lyrics) {
      // Generar con letras específicas
      result = await sunoClient.generateWithLyrics(lyrics, style, {
        duration,
        tempo,
        key,
        language,
        vocals,
        instrumental
      });
    } else {
      // Generar desde prompt
      result = await sunoClient.generateMusic(prompt, {
        duration,
        style,
        mood,
        tempo,
        key,
        language,
        vocals,
        instrumental,
        customStyle,
        seed
      });
    }

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      type: 'music_generation'
    });

  } catch (error) {
    console.error('Error en /generator/generate-music:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * POST /generator/generate-cover
 * Generar cover de una canción (Suno Cover)
 */
router.post('/generator/generate-cover', authenticate, async (req, res) => {
  try {
    const { 
      originalSong, 
      coverStyle, 
      duration = 30,
      tempo = 'medium',
      key = 'C',
      language = 'en',
      vocals = true,
      instrumental = false,
      preserveMelody = true,
      styleIntensity = 0.7
    } = req.body;

    if (!originalSong || !coverStyle) {
      return res.status(400).json({ 
        error: 'Se requieren "originalSong" y "coverStyle"' 
      });
    }

    const result = await sunoClient.generateCover(originalSong, coverStyle, {
      duration,
      tempo,
      key,
      language,
      vocals,
      instrumental,
      preserveMelody,
      styleIntensity
    });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      type: 'cover_generation'
    });

  } catch (error) {
    console.error('Error en /generator/generate-cover:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * POST /generator/generate-lyrics
 * Generar letras con IA Qwen
 */
router.post('/generator/generate-lyrics', authenticate, async (req, res) => {
  try {
    const { 
      prompt, 
      style = 'song',
      mood = 'happy',
      theme = '',
      language = 'en',
      length = 'medium',
      rhymeScheme = 'auto',
      includeMetaphors = true,
      includePersonification = false,
      includeHyperbole = false
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        error: 'Se requiere "prompt" para generar letras' 
      });
    }

    // Usar Qwen para generar letras creativas
    const qwenPrompt = `Eres un compositor experto y poeta creativo. Genera letras de canción basadas en el siguiente prompt:

Prompt del usuario: "${prompt}"
Estilo: ${style}
Mood: ${mood}
Tema: ${theme || 'general'}
Idioma: ${language}
Longitud: ${length}
Esquema de rima: ${rhymeScheme}

Requisitos específicos:
- ${includeMetaphors ? 'Incluir metáforas creativas' : 'Evitar metáforas complejas'}
- ${includePersonification ? 'Incluir personificación' : 'Evitar personificación'}
- ${includeHyperbole ? 'Incluir hipérbole' : 'Evitar hipérbole'}
- Mantener coherencia narrativa
- Usar lenguaje poético apropiado
- Estructura de verso/estribillo clara

Genera letras completas y creativas que capturen la esencia del prompt del usuario.`;

    // Llamar a Qwen API
    const qwenResponse = await fetch(`${process.env.QWEN_BASE_URL || 'https://api.qwen.com/v1'}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un compositor experto y poeta creativo especializado en escribir letras de canciones.'
          },
          {
            role: 'user',
            content: qwenPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    });

    const qwenData = await qwenResponse.json();
    
    if (!qwenResponse.ok) {
      throw new Error(qwenData.message || 'Error generando letras con Qwen');
    }

    const generatedLyrics = qwenData.choices[0].message.content;

    res.json({
      success: true,
      data: {
        lyrics: generatedLyrics,
        metadata: {
          prompt,
          style,
          mood,
          theme,
          language,
          length,
          rhymeScheme,
          includeMetaphors,
          includePersonification,
          includeHyperbole
        }
      },
      timestamp: new Date().toISOString(),
      type: 'lyrics_generation'
    });

  } catch (error) {
    console.error('Error en /generator/generate-lyrics:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * POST /generator/generate-style-prompt
 * Generar prompt de estilo musical con IA Qwen
 */
router.post('/generator/generate-style-prompt', authenticate, async (req, res) => {
  try {
    const { 
      description, 
      mood = 'happy',
      genre = 'pop',
      era = 'modern',
      instruments = '',
      tempo = 'medium',
      complexity = 'medium'
    } = req.body;

    if (!description) {
      return res.status(400).json({ 
        error: 'Se requiere "description" para generar prompt de estilo' 
      });
    }

    // Usar Qwen para generar prompt de estilo creativo
    const qwenPrompt = `Eres un productor musical experto y especialista en estilos musicales. Genera un prompt creativo y coherente para SunoAPI basado en la siguiente descripción:

Descripción del usuario: "${description}"
Mood: ${mood}
Género base: ${genre}
Era: ${era}
Instrumentos: ${instruments || 'automático'}
Tempo: ${tempo}
Complejidad: ${complexity}

El prompt debe ser:
- Creativo pero coherente
- Específico para SunoAPI
- Incluir elementos técnicos musicales
- Mantener la esencia de la descripción del usuario
- Optimizado para obtener el mejor resultado musical

Genera un prompt en inglés que sea claro, creativo y técnicamente preciso.`;

    // Llamar a Qwen API
    const qwenResponse = await fetch(`${process.env.QWEN_BASE_URL || 'https://api.qwen.com/v1'}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un productor musical experto especializado en crear prompts optimizados para generación musical con IA.'
          },
          {
            role: 'user',
            content: qwenPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const qwenData = await qwenResponse.json();
    
    if (!qwenResponse.ok) {
      throw new Error(qwenData.message || 'Error generando prompt de estilo con Qwen');
    }

    const generatedPrompt = qwenData.choices[0].message.content;

    res.json({
      success: true,
      data: {
        prompt: generatedPrompt,
        metadata: {
          description,
          mood,
          genre,
          era,
          instruments,
          tempo,
          complexity
        }
      },
      timestamp: new Date().toISOString(),
      type: 'style_prompt_generation'
    });

  } catch (error) {
    console.error('Error en /generator/generate-style-prompt:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * GET /generator/status/:generationId
 * Obtener estado de una generación
 */
router.get('/generator/status/:generationId', authenticate, async (req, res) => {
  try {
    const { generationId } = req.params;
    
    const result = await sunoClient.getGenerationStatus(generationId);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /generator/status:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * GET /generator/history
 * Obtener historial de generaciones
 */
router.get('/generator/history', authenticate, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const result = await sunoClient.getGenerationHistory(parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /generator/history:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * GET /generator/styles
 * Obtener estilos musicales disponibles
 */
router.get('/generator/styles', async (req, res) => {
  try {
    const result = await sunoClient.getAvailableStyles();

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /generator/styles:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * GET /generator/account
 * Obtener información de la cuenta Suno
 */
router.get('/generator/account', authenticate, async (req, res) => {
  try {
    const result = await sunoClient.getAccountInfo();

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /generator/account:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * DELETE /generator/delete/:generationId
 * Eliminar una generación
 */
router.delete('/generator/delete/:generationId', authenticate, async (req, res) => {
  try {
    const { generationId } = req.params;
    
    const result = await sunoClient.deleteGeneration(generationId);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /generator/delete:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

module.exports = router;