import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallpaper } from "@/contexts/WallpaperContext";

const tips = [
  "💧 Stay hydrated - drink some water",
  "🧘 Stretch your body and move around",
  "👀 Rest your eyes - look at something far away",
  "🌬️ Take deep breaths and relax",
  "🚶 Take a short walk if possible"
];

const Break = () => {
  const navigate = useNavigate();
  const { currentWallpaper } = useWallpaper();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const { timeRemaining, start, isComplete } = useTimer(5);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (isComplete) {
      navigate("/proof");
    }
  }, [isComplete, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSkip = () => {
    navigate("/proof");
  };

  return (
    <div 
      className="p-4 space-y-6 flex flex-col items-center justify-center min-h-[80vh] transition-all duration-500"
      style={{
        backgroundImage: currentWallpaper ? `url(${currentWallpaper})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Coffee className="h-24 w-24 text-accent animate-float drop-shadow-glow" />
      
      <Card className="p-6 space-y-4 text-center max-w-sm bg-card/95 backdrop-blur-sm">
        <h1 className="text-3xl font-bold">Break Time!</h1>
        <p className="text-muted-foreground">
          You've earned a break. Relax and recharge!
        </p>
        
        <div className="text-6xl font-bold text-primary my-6 animate-pulse">
          {formatTime(timeRemaining)}
        </div>

        <div className="min-h-[60px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground transition-all duration-500">
            {tips[currentTipIndex]}
          </p>
        </div>

        <Button variant="outline" className="w-full mt-4" onClick={handleSkip}>
          Skip Break
        </Button>
      </Card>
    </div>
  );
};

export default Break;
