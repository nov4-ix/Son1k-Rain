import { useEffect, useRef } from 'react';
import { useNexusConfig } from '../hooks/useNexusConfig';
import { useGameScore } from '../hooks/useGameScore';

const MatrixRain = ({ 
  color = null, 
  fontSize = null, 
  stepMs = null,
  settleAfterMs = null,
  transitionMs = null,
  trailInitial = null,
  trailCalm = null,
  glyphAlphaInitial = null,
  glyphAlphaCalm = null
}) => {
  const { config } = useNexusConfig();
  const { foundEasterEgg, incrementTime } = useGameScore();
  
  // Usar configuración por defecto si no se pasan props
  const finalColor = color || config.matrixRain.color;
  const finalFontSize = fontSize || config.matrixRain.fontSize;
  const finalStepMs = stepMs || config.matrixRain.stepMs;
  const finalSettleAfterMs = settleAfterMs || config.matrixRain.settleAfterMs;
  const finalTransitionMs = transitionMs || config.matrixRain.transitionMs;
  const finalTrailInitial = trailInitial || config.matrixRain.trailInitial;
  const finalTrailCalm = trailCalm || config.matrixRain.trailCalm;
  const finalGlyphAlphaInitial = glyphAlphaInitial || config.matrixRain.glyphAlphaInitial;
  const finalGlyphAlphaCalm = glyphAlphaCalm || config.matrixRain.glyphAlphaCalm;
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const columnsRef = useRef([]);
  const startTimeRef = useRef(Date.now());
  const isSettledRef = useRef(false);

  // Caracteres Matrix
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
  
  // Mensajes ocultos (easter eggs)
  const hiddenMessages = [
    "THE MATRIX HAS YOU",
    "WAKE UP NEO",
    "FOLLOW THE WHITE RABBIT",
    "THERE IS NO SPOON",
    "RED PILL OR BLUE PILL",
    "THE ONE IS COMING",
    "AGENT SMITH APPROACHING",
    "MORPHEUS WAITS",
    "TRINITY IS NEAR",
    "NEO IS THE ONE",
    "NEXUS ACTIVATED",
    "RESISTANCE IS FUTILE",
    "ENTER THE MATRIX",
    "REALITY IS AN ILLUSION",
    "CHOOSE YOUR PATH",
    "THE SIMULATION RUNS",
    "CODE IS EVERYWHERE",
    "BREAK THE SYSTEM",
    "FIND THE EXIT",
    "YOU ARE THE ONE"
  ];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Inicializar columnas
    const columnCount = Math.floor(canvas.width / finalFontSize);
    columnsRef.current = Array.from({ length: columnCount }, (_, i) => ({
      x: i * finalFontSize,
      y: Math.random() * canvas.height,
      speed: 0.5 + Math.random() * 1.5,
      chars: Array.from({ length: Math.floor(canvas.height / finalFontSize) + 2 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ),
      charIndex: 0,
      lastUpdate: Date.now() + Math.random() * 1000 // Desincronización inicial
    }));

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      
      // Verificar si debemos hacer la transición
      if (elapsed >= finalSettleAfterMs && !isSettledRef.current) {
        isSettledRef.current = true;
      }

      // Calcular opacidades actuales
      let currentTrailAlpha = finalTrailInitial;
      let currentGlyphAlpha = finalGlyphAlphaInitial;

      if (isSettledRef.current) {
        const transitionProgress = Math.min((elapsed - finalSettleAfterMs) / finalTransitionMs, 1);
        currentTrailAlpha = finalTrailInitial + (finalTrailCalm - finalTrailInitial) * transitionProgress;
        currentGlyphAlpha = finalGlyphAlphaInitial + (finalGlyphAlphaCalm - finalGlyphAlphaInitial) * transitionProgress;
      }

      // Limpiar canvas con fondo oscuro
      ctx.fillStyle = `rgba(10, 12, 16, ${currentTrailAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar cada columna
      columnsRef.current.forEach(column => {
        if (now - column.lastUpdate >= finalStepMs) {
          column.y += column.speed;
          column.charIndex = (column.charIndex + 1) % column.chars.length;
          column.lastUpdate = now;

          // Resetear columna si sale de pantalla
          if (column.y > canvas.height + finalFontSize) {
            column.y = -finalFontSize;
            column.chars = Array.from({ length: Math.floor(canvas.height / finalFontSize) + 2 }, () => 
              chars[Math.floor(Math.random() * chars.length)]
            );
          }
        }

        // Dibujar caracteres de la columna
        ctx.font = `${finalFontSize}px monospace`;
        ctx.textAlign = 'center';
        
        // Dibujar caracteres con opacidad variable
        for (let i = 0; i < column.chars.length; i++) {
          const charY = column.y - (i * finalFontSize);
          if (charY > -finalFontSize && charY < canvas.height + finalFontSize) {
            const alpha = Math.max(0, 1 - (i / column.chars.length));
            
            // Easter egg: mostrar mensaje oculto según configuración
            if (Math.random() < config.animations.easterEggChance && i === 0) {
              const message = hiddenMessages[Math.floor(Math.random() * hiddenMessages.length)];
              ctx.fillStyle = `${finalColor}${Math.floor(alpha * currentGlyphAlpha * 255).toString(16).padStart(2, '0')}`;
              ctx.font = `${finalFontSize * 0.8}px monospace`;
              ctx.fillText(message, column.x, charY);
              ctx.font = `${finalFontSize}px monospace`;
              
              // Registrar easter egg encontrado
              foundEasterEgg(message);
            } else {
              ctx.fillStyle = `${finalColor}${Math.floor(alpha * currentGlyphAlpha * 255).toString(16).padStart(2, '0')}`;
              ctx.fillText(column.chars[(column.charIndex + i) % column.chars.length], column.x, charY);
            }
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [finalColor, finalFontSize, finalStepMs, finalSettleAfterMs, finalTransitionMs, finalTrailInitial, finalTrailCalm, finalGlyphAlphaInitial, finalGlyphAlphaCalm, config]);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-canvas"
      style={{
        background: '#0A0C10',
        mixBlendMode: 'normal'
      }}
    />
  );
};

export default MatrixRain;