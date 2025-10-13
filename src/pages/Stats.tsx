import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useWallpaper } from "@/contexts/WallpaperContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useAppBlock } from "@/contexts/AppBlockContext";

interface SessionData {
  duration: number;
  timestamp: string;
  taskName: string;
}

const Stats = () => {
  const { currentWallpaper } = useWallpaper();
  const { profile } = useUserProfile();
  const { distractionCount } = useAppBlock();
  const [sessions, setSessions] = useState<SessionData[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("focusSessions");
    if (stored) {
      const sessionData: SessionData[] = JSON.parse(stored);
      setSessions(sessionData);
    }
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getWeeklyData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const weekData = Array(7).fill(0);

    sessions.forEach(session => {
      const sessionDate = new Date(session.timestamp);
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 7) {
        weekData[sessionDate.getDay()] += session.duration;
      }
    });

    const maxTime = Math.max(...weekData, 1);
    return days.map((day, i) => ({
      day,
      time: weekData[i],
      percentage: (weekData[i] / maxTime) * 100
    }));
  };

  const weeklyData = getWeeklyData();

  return (
    <div 
      className="p-4 space-y-6 min-h-screen"
      style={{
        backgroundImage: currentWallpaper ? `url(${currentWallpaper})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="text-2xl font-bold">Statistics</h1>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center bg-card/95 backdrop-blur-sm">
          <p className="text-3xl font-bold text-primary">{formatTime(profile.totalFocusTime)}</p>
          <p className="text-sm text-muted-foreground">Total Focus Time</p>
        </Card>
        <Card className="p-4 text-center bg-card/95 backdrop-blur-sm">
          <p className="text-3xl font-bold text-success">{profile.totalSessions}</p>
          <p className="text-sm text-muted-foreground">Sessions Completed</p>
        </Card>
      </div>

      <Tabs defaultValue="week" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
        
        <TabsContent value="week" className="space-y-4 mt-4">
          <Card className="p-4 bg-card/95 backdrop-blur-sm">
            <h3 className="font-semibold mb-3">Weekly Progress</h3>
            <div className="space-y-2">
              {weeklyData.map((data) => (
                <div key={data.day} className="flex items-center gap-3">
                  <span className="text-sm w-12">{data.day}</span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-right">
                    {data.time > 0 ? formatTime(data.time) : ''}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-4 mt-4">
          <Card className="p-4 bg-card/95 backdrop-blur-sm">
            <h3 className="font-semibold mb-3">Monthly Progress</h3>
            <div className="text-center py-8">
              <p className="text-4xl font-bold text-primary mb-2">
                {sessions.filter(s => {
                  const sessionDate = new Date(s.timestamp);
                  const now = new Date();
                  return sessionDate.getMonth() === now.getMonth() && 
                         sessionDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
              <p className="text-sm text-muted-foreground">Sessions This Month</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-4 bg-card/95 backdrop-blur-sm">
        <h3 className="font-semibold mb-3">Achievements</h3>
        <div className="flex flex-wrap gap-2">
          {profile.streak >= 1 && <Badge variant="secondary">⭐ First Session</Badge>}
          {profile.totalSessions >= 10 && <Badge variant="secondary">💯 10 Sessions</Badge>}
          {profile.streak >= 3 && <Badge variant="secondary">🔥 3 Day Streak</Badge>}
          {profile.streak >= 5 && <Badge variant="secondary">🔥 5 Day Streak</Badge>}
          {profile.streak >= 7 && <Badge variant="secondary">🔥 7 Day Streak</Badge>}
          {profile.totalFocusTime >= 60 && <Badge variant="secondary">⏰ 1 Hour Focus</Badge>}
          {profile.totalFocusTime >= 600 && <Badge variant="secondary">⏰ 10 Hours Focus</Badge>}
        </div>
      </Card>
    </div>
  );
};

export default Stats;
