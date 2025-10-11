import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTimer } from "@/hooks/useTimer";
import { useNavigate, useLocation } from "react-router-dom";
import { Pause, Play, X } from "lucide-react";
import { useWallpaper } from "@/contexts/WallpaperContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const motivationalMessages = [
  "You're doing great! Stay focused!",
  "Every minute counts toward your goals!",
  "Focus is your superpower!",
  "You're building something amazing!",
  "Keep going, you're unstoppable!",
];

const FocusSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentWallpaper } = useWallpaper();
  const { taskName, duration } = location.state || { taskName: "Task", duration: 25 };

  const {
    formatTime,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    cancel,
    progress,
    isComplete,
  } = useTimer(duration);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (isComplete) {
      localStorage.setItem("currentTask", taskName);
      navigate("/break");
    }
  }, [isComplete, navigate, taskName]);

  const handleCancel = () => {
    cancel();
    navigate("/");
  };

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <div
      className="p-4 space-y-6 min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(rgba(26, 26, 26, 0.9), rgba(26, 26, 26, 0.9)), url(${currentWallpaper})`,
      }}
    >
      <Card className="p-8 space-y-6 max-w-sm w-full bg-card/90 backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-muted-foreground mb-2">Working on</h2>
          <h1 className="text-2xl font-bold">{taskName}</h1>
        </div>

        {/* Circular Timer Display */}
        <div className="relative flex items-center justify-center">
          <svg className="transform -rotate-90 w-64 h-64">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-secondary"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              className="text-primary transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <div className="text-5xl font-bold">{formatTime()}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          {isRunning ? (
            <Button size="lg" onClick={pause} className="w-32">
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </Button>
          ) : isPaused ? (
            <Button size="lg" onClick={resume} className="w-32">
              <Play className="mr-2 h-5 w-5" />
              Resume
            </Button>
          ) : null}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg" variant="destructive" className="w-32">
                <X className="mr-2 h-5 w-5" />
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Session?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this focus session? Your progress will not be saved.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, continue</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel}>Yes, cancel</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Motivational Message */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground italic">{randomMessage}</p>
        </div>
      </Card>
    </div>
  );
};

export default FocusSession;
