# NEXUS Interface

Interfaz visual "NEXUS" con efectos Matrix Rain, glitch TV y tipografía 8-bit.

## Características

- **Matrix Rain**: Lluvia de caracteres cian con transición de opacidad a los 5 segundos
- **Aro Morado**: Círculo único con efectos glitch tipo TV vieja
- **Barras Glitch**: Interferencia horizontal que se mueve lateralmente
- **Tipografía 8-bit**: Fuente CoinDingDong para títulos y subtítulos
- **Íconos Neon**: 6 íconos alrededor del aro con hover sutil

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
│   ├── MatrixRain.jsx    # Lluvia Matrix con transición de opacidad
│   └── NexusScene.jsx    # Aro morado + íconos + textos
├── App.jsx               # Componente principal
├── main.jsx             # Punto de entrada
└── index.css            # Estilos globales y efectos glitch
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

## Efectos Implementados

1. **Matrix Rain**: Caída desincronizada por columnas
2. **Glitch TV**: Vibración, parpadeo y "borrado" por frames
3. **Interferencia**: Barras horizontales con movimiento lateral
4. **Transición**: Suavización de opacidades a los 5 segundos
5. **Hover**: Glow cian sutil en íconos

## Rendimiento

- Usa `requestAnimationFrame` para animaciones fluidas
- Sin timers densos, solo acumuladores por columna
- Canvas optimizado con fondo oscuro consistente
- Efectos CSS con `mix-blend-mode` para interferencia

## Compatibilidad

- Navegadores modernos con soporte para CSS Grid/Flexbox
- Canvas 2D API
- CSS Custom Properties (variables)
- Responsive design para móviles