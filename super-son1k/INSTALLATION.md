# 🚀 Instrucciones de Instalación - Super-Son1k

## ✅ Proyecto Completado

El monorepo Super-Son1k con integración Qwen AI está completamente implementado y listo para usar.

## 📋 Checklist de Implementación Completado

### ✅ Servicios Centralizados
- [x] **qwenClient.js**: Cliente centralizado para todas las llamadas a Qwen API
- [x] **Configuración**: Variables de entorno y configuración flexible
- [x] **Retry Logic**: Sistema de reintentos automático con exponential backoff
- [x] **Error Handling**: Manejo robusto de errores y timeouts

### ✅ Backend API Completo
- [x] **Endpoints Pixel**: `/api/qwen/pixel/qwen-analyze` para QA técnico
- [x] **Endpoints Nova**: `/api/qwen/nova/qwen-copy` para generación de contenido
- [x] **Endpoints Clone**: `/api/qwen/clone/qwen-clean` para limpieza de datasets
- [x] **Endpoints Ghost**: `/api/qwen/ghost/qwen-analyze` para análisis musical
- [x] **Health Checks**: `/api/qwen/health` y `/api/qwen/status`
- [x] **Rate Limiting**: Protección contra abuso de API
- [x] **CORS**: Configuración para desarrollo y producción

### ✅ Componentes UI Completos
- [x] **Pixel Console**: Consola interactiva para análisis técnico
- [x] **Nova Post Generator**: Generador de contenido para redes sociales
- [x] **Clone Station Cleaner**: Limpiador de datasets de audio
- [x] **Ghost Studio Analyzer**: Analizador musical inteligente
- [x] **Responsive Design**: Adaptable a móviles y desktop
- [x] **Error Handling**: Manejo de errores en UI

### ✅ Integración Nexus Visual
- [x] **Nexus Interface**: Interfaz Matrix completa con gamificación
- [x] **PWA**: Progressive Web App instalable
- [x] **Easter Eggs**: Sistema de puntuación y logros
- [x] **Mini-juego**: Hacking game desbloqueable

---

## 🛠️ Instalación Paso a Paso

### 1. Prerrequisitos
```bash
# Verificar versiones
node --version  # >= 18.0.0
npm --version   # >= 8.0.0

# Obtener API Key de Qwen
# Visitar: https://api.qwen.com/
```

### 2. Instalación del Monorepo
```bash
# Clonar o navegar al directorio
cd super-son1k

# Instalar dependencias del monorepo
npm install

# Instalar dependencias de todos los módulos
npm run install:all
```

### 3. Configuración de Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp backend/.env.example backend/.env

# Editar con tu API Key
nano backend/.env
```

**Contenido mínimo de `.env`:**
```bash
QWEN_API_KEY=tu_api_key_aqui
PORT=3001
NODE_ENV=development
REQUIRE_AUTH=false
```

### 4. Verificar Instalación
```bash
# Verificar estructura del proyecto
ls -la
# Deberías ver: apps/, backend/, services/, packages/

# Verificar dependencias instaladas
ls backend/node_modules
ls apps/web-classic/node_modules
ls apps/nexus-visual/node_modules
```

---

## 🚀 Inicio Rápido

### Desarrollo (Todos los servicios)
```bash
# Iniciar todos los servicios simultáneamente
npm run dev

# Esto iniciará:
# - Backend API en http://localhost:3001
# - Web Classic en http://localhost:3000
# - Nexus Visual en http://localhost:5173
```

### Desarrollo Individual
```bash
# Solo backend
npm run dev:backend

# Solo web classic
npm run dev:web-classic

# Solo nexus visual
npm run dev:nexus-visual
```

### Verificar Servicios
```bash
# Health check del backend
curl http://localhost:3001/health

# Status de Qwen API
curl http://localhost:3001/api/qwen/status

# Verificar web classic
open http://localhost:3000

# Verificar nexus visual
open http://localhost:5173
```

---

## 🎮 Uso de las Herramientas

### 🤖 Pixel Console
1. **Acceder**: http://localhost:3000 → Tab "🤖 Pixel"
2. **Funcionalidades**:
   - Análisis de logs y debugging
   - Revisión de código técnico
   - Optimización de prompts
   - Historial de consultas
3. **Ejemplo**: Pegar logs de error y obtener análisis automático

### 📱 Nova Post Generator
1. **Acceder**: http://localhost:3000 → Tab "📱 Nova"
2. **Funcionalidades**:
   - Generación de contenido para Instagram, TikTok, Twitter, YouTube
   - Múltiples versiones automáticas
   - Hashtags contextuales
   - Metadata avanzada
3. **Ejemplo**: Ingresar descripción de producto y generar posts

### 🎤 Clone Station Cleaner
1. **Acceder**: http://localhost:3000 → Tab "🎤 Clone Station"
2. **Funcionalidades**:
   - Limpieza de transcripciones de audio
   - Optimización para entrenamiento de voz
   - Análisis de calidad de dataset
   - Exportación de datasets limpios
3. **Ejemplo**: Agregar transcripciones y obtener versión optimizada

### 🎵 Ghost Studio Analyzer
1. **Acceder**: http://localhost:3000 → Tab "🎵 Ghost Studio"
2. **Funcionalidades**:
   - Etiquetado automático de stems musicales
   - Sugerencias de progresiones de acordes
   - Análisis de género y mood
   - Recomendaciones de producción
3. **Ejemplo**: Describir track y obtener análisis completo

### 🌌 Nexus Visual Interface
1. **Acceder**: http://localhost:5173
2. **Funcionalidades**:
   - Interfaz Matrix con efectos avanzados
   - Sistema de puntuación y easter eggs
   - Mini-juego de hacking
   - PWA instalable
3. **Ejemplo**: Interactuar con íconos para ganar puntos

---

## 🔧 Configuración Avanzada

### Personalización de Prompts
```javascript
// Editar services/qwenClient.js
// Modificar prompts específicos para cada herramienta:
// - Pixel: Prompts técnicos
// - Nova: Prompts de marketing
// - Clone: Prompts de audio
// - Ghost: Prompts musicales
```

### Rate Limiting
```javascript
// backend/server.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
});
```

### CORS Configuration
```javascript
// backend/server.js
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

---

## 🧪 Testing

### Tests Automáticos
```bash
# Ejecutar todos los tests
npm test

# Tests específicos
npm run test:backend
npm run test:web-classic
npm run test:nexus-visual
```

### Tests Manuales
```bash
# Test de endpoints
curl -X POST http://localhost:3001/api/qwen/pixel/qwen-analyze \
  -H "Content-Type: application/json" \
  -d '{"input": "Error: Cannot read property of undefined", "type": "logs"}'

# Test de health
curl http://localhost:3001/api/qwen/health
```

---

## 🚀 Deploy a Producción

### Backend
```bash
# Build
npm run build:backend

# Variables de producción
NODE_ENV=production
QWEN_API_KEY=tu_api_key_produccion
PORT=3001
REQUIRE_AUTH=true
```

### Frontend
```bash
# Build
npm run build:web-classic
npm run build:nexus-visual

# Configurar REACT_APP_API_URL para producción
# Deploy a Vercel/Netlify
```

---

## 🆘 Solución de Problemas

### Error: "QWEN_API_KEY not found"
```bash
# Verificar archivo .env
cat backend/.env

# Verificar que esté en backend/
ls backend/.env
```

### Error: "Cannot connect to Qwen API"
```bash
# Verificar conectividad
curl https://api.qwen.com/v1/models

# Verificar API key
curl -H "Authorization: Bearer $QWEN_API_KEY" https://api.qwen.com/v1/models
```

### Error: "CORS policy"
```bash
# Verificar configuración CORS en backend/server.js
# Asegurar que el origen esté en ALLOWED_ORIGINS
```

### Puerto ocupado
```bash
# Cambiar puerto en backend/.env
PORT=3002

# O matar proceso en puerto 3001
lsof -ti:3001 | xargs kill -9
```

---

## 📊 Monitoreo

### Health Checks
```bash
# Backend health
curl http://localhost:3001/health

# Qwen API health
curl http://localhost:3001/api/qwen/health

# Status completo
curl http://localhost:3001/api/qwen/status
```

### Logs
```bash
# Ver logs del backend
cd backend && npm run dev

# Logs estructurados con Morgan
# Formato: combined (IP, método, URL, status, tiempo)
```

---

## 🎉 ¡Instalación Completada!

### ✅ Verificación Final
- [ ] Backend corriendo en http://localhost:3001
- [ ] Web Classic corriendo en http://localhost:3000
- [ ] Nexus Visual corriendo en http://localhost:5173
- [ ] Health checks respondiendo correctamente
- [ ] Qwen API conectada y funcionando
- [ ] Todos los componentes UI cargando sin errores

### 🚀 Próximos Pasos
1. **Probar todas las herramientas**: Pixel, Nova, Clone Station, Ghost Studio
2. **Personalizar prompts**: Adaptar a tus necesidades específicas
3. **Configurar producción**: Deploy a servidor de producción
4. **Monitorear uso**: Implementar analytics y métricas
5. **Expandir funcionalidades**: Agregar nuevas integraciones

---

**¡Super-Son1k con Qwen AI está listo para potenciar tu creatividad! 🚀✨**