import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AppBlockContextType {
  isBlocking: boolean;
  blockingEnabled: boolean;
  whitelist: string[];
  distractionCount: number;
  addToWhitelist: (app: string) => void;
  removeFromWhitelist: (app: string) => void;
  toggleBlocking: (enabled: boolean) => void;
  startBlocking: () => void;
  stopBlocking: () => void;
  recordDistraction: () => void;
  resetDistractionCount: () => void;
}

const AppBlockContext = createContext<AppBlockContextType | undefined>(undefined);

const DEFAULT_WHITELIST = [
  "lovable.app",
  "localhost",
];

export const AppBlockProvider = ({ children }: { children: ReactNode }) => {
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockingEnabled, setBlockingEnabled] = useState(() => {
    const saved = localStorage.getItem("appBlockingEnabled");
    return saved === "true";
  });
  const [whitelist, setWhitelist] = useState<string[]>(() => {
    const saved = localStorage.getItem("appWhitelist");
    return saved ? JSON.parse(saved) : DEFAULT_WHITELIST;
  });
  const [distractionCount, setDistractionCount] = useState(() => {
    const saved = localStorage.getItem("distractionCount");
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("appWhitelist", JSON.stringify(whitelist));
  }, [whitelist]);

  useEffect(() => {
    localStorage.setItem("distractionCount", distractionCount.toString());
  }, [distractionCount]);

  useEffect(() => {
    localStorage.setItem("appBlockingEnabled", blockingEnabled.toString());
  }, [blockingEnabled]);

  const addToWhitelist = (app: string) => {
    if (!whitelist.includes(app)) {
      setWhitelist([...whitelist, app]);
    }
  };

  const removeFromWhitelist = (app: string) => {
    setWhitelist(whitelist.filter(item => item !== app));
  };

  const toggleBlocking = (enabled: boolean) => {
    setBlockingEnabled(enabled);
  };

  const startBlocking = () => {
    setIsBlocking(true);
  };

  const stopBlocking = () => {
    setIsBlocking(false);
  };

  const recordDistraction = () => {
    setDistractionCount(prev => prev + 1);
  };

  const resetDistractionCount = () => {
    setDistractionCount(0);
  };

  // Monitor visibility changes during blocking
  useEffect(() => {
    if (!isBlocking || !blockingEnabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordDistraction();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isBlocking, blockingEnabled]);

  return (
    <AppBlockContext.Provider
      value={{
        isBlocking,
        blockingEnabled,
        whitelist,
        distractionCount,
        addToWhitelist,
        removeFromWhitelist,
        toggleBlocking,
        startBlocking,
        stopBlocking,
        recordDistraction,
        resetDistractionCount,
      }}
    >
      {children}
    </AppBlockContext.Provider>
  );
};

export const useAppBlock = () => {
  const context = useContext(AppBlockContext);
  if (!context) {
    throw new Error("useAppBlock must be used within AppBlockProvider");
  }
  return context;
};
