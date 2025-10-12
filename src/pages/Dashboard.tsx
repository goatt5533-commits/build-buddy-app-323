import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Coins, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallpaper } from "@/contexts/WallpaperContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentWallpaper } = useWallpaper();
  const { profile } = useUserProfile();
  const [coinCount, setCoinCount] = useState(0);
  const [displayXP, setDisplayXP] = useState(0);

  useEffect(() => {
    // Animate coin counter
    let start = 0;
    const end = profile.coins;
    const duration = 1000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCoinCount(end);
        clearInterval(timer);
      } else {
        setCoinCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [profile.coins]);

  useEffect(() => {
    // Animate XP counter
    let start = 0;
    const end = profile.xp;
    const duration = 800;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayXP(end);
        clearInterval(timer);
      } else {
        setDisplayXP(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [profile.xp]);

  return (
    <div 
      className="p-4 space-y-6 min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(rgba(26, 26, 26, 0.85), rgba(26, 26, 26, 0.85)), url(${currentWallpaper})`,
      }}
    >
      {/* Header with rank and avatar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FocusForge</h1>
          <Badge variant="secondary" className="mt-1">
            {profile.rank}
          </Badge>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
          {profile.rank.charAt(0)}
        </div>
      </div>

      {/* XP Progress */}
      <Card className="p-4 space-y-2 bg-card/80 backdrop-blur-sm">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Level {profile.level}</span>
          <span className="text-muted-foreground">{displayXP} / {profile.level * 1000} XP</span>
        </div>
        <Progress value={(displayXP % 1000) / 10} className="h-3" />
      </Card>

      {/* Coins and Streak */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 flex items-center gap-3 bg-card/80 backdrop-blur-sm">
          <Coins className="h-6 w-6 text-warning animate-glow" />
          <div>
            <p className="text-2xl font-bold">{coinCount}</p>
            <p className="text-xs text-muted-foreground">Coins</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 bg-card/80 backdrop-blur-sm">
          <Flame className="h-6 w-6 text-destructive animate-glow" />
          <div>
            <p className="text-2xl font-bold">{profile.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </Card>
      </div>

      {/* Start Focus Button */}
      <Button
        size="lg"
        className="w-full h-16 text-lg font-bold bg-primary hover:bg-primary/90 animate-float"
        onClick={() => navigate("/focus")}
      >
        <PlayCircle className="mr-2 h-6 w-6" />
        Start Focus Session
      </Button>

      {/* Quick Stats */}
      <Card className="p-4 bg-card/80 backdrop-blur-sm">
        <h3 className="font-semibold mb-3">Total Progress</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-success">
              {Math.floor(profile.totalFocusTime / 60)}h {profile.totalFocusTime % 60}m
            </p>
            <p className="text-xs text-muted-foreground">Focus Time</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">{profile.totalSessions}</p>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
