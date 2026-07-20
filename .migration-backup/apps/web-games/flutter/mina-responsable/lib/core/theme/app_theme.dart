import 'package:flutter/material.dart';

class AppTheme {
  static const Color primary = Color(0xFFD4AF37);
  static const Color primaryLight = Color(0xFFE8C56D);
  static const Color primaryDark = Color(0xFFB8941F);
  static const Color secondary = Color(0xFF0F172A);
  static const Color background = Color(0xFFF8F5F0);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color error = Color(0xFFDC2626);

  static const Color rdmCopper = Color(0xFFD4AF37);
  static const Color rdmCopperLight = Color(0xFFE8C56D);
  static const Color rdmCopperDark = Color(0xFFB8941F);
  static const Color rdmInk = Color(0xFF0F172A);
  static const Color rdmPaper = Color(0xFFF8F5F0);
  static const Color rdmParchment = Color(0xFFDFD8CD);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: const ColorScheme.light(
      primary: rdmCopper,
      onPrimary: rdmInk,
      secondary: rdmCopperLight,
      onSecondary: rdmInk,
      surface: surface,
      onSurface: rdmInk,
      background: background,
      onBackground: rdmInk,
      error: error,
      onError: Colors.white,
    ),
    scaffoldBackgroundColor: background,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        fontFamily: 'PlayfairDisplay',
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: rdmInk,
      ),
      iconTheme: IconThemeData(color: rdmInk),
    ),
    cardTheme: CardThemeData(
      color: surface,
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      margin: const EdgeInsets.all(8),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: rdmCopper,
        foregroundColor: rdmInk,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        textStyle: const TextStyle(
          fontFamily: 'DMSans',
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: rdmCopper,
        side: const BorderSide(color: rdmCopper, width: 1.5),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        textStyle: const TextStyle(
          fontFamily: 'DMSans',
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: rdmCopper,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        textStyle: const TextStyle(
          fontFamily: 'DMSans',
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: surface,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.grey, width: 0.5),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.grey, width: 0.5),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: rdmCopper, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: error, width: 1),
      ),
      labelStyle: const TextStyle(
        fontFamily: 'DMSans',
        color: Colors.grey,
      ),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontFamily: 'PlayfairDisplay',
        fontSize: 57,
        fontWeight: FontWeight.w600,
        color: rdmInk,
      ),
      displayMedium: TextStyle(
        fontFamily: 'PlayfairDisplay',
        fontSize: 45,
        fontWeight: FontWeight.w600,
        color: rdmInk,
      ),
      displaySmall: TextStyle(
        fontFamily: 'PlayfairDisplay',
        fontSize: 36,
        fontWeight: FontWeight.w600,
        color: rdmInk,
      ),
      headlineLarge: TextStyle(
        fontFamily: 'PlayfairDisplay',
        fontSize: 32,
        fontWeight: FontWeight.w600,
        color: rdmInk,
      ),
      headlineMedium: TextStyle(
        fontFamily: 'PlayfairDisplay',
        fontSize: 28,
        fontWeight: FontWeight.w600,
        color: rdmInk,
      ),
      headlineSmall: TextStyle(
        fontFamily: 'PlayfairDisplay',
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: rdmInk,
      ),
      titleLarge: TextStyle(
        fontFamily: 'DMSans',
        fontSize: 22,
        fontWeight: FontWeight.w600,
        color: rdmInk,
      ),
      titleMedium: TextStyle(
        fontFamily: 'DMSans',
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: rdmInk,
      ),
      titleSmall: TextStyle(
        fontFamily: 'DMSans',
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: rdmInk,
      ),
      bodyLarge: TextStyle(
        fontFamily: 'DMSans',
        fontSize: 16,
        color: rdmInk,
      ),
      bodyMedium: TextStyle(
        fontFamily: 'DMSans',
        fontSize: 14,
        color: rdmInk,
      ),
      bodySmall: TextStyle(
        fontFamily: 'DMSans',
        fontSize: 12,
        color: Colors.grey,
      ),
      labelLarge: TextStyle(
        fontFamily: 'DMSans',
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: rdmInk,
      ),
    ),
    fontFamily: 'DMSans',
  );

  static ThemeData darkTheme = lightTheme.copyWith(
    brightness: Brightness.dark,
    colorScheme: const ColorScheme.dark(
      primary: rdmCopperLight,
      onPrimary: rdmInk,
      secondary: rdmCopper,
      onSecondary: rdmInk,
      surface: Color(0xFF1E1E1E),
      onSurface: Colors.white,
      background: Color(0xFF0F172A),
      onBackground: Colors.white,
      error: Color(0xFFEF4444),
      onError: Colors.white,
    ),
    scaffoldBackgroundColor: const Color(0xFF0F172A),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        fontFamily: 'PlayfairDisplay',
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: Colors.white,
      ),
      iconTheme: IconThemeData(color: Colors.white),
    ),
    cardTheme: CardThemeData(
      color: const Color(0xFF1E1E1E),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: rdmCopperLight,
        foregroundColor: rdmInk,
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: const Color(0xFF1E1E1E),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.grey, width: 0.5),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.grey, width: 0.5),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: rdmCopperLight, width: 2),
      ),
    ),
    textTheme: lightTheme.textTheme.apply(
      bodyColor: Colors.white,
      displayColor: Colors.white,
    ),
  );
}