import 'dart:js_interop';
import 'dart:html' as html;

import 'package:flutter/material.dart';

class GameIframe extends StatefulWidget {
  final String src;
  final Function(Map<String, dynamic>) onMessage;

  const GameIframe({
    super.key,
    required this.src,
    required this.onMessage,
  });

  @override
  State<GameIframe> createState() => _GameIframeState();
}

class _GameIframeState extends State<GameIframe> {
  late final html.IFrameElement _iframe;
  bool _isLoaded = false;

  @override
  void initState() {
    super.initState();
    _setupIframe();
  }

  void _setupIframe() {
    _iframe = html.IFrameElement()
      ..src = widget.src
      ..style.width = '100%'
      ..style.height = '100%'
      ..style.border = 'none'
      ..allow = 'fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      ..sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-downloads allow-presentation allow-top-navigation-by-user-activation'
      ..referrerPolicy = 'strict-origin-when-cross-origin'
      ..onLoad.listen((_) {
        setState(() => _isLoaded = true);
        // Enviar mensaje de inicialización al iframe
        _postMessage({
          'type': 'INIT',
          'origin': 'rdm-web-games',
        });
      });

    // Escuchar mensajes del iframe
    html.window.addEventListener('message', _handleMessage);

    // Agregar al DOM
    html.document.body?.children.add(_iframe);
  }

  void _handleMessage(html.MessageEvent event) {
    // Verificar origen
    if (!event.origin.endsWith('rdm-digital-hub-ldtocs-main') && 
        !event.origin.endsWith('localhost') &&
        !event.origin.endsWith('visitarealdelmonte.online')) {
      return;
    }

    try {
      final data = event.data;
      if (data is Map<String, dynamic>) {
        widget.onMessage(data);
      }
    } catch (e) {
      debugPrint('Error processing iframe message: $e');
    }
  }

  void _postMessage(Map<String, dynamic> message) {
    if (_iframe.contentWindow != null) {
      _iframe.contentWindow!.postMessage(message.jsify(), '*');
    }
  }

  @override
  void dispose() {
    html.window.removeEventListener('message', _handleMessage);
    _iframe.remove();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Iframe container
        Container(
          width: double.infinity,
          height: double.infinity,
          child: HtmlElementView(
            viewType: 'game-iframe',
            onPlatformViewCreated: (id) {
              // Registrar el iframe
            },
          ),
        ),
        
        // Loading overlay
        if (!_isLoaded)
          Container(
            color: Theme.of(context).colorScheme.background,
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Theme.of(context).colorScheme.primary),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Cargando juego...',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onBackground.withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

// Register the platform view
class HtmlElementView extends StatelessWidget {
  final String viewType;
  final Function(int) onPlatformViewCreated;

  const HtmlElementView({
    super.key,
    required this.viewType,
    required this.onPlatformViewCreated,
  });

  @override
  Widget build(BuildContext context) {
    return PlatformViewLink(
      viewType: viewType,
      surfaceFactory: (context, controller) {
        return AndroidViewSurface(
          controller: controller as AndroidViewController,
          gestureRecognizers: const <Factory<OneSequenceGestureRecognizer>>{},
          hitTestBehavior: PlatformViewHitTestBehavior.opaque,
        );
      },
      onCreatePlatformView: (params) {
        return PlatformViewsService.initSurfaceWebView(
          id: params.id,
          viewType: viewType,
          layoutDirection: TextDirection.ltr,
          onPlatformViewCreated: params.onPlatformViewCreated,
        );
      },
    );
  }
}