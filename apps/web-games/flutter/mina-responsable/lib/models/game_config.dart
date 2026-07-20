import 'dart:convert';

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

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'slug': slug,
      'name': name,
      'description': description,
      'thumbnailUrl': thumbnailUrl,
      'iframeUrl': iframeUrl,
      'isActive': isActive,
      'config': config.toJson(),
    };
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

  Map<String, dynamic> toJson() {
    return {
      'freeRunsPerDay': freeRunsPerDay,
      'baseXpPerRun': baseXpPerRun,
      'baseCoinsPerRun': baseCoinsPerRun,
      'maxScore': maxScore,
      'timeLimitMs': timeLimitMs,
      'difficultyLevels': difficultyLevels.map((e) => e.toJson()).toList(),
      'boosters': boosters.map((e) => e.toJson()).toList(),
    };
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

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'multiplier': multiplier,
      'description': description,
    };
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

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'name': name,
      'description': description,
      'price': price,
      'currency': currency,
      'effect': effect,
    };
  }
}