import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../config/app_config.dart';
import '../models/user.dart';
import '../models/game_session.dart';
import '../models/game_config.dart';

class GameProvider extends ChangeNotifier {
  GameConfig? _gameConfig;
  GameSession? _currentSession;
  UserProfile? _userProfile;
  bool _isLoading = false;
  String? _error;

  GameConfig? get gameConfig => _gameConfig;
  GameSession? get currentSession => _currentSession;
  UserProfile? get userProfile => _userProfile;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasActiveSession => _currentSession != null && !_currentSession!.isCompleted;

  Future<void> loadGameConfig() async {
    _setLoading(true);
    try {
      final response = await http.get(
        Uri.parse('${AppConfig.apiBaseUrl}/games/${AppConfig.gameId}/config'),
        headers: {'Content-Type': 'application/json'},
      );
      
      if (response.statusCode == 200) {
        _gameConfig = GameConfig.fromJson(json.decode(response.body));
        notifyListeners();
      }
    } catch (e) {
      _error = 'Error cargando configuración: $e';
    } finally {
      _setLoading(false);
    }
  }

  Future<void> startSession() async {
    if (_gameConfig == null) return;
    
    _setLoading(true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await http.post(
        Uri.parse('${AppConfig.apiBaseUrl}/games/${AppConfig.gameId}/session/start'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      
      if (response.statusCode == 200) {
        _currentSession = GameSession.fromJson(json.decode(response.body)['session']);
        notifyListeners();
      }
    } catch (e) {
      _error = 'Error iniciando sesión: $e';
    } finally {
      _setLoading(false);
    }
  }

  Future<void> completeSession({
    required int score,
    required int xpEarned,
    required int coinsEarned,
    required int durationMs,
    Map<String, dynamic>? metadata,
  }) async {
    if (_currentSession == null) return;
    
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await http.post(
        Uri.parse('${AppConfig.apiBaseUrl}/games/session/complete'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'sessionId': _currentSession!.id,
          'gameId': _gameConfig!.id,
          'score': score,
          'xpEarned': xpEarned,
          'coinsEarned': coinsEarned,
          'durationMs': durationMs,
          'metadata': metadata ?? {},
          'completedAt': DateTime.now().toIso8601String(),
        }),
      );
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _currentSession = _currentSession!.copyWith(
          isCompleted: true,
          score: score,
          xpEarned: xpEarned,
          coinsEarned: coinsEarned,
          durationMs: durationMs,
          endedAt: DateTime.now(),
        );
        notifyListeners();
      }
    } catch (e) {
      _error = 'Error completando sesión: $e';
    }
  }

  Future<void> loadUserProfile() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await http.get(
        Uri.parse('${AppConfig.apiBaseUrl}/users/profile'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      
      if (response.statusCode == 200) {
        _userProfile = UserProfile.fromJson(json.decode(response.body));
        notifyListeners();
      }
    } catch (e) {
      _error = 'Error cargando perfil: $e';
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void reset() {
    _currentSession = null;
    _gameConfig = null;
    _userProfile = null;
    _error = null;
    notifyListeners();
  }
}

class AuthProvider extends ChangeNotifier {
  User? _user;
  String? _token;
  bool _isAuthenticated = false;
  bool _isLoading = false;

  User? get user => _user;
  String? get token => _token;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;

  Future<void> initAuth() async {
    _setLoading(true);
    try {
      final prefs = await SharedPreferences.getInstance();
      _token = prefs.getString('auth_token');
      
      if (_token != null) {
        // Validar token
        final response = await http.get(
          Uri.parse('${AppConfig.apiBaseUrl}/auth/validate'),
          headers: {'Authorization': 'Bearer $_token'},
        );
        
        if (response.statusCode == 200) {
          _user = User.fromJson(json.decode(response.body)['user']);
          _isAuthenticated = true;
        } else {
          await _clearAuth();
        }
      }
    } catch (e) {
      await _clearAuth();
    } finally {
      _setLoading(false);
    }
  }

  Future<void> signInWithOAuth(String provider) async {
    _setLoading(true);
    try {
      // Redirigir a Supabase OAuth
      final uri = Uri.parse('${AppConfig.supabaseUrl}/auth/v1/authorize')
          .replace(queryParameters: {
        'provider': provider,
        'redirect_to': '${AppConfig.apiBaseUrl}/auth/callback',
        'response_type': 'code',
      });
      
      // En web, redirigir
      if (Uri.base.scheme == 'http' || Uri.base.scheme == 'https') {
        // ignore: deprecated_member_use
        await html.window.open(uri.toString(), '_self');
      }
    } catch (e) {
      rethrow;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> handleAuthCallback(String code) async {
    _setLoading(true);
    try {
      final response = await http.post(
        Uri.parse('${AppConfig.apiBaseUrl}/auth/callback'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'code': code}),
      );
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _token = data['access_token'];
        _user = User.fromJson(data['user']);
        _isAuthenticated = true;
        
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', _token!);
        
        notifyListeners();
      }
    } catch (e) {
      rethrow;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> signOut() async {
    await _clearAuth();
    notifyListeners();
  }

  Future<void> _clearAuth() async {
    _user = null;
    _token = null;
    _isAuthenticated = false;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}