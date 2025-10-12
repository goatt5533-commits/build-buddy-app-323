import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useWallpaper } from "@/contexts/WallpaperContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useState, useRef } from "react";
import { Upload, Trash2, User, Bell, Volume2 } from "lucide-react";
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

const defaultWallpapers = [
  "https://images.unsplash.com/photo-1557683316-973673baf926",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a",
];

const Settings = () => {
  const { currentWallpaper, setWallpaper } = useWallpaper();
  const { profile, resetProfile } = useUserProfile();
  const [notifications, setNotifications] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
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

  const handleDataReset = () => {
    localStorage.removeItem("focusSessions");
    localStorage.removeItem("memories");
    resetProfile();
    toast({
      title: "Data Reset",
      description: "All your data has been cleared",
      variant: "destructive",
    });
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
        <h3 className="font-semibold">Preferences</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="notifications">Notifications</Label>
          </div>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
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
            onCheckedChange={setSoundEffects}
          />
        </div>
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
