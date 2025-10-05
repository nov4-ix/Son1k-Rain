/**
 * Auth Routes - Endpoints para autenticación y gestión de usuarios
 * Super-Son1k Backend
 */

const express = require('express');
const router = express.Router();
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
 * Middleware de autorización por rol
 */
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }

    next();
  };
};

/**
 * POST /auth/login
 * Iniciar sesión
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son requeridos'
      });
    }

    const result = await authService.authenticate(email, password);

    res.json({
      success: true,
      data: result,
      message: 'Inicio de sesión exitoso',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/login:', error);
    res.status(401).json({
      success: false,
      error: 'Error de autenticación',
      message: error.message
    });
  }
});

/**
 * POST /auth/register
 * Registrar nuevo usuario
 */
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, nickname, role = 'free' } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Formato de email inválido'
      });
    }

    // Validar contraseña
    if (password.length < 8) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    const user = await authService.createUser({
      email,
      password,
      role,
      nickname: nickname || email.split('@')[0],
      isFounder: false,
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
      profile: {
        avatar: null,
        bio: '',
        location: '',
        website: ''
      }
    });

    res.json({
      success: true,
      data: { user },
      message: 'Usuario registrado exitosamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/register:', error);
    res.status(400).json({
      success: false,
      error: 'Error de registro',
      message: error.message
    });
  }
});

/**
 * POST /auth/refresh
 * Refrescar token de acceso
 */
router.post('/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token requerido'
      });
    }

    const tokens = await authService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      data: tokens,
      message: 'Token refrescado exitosamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/refresh:', error);
    res.status(401).json({
      success: false,
      error: 'Error refrescando token',
      message: error.message
    });
  }
});

/**
 * POST /auth/logout
 * Cerrar sesión
 */
router.post('/auth/logout', authenticate, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const result = authService.logout(refreshToken);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/logout:', error);
    res.status(500).json({
      success: false,
      error: 'Error cerrando sesión',
      message: error.message
    });
  }
});

/**
 * GET /auth/me
 * Obtener información del usuario actual
 */
router.get('/auth/me', authenticate, async (req, res) => {
  try {
    const user = authService.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: { user: authService.sanitizeUser(user) },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/me:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo información del usuario',
      message: error.message
    });
  }
});

/**
 * PUT /auth/profile
 * Actualizar perfil del usuario
 */
router.put('/auth/profile', authenticate, async (req, res) => {
  try {
    const { nickname, profile, preferences } = req.body;

    const updatedUser = await authService.updateProfile(req.user.userId, {
      nickname,
      profile,
      preferences
    });

    res.json({
      success: true,
      data: { user: updatedUser },
      message: 'Perfil actualizado exitosamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/profile:', error);
    res.status(400).json({
      success: false,
      error: 'Error actualizando perfil',
      message: error.message
    });
  }
});

/**
 * PUT /auth/password
 * Cambiar contraseña
 */
router.put('/auth/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Contraseña actual y nueva contraseña son requeridas'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: 'La nueva contraseña debe tener al menos 8 caracteres'
      });
    }

    const result = await authService.changePassword(
      req.user.userId,
      currentPassword,
      newPassword
    );

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/password:', error);
    res.status(400).json({
      success: false,
      error: 'Error cambiando contraseña',
      message: error.message
    });
  }
});

/**
 * GET /auth/users
 * Obtener todos los usuarios (solo admin)
 */
router.get('/auth/users', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const users = authService.getAllUsers(req.user.role);

    res.json({
      success: true,
      data: { users },
      count: users.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/users:', error);
    res.status(403).json({
      success: false,
      error: 'Error obteniendo usuarios',
      message: error.message
    });
  }
});

/**
 * PUT /auth/users/:userId/toggle
 * Activar/Desactivar usuario (solo admin)
 */
router.put('/auth/users/:userId/toggle', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;

    const result = authService.toggleUserStatus(userId, req.user.role);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/users/:userId/toggle:', error);
    res.status(400).json({
      success: false,
      error: 'Error cambiando estado del usuario',
      message: error.message
    });
  }
});

/**
 * GET /auth/stats
 * Obtener estadísticas de usuarios (solo admin)
 */
router.get('/auth/stats', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const stats = authService.getUserStats();

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estadísticas',
      message: error.message
    });
  }
});

/**
 * GET /auth/verify
 * Verificar token
 */
router.get('/auth/verify', authenticate, async (req, res) => {
  try {
    const user = authService.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        valid: true,
        user: authService.sanitizeUser(user)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/verify:', error);
    res.status(401).json({
      success: false,
      error: 'Token inválido',
      message: error.message
    });
  }
});

/**
 * GET /auth/permissions
 * Obtener permisos del usuario actual
 */
router.get('/auth/permissions', authenticate, async (req, res) => {
  try {
    const user = authService.getUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    const permissions = {
      role: user.role,
      permissions: authService.roles[user.role].permissions,
      limits: authService.roles[user.role].limits,
      features: authService.roles[user.role].features,
      isFounder: user.isFounder
    };

    res.json({
      success: true,
      data: permissions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/permissions:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo permisos',
      message: error.message
    });
  }
});

/**
 * POST /auth/check-usage
 * Verificar límites de uso
 */
router.post('/auth/check-usage', authenticate, async (req, res) => {
  try {
    const { action } = req.body;

    if (!action) {
      return res.status(400).json({
        error: 'Acción requerida'
      });
    }

    const result = authService.checkUsageLimits(req.user.userId, action);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/check-usage:', error);
    res.status(500).json({
      success: false,
      error: 'Error verificando límites',
      message: error.message
    });
  }
});

/**
 * DELETE /auth/reset
 * Reset datos de autenticación (solo desarrollo)
 */
router.delete('/auth/reset', authenticate, authorize(['admin']), async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        error: 'Reset no permitido en producción'
      });
    }

    authService.resetData();

    res.json({
      success: true,
      message: 'Datos de autenticación reseteados exitosamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /auth/reset:', error);
    res.status(500).json({
      success: false,
      error: 'Error reseteando datos',
      message: error.message
    });
  }
});

module.exports = router;