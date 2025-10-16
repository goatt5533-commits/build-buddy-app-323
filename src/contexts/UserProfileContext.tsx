import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface UserProfile {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastSessionDate: string | null;
  rank: string;
  totalFocusTime: number; // in minutes
  totalSessions: number;
  streakFreezes: number;
}

interface UserProfileContextType {
  profile: UserProfile;
  addXP: (amount: number, applyBoost?: boolean) => void;
  addCoins: (amount: number) => void;
  updateStreak: () => void;
  resetProfile: () => void;
  completeSession: (durationMinutes: number) => void;
  getActiveXPMultiplier: () => number;
  addStreakFreeze: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const INITIAL_PROFILE: UserProfile = {
  xp: 0,
  level: 1,
  coins: 0,
  streak: 0,
  lastSessionDate: null,
  rank: "Wanderer",
  totalFocusTime: 0,
  totalSessions: 0,
  streakFreezes: 0,
};

const XP_PER_LEVEL = 100;
const RANKS = [
  { name: "Wanderer", minLevel: 1 },
  { name: "Awakened", minLevel: 5 },
  { name: "Intent", minLevel: 15 },
  { name: "Disciplined", minLevel: 215 },
  { name: "Diligent", minLevel: 376 },
  { name: "Unshakened", minLevel: 543 },
  { name: "Visionery", minLevel: 770 },
  { name: "Liberated", minLevel: 1045 },
  { name: "Transcendent", minLevel: 1380 },
];

const calculateLevel = (xp: number): number => {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
};

const calculateRank = (level: number): string => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLevel) {
      return RANKS[i].name;
    }
  }
  return RANKS[0].name;
};

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("userProfile");
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }, [profile]);

  const getActiveXPMultiplier = (): number => {
    const activeBoosts = localStorage.getItem('activeBoosts');
    if (!activeBoosts) return 1;
    
    const boosts = JSON.parse(activeBoosts);
    const now = Date.now();
    const validBoosts = boosts.filter((boost: any) => boost.expiresAt > now);
    
    if (validBoosts.length === 0) return 1;
    return Math.max(...validBoosts.map((b: any) => b.multiplier));
  };

  const addXP = (amount: number, applyBoost: boolean = true) => {
    const multiplier = applyBoost ? getActiveXPMultiplier() : 1;
    const finalAmount = amount * multiplier;
    
    setProfile((prev) => {
      const newXP = prev.xp + finalAmount;
      const newLevel = calculateLevel(newXP);
      const newRank = calculateRank(newLevel);
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        rank: newRank,
      };
    });
  };

  const addCoins = (amount: number) => {
    setProfile((prev) => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    setProfile((prev) => {
      if (prev.lastSessionDate === today) {
        // Already completed a session today
        return prev;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      let newStreak = prev.streak;
      if (prev.lastSessionDate === yesterdayStr) {
        // Continuing streak
        newStreak = prev.streak + 1;
      } else if (prev.lastSessionDate === null || prev.lastSessionDate !== today) {
        // Starting new streak
        newStreak = 1;
      }

      return {
        ...prev,
        streak: newStreak,
        lastSessionDate: today,
      };
    });
  };

  const completeSession = (durationMinutes: number) => {
    // Award XP based on duration: 2 XP per minute with boost multiplier
    const baseXP = durationMinutes * 2;
    const multiplier = getActiveXPMultiplier();
    const xpEarned = baseXP * multiplier;
    // Award coins based on duration: 2 coins per minute
    const coinsEarned = durationMinutes * 2;

    setProfile((prev) => {
      const newXP = prev.xp + xpEarned;
      const newLevel = calculateLevel(newXP);
      const newRank = calculateRank(newLevel);
      
      const today = new Date().toDateString();
      let newStreak = prev.streak;
      let newStreakFreezes = prev.streakFreezes;
      
      if (prev.lastSessionDate === today) {
        // Already completed a session today
        newStreak = prev.streak;
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (prev.lastSessionDate === yesterdayStr) {
          // Continuing streak
          newStreak = prev.streak + 1;
        } else if (prev.streakFreezes > 0) {
          // Use a streak freeze to maintain streak
          newStreak = prev.streak;
          newStreakFreezes = prev.streakFreezes - 1;
        } else {
          // Starting new streak
          newStreak = 1;
        }
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        rank: newRank,
        coins: prev.coins + coinsEarned,
        streak: newStreak,
        streakFreezes: newStreakFreezes,
        lastSessionDate: today,
        totalFocusTime: prev.totalFocusTime + durationMinutes,
        totalSessions: prev.totalSessions + 1,
      };
    });
  };

  const addStreakFreeze = () => {
    setProfile((prev) => ({
      ...prev,
      streakFreezes: prev.streakFreezes + 1,
    }));
  };

  const resetProfile = () => {
    setProfile(INITIAL_PROFILE);
    localStorage.setItem("userProfile", JSON.stringify(INITIAL_PROFILE));
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        addXP,
        addCoins,
        updateStreak,
        resetProfile,
        completeSession,
        getActiveXPMultiplier,
        addStreakFreeze,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return context;
};
