/**
 * useAnimations Hook - Sistema de animaciones avanzado
 * Super-Son1k Web Classic
 */

import { useState, useEffect, useCallback } from 'react';

const useAnimations = () => {
  const [isVisible, setIsVisible] = useState({});
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Verificar si las animaciones están habilitadas
  useEffect(() => {
    const animationsEnabled = localStorage.getItem('super-son1k-animations') !== 'false';
    setAnimationsEnabled(animationsEnabled);
    document.documentElement.style.setProperty('--animations-enabled', animationsEnabled ? '1' : '0');
  }, []);

  // Intersection Observer para animaciones de entrada
  const observeElement = useCallback((element, animationType = 'fadeInUp') => {
    if (!element || !animationsEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [animationsEnabled]);

  // Animaciones predefinidas
  const animations = {
    fadeInUp: {
      initial: { opacity: 0, transform: 'translateY(20px)' },
      animate: { opacity: 1, transform: 'translateY(0)' },
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    fadeInLeft: {
      initial: { opacity: 0, transform: 'translateX(-20px)' },
      animate: { opacity: 1, transform: 'translateX(0)' },
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    fadeInRight: {
      initial: { opacity: 0, transform: 'translateX(20px)' },
      animate: { opacity: 1, transform: 'translateX(0)' },
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    scaleIn: {
      initial: { opacity: 0, transform: 'scale(0.9)' },
      animate: { opacity: 1, transform: 'scale(1)' },
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    slideInDown: {
      initial: { opacity: 0, transform: 'translateY(-20px)' },
      animate: { opacity: 1, transform: 'translateY(0)' },
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    bounceIn: {
      initial: { opacity: 0, transform: 'scale(0.3)' },
      animate: { opacity: 1, transform: 'scale(1)' },
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    rotateIn: {
      initial: { opacity: 0, transform: 'rotate(-180deg)' },
      animate: { opacity: 1, transform: 'rotate(0deg)' },
      transition: { duration: 0.8, ease: 'easeOut' }
    },
    flipIn: {
      initial: { opacity: 0, transform: 'rotateY(-90deg)' },
      animate: { opacity: 1, transform: 'rotateY(0deg)' },
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  // Obtener clase CSS para animación
  const getAnimationClass = useCallback((elementId, animationType = 'fadeInUp') => {
    if (!animationsEnabled) return '';
    
    const isElementVisible = isVisible[elementId];
    const animation = animations[animationType];
    
    if (!animation) return '';
    
    return isElementVisible ? 'animate-in' : 'animate-out';
  }, [isVisible, animationsEnabled]);

  // Crear ref con observador automático
  const createAnimatedRef = useCallback((animationType = 'fadeInUp') => {
    return (element) => {
      if (element) {
        element.id = element.id || `animated-${Date.now()}-${Math.random()}`;
        observeElement(element, animationType);
      }
    };
  }, [observeElement]);

  // Animación de escritura (typewriter)
  const typewriter = useCallback((text, speed = 50) => {
    return new Promise((resolve) => {
      let index = 0;
      const element = document.getElementById('typewriter');
      if (!element) return resolve();

      const timer = setInterval(() => {
        element.textContent = text.slice(0, index);
        index++;
        
        if (index > text.length) {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }, []);

  // Animación de progreso
  const animateProgress = useCallback((elementId, targetValue, duration = 1000) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startValue = 0;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = startValue + (targetValue - startValue) * progress;
      element.style.width = `${currentValue}%`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Animación de partículas
  const createParticles = useCallback((containerId, count = 20) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Limpiar partículas existentes
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--color-primary);
        border-radius: 50%;
        opacity: 0.6;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${2 + Math.random() * 3}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
      `;
      container.appendChild(particle);
    }
  }, []);

  // Animación de pulso
  const pulse = useCallback((elementId, scale = 1.1) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.style.animation = `pulse 0.6s ease-in-out`;
    setTimeout(() => {
      element.style.animation = '';
    }, 600);
  }, []);

  // Animación de shake
  const shake = useCallback((elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  }, []);

  // Animación de glow
  const glow = useCallback((elementId, color = 'var(--color-primary)') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const originalBoxShadow = element.style.boxShadow;
    element.style.boxShadow = `0 0 20px ${color}`;
    
    setTimeout(() => {
      element.style.boxShadow = originalBoxShadow;
    }, 1000);
  }, []);

  return {
    animationsEnabled,
    isVisible,
    observeElement,
    getAnimationClass,
    createAnimatedRef,
    typewriter,
    animateProgress,
    createParticles,
    pulse,
    shake,
    glow,
    animations
  };
};

export default useAnimations;