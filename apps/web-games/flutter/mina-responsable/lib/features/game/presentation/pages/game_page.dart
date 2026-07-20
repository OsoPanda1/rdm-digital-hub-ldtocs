import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_web_plugins/flutter_web_plugins.dart';

import '../core/config/app_config.dart';
import '../features/game/presentation/providers/game_provider.dart';
import 'widgets/game_iframe.dart';
import 'widgets/game_header.dart';
import 'widgets/game_controls.dart';

class GamePage extends StatefulWidget {
  const GamePage({super.key});

  @override
  State<GamePage> createState() => _GamePageState();
}

class _GamePageState extends State<GamePage> with WidgetsBindingObserver {
  bool _isFullscreen = false;
  bool _isMuted = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initializeGame();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused || state == AppLifecycleState.detached) {
      // Pausar el juego si es necesario
    }
  }

  Future<void> _initializeGame() async {
    final provider = context.read<GameProvider>();
    await provider.loadGameConfig();
    await provider.loadUserProfile();
    await provider.startSession();
  }

  void _toggleFullscreen() {
    setState(() {
      _isFullscreen = !_isFullscreen;
    });
  }

  void _toggleMute() {
    setState(() {
      _isMuted = !_isMuted;
    });
    // Enviar mensaje al iframe
    _sendToIframe({'type': 'SET_MUTED', muted: _isMuted});
  }

  void _sendToIframe(Map<String, dynamic> message) {
    // Enviar mensaje al iframe del juego
    // En web, se usa window.postMessage
  }

  void _handleGameMessage(Map<String, dynamic> message) {
    final provider = context.read<GameProvider>();
    
    switch (message['type']) {
      case 'GAME_COMPLETE':
        final payload = message['payload'] as Map<String, dynamic>;
        provider.completeSession(
          score: payload['score'] as int,
          xpEarned: payload['xpEarned'] as int,
          coinsEarned: payload['coinsEarned'] as int,
          durationMs: payload['durationMs'] as int,
          metadata: payload['metadata'] as Map<String, dynamic>?,
        );
        break;
      case 'GAME_ERROR':
        // Manejar error del juego
        break;
      case 'GAME_READY':
        // Juego cargado
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Game iframe
          Positioned.fill(
            child: Consumer<GameProvider>(
              builder: (context, provider, _) {
                if (provider.isLoading || provider.gameConfig == null) {
                  return _buildLoadingScreen();
                }
                
                return GameIframe(
                  src: provider.gameConfig!.iframeUrl,
                  onMessage: _handleGameMessage,
                );
              },
            ),
          ),
          
          // Header overlay
          if (!_isFullscreen) _buildHeader(provider),
          
          // Controls overlay
          if (!_isFullscreen) _buildControls(provider),
          
          // Fullscreen button
          _buildFullscreenButton(),
        ],
      ),
    );
  }

  Widget _buildLoadingScreen() {
    return Container(
      color: Theme.of(context).colorScheme.background,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primary),
            ),
            const SizedBox(height: 24),
            Text(
              'Cargando Mina Responsable...',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                color: Theme.of(context).colorScheme.onBackground,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Preparando tu partida minera ética',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).colorScheme.onBackground.withOpacity(0.7),
              ),
            ),
          ],
        ),
      );
    }

  GameProvider get provider => context.read<GameProvider>();

  Widget _buildHeader(GameProvider provider) {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      child: SafeArea(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Theme.of(context).colorScheme.background.withOpacity(0.95),
                Colors.transparent,
              ],
            ),
          ),
          child: Row(
            children: [
              // Back button
              IconButton(
                onPressed: () => _showExitConfirmation(),
                icon: Icon(
                  Icons.arrow_back_rounded,
                  color: Theme.of(context).colorScheme.onBackground,
                ),
                tooltip: 'Salir del juego',
              ),
              
              // Game info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Mina Responsable',
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: Theme.of(context).colorScheme.primary,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'DMSans',
                      ),
                    ),
                    Text(
                      provider.gameConfig?.name ?? 'Cargando...',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onBackground,
                        fontFamily: 'PlayfairDisplay',
                      ),
                    ),
                  ],
                ),
              ),
              
              // Free runs indicator
              Consumer<GameProvider>(
                builder: (context, provider, _) {
                  final remainingFree = provider.remainingFreeRuns ?? 0;
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: remainingFree > 0 
                          ? Theme.of(context).colorScheme.primaryContainer
                          : Theme.of(context).colorScheme.errorContainer,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          remainingFree > 0 ? Icons.free_breakfast : Icons.lock_rounded,
                          size: 16,
                          color: remainingFree > 0
                              ? Theme.of(context).colorScheme.onPrimaryContainer
                              : Theme.of(context).colorScheme.onErrorContainer,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          remainingFree > 0 ? '$remainingFree gratis hoy' : 'Sin runs gratis',
                          style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: remainingFree > 0
                                ? Theme.of(context).colorScheme.onPrimaryContainer
                                : Theme.of(context).colorScheme.onErrorContainer,
                            fontWeight: FontWeight.w600,
                            fontFamily: 'DMSans',
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
              
              // Mute/Fullscreen
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    onPressed: _toggleMute,
                    icon: Icon(
                      _isMuted ? Icons.volume_off_rounded : Icons.volume_up_rounded,
                      color: Theme.of(context).colorScheme.onBackground,
                    ),
                    tooltip: _isMuted ? 'Activar sonido' : 'Silenciar',
                  ),
                  IconButton(
                    onPressed: _toggleFullscreen,
                    icon: Icon(
                      _isFullscreen ? Icons.fullscreen_exit_rounded : Icons.fullscreen_rounded,
                      color: Theme.of(context).colorScheme.onBackground,
                    ),
                    tooltip: _isFullscreen ? 'Salir pantalla completa' : 'Pantalla completa',
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    }

  Widget _buildControls(GameProvider provider) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: SafeArea(
        top: false,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.bottomCenter,
              end: Alignment.topCenter,
              colors: [
                Theme.of(context).colorScheme.background.withOpacity(0.95),
                Colors.transparent,
              ],
            ),
          ),
          child: GameControls(
            remainingFree: provider.remainingFreeRuns ?? 0,
            canPlayFree: provider.canPlayFree,
            onStartGame: () => provider.startSession(),
            onBuyPack: () => _showPurchaseDialog(),
            onBuyBooster: () => _showBoosterDialog(),
          ),
        ),
      ),
    );
  }

  Widget _buildFullscreenButton() {
    return Positioned(
      bottom: 100,
      right: 16,
      child: SafeArea(
        child: FloatingActionButton.small(
          onPressed: _toggleFullscreen,
          backgroundColor: Theme.of(context).colorScheme.primary,
          foregroundColor: Theme.of(context).colorScheme.onPrimary,
          child: Icon(_isFullscreen ? Icons.fullscreen_exit_rounded : Icons.fullscreen_rounded),
          tooltip: _isFullscreen ? 'Salir pantalla completa' : 'Pantalla completa',
        ),
      ),
    );
  }

  void _toggleMute() {
    setState(() {
      _isMuted = !_isMuted;
    });
    _sendToIframe({'type': 'SET_MUTED', 'muted': _isMuted});
  }

  void _showExitConfirmation() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('¿Salir de la partida?'),
        content: Text(
          provider.currentSession != null && !provider.currentSession!.isCompleted
              ? 'Tu progreso no se guardará si sales ahora. ¿Seguro que quieres salir?'
              : '¿Seguro que quieres salir?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Continuar jugando'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
            },
            child: const Text('Salir y perder progreso'),
          ),
        ],
      ),
    );
  }

  void _showPurchaseDialog() {
    // Mostrar diálogo de compra de pack
  }

  void _showBoosterDialog() {
    // Mostrar diálogo de compra de booster
  }
}