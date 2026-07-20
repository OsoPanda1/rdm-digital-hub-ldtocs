import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();

  late SharedPreferences _prefs;

  static Future<void> init() async {
    _instance._prefs = await SharedPreferences.getInstance();
  }

  SharedPreferences get prefs => _prefs;

  // Auth
  Future<void> saveToken(String token) async {
    await _prefs.setString('access_token', token);
  }

  String? getToken() {
    return _prefs.getString('access_token');
  }

  Future<void> clearToken() async {
    await _prefs.remove('access_token');
  }

  Future<void> saveUserId(String userId) async {
    await _prefs.setString('user_id', userId);
  }

  String? getUserId() {
    return _prefs.getString('user_id');
  }

  Future<void> saveGameSession(String gameId, Map<String, dynamic> session) async {
    await _prefs.setString('session_$gameId', jsonEncode(session));
  }

  Map<String, dynamic>? getGameSession(String gameId) {
    final data = _prefs.getString('session_$gameId');
    if (data != null) {
      return jsonDecode(data) as Map<String, dynamic>;
    }
    return null;
  }

  Future<void> clearGameSession(String gameId) async {
    await _prefs.remove('session_$gameId');
  }

  // Settings
  Future<void> setMuted(bool muted) async {
    await _prefs.setBool('muted', muted);
  }

  bool getMuted() {
    return _prefs.getBool('muted') ?? false;
  }

  Future<void> setMusicVolume(double volume) async {
    await _prefs.setDouble('music_volume', volume);
  }

  double getMusicVolume() {
    return _prefs.getDouble('music_volume') ?? 0.5;
  }

  Future<void> setSfxVolume(double volume) async {
    await _prefs.setDouble('sfx_volume', volume);
  }

  double getSfxVolume() {
    return _prefs.getDouble('sfx_volume') ?? 1.0;
  }

  Future<void> setLastPlayedGame(String gameId) async {
    await _prefs.setString('last_played_game', gameId);
  }

  String? getLastPlayedGame() {
    return _prefs.getString('last_played_game');
  }

  Future<void> clearAll() async {
    await _prefs.clear();
  }
}