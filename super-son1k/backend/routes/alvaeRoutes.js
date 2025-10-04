/**
 * ALVAE Routes - Endpoints para el símbolo más exclusivo
 * Super-Son1k Backend
 */

const express = require('express');
const router = express.Router();
const alvaeService = require('../../services/alvaeService');
const authService = require('../../services/authService');
const { trackMetrics } = require('../middleware/metricsMiddleware');

// Aplicar middleware de métricas
router.use(trackMetrics);

/**
 * Middleware de autenticación
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autorización requerido' });
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

/**
 * GET /alvae/status
 * Obtener estado ALVAE del usuario actual
 */
router.get('/alvae/status', authenticate, async (req, res) => {
  try {
    const alvaeInfo = alvaeService.getAlvaeInfo(req.user.userId);
    
    res.json({
      success: true,
      data: { alvaeInfo },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /alvae/status:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estado ALVAE',
      message: error.message
    });
  }
});

/**
 * GET /alvae/evaluate
 * Evaluar elegibilidad ALVAE del usuario actual
 */
router.get('/alvae/evaluate', authenticate, async (req, res) => {
  try {
    const user = authService.getUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Simular estadísticas del usuario (en producción vendrían de la DB)
    const userStats = {
      isFounder: user.isFounder,
      stats: user.stats || {},
      daysActive: Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)),
      consecutiveDays: Math.floor(Math.random() * 30) + 1 // Simulado
    };

    const evaluation = alvaeService.evaluateAlvaeEligibility(req.user.userId, userStats);
    const motivation = alvaeService.getMotivationMessage(req.user.userId, evaluation);

    res.json({
      success: true,
      data: { evaluation, motivation },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /alvae/evaluate:', error);
    res.status(500).json({
      success: false,
      error: 'Error evaluando elegibilidad ALVAE',
      message: error.message
    });
  }
});

/**
 * POST /alvae/request
 * Solicitar ALVAE (solo si es elegible)
 */
router.post('/alvae/request', authenticate, async (req, res) => {
  try {
    const { reason, evaluation } = req.body;

    if (!evaluation || !evaluation.eligible) {
      return res.status(400).json({
        error: 'No eres elegible para ALVAE'
      });
    }

    const user = authService.getUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Verificar si ya tiene ALVAE
    if (alvaeService.hasAlvae(req.user.userId)) {
      return res.status(400).json({
        error: 'Ya tienes ALVAE'
      });
    }

    // Otorgar ALVAE
    const alvaeInfo = alvaeService.grantAlvae(
      req.user.userId,
      user,
      'SYSTEM',
      reason || 'User meets all ALVAE criteria'
    );

    if (!alvaeInfo) {
      return res.status(500).json({
        error: 'Error otorgando ALVAE'
      });
    }

    res.json({
      success: true,
      data: { alvaeInfo },
      message: '¡ALVAE otorgado exitosamente!',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /alvae/request:', error);
    res.status(500).json({
      success: false,
      error: 'Error solicitando ALVAE',
      message: error.message
    });
  }
});

/**
 * GET /alvae/members
 * Obtener todos los miembros ALVAE (solo admin)
 */
router.get('/alvae/members', authenticate, async (req, res) => {
  try {
    const user = authService.getUserById(req.user.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        error: 'Permisos insuficientes'
      });
    }

    const members = alvaeService.getAllAlvaeMembers();

    res.json({
      success: true,
      data: { members },
      count: members.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /alvae/members:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo miembros ALVAE',
      message: error.message
    });
  }
});

/**
 * GET /alvae/stats
 * Obtener estadísticas ALVAE (solo admin)
 */
router.get('/alvae/stats', authenticate, async (req, res) => {
  try {
    const user = authService.getUserById(req.user.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        error: 'Permisos insuficientes'
      });
    }

    const stats = alvaeService.getAlvaeStats();

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /alvae/stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estadísticas ALVAE',
      message: error.message
    });
  }
});

/**
 * POST /alvae/grant
 * Otorgar ALVAE manualmente (solo admin/grand master)
 */
router.post('/alvae/grant', authenticate, async (req, res) => {
  try {
    const { targetUserId, reason, alvaeLevel = 'MEMBER' } = req.body;

    if (!targetUserId || !reason) {
      return res.status(400).json({
        error: 'targetUserId y reason son requeridos'
      });
    }

    const granter = authService.getUserById(req.user.userId);
    
    if (!granter || !alvaeService.canGrantAlvae(req.user.userId)) {
      return res.status(403).json({
        error: 'No tienes permisos para otorgar ALVAE'
      });
    }

    const targetUser = authService.getUserById(targetUserId);
    
    if (!targetUser) {
      return res.status(404).json({
        error: 'Usuario objetivo no encontrado'
      });
    }

    // Verificar si ya tiene ALVAE
    if (alvaeService.hasAlvae(targetUserId)) {
      return res.status(400).json({
        error: 'El usuario ya tiene ALVAE'
      });
    }

    // Otorgar ALVAE
    const alvaeInfo = alvaeService.grantAlvae(
      targetUserId,
      targetUser,
      granter.nickname,
      reason
    );

    if (!alvaeInfo) {
      return res.status(500).json({
        error: 'Error otorgando ALVAE'
      });
    }

    res.json({
      success: true,
      data: { alvaeInfo },
      message: `ALVAE otorgado a ${targetUser.nickname}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /alvae/grant:', error);
    res.status(500).json({
      success: false,
      error: 'Error otorgando ALVAE',
      message: error.message
    });
  }
});

/**
 * DELETE /alvae/revoke/:userId
 * Revocar ALVAE (solo admin/grand master)
 */
router.delete('/alvae/revoke/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        error: 'reason es requerido'
      });
    }

    const revoker = authService.getUserById(req.user.userId);
    
    if (!revoker || !alvaeService.canGrantAlvae(req.user.userId)) {
      return res.status(403).json({
        error: 'No tienes permisos para revocar ALVAE'
      });
    }

    const success = alvaeService.revokeAlvae(userId, revoker.nickname, reason);

    if (!success) {
      return res.status(400).json({
        error: 'No se pudo revocar ALVAE (usuario no encontrado o ALVAE permanente)'
      });
    }

    res.json({
      success: true,
      message: 'ALVAE revocado exitosamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /alvae/revoke:', error);
    res.status(500).json({
      success: false,
      error: 'Error revocando ALVAE',
      message: error.message
    });
  }
});

/**
 * GET /alvae/symbol/:userId
 * Obtener símbolo ALVAE de un usuario específico
 */
router.get('/alvae/symbol/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    const symbol = alvaeService.getAlvaeSymbol(userId);

    res.json({
      success: true,
      data: { symbol },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /alvae/symbol:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo símbolo ALVAE',
      message: error.message
    });
  }
});

module.exports = router;