import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";

const Break = () => {
  return (
    <div className="p-4 space-y-6 flex flex-col items-center justify-center min-h-[80vh]">
      <Coffee className="h-24 w-24 text-accent animate-float" />
      
      <Card className="p-6 space-y-4 text-center max-w-sm">
        <h1 className="text-3xl font-bold">Break Time!</h1>
        <p className="text-muted-foreground">
          You've earned a 5-minute break. Relax and recharge!
        </p>
        
        <div className="text-6xl font-bold text-primary my-6">
          5:00
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>💧 Stay hydrated</p>
          <p>🧘 Stretch your body</p>
          <p>👀 Rest your eyes</p>
        </div>

        <Button variant="outline" className="w-full mt-4">
          Skip Break
        </Button>
      </Card>
    </div>
  );
};

export default Break;
