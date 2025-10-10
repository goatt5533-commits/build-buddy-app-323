import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Memories = () => {
  // Mock data for demonstration
  const memories = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    date: "2024-01-15",
    task: `Task ${i + 1}`,
  }));

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Memories</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search memories..."
          className="pl-10 bg-card"
        />
      </div>

      {/* Memories Grid */}
      <div className="grid grid-cols-2 gap-4">
        {memories.map((memory) => (
          <Card
            key={memory.id}
            className="aspect-square overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          >
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-4xl">📸</span>
            </div>
            <div className="p-2 bg-card">
              <p className="text-xs font-medium truncate">{memory.task}</p>
              <p className="text-xs text-muted-foreground">{memory.date}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Memories;
