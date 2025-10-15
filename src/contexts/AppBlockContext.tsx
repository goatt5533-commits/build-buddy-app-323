import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { App as CapacitorApp } from '@capacitor/app';

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

export const COMMON_APPS = [
  { id: "spotify", name: "Spotify", icon: "🎵" },
  { id: "apple-music", name: "Apple Music", icon: "🎵" },
  { id: "youtube-music", name: "YouTube Music", icon: "🎵" },
  { id: "messages", name: "Messages", icon: "💬" },
  { id: "whatsapp", name: "WhatsApp", icon: "💬" },
  { id: "telegram", name: "Telegram", icon: "💬" },
  { id: "slack", name: "Slack", icon: "💼" },
  { id: "discord", name: "Discord", icon: "💬" },
  { id: "notes", name: "Notes", icon: "📝" },
  { id: "calendar", name: "Calendar", icon: "📅" },
  { id: "clock", name: "Clock/Timer", icon: "⏰" },
  { id: "camera", name: "Camera", icon: "📷" },
  { id: "files", name: "Files", icon: "📁" },
  { id: "maps", name: "Maps", icon: "🗺️" },
];

export const AppBlockProvider = ({ children }: { children: ReactNode }) => {
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockingEnabled, setBlockingEnabled] = useState(() => {
    const saved = localStorage.getItem("appBlockingEnabled");
    return saved === "true";
  });
  const [whitelist, setWhitelist] = useState<string[]>(() => {
    const saved = localStorage.getItem("appWhitelist");
    return saved ? JSON.parse(saved) : [];
  });
  const [distractionCount, setDistractionCount] = useState(() => {
    const saved = localStorage.getItem("distractionCount");
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => { localStorage.setItem("appWhitelist", JSON.stringify(whitelist)); }, [whitelist]);
  useEffect(() => { localStorage.setItem("distractionCount", distractionCount.toString()); }, [distractionCount]);
  useEffect(() => { localStorage.setItem("appBlockingEnabled", blockingEnabled.toString()); }, [blockingEnabled]);

  const addToWhitelist = (app: string) => { if (!whitelist.includes(app)) setWhitelist([...whitelist, app]); };
  const removeFromWhitelist = (app: string) => { setWhitelist(whitelist.filter(item => item !== app)); };
  const toggleBlocking = (enabled: boolean) => { setBlockingEnabled(enabled); };
  const startBlocking = () => { setIsBlocking(true); };
  const stopBlocking = () => { setIsBlocking(false); };
  const recordDistraction = () => { setDistractionCount(prev => prev + 1); };
  const resetDistractionCount = () => { setDistractionCount(0); };

  // APK / Android native visibility detection
  useEffect(() => {
    if (!isBlocking || !blockingEnabled) return;

    let listenerHandle: any;
    CapacitorApp.addListener("appStateChange", (state) => {
      if (!state.isActive) {
        recordDistraction();
      }
    }).then(handle => {
      listenerHandle = handle;
    });

    return () => { 
      if (listenerHandle) listenerHandle.remove(); 
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
  if (!context) throw new Error("useAppBlock must be used within AppBlockProvider");
  return context;
};
