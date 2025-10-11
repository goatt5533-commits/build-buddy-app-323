import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, Sparkles, Coins } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWallpaper } from "@/contexts/WallpaperContext";
import { useToast } from "@/hooks/use-toast";

const Proof = () => {
  const navigate = useNavigate();
  const { currentWallpaper } = useWallpaper();
  const { toast } = useToast();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access or upload from gallery instead.",
        variant: "destructive"
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        
        // Stop camera
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setIsCameraActive(false);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMemory = () => {
    // Store memory (will be integrated with Supabase later)
    const memory = {
      image: capturedImage,
      timestamp: new Date().toISOString(),
      taskName: localStorage.getItem("currentTask") || "Focus Session",
    };
    
    const memories = JSON.parse(localStorage.getItem("memories") || "[]");
    memories.push(memory);
    localStorage.setItem("memories", JSON.stringify(memories));

    // Show reward animation
    setShowReward(true);
    
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsCameraActive(false);
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
      <h1 className="text-2xl font-bold text-center">Capture Your Achievement</h1>
      
      <Card className="p-6 space-y-4 bg-card/95 backdrop-blur-sm">
        <p className="text-center text-muted-foreground">
          Take a photo of your completed work to earn your rewards!
        </p>

        <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
          {!capturedImage && !isCameraActive && (
            <Camera className="h-16 w-16 text-muted-foreground" />
          )}
          
          {isCameraActive && (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          
          {capturedImage && (
            <img 
              src={capturedImage} 
              alt="Captured proof" 
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {!capturedImage && (
          <div className="space-y-2">
            {!isCameraActive ? (
              <>
                <Button className="w-full" size="lg" onClick={startCamera}>
                  <Camera className="mr-2 h-5 w-5" />
                  Take Photo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload from Gallery
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </>
            ) : (
              <Button className="w-full" size="lg" onClick={capturePhoto}>
                <Camera className="mr-2 h-5 w-5" />
                Capture
              </Button>
            )}
          </div>
        )}

        {capturedImage && !showReward && (
          <div className="space-y-2">
            <Button className="w-full" size="lg" onClick={handleSaveMemory}>
              <Sparkles className="mr-2 h-5 w-5" />
              Save & Claim Rewards
            </Button>
            <Button variant="outline" className="w-full" onClick={handleRetake}>
              Retake Photo
            </Button>
          </div>
        )}
      </Card>

      {showReward && (
        <Card className="p-8 space-y-6 text-center bg-card/95 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
          <div className="space-y-4">
            <Sparkles className="h-16 w-16 text-accent mx-auto animate-pulse" />
            <h2 className="text-3xl font-bold text-success">Congratulations!</h2>
            <p className="text-muted-foreground">You've earned your rewards!</p>
          </div>

          <div className="flex justify-center gap-8 text-2xl font-bold">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span>+50 XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-8 w-8 text-warning" />
              <span>+10 Coins</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">Returning to dashboard...</p>
        </Card>
      )}
    </div>
  );
};

export default Proof;
