/**
 * Auth Service - Servicio de autenticación y gestión de usuarios
 * Super-Son1k Monorepo
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.refreshTokens = new Map();
    
    // Configuración JWT
    this.jwtSecret = process.env.JWT_SECRET || 'super-son1k-secret-key-2024';
    this.jwtExpiry = '15m';
    this.refreshTokenExpiry = '7d';
    
    // Roles y permisos
    this.roles = {
      admin: {
        name: 'Administrator',
        permissions: ['*'], // Todos los permisos
        limits: {
          generationsPerDay: -1, // Ilimitado
          tracksPerDay: -1,
          apiCallsPerHour: -1,
          storageGB: -1
        },
        features: ['*'] // Todas las features
      },
      enterprise: {
        name: 'Enterprise',
        permissions: [
          'generate_music',
          'generate_lyrics',
          'generate_covers',
          'download_tracks',
          'share_content',
          'analytics_access',
          'collaboration',
          'priority_support',
          'white_label',
          'api_access',
          'custom_integrations',
          'dedicated_support',
          'admin_access'
        ],
        limits: {
          generationsPerDay: -1, // Ilimitado
          tracksPerDay: -1,
          apiCallsPerHour: -1,
          storageGB: -1
        },
        features: [
          'unlimited_generations',
          'advanced_analytics',
          'team_collaboration',
          'priority_generation',
          'custom_styles',
          'bulk_operations',
          'white_label_branding',
          'api_access',
          'custom_integrations',
          'dedicated_support',
          'sla_guarantee',
          'custom_deployment'
        ]
      },
      pro: {
        name: 'Pro',
        permissions: [
          'generate_music',
          'generate_lyrics',
          'generate_covers',
          'download_tracks',
          'share_content',
          'analytics_access',
          'collaboration',
          'priority_support',
          'api_access'
        ],
        limits: {
          generationsPerDay: 200,
          tracksPerDay: 100,
          apiCallsPerHour: 2000,
          storageGB: 25
        },
        features: [
          'advanced_analytics',
          'team_collaboration',
          'priority_generation',
          'custom_styles',
          'bulk_operations',
          'api_access',
          'priority_support',
          'advanced_export'
        ]
      },
      premium: {
        name: 'Premium',
        permissions: [
          'generate_music',
          'generate_lyrics',
          'generate_covers',
          'download_tracks',
          'share_content',
          'analytics_access',
          'collaboration'
        ],
        limits: {
          generationsPerDay: 50,
          tracksPerDay: 25,
          apiCallsPerHour: 500,
          storageGB: 5
        },
        features: [
          'enhanced_analytics',
          'team_collaboration',
          'priority_generation',
          'custom_styles',
          'enhanced_export',
          'priority_queue'
        ]
      },
      tester: {
        name: 'Tester',
        permissions: [
          'generate_music',
          'generate_lyrics',
          'download_tracks',
          'share_content',
          'analytics_access'
        ],
        limits: {
          generationsPerDay: 20,
          tracksPerDay: 10,
          apiCallsPerHour: 200,
          storageGB: 2
        },
        features: [
          'basic_analytics',
          'standard_generation',
          'community_access'
        ]
      },
      free: {
        name: 'Free',
        permissions: [
          'generate_music',
          'download_tracks',
          'share_content'
        ],
        limits: {
          generationsPerDay: 5,
          tracksPerDay: 3,
          apiCallsPerHour: 50,
          storageGB: 0.5
        },
        features: [
          'basic_generation',
          'community_access',
          'basic_export'
        ]
      }
    };
    
    this.initializeDefaultUsers();
  }

  /**
   * Inicializar usuarios por defecto
   */
  initializeDefaultUsers() {
    // Administrador
    this.createUser({
      email: 'nov4-ix@sonikvers3.com',
      password: 'iloveMusic!90',
      role: 'admin',
      nickname: 'Nova IX',
      isFounder: true,
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
      profile: {
        avatar: null,
        bio: 'Founder & Administrator of Super-Son1k',
        location: 'Global',
        website: 'https://son1kvers3.com'
      }
    });

    // Pro Enterprise - Josué
    this.createUser({
      email: 'pro.enterprise@son1kvers3.com',
      password: 'Premium!123',
      role: 'enterprise',
      nickname: 'Josué Enterprise',
      isFounder: true,
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
      profile: {
        avatar: null,
        bio: 'Co-Founder & Enterprise Partner',
        location: 'Global',
        website: 'https://son1kvers3.com'
      }
    });

    // 10 Testers Pro
    for (let i = 1; i <= 10; i++) {
      this.createUser({
        email: `pro.tester${i}@sonikvers3.com`,
        password: 'Premium!123',
        role: 'pro',
        nickname: `Tester${i}`,
        isFounder: true,
        isActive: true,
        createdAt: new Date(),
        lastLogin: null,
        profile: {
          avatar: null,
          bio: `Founder Tester #${i}`,
          location: 'Global',
          website: 'https://son1kvers3.com'
        }
      });
    }

    console.log(`✅ Auth Service initialized with ${this.users.size} users`);
  }

  /**
   * Crear usuario
   */
  async createUser(userData) {
    const { email, password, role = 'free', nickname, isFounder = false } = userData;
    
    // Verificar si el usuario ya existe
    if (this.users.has(email)) {
      throw new Error('Usuario ya existe');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = {
      id: this.generateUserId(),
      email,
      password: hashedPassword,
      role,
      nickname: nickname || email.split('@')[0],
      isFounder,
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
      profile: {
        avatar: null,
        bio: '',
        location: '',
        website: '',
        ...userData.profile
      },
      stats: {
        totalGenerations: 0,
        totalTracks: 0,
        totalPlays: 0,
        totalLikes: 0,
        totalShares: 0,
        lastActivity: null
      },
      preferences: {
        theme: 'pragmatic',
        language: 'en',
        notifications: true,
        autoSave: true
      }
    };

    this.users.set(email, user);
    return user;
  }

  /**
   * Autenticar usuario
   */
  async authenticate(email, password) {
    const user = this.users.get(email);
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new Error('Cuenta desactivada');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Actualizar último login
    user.lastLogin = new Date();
    user.stats.lastActivity = new Date();

    // Generar tokens
    const tokens = this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      tokens
    };
  }

  /**
   * Generar tokens JWT
   */
  generateTokens(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      isFounder: user.isFounder
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiry
    });

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      this.jwtSecret,
      { expiresIn: this.refreshTokenExpiry }
    );

    // Guardar refresh token
    this.refreshTokens.set(refreshToken, {
      userId: user.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60 * 1000 // 15 minutos en ms
    };
  }

  /**
   * Verificar token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  /**
   * Refrescar token
   */
  async refreshAccessToken(refreshToken) {
    const tokenData = this.refreshTokens.get(refreshToken);
    
    if (!tokenData) {
      throw new Error('Refresh token inválido');
    }

    if (tokenData.expiresAt < new Date()) {
      this.refreshTokens.delete(refreshToken);
      throw new Error('Refresh token expirado');
    }

    const user = this.getUserById(tokenData.userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return this.generateTokens(user);
  }

  /**
   * Obtener usuario por ID
   */
  getUserById(userId) {
    for (const [email, user] of this.users) {
      if (user.id === userId) {
        return user;
      }
    }
    return null;
  }

  /**
   * Obtener usuario por email
   */
  getUserByEmail(email) {
    return this.users.get(email);
  }

  /**
   * Sanitizar datos del usuario (remover información sensible)
   */
  sanitizeUser(user) {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  /**
   * Verificar permisos
   */
  hasPermission(userRole, permission) {
    const role = this.roles[userRole];
    
    if (!role) {
      return false;
    }

    // Admin tiene todos los permisos
    if (role.permissions.includes('*')) {
      return true;
    }

    return role.permissions.includes(permission);
  }

  /**
   * Verificar límites de uso
   */
  checkUsageLimits(userId, action) {
    const user = this.getUserById(userId);
    
    if (!user) {
      return { allowed: false, reason: 'Usuario no encontrado' };
    }

    const role = this.roles[user.role];
    
    if (!role) {
      return { allowed: false, reason: 'Rol inválido' };
    }

    // Admin tiene límites ilimitados
    if (role.limits[action] === -1) {
      return { allowed: true };
    }

    // Verificar límites diarios
    const today = new Date().toDateString();
    const userStats = user.stats;
    
    // Aquí implementarías la lógica de verificación de límites
    // Por ahora, siempre permitimos
    return { allowed: true };
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId, profileData) {
    const user = this.getUserById(userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Actualizar datos permitidos
    if (profileData.nickname) {
      user.nickname = profileData.nickname;
    }

    if (profileData.profile) {
      user.profile = { ...user.profile, ...profileData.profile };
    }

    if (profileData.preferences) {
      user.preferences = { ...user.preferences, ...profileData.preferences };
    }

    return this.sanitizeUser(user);
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = this.getUserById(userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    
    if (!isValidPassword) {
      throw new Error('Contraseña actual incorrecta');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;

    return { success: true, message: 'Contraseña actualizada exitosamente' };
  }

  /**
   * Obtener todos los usuarios (solo admin)
   */
  getAllUsers(requesterRole) {
    if (!this.hasPermission(requesterRole, 'admin_access')) {
      throw new Error('Permisos insuficientes');
    }

    const users = [];
    for (const [email, user] of this.users) {
      users.push(this.sanitizeUser(user));
    }

    return users.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Activar/Desactivar usuario
   */
  toggleUserStatus(userId, requesterRole) {
    if (!this.hasPermission(requesterRole, 'admin_access')) {
      throw new Error('Permisos insuficientes');
    }

    const user = this.getUserById(userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    user.isActive = !user.isActive;
    
    return {
      success: true,
      message: `Usuario ${user.isActive ? 'activado' : 'desactivado'} exitosamente`,
      user: this.sanitizeUser(user)
    };
  }

  /**
   * Logout
   */
  logout(refreshToken) {
    if (refreshToken) {
      this.refreshTokens.delete(refreshToken);
    }
    
    return { success: true, message: 'Sesión cerrada exitosamente' };
  }

  /**
   * Generar ID único para usuario
   */
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Obtener estadísticas de usuarios
   */
  getUserStats() {
    const stats = {
      totalUsers: this.users.size,
      activeUsers: 0,
      usersByRole: {},
      founders: 0,
      lastWeekSignups: 0
    };

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    for (const [email, user] of this.users) {
      if (user.isActive) {
        stats.activeUsers++;
      }

      if (user.isFounder) {
        stats.founders++;
      }

      if (user.createdAt > oneWeekAgo) {
        stats.lastWeekSignups++;
      }

      stats.usersByRole[user.role] = (stats.usersByRole[user.role] || 0) + 1;
    }

    return stats;
  }

  /**
   * Limpiar tokens expirados
   */
  cleanupExpiredTokens() {
    const now = new Date();
    
    for (const [token, data] of this.refreshTokens) {
      if (data.expiresAt < now) {
        this.refreshTokens.delete(token);
      }
    }
  }

  /**
   * Reset datos (solo para desarrollo)
   */
  resetData() {
    this.users.clear();
    this.sessions.clear();
    this.refreshTokens.clear();
    this.initializeDefaultUsers();
  }
}

// Singleton instance
const authService = new AuthService();

// Limpiar tokens expirados cada hora
setInterval(() => {
  authService.cleanupExpiredTokens();
}, 3600000);

module.exports = authService;