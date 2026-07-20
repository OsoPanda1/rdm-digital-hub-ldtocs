import { useState, useCallback, useEffect } from "react";

export interface UserGamificationState {
  userId: string;
  totalPoints: number;
  currentLevel: number;
  currentTier: "free" | "premium" | "elite";
  badges: string[];
  completedMissions: string[];
  streak: number;
  lastActivityDate: Date;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  pointsReward: number;
  icon: string;
  completed: boolean;
  category: "exploration" | "music" | "commerce" | "social";
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  icon: string;
  redeemable: boolean;
}

const DEFAULT_MISSIONS: Mission[] = [
  {
    id: "visit_mina",
    name: "Visita la Mina de Acosta",
    description: "Desciende 400 metros al corazón de la montaña",
    pointsReward: 100,
    icon: "⛏️",
    completed: false,
    category: "exploration",
  },
  {
    id: "listen_playlist",
    name: "Escucha 5 canciones",
    description: "Disfruta de la playlist completa de Real del Monte",
    pointsReward: 50,
    icon: "🎵",
    completed: false,
    category: "music",
  },
  {
    id: "buy_pastes",
    name: "Compra pastes auténticos",
    description: "Prueba los pastes en un comercio local",
    pointsReward: 75,
    icon: "🥧",
    completed: false,
    category: "commerce",
  },
  {
    id: "visit_panteón",
    name: "Explora el Panteón Inglés",
    description: "Descubre el único cementerio con tumbas hacia Cornwall",
    pointsReward: 80,
    icon: "🪦",
    completed: false,
    category: "exploration",
  },
  {
    id: "share_story",
    name: "Comparte tu historia",
    description: "Sube una foto o historia sobre tu visita",
    pointsReward: 60,
    icon: "📸",
    completed: false,
    category: "social",
  },
  {
    id: "complete_tour",
    name: "Completa un tour",
    description: "Termina un tour guiado de Real del Monte",
    pointsReward: 150,
    icon: "🗺️",
    completed: false,
    category: "exploration",
  },
];

const DEFAULT_REWARDS: Reward[] = [
  {
    id: "free_entry",
    name: "Entrada Gratis - Mina de Acosta",
    description: "Acceso libre a la mina",
    pointsRequired: 500,
    icon: "🎟️",
    redeemable: true,
  },
  {
    id: "discount_20",
    name: "Descuento 20% - Pastes",
    description: "Obtén 20% de descuento en pastes",
    pointsRequired: 300,
    icon: "💳",
    redeemable: true,
  },
  {
    id: "exclusive_tour",
    name: "Tour Privado Exclusivo",
    description: "Tour personalizado de 3 horas",
    pointsRequired: 800,
    icon: "👨‍🎓",
    redeemable: true,
  },
  {
    id: "vip_status",
    name: "VIP Status por 1 mes",
    description: "Acceso VIP a todos los comercios",
    pointsRequired: 1200,
    icon: "👑",
    redeemable: true,
  },
  {
    id: "digital_cert",
    name: "Certificado Digital",
    description: "Certificado de Embajador de Real del Monte",
    pointsRequired: 1000,
    icon: "📜",
    redeemable: true,
  },
];

export function useGamification(userId: string) {
  const [state, setState] = useState<UserGamificationState>({
    userId,
    totalPoints: 0,
    currentLevel: 1,
    currentTier: "free",
    badges: [],
    completedMissions: [],
    streak: 0,
    lastActivityDate: new Date(),
  });

  const [missions, setMissions] = useState<Mission[]>(DEFAULT_MISSIONS);
  const [rewards, setRewards] = useState<Reward[]>(DEFAULT_REWARDS);

  // Load user data from localStorage (in production, use API)
  useEffect(() => {
    const stored = localStorage.getItem(`gamification_${userId}`);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading gamification data", e);
      }
    }
  }, [userId]);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(`gamification_${userId}`, JSON.stringify(state));
  }, [state, userId]);

  // Calculate tier based on points
  const calculateTier = useCallback((points: number): "free" | "premium" | "elite" => {
    if (points >= 2000) return "elite";
    if (points >= 1000) return "premium";
    return "free";
  }, []);

  // Calculate level based on points
  const calculateLevel = useCallback((points: number): number => {
    return Math.floor(points / 250) + 1;
  }, []);

  // Add points for completing an activity
  const addPoints = useCallback(
    (points: number, activity: string) => {
      setState((prev) => {
        const newPoints = prev.totalPoints + points;
        const newLevel = calculateLevel(newPoints);
        const newTier = calculateTier(newPoints);

        return {
          ...prev,
          totalPoints: newPoints,
          currentLevel: newLevel,
          currentTier: newTier,
          lastActivityDate: new Date(),
          streak: prev.streak + 1,
          badges: newTier !== prev.currentTier ? [...prev.badges, `${newTier}_badge`] : prev.badges,
        };
      });

      console.log(`[Gamification] Added ${points} points for ${activity}`);
    },
    [calculateLevel, calculateTier]
  );

  // Complete a mission
  const completeMission = useCallback(
    (missionId: string) => {
      const mission = missions.find((m) => m.id === missionId);
      if (!mission || mission.completed) return;

      // Add points
      addPoints(mission.pointsReward, mission.name);

      // Mark mission as completed
      setMissions((prev) =>
        prev.map((m) => (m.id === missionId ? { ...m, completed: true } : m))
      );

      setState((prev) => ({
        ...prev,
        completedMissions: [...prev.completedMissions, missionId],
      }));

      console.log(`[Gamification] Mission completed: ${mission.name}`);
    },
    [missions, addPoints]
  );

  // Redeem a reward
  const redeemReward = useCallback(
    (rewardId: string): boolean => {
      const reward = rewards.find((r) => r.id === rewardId);
      if (!reward || !reward.redeemable) return false;

      if (state.totalPoints < reward.pointsRequired) {
        console.warn(`Insufficient points for reward ${rewardId}`);
        return false;
      }

      setState((prev) => ({
        ...prev,
        totalPoints: prev.totalPoints - reward.pointsRequired,
      }));

      console.log(`[Gamification] Redeemed reward: ${reward.name}`);
      return true;
    },
    [rewards, state.totalPoints]
  );

  // Get next reward milestone
  const getNextReward = useCallback((): Reward | null => {
    return (
      rewards.find(
        (r) =>
          r.redeemable &&
          r.pointsRequired > state.totalPoints &&
          r.pointsRequired <=
            state.totalPoints + (state.currentTier === "elite" ? 500 : 1000)
      ) || null
    );
  }, [rewards, state.totalPoints, state.currentTier]);

  // Get available missions for next interaction
  const getUncompletedMissions = useCallback((): Mission[] => {
    return missions.filter((m) => !m.completed);
  }, [missions]);

  // Track activity (generic method)
  const trackActivity = useCallback(
    (
      activityType:
        | "visit_place"
        | "listen_music"
        | "purchase"
        | "share"
        | "custom",
      customPoints?: number
    ) => {
      const pointsMap = {
        visit_place: 50,
        listen_music: 25,
        purchase: 100,
        share: 60,
        custom: customPoints || 0,
      };

      addPoints(pointsMap[activityType], activityType);
    },
    [addPoints]
  );

  // Get achievement badge based on level
  const getAchievementBadge = useCallback((): string => {
    if (state.currentLevel >= 10) return "🏆"; // Legend
    if (state.currentLevel >= 7) return "⭐"; // Master
    if (state.currentLevel >= 5) return "🎖️"; // Expert
    if (state.currentLevel >= 3) return "🔥"; // Advanced
    return "🌱"; // Novice
  }, [state.currentLevel]);

  // Get personalized message
  const getMotivationalMessage = useCallback((): string => {
    const nextMilestone = getNextReward();
    if (!nextMilestone) return "¡Eres un Embajador de Real del Monte!";

    const pointsNeeded = nextMilestone.pointsRequired - state.totalPoints;
    return `Solo ${pointsNeeded} puntos para desbloquear "${nextMilestone.name}"`;
  }, [getNextReward, state.totalPoints]);

  return {
    state,
    missions,
    rewards,
    addPoints,
    completeMission,
    redeemReward,
    getNextReward,
    getUncompletedMissions,
    trackActivity,
    getAchievementBadge,
    getMotivationalMessage,
  };
}
