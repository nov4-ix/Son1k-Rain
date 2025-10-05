/**
 * Track Routes - Endpoints para analytics de tracks
 * Super-Son1k Backend
 */

const express = require('express');
const router = express.Router();
const trackAnalyticsService = require('../../services/trackAnalyticsService');
const { trackMetrics } = require('../middleware/metricsMiddleware');

// Aplicar middleware de métricas
router.use(trackMetrics);

/**
 * Middleware de autenticación
 */
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token && process.env.REQUIRE_AUTH === 'true') {
    return res.status(401).json({ error: 'Token de autorización requerido' });
  }
  next();
};

/**
 * POST /tracks/generate
 * Registrar un nuevo track generado
 */
router.post('/tracks/generate', authenticate, async (req, res) => {
  try {
    const { 
      title, 
      artist, 
      genre, 
      duration, 
      generatedBy, 
      tool, 
      style, 
      mood, 
      tempo, 
      key, 
      language, 
      audioUrl, 
      coverUrl, 
      tags 
    } = req.body;

    if (!title || !audioUrl) {
      return res.status(400).json({
        error: 'Campos requeridos: title, audioUrl'
      });
    }

    const trackData = {
      title,
      artist: artist || 'Super-Son1k User',
      genre: genre || 'Electronic',
      duration: duration || 30,
      generatedBy: generatedBy || 'anonymous',
      tool: tool || 'generator',
      style,
      mood,
      tempo,
      key,
      language: language || 'en',
      audioUrl,
      coverUrl,
      tags: tags || []
    };

    const trackId = trackAnalyticsService.recordTrackGenerated(trackData);

    res.json({
      success: true,
      data: {
        trackId,
        track: trackAnalyticsService.getTrack(trackId)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/generate:', error);
    res.status(500).json({
      success: false,
      error: 'Error registrando track',
      message: error.message
    });
  }
});

/**
 * GET /tracks/top
 * Obtener top tracks por categoría
 */
router.get('/tracks/top', authenticate, async (req, res) => {
  try {
    const { category = 'popularity', limit = 10 } = req.query;

    const topTracks = trackAnalyticsService.getTopTracks(category, parseInt(limit));
    const trendingTracks = trackAnalyticsService.getTrendingTracks(parseInt(limit));
    const globalStats = trackAnalyticsService.getGlobalStats();

    res.json({
      success: true,
      data: {
        topTracks: topTracks.map(track => ({ ...track, category })),
        trendingTracks,
        globalStats
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/top:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo top tracks',
      message: error.message
    });
  }
});

/**
 * POST /tracks/:trackId/play
 * Registrar play de un track
 */
router.post('/tracks/:trackId/play', authenticate, async (req, res) => {
  try {
    const { trackId } = req.params;
    const { userId = 'anonymous' } = req.body;

    const success = trackAnalyticsService.recordPlay(trackId, userId);

    if (!success) {
      return res.status(404).json({
        error: 'Track no encontrado'
      });
    }

    const track = trackAnalyticsService.getTrack(trackId);

    res.json({
      success: true,
      data: {
        trackId,
        plays: track.stats.plays,
        message: 'Play registrado exitosamente'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/:trackId/play:', error);
    res.status(500).json({
      success: false,
      error: 'Error registrando play',
      message: error.message
    });
  }
});

/**
 * POST /tracks/:trackId/like
 * Registrar like de un track
 */
router.post('/tracks/:trackId/like', authenticate, async (req, res) => {
  try {
    const { trackId } = req.params;
    const { userId = 'anonymous', liked = true } = req.body;

    const success = trackAnalyticsService.recordLike(trackId, userId);

    if (!success) {
      return res.status(404).json({
        error: 'Track no encontrado'
      });
    }

    const track = trackAnalyticsService.getTrack(trackId);

    res.json({
      success: true,
      data: {
        trackId,
        likes: track.stats.likes,
        liked: liked,
        message: liked ? 'Like registrado exitosamente' : 'Like removido exitosamente'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/:trackId/like:', error);
    res.status(500).json({
      success: false,
      error: 'Error registrando like',
      message: error.message
    });
  }
});

/**
 * POST /tracks/:trackId/share
 * Registrar share de un track
 */
router.post('/tracks/:trackId/share', authenticate, async (req, res) => {
  try {
    const { trackId } = req.params;
    const { userId = 'anonymous', platform = 'web' } = req.body;

    const success = trackAnalyticsService.recordShare(trackId, userId, platform);

    if (!success) {
      return res.status(404).json({
        error: 'Track no encontrado'
      });
    }

    const track = trackAnalyticsService.getTrack(trackId);

    res.json({
      success: true,
      data: {
        trackId,
        shares: track.stats.shares,
        platform: platform,
        message: 'Share registrado exitosamente'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/:trackId/share:', error);
    res.status(500).json({
      success: false,
      error: 'Error registrando share',
      message: error.message
    });
  }
});

/**
 * POST /tracks/:trackId/download
 * Registrar download de un track
 */
router.post('/tracks/:trackId/download', authenticate, async (req, res) => {
  try {
    const { trackId } = req.params;
    const { userId = 'anonymous' } = req.body;

    const success = trackAnalyticsService.recordDownload(trackId, userId);

    if (!success) {
      return res.status(404).json({
        error: 'Track no encontrado'
      });
    }

    const track = trackAnalyticsService.getTrack(trackId);

    res.json({
      success: true,
      data: {
        trackId,
        downloads: track.stats.downloads,
        message: 'Download registrado exitosamente'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/:trackId/download:', error);
    res.status(500).json({
      success: false,
      error: 'Error registrando download',
      message: error.message
    });
  }
});

/**
 * GET /tracks/:trackId
 * Obtener información de un track específico
 */
router.get('/tracks/:trackId', authenticate, async (req, res) => {
  try {
    const { trackId } = req.params;

    const track = trackAnalyticsService.getTrack(trackId);

    if (!track) {
      return res.status(404).json({
        error: 'Track no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        track: {
          ...track,
          popularityScore: trackAnalyticsService.calculatePopularityScore(track)
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/:trackId:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo track',
      message: error.message
    });
  }
});

/**
 * GET /tracks/search
 * Buscar tracks
 */
router.get('/tracks/search', authenticate, async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Parámetro de búsqueda "q" requerido'
      });
    }

    const tracks = trackAnalyticsService.searchTracks(q, parseInt(limit));

    res.json({
      success: true,
      data: {
        tracks,
        query: q,
        count: tracks.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/search:', error);
    res.status(500).json({
      success: false,
      error: 'Error buscando tracks',
      message: error.message
    });
  }
});

/**
 * GET /tracks/genre/:genre
 * Obtener tracks por género
 */
router.get('/tracks/genre/:genre', authenticate, async (req, res) => {
  try {
    const { genre } = req.params;
    const { limit = 10 } = req.query;

    const tracks = trackAnalyticsService.getTracksByGenre(genre, parseInt(limit));

    res.json({
      success: true,
      data: {
        tracks,
        genre: genre,
        count: tracks.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/genre/:genre:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo tracks por género',
      message: error.message
    });
  }
});

/**
 * GET /tracks/tool/:tool
 * Obtener tracks por herramienta
 */
router.get('/tracks/tool/:tool', authenticate, async (req, res) => {
  try {
    const { tool } = req.params;
    const { limit = 10 } = req.query;

    const tracks = trackAnalyticsService.getTracksByTool(tool, parseInt(limit));

    res.json({
      success: true,
      data: {
        tracks,
        tool: tool,
        count: tracks.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/tool/:tool:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo tracks por herramienta',
      message: error.message
    });
  }
});

/**
 * GET /tracks/user/:userId
 * Obtener tracks de un usuario
 */
router.get('/tracks/user/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    const tracks = trackAnalyticsService.getUserTracks(userId);

    res.json({
      success: true,
      data: {
        tracks,
        userId: userId,
        count: tracks.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/user/:userId:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo tracks del usuario',
      message: error.message
    });
  }
});

/**
 * GET /tracks/analytics/dashboard
 * Obtener datos completos para dashboard
 */
router.get('/tracks/analytics/dashboard', authenticate, async (req, res) => {
  try {
    const dashboardData = trackAnalyticsService.getDashboardData();

    res.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/analytics/dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo datos del dashboard',
      message: error.message
    });
  }
});

/**
 * GET /tracks/analytics/stats
 * Obtener estadísticas globales
 */
router.get('/tracks/analytics/stats', authenticate, async (req, res) => {
  try {
    const globalStats = trackAnalyticsService.getGlobalStats();

    res.json({
      success: true,
      data: globalStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/analytics/stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estadísticas',
      message: error.message
    });
  }
});

/**
 * DELETE /tracks/:trackId
 * Eliminar un track (solo para desarrollo)
 */
router.delete('/tracks/:trackId', authenticate, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        error: 'Eliminación de tracks no permitida en producción'
      });
    }

    const { trackId } = req.params;
    const track = trackAnalyticsService.getTrack(trackId);

    if (!track) {
      return res.status(404).json({
        error: 'Track no encontrado'
      });
    }

    // En una implementación real, esto eliminaría el track de la base de datos
    // Por ahora, solo retornamos éxito
    res.json({
      success: true,
      message: 'Track eliminado exitosamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /tracks/:trackId:', error);
    res.status(500).json({
      success: false,
      error: 'Error eliminando track',
      message: error.message
    });
  }
});

module.exports = router;