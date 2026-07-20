import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface PointsData {
  available: number;
  earned: number;
  redeemed: number;
  tier: 'Base' | 'Guardian' | 'Ambassador';
  multiplier: number;
  nextRewardAt: number;
}

export interface PointsActivity {
  id: string;
  type: 'game' | 'quiz' | 'tour' | 'purchase' | 'referral';
  points: number;
  description: string;
  timestamp: Date;
}

export function useGamificationPoints() {
  const queryClient = useQueryClient();
  const [localPoints, setLocalPoints] = useState<PointsData | null>(null);

  // Fetch user's points
  const { data: pointsData, isLoading } = useQuery({
    queryKey: ['user-points'],
    queryFn: async (): Promise<PointsData> => {
      const res = await fetch('/api/gamification/points', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch points');
      return res.json();
    },
    staleTime: 30_000,
  });

  // Fetch points activity history
  const { data: activity = [] } = useQuery({
    queryKey: ['points-activity'],
    queryFn: async (): Promise<PointsActivity[]> => {
      const res = await fetch('/api/gamification/activity', {
        credentials: 'include',
      });
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Add points mutation
  const { mutate: addPoints } = useMutation({
    mutationFn: async ({
      points,
      type,
      description,
    }: {
      points: number;
      type: string;
      description: string;
    }) => {
      const res = await fetch('/api/gamification/points/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ points, type, description }),
      });
      if (!res.ok) throw new Error('Failed to add points');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-points'] });
      queryClient.invalidateQueries({ queryKey: ['points-activity'] });
    },
  });

  // Redeem points mutation
  const { mutate: redeemPoints } = useMutation({
    mutationFn: async ({
      points,
      rewardId,
    }: {
      points: number;
      rewardId: string;
    }) => {
      const res = await fetch('/api/gamification/points/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ points, rewardId }),
      });
      if (!res.ok) throw new Error('Failed to redeem points');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-points'] });
    },
  });

  // Upgrade tier mutation
  const { mutate: upgradeTier } = useMutation({
    mutationFn: async (tier: 'Guardian' | 'Ambassador') => {
      const res = await fetch('/api/gamification/tier/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tier }),
      });
      if (!res.ok) throw new Error('Failed to upgrade tier');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-points'] });
    },
  });

  // Calculate points needed for next reward
  const pointsToNextReward = useCallback((): number => {
    if (!pointsData) return 0;
    const rewardThresholds = [100, 250, 500, 1000, 2500];
    const nextThreshold = rewardThresholds.find(
      (t) => pointsData.available < t
    ) || rewardThresholds[rewardThresholds.length - 1];
    return nextThreshold - pointsData.available;
  }, [pointsData]);

  // Get multiplier bonus text
  const multiplierBonus = useCallback((): string => {
    if (!pointsData) return '1x';
    switch (pointsData.tier) {
      case 'Guardian':
        return '2x (Guardián)';
      case 'Ambassador':
        return '3x (Embajador)';
      default:
        return '1x';
    }
  }, [pointsData]);

  return {
    points: pointsData || localPoints,
    activity,
    isLoading,
    addPoints,
    redeemPoints,
    upgradeTier,
    pointsToNextReward: pointsToNextReward(),
    multiplierBonus: multiplierBonus(),
  };
}
