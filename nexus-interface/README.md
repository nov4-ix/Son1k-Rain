# 🌌 NEXUS Interface

Una interfaz futurista inspirada en Matrix con efectos visuales avanzados, sonidos inmersivos y configuración en tiempo real.

## ✨ Características Principales

### 🎨 Efectos Visuales
- **Lluvia Matrix**: Caída de caracteres con transición de opacidad a los 5s
- **Aro Glitch**: Círculo morado con múltiples efectos de glitch TV
- **Halo Dinámico**: Resplandor que pulsa como heartbeat de energía
- **Barras Glitch**: Interferencia horizontal tipo TV vieja
- **Animación de Entrada**: Fade-in glitchado al cargar
- **Efectos Ghost**: Duplicación intermitente cada 8s

### 🎛️ Interacciones
- **Hover Avanzado**: Rotación, vibración y partículas en íconos
- **Botón Secreto**: ⚡ para activar modo alterno
- **Sonidos Inmersivos**: Audio de activación, glitch y hover
- **Atajos de Teclado**: Ctrl+A, Espacio, Escape

### 🌀 Experiencia Narrativa
- **Micro-texto**: "NEXUS sincronizado" tras 5s
- **Easter Eggs**: 20 mensajes Matrix ocultos en la lluvia
- **Flash de Glitch**: Reinicio visual cada 15s
- **Modos Demo**: Matrix, Cyberpunk, Minimal, Neon

### ⚡ Optimizaciones
- **GPU Accelerated**: will-change, transform3D, backface-visibility
- **Configuración JSON**: Todos los efectos ajustables
- **Panel en Tiempo Real**: Cambios instantáneos sin recarga
- **Rendimiento Optimizado**: requestAnimationFrame, acumuladores

## 🚀 Instalación y Uso

```bash
# Clonar e instalar
git clone <repo>
cd nexus-interface
npm install

# Servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 🎮 Controles

### Panel de Configuración (⚙️)
- **Colores**: Paleta completa en tiempo real
- **Aro**: Tamaño (200-400px)
- **Íconos**: Tamaño y fuente
- **Barras Glitch**: Opacidad
- **Animaciones**: Delays configurables
- **Modos Demo**: Predefinidos con un clic

### Atajos de Teclado
- **Ctrl/Cmd + A**: Modo alterno
- **Espacio**: Flash manual
- **Escape**: Resetear modo

### Botones Especiales
- **⚙️** (esquina superior izquierda): Panel configuración
- **⚡** (esquina superior derecha): Modo alterno

## 🎨 Modos Demo

| Modo | Colores | Estilo |
|------|---------|--------|
| **Matrix** | Verde/Rojo | Clásico Matrix |
| **Cyberpunk** | Magenta/Cian | Futurista |
| **Minimal** | Blanco/Gris | Minimalista |
| **Neon** | Cian/Rosa | Neón brillante |

## 🔧 Configuración Avanzada

### Archivo JSON (nexus-config.json)
```json
{
  "colors": {
    "background": "#0A0C10",
    "cyan": "#00FFE7",
    "magenta": "#B84DFF",
    "dim": "#9AF7EE"
  },
  "matrixRain": {
    "settleAfterMs": 5000,
    "transitionMs": 1000,
    "trailCalm": 0.06,
    "glyphAlphaCalm": 0.65
  },
  "animations": {
    "microTextDelay": 5000,
    "glitchFlashInterval": 15000,
    "easterEggChance": 0.01
  }
}
```

### Variables CSS Dinámicas
```css
:root {
  --ring-size: 300px;
  --icon-size: 40px;
  --glitch-lines-opacity: 0.23;
}
```

## 📁 Estructura del Proyecto

```
nexus-interface/
├── src/
│   ├── components/
│   │   ├── MatrixRain.jsx    # Lluvia Matrix + easter eggs
│   │   ├── NexusScene.jsx     # Aro + efectos + sonidos
│   │   └── ConfigPanel.jsx    # Panel configuración
│   ├── hooks/
│   │   └── useNexusConfig.js  # Gestión configuración
│   ├── config/
│   │   └── nexus-config.json  # Configuración JSON
│   ├── App.jsx               # Componente principal
│   └── index.css             # Estilos + animaciones
├── package.json
└── README.md
```

## 🎯 Easter Eggs

### Mensajes Matrix Ocultos (1/100 frames)
- "THE MATRIX HAS YOU"
- "WAKE UP NEO"
- "FOLLOW THE WHITE RABBIT"
- "THERE IS NO SPOON"
- "RED PILL OR BLUE PILL"
- "NEXUS ACTIVATED"
- "RESISTANCE IS FUTILE"
- "ENTER THE MATRIX"
- "REALITY IS AN ILLUSION"
- "CHOOSE YOUR PATH"
- Y 10 más...

### Efectos Especiales
- Micro-texto "NEXUS sincronizado" tras 5s
- Flash de glitch cada 15s
- Sonidos de hover en íconos
- Modo alterno con inversión de colores

## 🎵 Sistema de Audio

- **Activación**: Buzz descendente + glitch secundario
- **Hover**: Sonido sutil al pasar mouse
- **Web Audio API**: Sin archivos externos
- **Volumen Configurable**: Ajustable en JSON

## 🚀 Rendimiento

- **60 FPS**: Animaciones suaves con requestAnimationFrame
- **GPU Optimizado**: will-change, transform3D
- **Memoria Eficiente**: Acumuladores por columna
- **Sin Bloqueos**: Animaciones no bloquean UI

## 🎨 Paleta de Colores

- **Fondo**: `#0A0C10` (Negro carbón)
- **Cian**: `#00FFE7` (Lluvia Matrix)
- **Magenta**: `#B84DFF` (Aro glitch)
- **Dim**: `#9AF7EE` (Subtítulos)

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Desktop, Tablet, Mobile
- **Resoluciones**: Responsive (clamp CSS)
- **Audio**: Web Audio API compatible

## 🔮 Futuras Mejoras

- [ ] Más modos demo
- [ ] Efectos de partículas avanzados
- [ ] Sistema de temas personalizados
- [ ] Exportar configuración
- [ ] Modo VR/AR
- [ ] Integración con APIs externas

---

**¡Bienvenido a la Resistencia!** 🌌✨

*NEXUS ACTIVADO - Sistema de interfaz futurista completamente funcional*