/**
 * Track Analytics Service - Servicio de analytics de tracks
 * Super-Son1k Monorepo
 */

class TrackAnalyticsService {
  constructor() {
    this.tracks = new Map(); // Track ID -> Track Data
    this.userInteractions = new Map(); // User ID -> Interactions
    this.globalStats = {
      totalTracks: 0,
      totalPlays: 0,
      totalLikes: 0,
      totalShares: 0,
      totalDownloads: 0
    };
    
    this.startAnalyticsCollection();
  }

  /**
   * Iniciar recolección de analytics
   */
  startAnalyticsCollection() {
    // Limpiar datos antiguos cada hora
    setInterval(() => {
      this.cleanupOldData();
    }, 3600000);

    // Actualizar rankings cada 5 minutos
    setInterval(() => {
      this.updateRankings();
    }, 300000);
  }

  /**
   * Registrar un nuevo track generado
   */
  recordTrackGenerated(trackData) {
    const trackId = trackData.id || this.generateTrackId();
    
    const track = {
      id: trackId,
      title: trackData.title || 'Untitled Track',
      artist: trackData.artist || 'Unknown Artist',
      genre: trackData.genre || 'Unknown',
      duration: trackData.duration || 30,
      createdAt: new Date(),
      generatedBy: trackData.generatedBy || 'anonymous',
      tool: trackData.tool || 'generator',
      metadata: {
        style: trackData.style || '',
        mood: trackData.mood || '',
        tempo: trackData.tempo || 'medium',
        key: trackData.key || 'C',
        language: trackData.language || 'en'
      },
      stats: {
        plays: 0,
        likes: 0,
        shares: 0,
        downloads: 0,
        lastPlayed: null,
        lastLiked: null,
        lastShared: null
      },
      audioUrl: trackData.audioUrl || '',
      coverUrl: trackData.coverUrl || '',
      tags: trackData.tags || []
    };

    this.tracks.set(trackId, track);
    this.globalStats.totalTracks++;
    
    return trackId;
  }

  /**
   * Registrar play de un track
   */
  recordPlay(trackId, userId = 'anonymous') {
    const track = this.tracks.get(trackId);
    if (!track) return false;

    track.stats.plays++;
    track.stats.lastPlayed = new Date();
    this.globalStats.totalPlays++;

    // Registrar interacción del usuario
    this.recordUserInteraction(userId, 'play', trackId);

    return true;
  }

  /**
   * Registrar like de un track
   */
  recordLike(trackId, userId = 'anonymous') {
    const track = this.tracks.get(trackId);
    if (!track) return false;

    track.stats.likes++;
    track.stats.lastLiked = new Date();
    this.globalStats.totalLikes++;

    // Registrar interacción del usuario
    this.recordUserInteraction(userId, 'like', trackId);

    return true;
  }

  /**
   * Registrar share de un track
   */
  recordShare(trackId, userId = 'anonymous', platform = 'unknown') {
    const track = this.tracks.get(trackId);
    if (!track) return false;

    track.stats.shares++;
    track.stats.lastShared = new Date();
    this.globalStats.totalShares++;

    // Registrar interacción del usuario
    this.recordUserInteraction(userId, 'share', trackId, { platform });

    return true;
  }

  /**
   * Registrar download de un track
   */
  recordDownload(trackId, userId = 'anonymous') {
    const track = this.tracks.get(trackId);
    if (!track) return false;

    track.stats.downloads++;
    this.globalStats.totalDownloads++;

    // Registrar interacción del usuario
    this.recordUserInteraction(userId, 'download', trackId);

    return true;
  }

  /**
   * Registrar interacción del usuario
   */
  recordUserInteraction(userId, action, trackId, metadata = {}) {
    if (!this.userInteractions.has(userId)) {
      this.userInteractions.set(userId, []);
    }

    const interaction = {
      userId,
      action,
      trackId,
      timestamp: new Date(),
      metadata
    };

    this.userInteractions.get(userId).push(interaction);

    // Mantener solo las últimas 100 interacciones por usuario
    const userInteractions = this.userInteractions.get(userId);
    if (userInteractions.length > 100) {
      userInteractions.splice(0, userInteractions.length - 100);
    }
  }

  /**
   * Obtener Top 10 tracks por criterio
   */
  getTopTracks(criteria = 'popularity', limit = 10) {
    const tracksArray = Array.from(this.tracks.values());
    
    let sortedTracks;
    
    switch (criteria) {
      case 'plays':
        sortedTracks = tracksArray.sort((a, b) => b.stats.plays - a.stats.plays);
        break;
      case 'likes':
        sortedTracks = tracksArray.sort((a, b) => b.stats.likes - a.stats.likes);
        break;
      case 'shares':
        sortedTracks = tracksArray.sort((a, b) => b.stats.shares - a.stats.shares);
        break;
      case 'downloads':
        sortedTracks = tracksArray.sort((a, b) => b.stats.downloads - a.stats.downloads);
        break;
      case 'recent':
        sortedTracks = tracksArray.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'popularity':
      default:
        // Algoritmo de popularidad: (plays * 1) + (likes * 3) + (shares * 5) + (downloads * 2)
        sortedTracks = tracksArray.sort((a, b) => {
          const scoreA = this.calculatePopularityScore(a);
          const scoreB = this.calculatePopularityScore(b);
          return scoreB - scoreA;
        });
        break;
    }

    return sortedTracks.slice(0, limit).map(track => ({
      ...track,
      popularityScore: this.calculatePopularityScore(track),
      rank: sortedTracks.indexOf(track) + 1
    }));
  }

  /**
   * Calcular score de popularidad
   */
  calculatePopularityScore(track) {
    const { plays, likes, shares, downloads } = track.stats;
    
    // Algoritmo de popularidad ponderado
    const score = (plays * 1) + (likes * 3) + (shares * 5) + (downloads * 2);
    
    // Bonus por recencia (tracks nuevos tienen pequeño bonus)
    const daysSinceCreation = (new Date() - track.createdAt) / (1000 * 60 * 60 * 24);
    const recencyBonus = Math.max(0, 10 - daysSinceCreation) * 0.1;
    
    return Math.round(score + recencyBonus);
  }

  /**
   * Obtener estadísticas globales
   */
  getGlobalStats() {
    return {
      ...this.globalStats,
      totalUsers: this.userInteractions.size,
      averagePlaysPerTrack: this.globalStats.totalTracks > 0 ? 
        Math.round(this.globalStats.totalPlays / this.globalStats.totalTracks) : 0,
      averageLikesPerTrack: this.globalStats.totalTracks > 0 ? 
        Math.round(this.globalStats.totalLikes / this.globalStats.totalTracks) : 0,
      topGenre: this.getTopGenre(),
      topTool: this.getTopTool(),
      lastUpdated: new Date()
    };
  }

  /**
   * Obtener género más popular
   */
  getTopGenre() {
    const genreCount = new Map();
    
    this.tracks.forEach(track => {
      const genre = track.genre;
      genreCount.set(genre, (genreCount.get(genre) || 0) + track.stats.plays);
    });

    let topGenre = 'Unknown';
    let maxPlays = 0;

    genreCount.forEach((plays, genre) => {
      if (plays > maxPlays) {
        maxPlays = plays;
        topGenre = genre;
      }
    });

    return { genre: topGenre, plays: maxPlays };
  }

  /**
   * Obtener herramienta más popular
   */
  getTopTool() {
    const toolCount = new Map();
    
    this.tracks.forEach(track => {
      const tool = track.tool;
      toolCount.set(tool, (toolCount.get(tool) || 0) + track.stats.plays);
    });

    let topTool = 'generator';
    let maxPlays = 0;

    toolCount.forEach((plays, tool) => {
      if (plays > maxPlays) {
        maxPlays = plays;
        topTool = tool;
      }
    });

    return { tool: topTool, plays: maxPlays };
  }

  /**
   * Obtener tracks por usuario
   */
  getUserTracks(userId) {
    const userTracks = [];
    
    this.tracks.forEach(track => {
      if (track.generatedBy === userId) {
        userTracks.push(track);
      }
    });

    return userTracks.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Obtener interacciones del usuario
   */
  getUserInteractions(userId) {
    return this.userInteractions.get(userId) || [];
  }

  /**
   * Obtener tracks trending (últimas 24 horas)
   */
  getTrendingTracks(limit = 10) {
    const oneDayAgo = new Date(Date.now() - 86400000);
    const tracksArray = Array.from(this.tracks.values());
    
    // Filtrar tracks creados en las últimas 24 horas
    const recentTracks = tracksArray.filter(track => track.createdAt > oneDayAgo);
    
    // Ordenar por popularidad score
    const trendingTracks = recentTracks.sort((a, b) => {
      const scoreA = this.calculatePopularityScore(a);
      const scoreB = this.calculatePopularityScore(b);
      return scoreB - scoreA;
    });

    return trendingTracks.slice(0, limit).map(track => ({
      ...track,
      popularityScore: this.calculatePopularityScore(track),
      rank: trendingTracks.indexOf(track) + 1,
      trending: true
    }));
  }

  /**
   * Obtener tracks por género
   */
  getTracksByGenre(genre, limit = 10) {
    const tracksArray = Array.from(this.tracks.values());
    const genreTracks = tracksArray.filter(track => 
      track.genre.toLowerCase() === genre.toLowerCase()
    );

    return genreTracks
      .sort((a, b) => this.calculatePopularityScore(b) - this.calculatePopularityScore(a))
      .slice(0, limit);
  }

  /**
   * Obtener tracks por herramienta
   */
  getTracksByTool(tool, limit = 10) {
    const tracksArray = Array.from(this.tracks.values());
    const toolTracks = tracksArray.filter(track => 
      track.tool === tool
    );

    return toolTracks
      .sort((a, b) => this.calculatePopularityScore(b) - this.calculatePopularityScore(a))
      .slice(0, limit);
  }

  /**
   * Actualizar rankings (llamado periódicamente)
   */
  updateRankings() {
    // Esta función se puede usar para cálculos más complejos
    // Por ahora, los rankings se calculan en tiempo real
    console.log('Track rankings updated at:', new Date().toISOString());
  }

  /**
   * Limpiar datos antiguos
   */
  cleanupOldData() {
    const oneMonthAgo = new Date(Date.now() - 2592000000); // 30 días
    
    // Limpiar tracks muy antiguos con pocas interacciones
    this.tracks.forEach((track, trackId) => {
      if (track.createdAt < oneMonthAgo && track.stats.plays < 5) {
        this.tracks.delete(trackId);
        this.globalStats.totalTracks--;
      }
    });
  }

  /**
   * Generar ID único para track
   */
  generateTrackId() {
    return 'track_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Obtener track por ID
   */
  getTrack(trackId) {
    return this.tracks.get(trackId);
  }

  /**
   * Buscar tracks
   */
  searchTracks(query, limit = 10) {
    const tracksArray = Array.from(this.tracks.values());
    const searchTerm = query.toLowerCase();
    
    const matchingTracks = tracksArray.filter(track => 
      track.title.toLowerCase().includes(searchTerm) ||
      track.artist.toLowerCase().includes(searchTerm) ||
      track.genre.toLowerCase().includes(searchTerm) ||
      track.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    return matchingTracks
      .sort((a, b) => this.calculatePopularityScore(b) - this.calculatePopularityScore(a))
      .slice(0, limit);
  }

  /**
   * Obtener datos para dashboard
   */
  getDashboardData() {
    return {
      topTracks: {
        mostPopular: this.getTopTracks('popularity', 10),
        mostPlayed: this.getTopTracks('plays', 10),
        mostLiked: this.getTopTracks('likes', 10),
        mostShared: this.getTopTracks('shares', 10),
        trending: this.getTrendingTracks(10)
      },
      globalStats: this.getGlobalStats(),
      genres: this.getGenreStats(),
      tools: this.getToolStats()
    };
  }

  /**
   * Obtener estadísticas por género
   */
  getGenreStats() {
    const genreStats = new Map();
    
    this.tracks.forEach(track => {
      const genre = track.genre;
      if (!genreStats.has(genre)) {
        genreStats.set(genre, {
          genre,
          count: 0,
          totalPlays: 0,
          totalLikes: 0,
          totalShares: 0
        });
      }
      
      const stats = genreStats.get(genre);
      stats.count++;
      stats.totalPlays += track.stats.plays;
      stats.totalLikes += track.stats.likes;
      stats.totalShares += track.stats.shares;
    });

    return Array.from(genreStats.values())
      .sort((a, b) => b.totalPlays - a.totalPlays);
  }

  /**
   * Obtener estadísticas por herramienta
   */
  getToolStats() {
    const toolStats = new Map();
    
    this.tracks.forEach(track => {
      const tool = track.tool;
      if (!toolStats.has(tool)) {
        toolStats.set(tool, {
          tool,
          count: 0,
          totalPlays: 0,
          totalLikes: 0,
          totalShares: 0
        });
      }
      
      const stats = toolStats.get(tool);
      stats.count++;
      stats.totalPlays += track.stats.plays;
      stats.totalLikes += track.stats.likes;
      stats.totalShares += track.stats.shares;
    });

    return Array.from(toolStats.values())
      .sort((a, b) => b.totalPlays - a.totalPlays);
  }

  /**
   * Reset datos (solo para desarrollo)
   */
  resetData() {
    this.tracks.clear();
    this.userInteractions.clear();
    this.globalStats = {
      totalTracks: 0,
      totalPlays: 0,
      totalLikes: 0,
      totalShares: 0,
      totalDownloads: 0
    };
  }
}

// Singleton instance
const trackAnalyticsService = new TrackAnalyticsService();

module.exports = trackAnalyticsService;