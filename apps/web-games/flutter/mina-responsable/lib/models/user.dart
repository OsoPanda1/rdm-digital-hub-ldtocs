class User {
  final String id;
  final String email;
  final String? displayName;
  final String? avatarUrl;
  final String tier;
  final int xp;
  final int vp;
  final int level;
  final List<String> badges;
  final DateTime createdAt;
  final DateTime updatedAt;

  User({
    required this.id,
    required this.email,
    this.displayName,
    this.avatarUrl,
    required this.tier,
    required this.xp,
    required this.vp,
    required this.level,
    required this.badges,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      email: json['email'] as String,
      displayName: json['display_name'] as String?,
      avatarUrl: json['avatar_url'] as String?,
      tier: json['tier'] as String? ?? 'BASE',
      xp: json['xp'] as int? ?? 0,
      vp: json['vp'] as int? ?? 0,
      level: json['level'] as int? ?? 1,
      badges: (json['badges'] as List? ?? []).map((e) => e as String).toList(),
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    };
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'display_name': displayName,
      'avatar_url': avatarUrl,
      'tier': tier,
      'xp': xp,
      'vp': vp,
      'level': level,
      'badges': badges,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
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
      userId: json['user_id'] as String,
      level: json['level'] as int? ?? 1,
      xp: json['xp'] as int? ?? 0,
      vp: json['vp'] as int? ?? 0,
      tier: json['tier'] as String? ?? 'BASE',
      badges: (json['badges'] as List? ?? []).map((e) => e as String).toList(),
      dailyStreak: json['daily_streak'] as int? ?? 0,
    );
  }
}