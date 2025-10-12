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
}

interface UserProfileContextType {
  profile: UserProfile;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  updateStreak: () => void;
  resetProfile: () => void;
  completeSession: (durationMinutes: number) => void;
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
};

const XP_PER_LEVEL = 100;
const RANKS = [
  { name: "Wanderer", minLevel: 1 },
  { name: "Awakened", minLevel: 5 },
  { name: "Intent", minLevel: 10 },
  { name: "Disciplined", minLevel: 25 },
  { name: "Diligent", minLevel: 50 },
  { name: "Unshakened", minLevel: 75 },
  { name: "Visionery", minLevel: 100 },
  { name: "Liberated", minLevel: 150 },
  { name: "Transcendent", minLevel: 200 },
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

  const addXP = (amount: number) => {
    setProfile((prev) => {
      const newXP = prev.xp + amount;
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
    // Award XP based on duration: 10 XP per minute
    const xpEarned = durationMinutes * 10;
    // Award coins based on duration: 2 coins per minute
    const coinsEarned = durationMinutes * 2;

    setProfile((prev) => {
      const newXP = prev.xp + xpEarned;
      const newLevel = calculateLevel(newXP);
      const newRank = calculateRank(newLevel);
      
      const today = new Date().toDateString();
      let newStreak = prev.streak;
      
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
        lastSessionDate: today,
        totalFocusTime: prev.totalFocusTime + durationMinutes,
        totalSessions: prev.totalSessions + 1,
      };
    });
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
