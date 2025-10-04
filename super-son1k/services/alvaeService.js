/**
 * ALVAE Service - Servicio para el símbolo más exclusivo de la plataforma
 * Super-Son1k Monorepo
 */

class AlvaeService {
  constructor() {
    this.alvaeMembers = new Map();
    this.alvaeCriteria = {
      // Solo los verdaderos founders pueden tener ALVAE
      founder: {
        required: true,
        description: 'Miembro fundador original'
      },
      // Criterios adicionales para mantener la exclusividad
      contributions: {
        minGenerations: 1000,
        minTracks: 500,
        minCommunityHelp: 50,
        description: 'Contribuciones significativas a la plataforma'
      },
      // Solo los más activos y valiosos
      activity: {
        minDaysActive: 30,
        minConsecutiveDays: 7,
        description: 'Actividad constante y comprometida'
      },
      // Solo los que realmente aportan valor
      impact: {
        minLikesReceived: 1000,
        minSharesReceived: 500,
        minDownloadsReceived: 200,
        description: 'Impacto real en la comunidad'
      }
    };
    
    this.initializeAlvaeMembers();
  }

  /**
   * Inicializar miembros ALVAE (solo los verdaderos founders)
   */
  initializeAlvaeMembers() {
    // Solo los founders originales tienen ALVAE por defecto
    const alvaeFounders = [
      {
        userId: 'nov4-ix',
        email: 'nov4-ix@sonikvers3.com',
        nickname: 'Nova IX',
        role: 'admin',
        alvaeLevel: 'GRAND_MASTER',
        alvaeTitle: 'Architect of Silence',
        alvaeDescription: 'Creator of the universe where music never stops',
        alvaeColor: '#FFD700', // Oro puro
        alvaeGlow: '#FFA500',  // Oro brillante
        alvaeSymbol: '👑',     // Corona dorada
        grantedAt: '2024-01-01T00:00:00Z',
        grantedBy: 'SYSTEM',
        isPermanent: true
      },
      {
        userId: 'josue-enterprise',
        email: 'pro.enterprise@son1kvers3.com',
        nickname: 'Josué Enterprise',
        role: 'enterprise',
        alvaeLevel: 'MASTER',
        alvaeTitle: 'Silence Breaker',
        alvaeDescription: 'Co-architect of the musical revolution',
        alvaeColor: '#8B5CF6', // Púrpura real
        alvaeGlow: '#A855F7',  // Púrpura brillante
        alvaeSymbol: '🏢',     // Edificio empresarial
        grantedAt: '2024-01-01T00:00:00Z',
        grantedBy: 'SYSTEM',
        isPermanent: true
      }
    ];

    // Los testers NO tienen ALVAE por defecto - deben ganárselo
    alvaeFounders.forEach(member => {
      this.alvaeMembers.set(member.userId, member);
    });

    console.log(`✨ ALVAE Service initialized with ${this.alvaeMembers.size} exclusive members`);
  }

  /**
   * Verificar si un usuario tiene ALVAE
   */
  hasAlvae(userId) {
    return this.alvaeMembers.has(userId);
  }

  /**
   * Obtener información ALVAE de un usuario
   */
  getAlvaeInfo(userId) {
    return this.alvaeMembers.get(userId) || null;
  }

  /**
   * Evaluar si un usuario puede obtener ALVAE
   */
  evaluateAlvaeEligibility(userId, userStats) {
    const evaluation = {
      eligible: false,
      score: 0,
      maxScore: 100,
      criteria: {},
      recommendations: []
    };

    // Criterio 1: Debe ser founder (requisito absoluto)
    if (!userStats.isFounder) {
      evaluation.criteria.founder = {
        passed: false,
        message: 'Solo los miembros fundadores pueden obtener ALVAE',
        weight: 40
      };
      evaluation.recommendations.push('Conviértete en miembro fundador');
      return evaluation;
    }

    evaluation.criteria.founder = {
      passed: true,
      message: 'Miembro fundador confirmado',
      weight: 40,
      score: 40
    };
    evaluation.score += 40;

    // Criterio 2: Contribuciones significativas
    const contributions = userStats.stats || {};
    const contributionScore = Math.min(
      (contributions.totalGenerations || 0) / 10 +
      (contributions.totalTracks || 0) / 5 +
      (contributions.totalPlays || 0) / 100,
      30
    );

    evaluation.criteria.contributions = {
      passed: contributionScore >= 20,
      score: contributionScore,
      weight: 30,
      message: `Contribuciones: ${contributions.totalGenerations || 0} generaciones, ${contributions.totalTracks || 0} tracks`,
      details: {
        generations: contributions.totalGenerations || 0,
        tracks: contributions.totalTracks || 0,
        plays: contributions.totalPlays || 0
      }
    };
    evaluation.score += contributionScore;

    // Criterio 3: Impacto en la comunidad
    const impactScore = Math.min(
      ((contributions.totalLikes || 0) / 100) +
      ((contributions.totalShares || 0) / 50) +
      ((contributions.totalDownloads || 0) / 20),
      20
    );

    evaluation.criteria.impact = {
      passed: impactScore >= 15,
      score: impactScore,
      weight: 20,
      message: `Impacto: ${contributions.totalLikes || 0} likes, ${contributions.totalShares || 0} shares`,
      details: {
        likes: contributions.totalLikes || 0,
        shares: contributions.totalShares || 0,
        downloads: contributions.totalDownloads || 0
      }
    };
    evaluation.score += impactScore;

    // Criterio 4: Actividad constante
    const activityScore = Math.min(
      (userStats.daysActive || 0) / 2 +
      (userStats.consecutiveDays || 0) / 2,
      10
    );

    evaluation.criteria.activity = {
      passed: activityScore >= 7,
      score: activityScore,
      weight: 10,
      message: `Actividad: ${userStats.daysActive || 0} días activo, ${userStats.consecutiveDays || 0} días consecutivos`,
      details: {
        daysActive: userStats.daysActive || 0,
        consecutiveDays: userStats.consecutiveDays || 0
      }
    };
    evaluation.score += activityScore;

    // Evaluación final
    evaluation.eligible = evaluation.score >= 80;

    if (!evaluation.eligible) {
      const neededScore = 80 - evaluation.score;
      evaluation.recommendations.push(`Necesitas ${neededScore} puntos más para obtener ALVAE`);
      
      if (contributionScore < 20) {
        evaluation.recommendations.push('Genera más música y tracks para aumentar tu contribución');
      }
      if (impactScore < 15) {
        evaluation.recommendations.push('Crea contenido que inspire más likes y shares');
      }
      if (activityScore < 7) {
        evaluation.recommendations.push('Mantén una actividad constante en la plataforma');
      }
    }

    return evaluation;
  }

  /**
   * Otorgar ALVAE a un usuario (solo por administradores)
   */
  grantAlvae(userId, userData, grantedBy, reason) {
    if (!this.hasAlvae(userId)) {
      const alvaeInfo = {
        userId,
        email: userData.email,
        nickname: userData.nickname,
        role: userData.role,
        alvaeLevel: 'MEMBER',
        alvaeTitle: 'Silence Warrior',
        alvaeDescription: 'Proven worthy of the ALVAE symbol',
        alvaeColor: '#10B981', // Verde esmeralda
        alvaeGlow: '#059669',  // Verde brillante
        alvaeSymbol: '✨',     // Estrella dorada
        grantedAt: new Date().toISOString(),
        grantedBy,
        reason,
        isPermanent: false
      };

      this.alvaeMembers.set(userId, alvaeInfo);
      
      console.log(`✨ ALVAE granted to ${userData.nickname} by ${grantedBy}`);
      return alvaeInfo;
    }
    
    return null;
  }

  /**
   * Revocar ALVAE (solo en casos extremos)
   */
  revokeAlvae(userId, revokedBy, reason) {
    const alvaeInfo = this.alvaeMembers.get(userId);
    
    if (alvaeInfo && !alvaeInfo.isPermanent) {
      this.alvaeMembers.delete(userId);
      console.log(`❌ ALVAE revoked from ${alvaeInfo.nickname} by ${revokedBy}: ${reason}`);
      return true;
    }
    
    return false;
  }

  /**
   * Obtener todos los miembros ALVAE
   */
  getAllAlvaeMembers() {
    return Array.from(this.alvaeMembers.values()).sort((a, b) => {
      // Ordenar por nivel ALVAE y fecha de otorgamiento
      const levelOrder = { 'GRAND_MASTER': 3, 'MASTER': 2, 'MEMBER': 1 };
      const levelDiff = levelOrder[b.alvaeLevel] - levelOrder[a.alvaeLevel];
      if (levelDiff !== 0) return levelDiff;
      return new Date(a.grantedAt) - new Date(b.grantedAt);
    });
  }

  /**
   * Obtener estadísticas ALVAE
   */
  getAlvaeStats() {
    const members = Array.from(this.alvaeMembers.values());
    
    return {
      totalMembers: members.length,
      byLevel: {
        grandMaster: members.filter(m => m.alvaeLevel === 'GRAND_MASTER').length,
        master: members.filter(m => m.alvaeLevel === 'MASTER').length,
        member: members.filter(m => m.alvaeLevel === 'MEMBER').length
      },
      byRole: {
        admin: members.filter(m => m.role === 'admin').length,
        enterprise: members.filter(m => m.role === 'enterprise').length,
        pro: members.filter(m => m.role === 'pro').length,
        premium: members.filter(m => m.role === 'premium').length
      },
      permanent: members.filter(m => m.isPermanent).length,
      earned: members.filter(m => !m.isPermanent).length,
      lastGranted: members.length > 0 ? 
        members.sort((a, b) => new Date(b.grantedAt) - new Date(a.grantedAt))[0].grantedAt : null
    };
  }

  /**
   * Verificar si un usuario puede otorgar ALVAE
   */
  canGrantAlvae(userId) {
    const user = this.alvaeMembers.get(userId);
    return user && (user.alvaeLevel === 'GRAND_MASTER' || user.role === 'admin');
  }

  /**
   * Obtener el símbolo ALVAE para mostrar
   */
  getAlvaeSymbol(userId) {
    const alvaeInfo = this.alvaeMembers.get(userId);
    if (!alvaeInfo) return null;

    return {
      symbol: alvaeInfo.alvaeSymbol,
      color: alvaeInfo.alvaeColor,
      glow: alvaeInfo.alvaeGlow,
      title: alvaeInfo.alvaeTitle,
      level: alvaeInfo.alvaeLevel,
      description: alvaeInfo.alvaeDescription
    };
  }

  /**
   * Generar mensaje de motivación para obtener ALVAE
   */
  getMotivationMessage(userId, evaluation) {
    if (evaluation.eligible) {
      return {
        type: 'success',
        title: '🎉 ¡Eres elegible para ALVAE!',
        message: 'Has demostrado ser digno del símbolo más exclusivo de la plataforma.',
        action: 'Contacta a un administrador para recibir tu ALVAE'
      };
    }

    const messages = [
      {
        type: 'info',
        title: '✨ El símbolo ALVAE te espera',
        message: 'Solo los miembros más valiosos de la comunidad pueden obtener este símbolo exclusivo.',
        action: 'Continúa contribuyendo para acercarte a tu objetivo'
      },
      {
        type: 'warning',
        title: '🏆 Camino hacia ALVAE',
        message: 'El símbolo ALVAE es el santo grial de Super-Son1k. Pocos lo logran.',
        action: 'Mantén la excelencia y la constancia'
      },
      {
        type: 'motivation',
        title: '🚀 Rompe el silencio',
        message: 'Cada generación, cada track, cada like cuenta para tu camino hacia ALVAE.',
        action: 'La música nunca se detiene para los verdaderos warriors'
      }
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }
}

// Singleton instance
const alvaeService = new AlvaeService();

module.exports = alvaeService;