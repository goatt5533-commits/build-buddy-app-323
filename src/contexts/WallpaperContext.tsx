import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface WallpaperContextType {
  currentWallpaper: string;
  setWallpaper: (url: string) => void;
  defaultWallpapers: string[];
}

const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined);

const DEFAULT_WALLPAPERS = [
  "https://images.unsplash.com/photo-1557683316-973673baf926",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
];

export const WallpaperProvider = ({ children }: { children: ReactNode }) => {
  const [currentWallpaper, setCurrentWallpaper] = useState(() => {
    return localStorage.getItem("wallpaper") || DEFAULT_WALLPAPERS[0];
  });

  const setWallpaper = (url: string) => {
    setCurrentWallpaper(url);
    localStorage.setItem("wallpaper", url);
  };

  return (
    <WallpaperContext.Provider
      value={{
        currentWallpaper,
        setWallpaper,
        defaultWallpapers: DEFAULT_WALLPAPERS,
      }}
    >
      {children}
    </WallpaperContext.Provider>
  );
};

export const useWallpaper = () => {
  const context = useContext(WallpaperContext);
  if (!context) {
    throw new Error("useWallpaper must be used within WallpaperProvider");
  }
  return context;
};
