/**
 * Subscription Plans - Componente de planes de suscripción
 * Super-Son1k Web Classic
 */

import React, { useState } from 'react';
import useTheme from '../hooks/useTheme';
import useAnimations from '../hooks/useAnimations';
import './SubscriptionPlans.css';

const SubscriptionPlans = ({ currentPlan = 'free', onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { theme } = useTheme();
  const { 
    createAnimatedRef, 
    getAnimationClass, 
    pulse, 
    glow,
    createParticles 
  } = useAnimations();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: '🆓',
      price: '$0',
      period: '/mes',
      description: 'Perfecto para empezar',
      color: '#6b7280',
      features: [
        '🎵 Generación básica de música',
        '📝 Generación de letras',
        '🎤 5 generaciones por día',
        '📥 Descarga de tracks',
        '📤 Compartir contenido',
        '👥 Acceso a comunidad',
        '📊 Analytics básicos',
        '💾 0.5GB de almacenamiento'
      ],
      limits: {
        generationsPerDay: 5,
        tracksPerDay: 3,
        apiCallsPerHour: 50,
        storageGB: 0.5
      },
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: '⭐',
      price: '$19',
      period: '/mes',
      description: 'Para creadores serios',
      color: '#f59e0b',
      features: [
        '🎵 Generación avanzada de música',
        '📝 Generación de letras con IA',
        '🎤 50 generaciones por día',
        '🎨 Estilos personalizados',
        '📊 Analytics mejorados',
        '👥 Colaboración en equipo',
        '⚡ Cola de prioridad',
        '📥 Exportación mejorada',
        '💾 5GB de almacenamiento',
        '🎯 Soporte prioritario'
      ],
      limits: {
        generationsPerDay: 50,
        tracksPerDay: 25,
        apiCallsPerHour: 500,
        storageGB: 5
      },
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: '🚀',
      price: '$49',
      period: '/mes',
      description: 'Para profesionales',
      color: '#3b82f6',
      features: [
        '🎵 Generación ilimitada de música',
        '📝 Generación de letras con IA',
        '🎤 Covers con SunoAPI',
        '🎨 Estilos personalizados',
        '📊 Analytics avanzados',
        '👥 Colaboración en equipo',
        '⚡ Cola de prioridad',
        '📥 Exportación avanzada',
        '🔌 Acceso a API',
        '💾 25GB de almacenamiento',
        '🎯 Soporte prioritario',
        '📈 Dashboard de métricas',
        '🎵 Top Tracks integrado'
      ],
      limits: {
        generationsPerDay: 200,
        tracksPerDay: 100,
        apiCallsPerHour: 2000,
        storageGB: 25
      },
      popular: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: '🏢',
      price: 'Custom',
      period: '',
      description: 'Para empresas',
      color: '#8b5cf6',
      features: [
        '🎵 Generación ilimitada',
        '📝 IA avanzada para letras',
        '🎤 Covers profesionales',
        '🎨 Estilos personalizados',
        '📊 Analytics empresariales',
        '👥 Colaboración ilimitada',
        '⚡ Procesamiento prioritario',
        '📥 Exportación empresarial',
        '🔌 API completa',
        '💾 Almacenamiento ilimitado',
        '🎯 Soporte dedicado',
        '📈 Dashboard completo',
        '🎵 Top Tracks premium',
        '🏷️ White label',
        '🔧 Integraciones personalizadas',
        '📋 SLA garantizado',
        '🚀 Despliegue personalizado'
      ],
      limits: {
        generationsPerDay: -1, // Ilimitado
        tracksPerDay: -1,
        apiCallsPerHour: -1,
        storageGB: -1
      },
      popular: false
    }
  ];

  const handleUpgrade = async (planId) => {
    setIsLoading(true);
    setSelectedPlan(planId);
    
    try {
      // Simular proceso de upgrade
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onUpgrade) {
        onUpgrade(planId);
      }
      
      pulse('upgrade-success');
      createParticles('upgrade-particles', 20);
      
    } catch (error) {
      console.error('Error upgrading plan:', error);
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const getPlanIcon = (planId) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.icon : '🎵';
  };

  const getPlanColor = (planId) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.color : '#6b7280';
  };

  return (
    <div className="subscription-plans" id="subscription-plans">
      <div className="particles-container" id="upgrade-particles"></div>
      
      {/* Header */}
      <div 
        className={`plans-header ${getAnimationClass('plans-header', 'fadeInDown')}`}
        ref={createAnimatedRef('fadeInDown')}
      >
        <h2>🚀 Planes de Suscripción</h2>
        <p>Elige el plan perfecto para tu creatividad musical</p>
        <div className="current-plan">
          <span className="current-plan-label">Plan actual:</span>
          <span 
            className="current-plan-name"
            style={{ color: getPlanColor(currentPlan) }}
          >
            {getPlanIcon(currentPlan)} {plans.find(p => p.id === currentPlan)?.name || 'Free'}
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      <div 
        className={`plans-grid ${getAnimationClass('plans-grid', 'fadeInUp')}`}
        ref={createAnimatedRef('fadeInUp')}
      >
        {plans.map((plan, index) => (
          <div 
            key={plan.id}
            className={`plan-card ${plan.popular ? 'popular' : ''} ${currentPlan === plan.id ? 'current' : ''} ${getAnimationClass(`plan-card-${index}`, 'scaleIn')}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {plan.popular && (
              <div className="popular-badge">
                ⭐ Más Popular
              </div>
            )}
            
            {currentPlan === plan.id && (
              <div className="current-badge">
                ✅ Plan Actual
              </div>
            )}

            <div className="plan-header">
              <div className="plan-icon" style={{ color: plan.color }}>
                {plan.icon}
              </div>
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>
            </div>

            <div className="plan-pricing">
              <div className="price">
                <span className="price-amount">{plan.price}</span>
                <span className="price-period">{plan.period}</span>
              </div>
            </div>

            <div className="plan-features">
              <h4>✨ Características</h4>
              <ul className="features-list">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="feature-item">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="plan-limits">
              <h4>📊 Límites</h4>
              <div className="limits-grid">
                <div className="limit-item">
                  <span className="limit-label">Generaciones/día:</span>
                  <span className="limit-value">
                    {plan.limits.generationsPerDay === -1 ? '∞' : plan.limits.generationsPerDay}
                  </span>
                </div>
                <div className="limit-item">
                  <span className="limit-label">Tracks/día:</span>
                  <span className="limit-value">
                    {plan.limits.tracksPerDay === -1 ? '∞' : plan.limits.tracksPerDay}
                  </span>
                </div>
                <div className="limit-item">
                  <span className="limit-label">API calls/hora:</span>
                  <span className="limit-value">
                    {plan.limits.apiCallsPerHour === -1 ? '∞' : plan.limits.apiCallsPerHour}
                  </span>
                </div>
                <div className="limit-item">
                  <span className="limit-label">Almacenamiento:</span>
                  <span className="limit-value">
                    {plan.limits.storageGB === -1 ? '∞' : `${plan.limits.storageGB}GB`}
                  </span>
                </div>
              </div>
            </div>

            <div className="plan-actions">
              {currentPlan === plan.id ? (
                <button className="current-plan-btn" disabled>
                  ✅ Plan Actual
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isLoading && selectedPlan === plan.id}
                  className={`upgrade-btn ${isLoading && selectedPlan === plan.id ? 'loading' : ''}`}
                  style={{ backgroundColor: plan.color }}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <>
                      <span className="loading-spinner"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      🚀 {plan.id === 'enterprise' ? 'Contactar' : 'Upgrade'}
                      <span className="btn-glow"></span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tools Comparison */}
      <div 
        className={`tools-comparison ${getAnimationClass('tools-comparison', 'fadeInUp')}`}
        ref={createAnimatedRef('fadeInUp')}
      >
        <h3>🛠️ Herramientas Incluidas</h3>
        <div className="comparison-table">
          <div className="comparison-header">
            <div className="tool-column">Herramienta</div>
            <div className="plan-column">Free</div>
            <div className="plan-column">Premium</div>
            <div className="plan-column">Pro</div>
            <div className="plan-column">Enterprise</div>
          </div>
          
          <div className="comparison-row">
            <div className="tool-column">🎵 The Generator</div>
            <div className="plan-column">✅ Básico</div>
            <div className="plan-column">✅ Avanzado</div>
            <div className="plan-column">✅ Completo</div>
            <div className="plan-column">✅ Ilimitado</div>
          </div>
          
          <div className="comparison-row">
            <div className="tool-column">🤖 Pixel Console</div>
            <div className="plan-column">❌</div>
            <div className="plan-column">✅</div>
            <div className="plan-column">✅</div>
            <div className="plan-column">✅</div>
          </div>
          
          <div className="comparison-row">
            <div className="tool-column">📱 Nova Post Pilot</div>
            <div className="plan-column">❌</div>
            <div className="plan-column">✅</div>
            <div className="plan-column">✅</div>
            <div className="plan-column">✅</div>
          </div>
          
          <div className="comparison-row">
            <div className="tool-column">🎤 Clone Station</div>
            <div className="plan-column">❌</div>
            <div className="plan-column">✅</div>
            <div className="plan-column">✅</div>
            <div className="plan-column">✅</div>
          </div>
          
          <div className="comparison-row">
            <div className="tool-column">🎵 Ghost Studio</div>
            <div className="plan-column">❌</div>
            <div className="plan-column">✅</div>
            <div className="plan-column">✅</div>
            <div className="plan-column">✅</div>
          </div>
          
          <div className="comparison-row">
            <div className="tool-column">📊 Dashboard</div>
            <div className="plan-column">❌</div>
            <div className="plan-column">✅</div>
            <div className="plan-column">✅</div>
            <div className="plan-column">✅</div>
          </div>
          
          <div className="comparison-row">
            <div className="tool-column">🎵 Top Tracks</div>
            <div className="plan-column">✅ Básico</div>
            <div className="plan-column">✅ Completo</div>
            <div className="plan-column">✅ Premium</div>
            <div className="plan-column">✅ Enterprise</div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div 
        className={`faq-section ${getAnimationClass('faq-section', 'fadeInUp')}`}
        ref={createAnimatedRef('fadeInUp')}
      >
        <h3>❓ Preguntas Frecuentes</h3>
        <div className="faq-list">
          <div className="faq-item">
            <h4>¿Puedo cambiar de plan en cualquier momento?</h4>
            <p>Sí, puedes cambiar de plan en cualquier momento. Los cambios se aplicarán inmediatamente y se prorrateará el costo.</p>
          </div>
          <div className="faq-item">
            <h4>¿Qué pasa si excedo mis límites?</h4>
            <p>Si excedes tus límites, podrás continuar usando las herramientas básicas. Te notificaremos cuando te acerques a tus límites.</p>
          </div>
          <div className="faq-item">
            <h4>¿Los tracks generados son míos?</h4>
            <p>Sí, todos los tracks que generes son completamente tuyos. Puedes usarlos comercialmente sin restricciones.</p>
          </div>
          <div className="faq-item">
            <h4>¿Hay descuentos anuales?</h4>
            <p>Sí, ofrecemos descuentos del 20% en planes anuales. Contacta con nuestro equipo para más información.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;