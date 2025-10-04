/**
 * Qwen Client - Cliente centralizado para integración con Qwen API
 * Super-Son1k Monorepo
 */

class QwenClient {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.QWEN_API_KEY;
    this.baseUrl = config.baseUrl || 'https://api.qwen.com/v1';
    this.timeout = config.timeout || 30000;
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
        console.warn(`Qwen API attempt ${attempt} failed:`, error.message);
        
        if (attempt < this.maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw new Error(`Qwen API failed after ${this.maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Análisis técnico para Pixel (QA, logs, diffs)
   */
  async analyzeTechnical(input) {
    const prompt = `Eres Pixel, un asistente técnico experto en desarrollo de software. 
    
Analiza el siguiente contenido técnico y proporciona:
1. Identificación de problemas potenciales
2. Sugerencias de mejora
3. Recomendaciones específicas
4. Código de ejemplo si es necesario

Contenido a analizar:
${input}

Responde en formato JSON estructurado con las siguientes claves:
- problems: array de problemas identificados
- suggestions: array de sugerencias
- recommendations: array de recomendaciones
- code_examples: array de ejemplos de código (si aplica)
- severity: nivel de severidad (low, medium, high, critical)`;

    return await this.makeRequest('/chat/completions', {
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres Pixel, un asistente técnico experto en desarrollo de software, QA, y optimización de código.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });
  }

  /**
   * Generación de contenido para Nova Post Pilot
   */
  async generateSocialContent(baseText, platform, metadata = {}) {
    const platformPrompts = {
      'tiktok': 'Crea contenido viral para TikTok: corto, dinámico, con hooks fuertes y call-to-action claro.',
      'instagram': 'Genera contenido para Instagram: estético, con hashtags relevantes y storytelling visual.',
      'twitter': 'Crea tweets impactantes: concisos, con engagement y posibilidad de viralización.',
      'youtube': 'Genera contenido para YouTube: títulos llamativos, descripciones detalladas y tags relevantes.'
    };

    const prompt = `${platformPrompts[platform] || 'Genera contenido para redes sociales'}

Texto base: "${baseText}"
Metadata: ${JSON.stringify(metadata)}

Genera múltiples versiones (3-5) adaptadas a ${platform} con:
- Título/caption principal
- Hashtags relevantes (máximo 10)
- Call-to-action sugerido
- Tono y estilo apropiado

Responde en formato JSON:
{
  "versions": [
    {
      "title": "título principal",
      "caption": "texto del post",
      "hashtags": ["#tag1", "#tag2"],
      "call_to_action": "CTA sugerido",
      "tone": "tono utilizado",
      "engagement_score": "alto/medio/bajo"
    }
  ],
  "platform": "${platform}",
  "recommendations": "sugerencias adicionales"
}`;

    return await this.makeRequest('/chat/completions', {
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en marketing digital y creación de contenido para redes sociales.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });
  }

  /**
   * Limpieza de datasets para Clone Station
   */
  async cleanAudioDataset(transcriptions, metadata = {}) {
    const prompt = `Eres un experto en procesamiento de audio y entrenamiento de modelos de voz.

Analiza las siguientes transcripciones de audio y proporciona:
1. Limpieza de muletillas y palabras innecesarias
2. Corrección de errores de transcripción
3. Optimización de timing y pausas
4. Recomendaciones de cortes útiles para entrenamiento
5. Calidad del dataset para entrenamiento de voz

Transcripciones:
${JSON.stringify(transcriptions, null, 2)}

Metadata del audio:
${JSON.stringify(metadata, null, 2)}

Responde en formato JSON:
{
  "cleaned_transcriptions": [
    {
      "original": "texto original",
      "cleaned": "texto limpio",
      "confidence": 0.95,
      "recommended_cuts": ["inicio", "fin"],
      "quality_score": "alto/medio/bajo"
    }
  ],
  "dataset_analysis": {
    "total_duration": "duración estimada",
    "quality_score": "puntuación general",
    "recommendations": ["recomendación 1", "recomendación 2"],
    "training_readiness": "listo/necesita_más_datos/no_recomendado"
  },
  "suggestions": "sugerencias adicionales para mejorar el dataset"
}`;

    return await this.makeRequest('/chat/completions', {
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en procesamiento de audio, transcripción y entrenamiento de modelos de voz.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000
      })
    });
  }

  /**
   * Análisis musical para Ghost Studio
   */
  async analyzeMusic(audioMetadata, stems = []) {
    const prompt = `Eres un experto en producción musical y análisis de audio.

Analiza la siguiente información musical y proporciona:
1. Etiquetado automático de stems y elementos musicales
2. Sugerencias de progresiones de acordes
3. Recomendaciones de estilo y género
4. Análisis de estructura musical
5. Sugerencias de mezcla y mastering

Metadata del audio:
${JSON.stringify(audioMetadata, null, 2)}

Stems disponibles:
${JSON.stringify(stems, null, 2)}

Responde en formato JSON:
{
  "stem_analysis": [
    {
      "stem_name": "nombre del stem",
      "tags": ["tag1", "tag2"],
      "instrument_type": "tipo de instrumento",
      "frequency_range": "rango de frecuencias",
      "style_suggestions": ["estilo1", "estilo2"]
    }
  ],
  "chord_progressions": [
    {
      "progression": "I-V-vi-IV",
      "style": "pop",
      "complexity": "simple",
      "mood": "uplifting"
    }
  ],
  "genre_analysis": {
    "primary_genre": "género principal",
    "secondary_genres": ["género2", "género3"],
    "confidence": 0.85
  },
  "production_suggestions": {
    "mixing": ["sugerencia1", "sugerencia2"],
    "mastering": ["sugerencia1", "sugerencia2"],
    "arrangement": ["sugerencia1", "sugerencia2"]
  },
  "overall_assessment": "evaluación general del track"
}`;

    return await this.makeRequest('/chat/completions', {
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en producción musical, análisis de audio y teoría musical.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
      })
    });
  }

  /**
   * Generación de prompts optimizados para Windsurf/Cursor
   */
  async generateOptimizedPrompt(context, task) {
    const prompt = `Eres un experto en optimización de prompts para herramientas de desarrollo como Windsurf y Cursor.

Contexto: ${context}
Tarea: ${task}

Genera un prompt optimizado que sea:
1. Específico y claro
2. Incluya ejemplos cuando sea necesario
3. Defina el formato de salida esperado
4. Incluya restricciones y consideraciones
5. Sea eficiente para herramientas de IA

Responde en formato JSON:
{
  "optimized_prompt": "prompt optimizado completo",
  "key_elements": ["elemento1", "elemento2"],
  "expected_output": "descripción del output esperado",
  "considerations": ["consideración1", "consideración2"],
  "example_usage": "ejemplo de uso del prompt"
}`;

    return await this.makeRequest('/chat/completions', {
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en optimización de prompts para herramientas de desarrollo asistido por IA.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1000
      })
    });
  }

  /**
   * Análisis de logs y debugging
   */
  async analyzeLogs(logs, context = {}) {
    const prompt = `Eres Pixel, un experto en debugging y análisis de logs.

Analiza los siguientes logs y proporciona:
1. Identificación de errores y warnings
2. Causas probables de los problemas
3. Soluciones sugeridas
4. Prevención de problemas similares
5. Optimizaciones recomendadas

Logs:
${logs}

Contexto adicional:
${JSON.stringify(context, null, 2)}

Responde en formato JSON:
{
  "error_analysis": [
    {
      "error_type": "tipo de error",
      "severity": "critical/high/medium/low",
      "description": "descripción del error",
      "probable_cause": "causa probable",
      "solution": "solución sugerida"
    }
  ],
  "performance_issues": [
    {
      "issue": "problema identificado",
      "impact": "impacto en rendimiento",
      "recommendation": "recomendación"
    }
  ],
  "summary": "resumen general del análisis",
  "next_steps": ["paso1", "paso2", "paso3"]
}`;

    return await this.makeRequest('/chat/completions', {
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres Pixel, un experto en debugging, análisis de logs y optimización de sistemas.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000
      })
    });
  }
}

module.exports = QwenClient;