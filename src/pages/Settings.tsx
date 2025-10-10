import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";

const Settings = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile Section */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
            A
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Apprentice</h3>
            <p className="text-sm text-muted-foreground">Level 1</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold">Appearance</h3>
        <Button variant="outline" className="w-full justify-between">
          Wallpaper
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Card>

      {/* App Behavior */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold">App Behavior</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Notifications</Label>
          <Switch id="notifications" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="blocking">Distraction Blocking</Label>
          <Switch id="blocking" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="music">Auto-play Music</Label>
          <Switch id="music" />
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold">Data Management</h3>
        <Button variant="outline" className="w-full">
          Backup Data
        </Button>
        <Button variant="destructive" className="w-full">
          Reset All Data
        </Button>
      </Card>
    </div>
  );
};

export default Settings;
