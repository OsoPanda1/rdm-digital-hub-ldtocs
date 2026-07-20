import 'package:flutter/material.dart';

class GameControls extends StatelessWidget {
  final int remainingFree;
  final bool canPlayFree;
  final VoidCallback onStartGame;
  final VoidCallback onBuyPack;
  final VoidCallback onBuyBooster;

  const GameControls({
    super.key,
    required this.remainingFree,
    required this.canPlayFree,
    required this.onStartGame,
    required this.onBuyPack,
    required this.onBuyBooster,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Main action buttons
        Row(
          children: [
            // Start game button
            Expanded(
              flex: 2,
              child: FilledButton.icon(
                onPressed: canPlayFree ? onStartGame : null,
                icon: Icon(
                  canPlayFree ? Icons.play_arrow_rounded : Icons.lock_rounded,
                  size: 20,
                ),
                label: Text(
                  canPlayFree
                      ? 'Jugar (${remainingFree > 0 ? '$remainingFree gratis' : 'Pack requerido'})'
                      : 'Comprar pack',
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                    fontFamily: 'DMSans',
                  ),
                ),
                style: FilledButton.styleFrom(
                  backgroundColor: canPlayFree
                      ? Theme.of(context).colorScheme.primary
                      : Theme.of(context).colorScheme.secondaryContainer,
                  foregroundColor: canPlayFree
                      ? Theme.of(context).colorScheme.onPrimary
                      : Theme.of(context).colorScheme.onSecondaryContainer,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  disabledBackgroundColor: Theme.of(context).colorScheme.surfaceContainerHighest,
                ),
              ),
            ),
            
            const SizedBox(width: 12),
            
            // Booster button
            Expanded(
              child: OutlinedButton.icon(
                onPressed: onBuyBooster,
                icon: const Icon(Icons.auto_fix_high_rounded, size: 20),
                label: const Text(
                  'Boosters',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                    fontFamily: 'DMSans',
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Theme.of(context).colorScheme.primary,
                  side: BorderSide(color: Theme.of(context).colorScheme.primary),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 12),
        
        // Secondary actions
        Row(
          children: [
            // Buy pack
            Expanded(
              child: OutlinedButton.icon(
                onPressed: onBuyPack,
                icon: const Icon(Icons.card_giftcard_rounded, size: 18),
                label: const Text(
                  'Comprar Pack',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                    fontFamily: 'DMSans',
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Theme.of(context).colorScheme.onSurfaceVariant,
                  side: BorderSide(color: Theme.of(context).colorScheme.outlineVariant),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
            
            const SizedBox(width: 8),
            
            // Tier info
            Expanded(
              child: Consumer<GameProvider>(
                builder: (context, provider, _) {
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          _getTierIcon(provider.userTier),
                          size: 16,
                          color: _getTierColor(provider.userTier),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'Tier: ${provider.userTier}',
                          style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                            fontWeight: FontWeight.w600,
                            fontFamily: 'DMSans',
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
        
        // Free runs indicator
        if (remainingFree > 0) ...[
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primaryContainer.withOpacity(0.3),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.free_breakfast_rounded,
                  size: 14,
                  color: Theme.of(context).colorScheme.onPrimaryContainer,
                ),
                const SizedBox(width: 6),
                Text(
                  'Te quedan $remainingFree run${remainingFree == 1 ? '' : 's'} gratis hoy',
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: Theme.of(context).colorScheme.onPrimaryContainer,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'DMSans',
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  IconData _getTierIcon(String tier) {
    switch (tier) {
      case 'EMBAJADOR': return Icons.star_rounded;
      case 'GUARDIAN': return Icons.shield_rounded;
      case 'CUIDADO': return Icons.favorite_rounded;
      case 'BASE':
      default: return Icons.circle_rounded;
    }
  }

  Color _getTierColor(String tier) {
    switch (tier) {
      case 'EMBAJADOR': return Colors.purple;
      case 'GUARDIAN': return Colors.green;
      case 'CUIDADO': return Colors.amber;
      case 'BASE':
      default: return Colors.grey;
    }
  }
}