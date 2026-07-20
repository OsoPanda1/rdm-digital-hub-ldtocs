import 'dart:convert';

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
  final bool isCompleted;

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
    this.isCompleted = false,
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
      isCompleted: json['isCompleted'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'gameId': gameId,
      'userId': userId,
      'status': status,
      'score': score,
      'xpEarned': xpEarned,
      'coinsEarned': coinsEarned,
      'durationMs': durationMs,
      'metadata': metadata,
      'startedAt': startedAt.toIso8601String(),
      'endedAt': endedAt?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'isCompleted': isCompleted,
    };
  }

  GameSession copyWith({
    String? id,
    String? gameId,
    String? userId,
    String? status,
    int? score,
    int? xpEarned,
    int? coinsEarned,
    int? durationMs,
    Map<String, dynamic>? metadata,
    DateTime? startedAt,
    DateTime? endedAt,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isCompleted,
  }) {
    return GameSession(
      id: id ?? this.id,
      gameId: gameId ?? this.gameId,
      userId: userId ?? this.userId,
      status: status ?? this.status,
      score: score ?? this.score,
      xpEarned: xpEarned ?? this.xpEarned,
      coinsEarned: coinsEarned ?? this.coinsEarned,
      durationMs: durationMs ?? this.durationMs,
      metadata: metadata ?? this.metadata,
      startedAt: startedAt ?? this.startedAt,
      endedAt: endedAt ?? this.endedAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}