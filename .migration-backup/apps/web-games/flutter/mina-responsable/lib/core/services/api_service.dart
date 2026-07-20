import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

import 'core/config/app_config.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  String? _accessToken;

  void setToken(String token) {
    _accessToken = token;
  }

  void clearToken() {
    _accessToken = null;
  }

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_accessToken != null) 'Authorization': 'Bearer $_accessToken',
  };

  Future<T> get<T>(String endpoint, T Function(Map<String, dynamic>) fromJson) async {
    final response = await http.get(
      Uri.parse('${AppConfig.apiBaseUrl}$endpoint'),
      headers: _headers,
    );
    return _handleResponse(response, fromJson);
  }

  Future<T> post<T>(String endpoint, Map<String, dynamic> body, T Function(Map<String, dynamic>) fromJson) async {
    final response = await http.post(
      Uri.parse('${AppConfig.apiBaseUrl}$endpoint'),
      headers: _headers,
      body: jsonEncode(body),
    );
    return _handleResponse(response, fromJson);
  }

  Future<T> _handleResponse<T>(http.Response response, T Function(Map<String, dynamic>) fromJson) async {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      final data = jsonDecode(response.body) as Map<String, dynamic>;
      return fromJson(data);
    } else {
      final error = jsonDecode(response.body) as Map<String, dynamic>;
      throw ApiException(
        error['message'] ?? 'Error desconocido',
        statusCode: response.statusCode,
        code: error['code'],
      );
    }
  }

  // Game-specific endpoints
  Future<GameConfig> getGameConfig() async {
    return get('/games/${AppConfig.gameId}/config', GameConfig.fromJson);
  }

  Future<GameSession> startSession() async {
    return post('/games/${AppConfig.gameId}/session/start', {}, GameSession.fromJson);
  }

  Future<GameSessionResult> completeSession({
    required String sessionId,
    required int score,
    required int xpEarned,
    required int coinsEarned,
    required int durationMs,
    Map<String, dynamic>? metadata,
  }) async {
    return post('/games/session/complete', {
      'sessionId': sessionId,
      'gameId': AppConfig.gameId,
      'score': score,
      'xpEarned': xpEarned,
      'coinsEarned': coinsEarned,
      'durationMs': durationMs,
      'metadata': metadata,
      'completedAt': DateTime.now().toIso8601String(),
    }, GameSessionResult.fromJson);
  }

  Future<GameStats> getGameStats() async {
    return get('/games/${AppConfig.gameId}/stats', GameStats.fromJson);
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;
  final String? code;

  ApiException(this.message, {required this.statusCode, this.code});

  @override
  String toString() => 'ApiException: $message (status: $statusCode${code != null ? ', code: $code' : ''})';
}

// Models
class GameConfig {
  final String id;
  final String type;
  final String slug;
  final String name;
  final String description;
  final String? thumbnailUrl;
  final String iframeUrl;
  final bool isActive;
  final GameConfigData config;

  GameConfig({
    required this.id,
    required this.type,
    required this.slug,
    required this.name,
    required this.description,
    this.thumbnailUrl,
    required this.iframeUrl,
    required this.isActive,
    required this.config,
  });

  factory GameConfig.fromJson(Map<String, dynamic> json) {
    return GameConfig(
      id: json['id'] as String,
      type: json['type'] as String,
      slug: json['slug'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      thumbnailUrl: json['thumbnailUrl'] as String?,
      iframeUrl: json['iframeUrl'] as String,
      isActive: json['isActive'] as bool,
      config: GameConfigData.fromJson(json['config'] as Map<String, dynamic>),
    );
  }
}

class GameConfigData {
  final int freeRunsPerDay;
  final int baseXpPerRun;
  final int baseCoinsPerRun;
  final int maxScore;
  final int timeLimitMs;
  final List<DifficultyLevel> difficultyLevels;
  final List<BoosterConfig> boosters;

  GameConfigData({
    required this.freeRunsPerDay,
    required this.baseXpPerRun,
    required this.baseCoinsPerRun,
    required this.maxScore,
    required this.timeLimitMs,
    required this.difficultyLevels,
    required this.boosters,
  });

  factory GameConfigData.fromJson(Map<String, dynamic> json) {
    return GameConfigData(
      freeRunsPerDay: json['freeRunsPerDay'] as int? ?? 2,
      baseXpPerRun: json['baseXpPerRun'] as int? ?? 100,
      baseCoinsPerRun: json['baseCoinsPerRun'] as int? ?? 50,
      maxScore: json['maxScore'] as int? ?? 10000,
      timeLimitMs: json['timeLimitMs'] as int? ?? 300000,
      difficultyLevels: (json['difficultyLevels'] as List? ?? [])
          .map((e) => DifficultyLevel.fromJson(e as Map<String, dynamic>))
          .toList(),
      boosters: (json['boosters'] as List? ?? [])
          .map((e) => BoosterConfig.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class DifficultyLevel {
  final String id;
  final String name;
  final double multiplier;
  final String description;

  DifficultyLevel({
    required this.id,
    required this.name,
    required this.multiplier,
    required this.description,
  });

  factory DifficultyLevel.fromJson(Map<String, dynamic> json) {
    return DifficultyLevel(
      id: json['id'] as String,
      name: json['name'] as String,
      multiplier: (json['multiplier'] as num).toDouble(),
      description: json['description'] as String,
    );
  }
}

class BoosterConfig {
  final String id;
  final String type;
  final String name;
  final String description;
  final int price;
  final String currency;
  final Map<String, dynamic> effect;

  BoosterConfig({
    required this.id,
    required this.type,
    required this.name,
    required this.description,
    required this.price,
    required this.currency,
    required this.effect,
  });

  factory BoosterConfig.fromJson(Map<String, dynamic> json) {
    return BoosterConfig(
      id: json['id'] as String,
      type: json['type'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      price: json['price'] as int,
      currency: json['currency'] as String? ?? 'MXN',
      effect: json['effect'] as Map<String, dynamic>,
    );
  }
}

class GameSession {
  final String id;
  final String gameId;
  final String userId;
  final String status;
  final int score;
  final int xpEarned;
  final int coinsEarned;
  final int durationMs;
  final Map<String, dynamic> metadata;
  final DateTime startedAt;
  final DateTime? endedAt;
  final DateTime createdAt;
  final DateTime updatedAt;

  GameSession({
    required this.id,
    required this.gameId,
    required this.userId,
    required this.status,
    required this.score,
    required this.xpEarned,
    required this.coinsEarned,
    required this.durationMs,
    required this.metadata,
    required this.startedAt,
    this.endedAt,
    required this.createdAt,
    required this.updatedAt,
  });

  factory GameSession.fromJson(Map<String, dynamic> json) {
    return GameSession(
      id: json['id'] as String,
      gameId: json['gameId'] as String,
      userId: json['userId'] as String,
      status: json['status'] as String,
      score: json['score'] as int? ?? 0,
      xpEarned: json['xpEarned'] as int? ?? 0,
      coinsEarned: json['coinsEarned'] as int? ?? 0,
      durationMs: json['durationMs'] as int? ?? 0,
      metadata: json['metadata'] as Map<String, dynamic>? ?? {},
      startedAt: DateTime.parse(json['startedAt'] as String),
      endedAt: json['endedAt'] != null ? DateTime.parse(json['endedAt'] as String) : null,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }
}

class GameSessionResult {
  final GameSession session;
  final int xpEarned;
  final int coinsEarned;
  final bool leveledUp;
  final String? newTier;
  final GameDailyUsage dailyUsage;
  final GameRewards rewards;

  GameSessionResult({
    required this.session,
    required this.xpEarned,
    required this.coinsEarned,
    required this.leveledUp,
    this.newTier,
    required this.dailyUsage,
    required this.rewards,
  });

  factory GameSessionResult.fromJson(Map<String, dynamic> json) {
    return GameSessionResult(
      session: GameSession.fromJson(json['session'] as Map<String, dynamic>),
      xpEarned: json['xpEarned'] as int? ?? 0,
      coinsEarned: json['coinsEarned'] as int? ?? 0,
      leveledUp: json['leveledUp'] as bool? ?? false,
      newTier: json['newTier'] as String?,
      dailyUsage: GameDailyUsage.fromJson(json['dailyUsage'] as Map<String, dynamic>),
      rewards: GameRewards.fromJson(json['rewards'] as Map<String, dynamic>),
    );
  }
}

class GameDailyUsage {
  final String id;
  final String gameId;
  final String userId;
  final String date;
  final int runsUsed;
  final int runsLimit;

  GameDailyUsage({
    required this.id,
    required this.gameId,
    required this.userId,
    required this.date,
    required this.runsUsed,
    required this.runsLimit,
  });

  factory GameDailyUsage.fromJson(Map<String, dynamic> json) {
    return GameDailyUsage(
      id: json['id'] as String,
      gameId: json['gameId'] as String,
      userId: json['userId'] as String,
      date: json['date'] as String,
      runsUsed: json['runsUsed'] as int? ?? 0,
      runsLimit: json['runsLimit'] as int? ?? 2,
    );
  }
}

class GameRewards {
  final int xp;
  final int coins;
  final List<String> badges;

  GameRewards({
    required this.xp,
    required this.coins,
    required this.badges,
  });

  factory GameRewards.fromJson(Map<String, dynamic> json) {
    return GameRewards(
      xp: json['xp'] as int? ?? 0,
      coins: json['coins'] as int? ?? 0,
      badges: (json['badges'] as List? ?? []).map((e) => e as String).toList(),
    );
  }
}

class GameStats {
  final GameConfig game;
  final UserProfile? userProfile;
  final GameDailyUsage? todayUsage;
  final List<GameSession> recentSessions;
  final List<LeaderboardEntry> leaderboard;

  GameStats({
    required this.game,
    this.userProfile,
    this.todayUsage,
    required this.recentSessions,
    required this.leaderboard,
  });

  factory GameStats.fromJson(Map<String, dynamic> json) {
    return GameStats(
      game: GameConfig.fromJson(json['game'] as Map<String, dynamic>),
      userProfile: json['userProfile'] != null 
          ? UserProfile.fromJson(json['userProfile'] as Map<String, dynamic>) 
          : null,
      todayUsage: json['todayUsage'] != null 
          ? GameDailyUsage.fromJson(json['todayUsage'] as Map<String, dynamic>) 
          : null,
      recentSessions: (json['recentSessions'] as List? ?? [])
          .map((e) => GameSession.fromJson(e as Map<String, dynamic>))
          .toList(),
      leaderboard: (json['leaderboard'] as List? ?? [])
          .map((e) => LeaderboardEntry.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class UserProfile {
  final String userId;
  final int level;
  final int xp;
  final int vp;
  final String tier;
  final List<String> badges;
  final int dailyStreak;

  UserProfile({
    required this.userId,
    required this.level,
    required this.xp,
    required this.vp,
    required this.tier,
    required this.badges,
    required this.dailyStreak,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      userId: json['userId'] as String,
      level: json['level'] as int? ?? 1,
      xp: json['xp'] as int? ?? 0,
      vp: json['vp'] as int? ?? 0,
      tier: json['tier'] as String? ?? 'BASE',
      badges: (json['badges'] as List? ?? []).map((e) => e as String).toList(),
      dailyStreak: json['dailyStreak'] as int? ?? 0,
    );
  }
}

class LeaderboardEntry {
  final String userId;
  final String displayName;
  final String? avatarUrl;
  final int score;
  final int totalXp;
  final String tier;
  final int rank;

  LeaderboardEntry({
    required this.userId,
    required this.displayName,
    this.avatarUrl,
    required this.score,
    required this.totalXp,
    required this.tier,
    required this.rank,
  });

  factory LeaderboardEntry.fromJson(Map<String, dynamic> json) {
    return LeaderboardEntry(
      userId: json['userId'] as String,
      displayName: json['displayName'] as String,
      avatarUrl: json['avatarUrl'] as String?,
      score: json['score'] as int? ?? 0,
      totalXp: json['totalXp'] as int? ?? 0,
      tier: json['tier'] as String? ?? 'BASE',
      rank: json['rank'] as int? ?? 0,
    );
  }
}