import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useWallpaper } from "@/contexts/WallpaperContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Memory {
  image: string;
  timestamp: string;
  taskName: string;
}

const Memories = () => {
  const { currentWallpaper } = useWallpaper();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("memories");
    if (stored) {
      setMemories(JSON.parse(stored));
    }
  }, []);

  const filteredMemories = memories.filter((memory) =>
    memory.taskName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDelete = (memoryToDelete: Memory, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const updated = memories.filter(m => m.timestamp !== memoryToDelete.timestamp);
    setMemories(updated);
    localStorage.setItem("memories", JSON.stringify(updated));
    setSelectedMemory(null);
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
      <h1 className="text-2xl font-bold">Memories</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search memories..."
          className="pl-10 bg-card/95 backdrop-blur-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredMemories.length === 0 ? (
        <Card className="p-8 text-center bg-card/95 backdrop-blur-sm">
          <p className="text-muted-foreground">
            {searchQuery ? "No memories found matching your search." : "No memories yet. Complete a focus session to create your first memory!"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredMemories.map((memory, index) => (
            <Card
              key={index}
              className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all bg-card/95 backdrop-blur-sm relative group"
              onClick={() => setSelectedMemory(memory)}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={memory.image} 
                  alt={memory.taskName}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDelete(memory, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate">{memory.taskName}</p>
                <p className="text-xs text-muted-foreground">{formatDate(memory.timestamp)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedMemory?.taskName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img 
              src={selectedMemory?.image} 
              alt={selectedMemory?.taskName}
              className="w-full rounded-lg"
            />
            <p className="text-sm text-muted-foreground">
              {selectedMemory && formatDate(selectedMemory.timestamp)}
            </p>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => selectedMemory && handleDelete(selectedMemory)}
            >
              <X className="mr-2 h-4 w-4" />
              Delete Memory
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Memories;
