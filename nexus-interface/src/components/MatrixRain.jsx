import { useEffect, useRef } from 'react';

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
  const columnsRef = useRef([]);
  const startTimeRef = useRef(Date.now());
  const isSettledRef = useRef(false);

  // Caracteres Matrix
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
  
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
    const columnCount = Math.floor(canvas.width / fontSize);
    columnsRef.current = Array.from({ length: columnCount }, (_, i) => ({
      x: i * fontSize,
      y: Math.random() * canvas.height,
      speed: 0.5 + Math.random() * 1.5,
      chars: Array.from({ length: Math.floor(canvas.height / fontSize) + 2 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ),
      charIndex: 0,
      lastUpdate: Date.now() + Math.random() * 1000 // Desincronización inicial
    }));

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      
      // Verificar si debemos hacer la transición
      if (elapsed >= settleAfterMs && !isSettledRef.current) {
        isSettledRef.current = true;
      }

      // Calcular opacidades actuales
      let currentTrailAlpha = trailInitial;
      let currentGlyphAlpha = glyphAlphaInitial;

      if (isSettledRef.current) {
        const transitionProgress = Math.min((elapsed - settleAfterMs) / transitionMs, 1);
        currentTrailAlpha = trailInitial + (trailCalm - trailInitial) * transitionProgress;
        currentGlyphAlpha = glyphAlphaInitial + (glyphAlphaCalm - glyphAlphaInitial) * transitionProgress;
      }

      // Limpiar canvas con fondo oscuro
      ctx.fillStyle = `rgba(10, 12, 16, ${currentTrailAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar cada columna
      columnsRef.current.forEach(column => {
        if (now - column.lastUpdate >= stepMs) {
          column.y += column.speed;
          column.charIndex = (column.charIndex + 1) % column.chars.length;
          column.lastUpdate = now;

          // Resetear columna si sale de pantalla
          if (column.y > canvas.height + fontSize) {
            column.y = -fontSize;
            column.chars = Array.from({ length: Math.floor(canvas.height / fontSize) + 2 }, () => 
              chars[Math.floor(Math.random() * chars.length)]
            );
          }
        }

        // Dibujar caracteres de la columna
        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = 'center';
        
        // Dibujar caracteres con opacidad variable
        for (let i = 0; i < column.chars.length; i++) {
          const charY = column.y - (i * fontSize);
          if (charY > -fontSize && charY < canvas.height + fontSize) {
            const alpha = Math.max(0, 1 - (i / column.chars.length));
            ctx.fillStyle = `${color}${Math.floor(alpha * currentGlyphAlpha * 255).toString(16).padStart(2, '0')}`;
            ctx.fillText(column.chars[(column.charIndex + i) % column.chars.length], column.x, charY);
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
  }, [color, fontSize, stepMs, settleAfterMs, transitionMs, trailInitial, trailCalm, glyphAlphaInitial, glyphAlphaCalm]);

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