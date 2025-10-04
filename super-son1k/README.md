# 🚀 Super-Son1k Monorepo

Monorepo completo con integración Qwen AI para herramientas de desarrollo y creatividad.

## 📁 Estructura del Proyecto

```
super-son1k/
├── apps/
│   ├── web-classic/          # UI clásica con componentes Qwen
│   └── nexus-visual/         # UI Nexus Visual (Matrix interface)
├── packages/                 # Librerías internas compartidas
├── backend/                  # API backend con endpoints Qwen
├── services/                 # Servicios centralizados (qwenClient.js)
└── README.md
```

## 🛠️ Herramientas Integradas

### 🤖 Pixel (Asistente Inteligente)
- **QA técnico**: Análisis de logs, debugging, revisión de código
- **Mentor creativo**: Sugerencias de prompts optimizados
- **Endpoint**: `/api/qwen/pixel/qwen-analyze`
- **UI**: Consola interactiva en web-classic

### 📱 Nova Post Pilot (Social Media)
- **Generación de copies**: Múltiples versiones para redes sociales
- **Hashtags contextuales**: Basados en embeddings
- **Plataformas**: TikTok, Instagram, Twitter, YouTube
- **Endpoint**: `/api/qwen/nova/qwen-copy`
- **UI**: Generador de contenido en web-classic

### 🎤 Clone Station (Voice Cloning)
- **Limpieza de datasets**: Transcripciones optimizadas
- **Recomendaciones de cortes**: Para entrenamiento eficiente
- **Endpoint**: `/api/qwen/clone/qwen-clean`
- **UI**: Limpiador de datasets en web-classic

### 🎵 Ghost Studio (Producción Musical)
- **Auto-etiquetado**: Stems musicales automáticos
- **Progresiones de acordes**: Sugerencias por estilo
- **Análisis de género**: Clasificación automática
- **Endpoint**: `/api/qwen/ghost/qwen-analyze`
- **UI**: Analizador musical en web-classic

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js >= 18.0.0
- npm >= 8.0.0
- API Key de Qwen

### Instalación Completa
```bash
# Clonar el repositorio
git clone <repo-url>
cd super-son1k

# Instalar todas las dependencias
npm run install:all

# Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env con tu QWEN_API_KEY
```

### Variables de Entorno
```bash
# backend/.env
QWEN_API_KEY=tu_api_key_aqui
QWEN_BASE_URL=https://api.qwen.com/v1
PORT=3001
NODE_ENV=development
REQUIRE_AUTH=false
```

## 🎮 Uso

### Desarrollo
```bash
# Iniciar todos los servicios en desarrollo
npm run dev

# O iniciar servicios individuales
npm run dev:backend      # Backend API (puerto 3001)
npm run dev:web-classic  # UI clásica (puerto 3000)
npm run dev:nexus-visual # UI Nexus (puerto 5173)
```

### Producción
```bash
# Build completo
npm run build

# Iniciar backend en producción
npm start
```

## 📡 Endpoints API

### Base URL: `http://localhost:3001/api/qwen`

#### Pixel (QA Técnico)
```bash
POST /pixel/qwen-analyze
Content-Type: application/json

{
  "input": "logs de error o código a analizar",
  "type": "logs|code|prompt|general",
  "context": {
    "task": "descripción de la tarea"
  }
}
```

#### Nova (Social Media)
```bash
POST /nova/qwen-copy
Content-Type: application/json

{
  "baseText": "texto base para generar contenido",
  "platform": "instagram|tiktok|twitter|youtube",
  "metadata": {
    "targetAudience": "audiencia objetivo",
    "tone": "professional|casual|funny",
    "keywords": "palabras clave",
    "callToAction": "CTA sugerido"
  }
}
```

#### Clone Station (Voice Cloning)
```bash
POST /clone/qwen-clean
Content-Type: application/json

{
  "transcriptions": [
    {
      "text": "texto transcrito",
      "timestamp": "00:01:30",
      "confidence": 0.95,
      "speaker": "nombre del speaker"
    }
  ],
  "metadata": {
    "speaker": "nombre del speaker",
    "language": "es",
    "audioQuality": "high",
    "duration": "2h 30m",
    "purpose": "voice_cloning"
  }
}
```

#### Ghost Studio (Música)
```bash
POST /ghost/qwen-analyze
Content-Type: application/json

{
  "audioMetadata": {
    "title": "nombre del track",
    "artist": "artista",
    "genre": "pop",
    "bpm": 120,
    "key": "C",
    "duration": "3:45",
    "mood": "happy"
  },
  "stems": [
    {
      "name": "Kick Drum",
      "type": "Drums",
      "frequency": "80-200Hz",
      "style": "Analog",
      "volume": 0.8
    }
  ],
  "analysisType": "full"
}
```

#### Health Check
```bash
GET /qwen/health
GET /qwen/status
```

## 🎨 Componentes UI

### Pixel Console
- **Ubicación**: `apps/web-classic/src/components/PixelConsole.jsx`
- **Funcionalidad**: Consola interactiva para consultas técnicas
- **Características**: Historial, diferentes tipos de análisis, resultados estructurados

### Nova Post Generator
- **Ubicación**: `apps/web-classic/src/components/NovaPostGenerator.jsx`
- **Funcionalidad**: Generador de contenido para redes sociales
- **Características**: Múltiples plataformas, metadata avanzada, copia fácil

### Clone Station Cleaner
- **Ubicación**: `apps/web-classic/src/components/CloneStationCleaner.jsx`
- **Funcionalidad**: Limpieza y optimización de datasets de audio
- **Características**: Comparación antes/después, exportación, análisis de calidad

### Ghost Studio Analyzer
- **Ubicación**: `apps/web-classic/src/components/GhostStudioAnalyzer.jsx`
- **Funcionalidad**: Análisis musical inteligente
- **Características**: Etiquetado automático, progresiones de acordes, sugerencias de producción

## 🔧 Configuración Avanzada

### Cliente Qwen Centralizado
```javascript
// services/qwenClient.js
const QwenClient = require('./services/qwenClient');

const client = new QwenClient({
  apiKey: process.env.QWEN_API_KEY,
  baseUrl: process.env.QWEN_BASE_URL,
  timeout: 30000,
  maxRetries: 3
});
```

### Personalización de Prompts
Los prompts pueden ser personalizados editando directamente el `qwenClient.js`:

- **Pixel**: Prompts técnicos para QA y debugging
- **Nova**: Prompts de marketing y contenido social
- **Clone**: Prompts de procesamiento de audio
- **Ghost**: Prompts de análisis musical

### Rate Limiting
```javascript
// Configuración en backend/server.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
});
```

## 🧪 Testing

```bash
# Tests completos
npm test

# Tests individuales
npm run test:backend
npm run test:web-classic
npm run test:nexus-visual
```

## 📊 Monitoreo

### Health Checks
```bash
# Verificar estado del servicio Qwen
npm run qwen:health

# Ver configuración y estado
npm run qwen:status
```

### Logs
Los logs se muestran en consola con formato estructurado:
- **Backend**: Morgan logging con formato 'combined'
- **Qwen API**: Logs de requests/responses
- **Errores**: Stack traces completos en desarrollo

## 🚀 Deploy

### Backend
```bash
# Build para producción
npm run build:backend

# Variables de entorno para producción
NODE_ENV=production
QWEN_API_KEY=tu_api_key_produccion
PORT=3001
REQUIRE_AUTH=true
```

### Frontend
```bash
# Build de aplicaciones
npm run build:web-classic
npm run build:nexus-visual

# Deploy a Vercel/Netlify
# Configurar REACT_APP_API_URL para apuntar al backend
```

## 🤝 Contribución

1. Fork el repositorio
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/super-son1k/issues)
- **Documentación**: Este README
- **API Docs**: Endpoints documentados arriba
- **Ejemplos**: Ver componentes UI para implementación

---

**¡Super-Son1k con Qwen AI - Potenciando la creatividad con inteligencia artificial! 🚀✨**