import { useWallpaper } from "@/contexts/WallpaperContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Zap, Award, Star, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: any;
  type: 'boost' | 'utility' | 'conversion';
  effect?: {
    duration?: number; // in minutes
    multiplier?: number;
    xpAmount?: number;
  };
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'double_xp_30',
    name: '2x XP Boost',
    description: '30 minutes of double XP earnings',
    price: 100,
    icon: Zap,
    type: 'boost',
    effect: { duration: 30, multiplier: 2 }
  },
  {
    id: 'double_xp_60',
    name: '2x XP Boost',
    description: '60 minutes of double XP earnings',
    price: 180,
    icon: Zap,
    type: 'boost',
    effect: { duration: 60, multiplier: 2 }
  },
  {
    id: 'triple_xp_30',
    name: '3x XP Boost',
    description: '30 minutes of triple XP earnings',
    price: 250,
    icon: TrendingUp,
    type: 'boost',
    effect: { duration: 30, multiplier: 3 }
  },
  {
    id: 'streak_freeze',
    name: 'Streak Freeze',
    description: 'Protects your streak for one missed day',
    price: 100,
    icon: Award,
    type: 'utility'
  },
  {
    id: 'coins_to_xp_50',
    name: '10 XP',
    description: 'Convert 50 coins to 10 XP',
    price: 50,
    icon: Star,
    type: 'conversion',
    effect: { xpAmount: 10 }
  },
  {
    id: 'coins_to_xp_100',
    name: '20 XP',
    description: 'Convert 100 coins to 20 XP',
    price: 100,
    icon: Star,
    type: 'conversion',
    effect: { xpAmount: 20 }
  },
  {
    id: 'coins_to_xp_250',
    name: '50 XP',
    description: 'Convert 250 coins to 50 XP',
    price: 250,
    icon: Star,
    type: 'conversion',
    effect: { xpAmount: 50 }
  }
];

const Shop = () => {
  const { currentWallpaper } = useWallpaper();
  const { profile, addCoins, addXP, addStreakFreeze } = useUserProfile();
  const [streakFreezes, setStreakFreezes] = useState<number>(() => {
    const saved = localStorage.getItem('streakFreezes');
    return saved ? parseInt(saved) : 0;
  });
  const [activeBoosts, setActiveBoosts] = useState<any[]>(() => {
    const saved = localStorage.getItem('activeBoosts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('streakFreezes', streakFreezes.toString());
  }, [streakFreezes]);

  useEffect(() => {
    localStorage.setItem('activeBoosts', JSON.stringify(activeBoosts));
  }, [activeBoosts]);

  // Check and remove expired boosts
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveBoosts(prev => {
        const active = prev.filter(boost => boost.expiresAt > now);
        if (active.length !== prev.length) {
          toast({
            title: "Boost Expired",
            description: "One of your XP boosts has ended.",
          });
        }
        return active;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePurchase = (item: ShopItem) => {
    if (profile.coins < item.price) {
      toast({
        title: "Insufficient Coins",
        description: `You need ${item.price - profile.coins} more coins to purchase this item.`,
        variant: "destructive",
      });
      return;
    }

    // Deduct coins
    addCoins(-item.price);

    if (item.type === 'boost' && item.effect) {
      // Activate boost
      const expiresAt = Date.now() + (item.effect.duration! * 60 * 1000);
      setActiveBoosts(prev => [...prev, {
        id: item.id,
        name: item.name,
        multiplier: item.effect!.multiplier,
        expiresAt
      }]);

      toast({
        title: "Boost Activated! 🚀",
        description: `${item.name} is now active for ${item.effect.duration} minutes!`,
      });
    } else if (item.type === 'utility') {
      // Add streak freeze
      setStreakFreezes(prev => prev + 1);
      addStreakFreeze();

      toast({
        title: "Streak Freeze Acquired! ❄️",
        description: `You now have ${streakFreezes + 1} streak freeze(s). It will automatically protect your streak if you miss a day.`,
      });
    } else if (item.type === 'conversion' && item.effect?.xpAmount) {
      // Convert coins to XP
      addXP(item.effect.xpAmount, false);

      toast({
        title: "XP Gained! ⭐",
        description: `Converted coins to ${item.effect.xpAmount} XP!`,
      });
    }
  };

  const getActiveMultiplier = () => {
    if (activeBoosts.length === 0) return 1;
    return Math.max(...activeBoosts.map(b => b.multiplier));
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="min-h-screen pb-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${currentWallpaper})` }}
    >
      <div className="min-h-screen bg-background/80 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 pt-6">
            <h1 className="text-4xl font-bold text-foreground">Shop</h1>
            <div className="flex items-center justify-center gap-2">
              <Coins className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-foreground">{profile.coins}</span>
              <span className="text-muted-foreground">coins</span>
            </div>
          </div>

          {/* Active Boosts */}
          {activeBoosts.length > 0 && (
            <Card className="bg-primary/10 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary animate-pulse" />
                  Active Boosts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {activeBoosts.map((boost, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                    <span className="font-medium">{boost.name}</span>
                    <Badge variant="secondary">
                      {formatTime(boost.expiresAt - Date.now())}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* XP Boosts Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">XP Boosts</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {SHOP_ITEMS.filter(item => item.type === 'boost').map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.id} className="hover:border-primary transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        {item.name}
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="h-5 w-5 text-primary" />
                          <span className="text-xl font-bold">{item.price}</span>
                        </div>
                        <Button 
                          onClick={() => handlePurchase(item)}
                          disabled={profile.coins < item.price}
                          size="sm"
                        >
                          Purchase
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Utilities Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Utilities</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {SHOP_ITEMS.filter(item => item.type === 'utility').map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.id} className="hover:border-primary transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        {item.name}
                        {item.type === 'utility' && streakFreezes > 0 && (
                          <Badge variant="secondary">{streakFreezes} owned</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="h-5 w-5 text-primary" />
                          <span className="text-xl font-bold">{item.price}</span>
                        </div>
                        <Button 
                          onClick={() => handlePurchase(item)}
                          disabled={profile.coins < item.price}
                          size="sm"
                        >
                          Purchase
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Coin Conversion Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Coin to XP Conversion</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {SHOP_ITEMS.filter(item => item.type === 'conversion').map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.id} className="hover:border-primary transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        {item.name}
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="h-5 w-5 text-primary" />
                          <span className="text-xl font-bold">{item.price}</span>
                        </div>
                        <Button 
                          onClick={() => handlePurchase(item)}
                          disabled={profile.coins < item.price}
                          size="sm"
                        >
                          Convert
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
