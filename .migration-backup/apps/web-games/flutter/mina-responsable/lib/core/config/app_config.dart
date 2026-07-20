class AppConfig {
  static String apiBaseUrl = '';
  static String supabaseUrl = '';
  static String supabaseAnonKey = '';
  static String stripePublishableKey = '';
  static String gameId = 'mina-responsable';
  static String gameSlug = 'mina-responsable';
  static String gameVersion = '1.0.0';
  static bool isDevelopment = false;

  static Future<void> loadFromEnv() async {
    // En web, las variables se pasan via --dart-define o se inyectan en index.html
    apiBaseUrl = const String.fromEnvironment('API_BASE_URL', defaultValue: 'https://api.rdm-digital.com');
    supabaseUrl = const String.fromEnvironment('SUPABASE_URL', defaultValue: '');
    supabaseAnonKey = const String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: '');
    stripePublishableKey = const String.fromEnvironment('STRIPE_PUBLISHABLE_KEY', defaultValue: '');
    gameId = const String.fromEnvironment('GAME_ID', defaultValue: 'mina-responsable');
    gameSlug = const String.fromEnvironment('GAME_SLUG', defaultValue: 'mina-responsable');
    gameVersion = const String.fromEnvironment('GAME_VERSION', defaultValue: '1.0.0');
    isDevelopment = const bool.fromEnvironment('IS_DEVELOPMENT', defaultValue: false);
  }
}