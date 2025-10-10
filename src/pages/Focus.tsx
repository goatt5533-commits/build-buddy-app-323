import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Focus = () => {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("");
  const [duration, setDuration] = useState(25);

  const durationOptions = [15, 25, 45, 60];

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Start Focus Session</h1>
      </div>

      <Card className="p-6 space-y-6">
        {/* Task Name Input */}
        <div className="space-y-2">
          <Label htmlFor="task">What are you working on?</Label>
          <Input
            id="task"
            placeholder="Enter task name..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="bg-background"
          />
        </div>

        {/* Duration Selection */}
        <div className="space-y-3">
          <Label>Select Duration</Label>
          <div className="grid grid-cols-4 gap-2">
            {durationOptions.map((min) => (
              <Button
                key={min}
                variant={duration === min ? "default" : "outline"}
                onClick={() => setDuration(min)}
                className="h-16"
              >
                {min}m
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom">Custom Duration (minutes)</Label>
            <Input
              id="custom"
              type="number"
              min="1"
              max="180"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="bg-background"
            />
          </div>
        </div>

        {/* Start Button */}
        <Button
          size="lg"
          className="w-full"
          disabled={!taskName.trim()}
        >
          Start {duration} Minute Focus
        </Button>
      </Card>
    </div>
  );
};

export default Focus;
