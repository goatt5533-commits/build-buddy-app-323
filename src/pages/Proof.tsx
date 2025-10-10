import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload } from "lucide-react";

const Proof = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Capture Your Achievement</h1>
      
      <Card className="p-6 space-y-4">
        <p className="text-center text-muted-foreground">
          Take a photo of your completed work to earn your rewards!
        </p>

        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
          <Camera className="h-16 w-16 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <Button className="w-full" size="lg">
            <Camera className="mr-2 h-5 w-5" />
            Take Photo
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            <Upload className="mr-2 h-5 w-5" />
            Upload from Gallery
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Proof;
