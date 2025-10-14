import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useWallpaper } from "@/contexts/WallpaperContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useMusic, playlists } from "@/contexts/MusicContext";
import { useAppBlock, COMMON_APPS } from "@/contexts/AppBlockContext";
import { useState, useRef } from "react";
import { Upload, Trash2, User, Bell, Volume2, Music, Check, Shield, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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

const Settings = () => {
  const { currentWallpaper, setWallpaper, defaultWallpapers } = useWallpaper();
  const { profile, resetProfile } = useUserProfile();
  const { currentPlaylist, volume, setPlaylist, setVolume } = useMusic();
  const { blockingEnabled, whitelist, distractionCount, addToWhitelist, removeFromWhitelist, toggleBlocking, resetDistractionCount } = useAppBlock();
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("notifications") === "true";
  });
  const [customAppName, setCustomAppName] = useState("");
  const [soundEffects, setSoundEffects] = useState(() => {
    const saved = localStorage.getItem("soundEffects");
    return saved === null ? true : saved === "true";
  });
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setWallpaper(imageUrl);
        toast({
          title: "Wallpaper Updated",
          description: "Your custom wallpaper has been set",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setNotifications(true);
          localStorage.setItem("notifications", "true");
          toast({
            title: "Notifications Enabled",
            description: "You'll receive focus session reminders",
          });
        } else {
          setNotifications(false);
          localStorage.setItem("notifications", "false");
          toast({
            title: "Permission Denied",
            description: "Please enable notifications in your browser settings",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Not Supported",
          description: "Your browser doesn't support notifications",
          variant: "destructive",
        });
      }
    } else {
      setNotifications(false);
      localStorage.setItem("notifications", "false");
    }
  };

  const handleSoundToggle = (checked: boolean) => {
    setSoundEffects(checked);
    localStorage.setItem("soundEffects", checked.toString());
  };

  const handleDataReset = () => {
    localStorage.removeItem("focusSessions");
    localStorage.removeItem("memories");
    resetProfile();
    resetDistractionCount();
    toast({
      title: "Data Reset",
      description: "All your data has been cleared",
      variant: "destructive",
    });
  };

  const handleToggleApp = (appId: string) => {
    if (whitelist.includes(appId)) {
      removeFromWhitelist(appId);
      toast({
        title: "App Removed",
        description: "This app will now count as a distraction",
      });
    } else {
      addToWhitelist(appId);
      toast({
        title: "App Whitelisted",
        description: "This app won't count as a distraction",
      });
    }
  };

  const handleAddCustomApp = () => {
    if (customAppName.trim()) {
      addToWhitelist(customAppName.trim());
      setCustomAppName("");
      toast({
        title: "App Added",
        description: `${customAppName} added to whitelist`,
      });
    }
  };

  return (
    <div 
      className="p-4 space-y-6 min-h-screen"
      style={{
        backgroundImage: currentWallpaper ? `url(${currentWallpaper})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card className="p-4 bg-card/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Profile</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold">
            {profile.rank.charAt(0)}
          </div>
          <div>
            <p className="font-medium">Rank: {profile.rank}</p>
            <p className="text-sm text-muted-foreground">Level {profile.level}</p>
            <p className="text-sm text-muted-foreground">{profile.xp} XP • {profile.coins} Coins</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card/95 backdrop-blur-sm">
        <h3 className="font-semibold mb-4">Wallpaper</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {defaultWallpapers.map((url, index) => (
            <div
              key={index}
              className={`aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                currentWallpaper === url ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setWallpaper(url)}
            >
              <img src={url} alt={`Wallpaper ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleWallpaperUpload}
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Custom Wallpaper
        </Button>
      </Card>

      <Card className="p-4 bg-card/95 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Music className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Music</h3>
        </div>
        
        <div className="space-y-3">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => {
                setPlaylist(playlist.id);
                toast({
                  title: "Music Updated",
                  description: `Selected: ${playlist.name}`,
                });
              }}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                currentPlaylist === playlist.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{playlist.name}</p>
                  <p className="text-xs text-muted-foreground">{playlist.description}</p>
                </div>
                {currentPlaylist === playlist.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>

        {currentPlaylist !== "none" && (
          <div className="pt-2">
            <Label className="text-sm">Volume: {volume}%</Label>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="mt-2"
            />
          </div>
        )}
      </Card>

      <Card className="p-4 bg-card/95 backdrop-blur-sm space-y-4">
        <h3 className="font-semibold">Preferences</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="notifications">Notifications</Label>
          </div>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={handleNotificationToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="sound">Sound Effects</Label>
          </div>
          <Switch
            id="sound"
            checked={soundEffects}
            onCheckedChange={handleSoundToggle}
          />
        </div>
      </Card>

      <Card className="p-4 bg-card/95 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Focus Mode</h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Label htmlFor="blocking">Distraction Tracking</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Track when you leave the app during focus sessions
            </p>
          </div>
          <Switch
            id="blocking"
            checked={blockingEnabled}
            onCheckedChange={toggleBlocking}
          />
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Distractions</span>
            <span className="text-lg font-bold text-destructive">{distractionCount}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Times you switched away during focus sessions
          </p>
        </div>

        {blockingEnabled && (
          <div className="space-y-3 pt-2 border-t">
            <div>
              <Label className="text-sm font-medium">Allowed Apps</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Select apps that won't count as distractions during focus sessions
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {COMMON_APPS.map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleToggleApp(app.id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    whitelist.includes(app.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{app.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{app.name}</p>
                    </div>
                    {whitelist.includes(app.id) && (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Label className="text-sm font-medium">Add Custom App</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Enter app name"
                  value={customAppName}
                  onChange={(e) => setCustomAppName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomApp()}
                />
                <Button size="icon" onClick={handleAddCustomApp}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {whitelist.filter(app => !COMMON_APPS.find(ca => ca.id === app)).length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Custom Apps</Label>
                {whitelist
                  .filter(app => !COMMON_APPS.find(ca => ca.id === app))
                  .map((app) => (
                    <div key={app} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-sm">{app}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          removeFromWhitelist(app);
                          toast({
                            title: "App Removed",
                            description: `${app} removed from whitelist`,
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </Card>

      <Card className="p-4 bg-card/95 backdrop-blur-sm">
        <h3 className="font-semibold mb-4">Data Management</h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Reset All Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your focus sessions, memories, and progress data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDataReset}>Reset Data</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
};

export default Settings;
