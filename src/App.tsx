import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WallpaperProvider } from "./contexts/WallpaperContext";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import { MusicProvider } from "./contexts/MusicContext";
import { AppBlockProvider } from "./contexts/AppBlockContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Focus from "./pages/Focus";
import FocusSession from "./pages/FocusSession";
import Break from "./pages/Break";
import Proof from "./pages/Proof";
import Stats from "./pages/Stats";
import Memories from "./pages/Memories";
import Settings from "./pages/Settings";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WallpaperProvider>
      <UserProfileProvider>
        <MusicProvider>
          <AppBlockProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Layout><Dashboard /></Layout>} />
                  <Route path="/focus" element={<Layout><Focus /></Layout>} />
                  <Route path="/focus-session" element={<Layout><FocusSession /></Layout>} />
                  <Route path="/break" element={<Layout><Break /></Layout>} />
                  <Route path="/proof" element={<Layout><Proof /></Layout>} />
                  <Route path="/stats" element={<Layout><Stats /></Layout>} />
                  <Route path="/memories" element={<Layout><Memories /></Layout>} />
                  <Route path="/shop" element={<Layout><Shop /></Layout>} />
                  <Route path="/settings" element={<Layout><Settings /></Layout>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AppBlockProvider>
        </MusicProvider>
      </UserProfileProvider>
    </WallpaperProvider>
  </QueryClientProvider>
);

export default App;
