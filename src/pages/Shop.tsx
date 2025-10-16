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
  type: 'boost' | 'cosmetic';
  effect?: {
    duration?: number; // in minutes
    multiplier?: number;
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
    id: 'bronze_medal',
    name: 'Bronze Medal',
    description: 'A badge of honor for your dedication',
    price: 50,
    icon: Award,
    type: 'cosmetic'
  },
  {
    id: 'silver_medal',
    name: 'Silver Medal',
    description: 'A prestigious achievement medal',
    price: 150,
    icon: Award,
    type: 'cosmetic'
  },
  {
    id: 'gold_medal',
    name: 'Gold Medal',
    description: 'The ultimate symbol of excellence',
    price: 300,
    icon: Star,
    type: 'cosmetic'
  }
];

const Shop = () => {
  const { currentWallpaper } = useWallpaper();
  const { profile, addCoins } = useUserProfile();
  const [ownedItems, setOwnedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('ownedShopItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeBoosts, setActiveBoosts] = useState<any[]>(() => {
    const saved = localStorage.getItem('activeBoosts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ownedShopItems', JSON.stringify(ownedItems));
  }, [ownedItems]);

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
    } else {
      // Add to owned items
      if (!ownedItems.includes(item.id)) {
        setOwnedItems(prev => [...prev, item.id]);
      }

      toast({
        title: "Purchase Successful! 🎉",
        description: `You've acquired ${item.name}!`,
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

          {/* Medals Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Medals & Achievements</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {SHOP_ITEMS.filter(item => item.type === 'cosmetic').map((item) => {
                const Icon = item.icon;
                const isOwned = ownedItems.includes(item.id);
                return (
                  <Card key={item.id} className={`hover:border-primary transition-colors ${isOwned ? 'bg-primary/5' : ''}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${isOwned ? 'text-primary' : 'text-muted-foreground'}`} />
                        {item.name}
                        {isOwned && <Badge variant="secondary">Owned</Badge>}
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
                          disabled={profile.coins < item.price || isOwned}
                          size="sm"
                        >
                          {isOwned ? 'Owned' : 'Purchase'}
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
