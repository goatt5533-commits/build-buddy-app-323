import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Stats = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Statistics</h1>

      {/* Total Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-primary">24h 35m</p>
          <p className="text-sm text-muted-foreground">Total Focus Time</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-success">42</p>
          <p className="text-sm text-muted-foreground">Sessions Completed</p>
        </Card>
      </div>

      {/* Time Period Toggle */}
      <Tabs defaultValue="week" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
        
        <TabsContent value="week" className="space-y-4 mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Weekly Progress</h3>
            <div className="space-y-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-sm w-12">{day}</span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${Math.random() * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-4 mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Monthly Progress</h3>
            <p className="text-muted-foreground text-sm">
              Monthly statistics will be displayed here
            </p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievements */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Achievements</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">🔥 5 Day Streak</Badge>
          <Badge variant="secondary">⭐ First Session</Badge>
          <Badge variant="secondary">💯 10 Sessions</Badge>
        </div>
      </Card>
    </div>
  );
};

export default Stats;
