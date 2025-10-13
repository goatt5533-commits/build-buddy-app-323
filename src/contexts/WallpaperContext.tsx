import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import wallpaper1 from "@/Assets/Wallpaper/55fce50581da2a61e4ed28680c7d0714.jpg";
import wallpaper2 from "@/Assets/Wallpaper/Abstract-geometric-iPhone-wallpaper-ieditwalls-iDownloadBlog-5.png";
import wallpaper3 from "@/Assets/Wallpaper/Abstract-geometric-iPhone-wallpaper-ieditwalls-iDownloadBlog-7.png";
import wallpaper4 from "@/Assets/Wallpaper/HD-wallpaper-life-motivation-study-motivation-quotes.jpg";
import wallpaper5 from "@/Assets/Wallpaper/HD-wallpaper-tumblr-metropolis-metropolitan-area-city-cityscape-urban-area-realistic-city.jpg";
import wallpaper6 from "@/Assets/Wallpaper/pexels-george-desipris-2055100.jpg";

interface WallpaperContextType {
  currentWallpaper: string;
  setWallpaper: (url: string) => void;
  defaultWallpapers: string[];
}

const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined);

const DEFAULT_WALLPAPERS = [
  wallpaper1,
  wallpaper2,
  wallpaper3,
  wallpaper4,
  wallpaper5,
  wallpaper6,
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
