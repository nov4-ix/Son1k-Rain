# NEXUS Interface - Enhanced Edition

Interfaz visual "NEXUS" avanzada con efectos Matrix Rain mejorados, glitch TV dinámico, audio ambiental y controles de rendimiento.

## ✨ Características Principales

- **Matrix Rain Avanzado**: Lluvia con caracteres katakana, efectos glitch por columna, partículas flotantes
- **Aro Morado Dinámico**: Círculo con pulso animado y efectos glitch TV mejorados
- **Barras Glitch**: Interferencia horizontal con movimiento lateral y parpadeo
- **Tipografía 8-bit**: Fuente CoinDingDong con efectos de glow mejorados
- **Íconos Interactivos**: 6 íconos con información detallada, estados y sonidos
- **Audio Ambiental**: Efectos de sonido procedurales con Web Audio API
- **Controles de Rendimiento**: Panel de configuración con monitoreo de FPS

## Paleta de Colores

```css
--bg: #0A0C10    /* Fondo oscuro */
--cyan: #00FFE7  /* Cian brillante */
--mag: #B84DFF   /* Magenta/púrpura */
--dim: #9AF7EE   /* Cian suave */
```

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── MatrixRain.jsx        # Lluvia Matrix avanzada con efectos glitch
│   ├── NexusScene.jsx        # Aro morado + íconos interactivos + textos
│   ├── AudioManager.jsx      # Gestor de audio ambiental y SFX
│   └── PerformanceControls.jsx # Controles de calidad y rendimiento
├── App.jsx                   # Componente principal con estado global
├── main.jsx                 # Punto de entrada
└── index.css                # Estilos globales y efectos avanzados
```

## Configuración Rápida

### Ajustar Intensidad de Barras Glitch
En `src/index.css`, línea ~200:
```css
.glitch-lines {
  opacity: 0.22; /* Cambiar entre 0.15-0.28 */
}
```

### Ajustar Centrado (±2%)
En `src/index.css`, líneas ~100-110:
```css
.nexus-center {
  transform: translate(-50%, -50%); /* Ajustar: translate(-48%, -52%) */
}
```

### Ajustar Opacidades Calm
En `src/components/MatrixRain.jsx`, props por defecto:
```jsx
trailCalm={0.06}        /* Opacidad fondo: 0.04-0.08 */
glyphAlphaCalm={0.65}   /* Opacidad glifos: 0.5-0.8 */
```

## 🎮 Controles y Atajos

- **Ctrl+Shift+P**: Abrir/cerrar controles de rendimiento
- **Click en íconos**: Mostrar información detallada y reproducir sonido
- **Panel de rendimiento**: Ajustar calidad, audio y animaciones en tiempo real

## 🎵 Audio Features

- **Sonido Ambiental**: Loop procedural con osciladores y filtros
- **SFX de Íconos**: Sonidos únicos por cada ícono (frecuencias musicales)
- **Efectos Matrix**: Sonidos de glitch y interferencia
- **Web Audio API**: Audio procedural sin archivos externos

## 🎨 Efectos Visuales Avanzados

1. **Matrix Rain Mejorado**: 
   - Caracteres katakana mezclados
   - Efectos glitch por columna
   - Partículas flotantes con física
   - Efectos sparkle y eco

2. **Glitch TV Dinámico**: 
   - Vibración micro-translate
   - Parpadeo irregular
   - "Borrado" por frames
   - Pulso animado del aro

3. **Íconos Interactivos**: 
   - Estados activos/inactivos
   - Información detallada
   - Colores personalizados por ícono
   - Indicadores de estado

4. **Interferencia**: 
   - Barras horizontales animadas
   - Movimiento lateral
   - Parpadeo irregular
   - Máscara radial para el centro

## ⚡ Rendimiento y Optimización

- **RequestAnimationFrame**: Animaciones fluidas sin timers densos
- **Canvas Optimizado**: Fondo oscuro consistente y renderizado eficiente
- **Controles de Calidad**: 3 niveles (Low/Medium/High) con ajustes automáticos
- **Monitoreo FPS**: Indicador en tiempo real con códigos de color
- **Efectos CSS**: `mix-blend-mode` y `backdrop-filter` para interferencia
- **Web Audio API**: Audio procedural sin archivos externos

## 🎯 Niveles de Calidad

- **Low**: 70% densidad de columnas, 20 partículas, 30% intensidad glitch
- **Medium**: 85% densidad de columnas, 40 partículas, 50% intensidad glitch  
- **High**: 100% densidad de columnas, 60 partículas, 70% intensidad glitch

## 🔧 Configuración Avanzada

### Nuevos Parámetros MatrixRain
```jsx
<MatrixRain 
  enableGlitch={true}        // Efectos glitch por columna
  enableParticles={true}     // Partículas flotantes
  quality="high"             // Nivel de calidad
/>
```

### Audio Manager
```jsx
<AudioManager 
  enableAmbient={true}       // Sonido ambiental
  enableSFX={true}          // Efectos de sonido
  volume={0.3}              // Volumen (0-1)
/>
```

## 📱 Compatibilidad

- **Navegadores**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **APIs Requeridas**: Canvas 2D, Web Audio API, CSS Custom Properties
- **Responsive**: Adaptable a móviles y tablets
- **Accesibilidad**: Controles de teclado y indicadores visuales