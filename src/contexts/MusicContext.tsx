import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface MusicContextType {
  currentPlaylist: string;
  isPlaying: boolean;
  volume: number;
  setPlaylist: (playlist: string) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const playlists = [
  { id: "lofi", name: "Lo-Fi Beats", description: "Chill lo-fi hip hop beats" },
  { id: "rain", name: "Rain Sounds", description: "Relaxing rain ambience" },
  { id: "ambient", name: "Ambient", description: "Soft ambient soundscapes" },
  { id: "beats", name: "Focus Beats", description: "Upbeat focus music" },
  { id: "none", name: "No Music", description: "Silence for deep focus" },
];

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [currentPlaylist, setCurrentPlaylist] = useState(() => {
    return localStorage.getItem("musicPlaylist") || "none";
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem("musicVolume");
    return saved ? parseInt(saved) : 50;
  });

  const setPlaylist = (playlist: string) => {
    setCurrentPlaylist(playlist);
    localStorage.setItem("musicPlaylist", playlist);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem("musicVolume", newVolume.toString());
  };

  return (
    <MusicContext.Provider
      value={{
        currentPlaylist,
        isPlaying,
        volume,
        setPlaylist,
        togglePlay,
        setVolume,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within MusicProvider");
  }
  return context;
};
