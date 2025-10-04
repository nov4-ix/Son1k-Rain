import React, { useRef, useEffect } from 'react';

const MatrixRain = ({ 
  color = "#00FFE7", 
  fontSize = 18, 
  stepMs = 34,
  settleAfterMs = 5000,
  transitionMs = 1000,
  trailInitial = 0.12,
  trailCalm = 0.06,
  glyphAlphaInitial = 1.0,
  glyphAlphaCalm = 0.65
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const columnsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Caracteres Matrix
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Inicializar columnas
    const columnCount = Math.floor(canvas.width / fontSize);
    columnsRef.current = Array.from({ length: columnCount }, (_, i) => ({
      x: i * fontSize,
      y: Math.random() * canvas.height,
      chars: Array.from({ length: Math.floor(canvas.height / fontSize) + 2 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ),
      speeds: Array.from({ length: Math.floor(canvas.height / fontSize) + 2 }, () => 
        Math.random() * 0.5 + 0.5
      ),
      lastUpdate: Date.now() - Math.random() * stepMs * 10 // Desincronizar inicio
    }));

    startTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      
      // Limpiar canvas con fondo oscuro
      ctx.fillStyle = 'rgba(10, 12, 16, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calcular opacidades según tiempo transcurrido
      let trailOpacity, glyphOpacity;
      
      if (elapsed < settleAfterMs) {
        // Fase inicial - opacidades completas
        trailOpacity = trailInitial;
        glyphOpacity = glyphAlphaInitial;
      } else if (elapsed < settleAfterMs + transitionMs) {
        // Fase de transición suave
        const progress = (elapsed - settleAfterMs) / transitionMs;
        trailOpacity = trailInitial + (trailCalm - trailInitial) * progress;
        glyphOpacity = glyphAlphaInitial + (glyphAlphaCalm - glyphAlphaInitial) * progress;
      } else {
        // Fase calm - opacidades reducidas
        trailOpacity = trailCalm;
        glyphOpacity = glyphAlphaCalm;
      }

      // Dibujar fondo de la lluvia con opacidad de trail
      ctx.fillStyle = `rgba(10, 12, 16, ${trailOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Actualizar y dibujar cada columna
      columnsRef.current.forEach(column => {
        if (now - column.lastUpdate >= stepMs) {
          // Mover caracteres hacia abajo
          column.y += fontSize * 0.8;
          
          // Si la columna se sale de la pantalla, reiniciar desde arriba
          if (column.y > canvas.height + fontSize) {
            column.y = -fontSize;
            // Regenerar algunos caracteres aleatoriamente
            for (let i = 0; i < column.chars.length; i++) {
              if (Math.random() < 0.1) {
                column.chars[i] = chars[Math.floor(Math.random() * chars.length)];
              }
            }
          }
          
          column.lastUpdate = now;
        }

        // Dibujar caracteres de la columna
        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = 'center';
        
        column.chars.forEach((char, index) => {
          const y = column.y + (index * fontSize);
          
          if (y > -fontSize && y < canvas.height + fontSize) {
            // Efecto de desvanecimiento hacia arriba
            const alpha = Math.max(0, 1 - (index / column.chars.length));
            const finalAlpha = alpha * glyphOpacity;
            
            ctx.fillStyle = `${color}${Math.floor(finalAlpha * 255).toString(16).padStart(2, '0')}`;
            ctx.fillText(char, column.x + fontSize / 2, y);
          }
        });
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
  }, [color, fontSize, stepMs, settleAfterMs, transitionMs, trailInitial, trailCalm, glyphAlphaInitial, glyphAlphaCalm]);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        background: '#0A0C10',
        mixBlendMode: 'normal'
      }}
    />
  );
};

export default MatrixRain;