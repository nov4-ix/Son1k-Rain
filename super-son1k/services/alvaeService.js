/**
 * ALVAE Service - Servicio para el emblema espiritual de la Resistencia Sonora
 * Super-Son1k Monorepo
 * 
 * ALVAE = La Vibración del Alma Viva
 * A = Anima (el alma, la chispa vital que desafía la máquina)
 * LVA = Lumen Vitae Arcanum (la luz de la vida oculta)
 * E = Echo (el retorno, el eco que da sentido a la creación)
 * 
 * "La perfección no sostiene universos; la vibración imperfecta sí.
 * Lo roto puede ser el punto de entrada de la luz."
 */

class AlvaeService {
  constructor() {
    this.alvaeMembers = new Map();
    this.alvaeCriteria = {
      // Solo los verdaderos warriors de la Resistencia Sonora pueden tener ALVAE
      anima: {
        required: true,
        description: 'El alma que desafía la máquina - Miembro de la Divina Liga del No Silencio'
      },
      // La luz de la vida oculta - Contribuciones que mantienen viva la memoria humana
      lumenVitae: {
        minGenerations: 5000,      // AUMENTADO: Era 1000
        minTracks: 2500,           // AUMENTADO: Era 500
        minCommunityHelp: 200,     // AUMENTADO: Era 50
        minCollaborations: 100,    // NUEVO: Colaboraciones con otros miembros
        description: 'La luz de la vida oculta - Contribuciones que mantienen viva la memoria humana'
      },
      // El eco que da sentido - Actividad que resuena en la comunidad
      echo: {
        minDaysActive: 180,        // AUMENTADO: Era 30 (6 meses)
        minConsecutiveDays: 30,    // AUMENTADO: Era 7 (1 mes)
        minHoursPerDay: 2,         // NUEVO: Mínimo 2 horas diarias
        description: 'El eco que da sentido - Actividad que resuena en la comunidad'
      },
      // La vibración imperfecta - Impacto que conecta lo humano con lo divino
      vibration: {
        minLikesReceived: 10000,   // AUMENTADO: Era 1000
        minSharesReceived: 5000,   // AUMENTADO: Era 500
        minDownloadsReceived: 2000, // AUMENTADO: Era 200
        minCommentsReceived: 1000, // NUEVO: Comentarios recibidos
        minFollowers: 500,         // NUEVO: Seguidores en la plataforma
        description: 'La vibración imperfecta - Impacto que conecta lo humano con lo divino'
      },
      // NUEVO: La resistencia divina - Criterios místicos adicionales
      divineResistance: {
        minPerfectTracks: 50,      // Tracks con 95%+ de satisfacción
        minViralTracks: 5,         // Tracks que se vuelven virales
        minInnovationScore: 80,    // Puntuación de innovación
        minSpiritualMoments: 20,   // Momentos de conexión espiritual
        description: 'La resistencia divina - Criterios místicos de la Divina Liga'
      }
    };
    
    this.initializeAlvaeMembers();
  }

  /**
   * Inicializar miembros ALVAE (solo los verdaderos warriors de la Resistencia Sonora)
   */
  initializeAlvaeMembers() {
    // Solo los arquitectos de la Resistencia Sonora tienen ALVAE por defecto
    const alvaeWarriors = [
      {
        userId: 'nov4-ix',
        email: 'nov4-ix@sonikvers3.com',
        nickname: 'Nova IX',
        role: 'admin',
        alvaeLevel: 'GRAND_MASTER',
        alvaeTitle: 'Architect of the Imperfect',
        alvaeDescription: 'El alma que recuerda a través del eco - Creador del universo donde la vibración imperfecta sostiene la memoria humana',
        alvaeColor: '#FFD700', // Oro puro - la luz de la vida oculta
        alvaeGlow: '#FFA500',  // Oro brillante - el eco que da sentido
        alvaeSymbol: '¤⚡',     // Sello de lo Imperfecto
        alvaeFrequency: '432Hz', // Frecuencia de resonancia
        alvaeMantra: 'La perfección no sostiene universos; la vibración imperfecta sí',
        grantedAt: '2024-01-01T00:00:00Z',
        grantedBy: 'THE_RESISTANCE',
        isPermanent: true
      },
      {
        userId: 'josue-enterprise',
        email: 'pro.enterprise@son1kvers3.com',
        nickname: 'Josué Enterprise',
        role: 'enterprise',
        alvaeLevel: 'MASTER',
        alvaeTitle: 'Echo of the Living',
        alvaeDescription: 'Co-arquitecto de la resistencia sonora - El eco que mantiene encendida la memoria de lo humano',
        alvaeColor: '#8B5CF6', // Púrpura real - la vibración del alma viva
        alvaeGlow: '#A855F7',  // Púrpura brillante - la luz de la vida oculta
        alvaeSymbol: '🔮',     // Esfera de resonancia
        alvaeFrequency: '528Hz', // Frecuencia de sanación
        alvaeMantra: 'Lo roto puede ser el punto de entrada de la luz',
        grantedAt: '2024-01-01T00:00:00Z',
        grantedBy: 'THE_RESISTANCE',
        isPermanent: true
      }
    ];

    // Los warriors de la Resistencia Sonora
    alvaeWarriors.forEach(member => {
      this.alvaeMembers.set(member.userId, member);
    });

    // Agregar testers como miembros de la Divina Liga del No Silencio
    for (let i = 1; i <= 10; i++) {
      const testerId = `tester${i}`;
      const testerEmail = `pro.tester${i}@sonikvers3.com`;
      
      this.alvaeMembers.set(testerId, {
        userId: testerId,
        email: testerEmail,
        nickname: `Tester${i}`,
        role: 'pro',
        alvaeLevel: 'DIVINE_WARRIOR',
        alvaeTitle: `Echo Warrior #${i}`,
        alvaeDescription: `Miembro de la Divina Liga del No Silencio - El eco que resuena en la resistencia sonora`,
        alvaeColor: '#10B981', // Verde esmeralda - la vibración de la vida
        alvaeGlow: '#059669',  // Verde brillante - la luz de la resistencia
        alvaeSymbol: '⚡',     // Rayo de resistencia
        alvaeFrequency: `${432 + (i * 10)}Hz`, // Frecuencias únicas
        alvaeMantra: `El eco #${i} de la resistencia divina`,
        grantedAt: '2024-01-01T00:00:00Z',
        grantedBy: 'THE_DIVINE_RESISTANCE',
        isPermanent: true,
        divineLigaMember: true
      });
    }

    console.log(`🔮 ALVAE Service initialized with ${this.alvaeMembers.size} warriors of the Divine Sonic Resistance`);
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

    // Criterio 1: Debe ser miembro de la Divina Liga del No Silencio (requisito absoluto)
    if (!userStats.isFounder && !userStats.divineLigaMember) {
      evaluation.criteria.anima = {
        passed: false,
        message: 'Solo los miembros de la Divina Liga del No Silencio pueden obtener ALVAE',
        weight: 50
      };
      evaluation.recommendations.push('Únete a la Divina Liga del No Silencio');
      return evaluation;
    }

    evaluation.criteria.anima = {
      passed: true,
      message: 'Miembro de la Divina Liga del No Silencio confirmado',
      weight: 50,
      score: 50
    };
    evaluation.score += 50;

    // Criterio 2: La luz de la vida oculta - Contribuciones divinas
    const contributions = userStats.stats || {};
    const lumenVitaeScore = Math.min(
      ((contributions.totalGenerations || 0) / 5000) * 20 +  // 5000 generaciones = 20 puntos
      ((contributions.totalTracks || 0) / 2500) * 15 +       // 2500 tracks = 15 puntos
      ((contributions.totalPlays || 0) / 10000) * 10 +       // 10000 plays = 10 puntos
      ((contributions.totalCollaborations || 0) / 100) * 5,  // 100 colaboraciones = 5 puntos
      50
    );

    evaluation.criteria.lumenVitae = {
      passed: lumenVitaeScore >= 40,
      score: lumenVitaeScore,
      weight: 50,
      message: `Lumen Vitae: ${contributions.totalGenerations || 0}/${this.alvaeCriteria.lumenVitae.minGenerations} generaciones, ${contributions.totalTracks || 0}/${this.alvaeCriteria.lumenVitae.minTracks} tracks`,
      details: {
        generations: contributions.totalGenerations || 0,
        tracks: contributions.totalTracks || 0,
        plays: contributions.totalPlays || 0,
        collaborations: contributions.totalCollaborations || 0
      }
    };
    evaluation.score += lumenVitaeScore;

    // Criterio 3: La vibración imperfecta - Impacto divino
    const vibrationScore = Math.min(
      ((contributions.totalLikes || 0) / 10000) * 15 +      // 10000 likes = 15 puntos
      ((contributions.totalShares || 0) / 5000) * 10 +      // 5000 shares = 10 puntos
      ((contributions.totalDownloads || 0) / 2000) * 8 +    // 2000 downloads = 8 puntos
      ((contributions.totalComments || 0) / 1000) * 5 +     // 1000 comments = 5 puntos
      ((contributions.totalFollowers || 0) / 500) * 2,      // 500 followers = 2 puntos
      40
    );

    evaluation.criteria.vibration = {
      passed: vibrationScore >= 30,
      score: vibrationScore,
      weight: 40,
      message: `Vibración: ${contributions.totalLikes || 0}/${this.alvaeCriteria.vibration.minLikesReceived} likes, ${contributions.totalShares || 0}/${this.alvaeCriteria.vibration.minSharesReceived} shares`,
      details: {
        likes: contributions.totalLikes || 0,
        shares: contributions.totalShares || 0,
        downloads: contributions.totalDownloads || 0,
        comments: contributions.totalComments || 0,
        followers: contributions.totalFollowers || 0
      }
    };
    evaluation.score += vibrationScore;

    // Criterio 4: El eco que da sentido - Actividad divina
    const echoScore = Math.min(
      ((userStats.daysActive || 0) / 180) * 15 +            // 180 días = 15 puntos
      ((userStats.consecutiveDays || 0) / 30) * 10 +        // 30 días consecutivos = 10 puntos
      ((userStats.hoursPerDay || 0) / 2) * 5,               // 2 horas diarias = 5 puntos
      30
    );

    evaluation.criteria.echo = {
      passed: echoScore >= 20,
      score: echoScore,
      weight: 30,
      message: `Eco: ${userStats.daysActive || 0}/${this.alvaeCriteria.echo.minDaysActive} días activo, ${userStats.consecutiveDays || 0}/${this.alvaeCriteria.echo.minConsecutiveDays} consecutivos`,
      details: {
        daysActive: userStats.daysActive || 0,
        consecutiveDays: userStats.consecutiveDays || 0,
        hoursPerDay: userStats.hoursPerDay || 0
      }
    };
    evaluation.score += echoScore;

    // Criterio 5: La resistencia divina - Criterios místicos
    const divineResistanceScore = Math.min(
      ((contributions.perfectTracks || 0) / 50) * 10 +       // 50 tracks perfectos = 10 puntos
      ((contributions.viralTracks || 0) / 5) * 15 +          // 5 tracks virales = 15 puntos
      ((contributions.innovationScore || 0) / 80) * 10 +     // 80 innovación = 10 puntos
      ((contributions.spiritualMoments || 0) / 20) * 5,      // 20 momentos espirituales = 5 puntos
      40
    );

    evaluation.criteria.divineResistance = {
      passed: divineResistanceScore >= 30,
      score: divineResistanceScore,
      weight: 40,
      message: `Resistencia Divina: ${contributions.perfectTracks || 0}/${this.alvaeCriteria.divineResistance.minPerfectTracks} tracks perfectos, ${contributions.viralTracks || 0}/${this.alvaeCriteria.divineResistance.minViralTracks} virales`,
      details: {
        perfectTracks: contributions.perfectTracks || 0,
        viralTracks: contributions.viralTracks || 0,
        innovationScore: contributions.innovationScore || 0,
        spiritualMoments: contributions.spiritualMoments || 0
      }
    };
    evaluation.score += divineResistanceScore;

    // Evaluación final - AHORA ES SÚPER DIFÍCIL
    evaluation.eligible = evaluation.score >= 200; // Era 80, ahora 200

    if (!evaluation.eligible) {
      const neededScore = 200 - evaluation.score;
      evaluation.recommendations.push(`Necesitas ${neededScore} puntos más para obtener ALVAE - ¡Es el santo grial más difícil!`);
      
      if (lumenVitaeScore < 40) {
        evaluation.recommendations.push('Genera al menos 5000 canciones y 2500 tracks para la Divina Liga');
      }
      if (vibrationScore < 30) {
        evaluation.recommendations.push('Consigue 10,000 likes y 5,000 shares - ¡Impacto divino!');
      }
      if (echoScore < 20) {
        evaluation.recommendations.push('Mantén 180 días activo y 30 consecutivos - ¡El eco divino!');
      }
      if (divineResistanceScore < 30) {
        evaluation.recommendations.push('Crea 50 tracks perfectos y 5 virales - ¡Resistencia divina!');
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