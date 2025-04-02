
import React from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Timer, Quote, BookHeart, Sparkles,
  Heart, Volume2, Moon, LogOut
} from "lucide-react";

interface ChatSidebarProps {
  username: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  logout: () => void;
  clearMessages: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setActiveFeature: (feature: string | null) => void;
  closeSidebar: () => void;
  processSpecialCommands: (message: string) => boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  username,
  isDarkMode,
  toggleDarkMode,
  logout,
  clearMessages,
  sidebarOpen,
  setSidebarOpen,
  setActiveFeature,
  closeSidebar,
  processSpecialCommands
}) => {
  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <div className="flex flex-col h-full">
          <div className="py-4">
            <h2 className="text-2xl font-light mb-4">CISHA AI</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your personal spiritual assistant to guide you on your journey of inner peace.
            </p>
            
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="space-y-4 mt-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => {
                    setActiveFeature("meditation");
                    closeSidebar();
                  }}
                >
                  <Timer className="h-4 w-4 mr-2" />
                  Meditation Timer
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveFeature("quote");
                    closeSidebar();
                  }}
                >
                  <Quote className="h-4 w-4 mr-2" />
                  Daily Quote
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveFeature("prayer");
                    closeSidebar();
                  }}
                >
                  <BookHeart className="h-4 w-4 mr-2" />
                  Prayer Request
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    processSpecialCommands("Please suggest a positive affirmation for me");
                    closeSidebar();
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Affirmation
                </Button>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4" />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4" />
                    <Label htmlFor="sound">Sound Effects</Label>
                  </div>
                  <Switch id="sound" />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive"
                  onClick={() => {
                    clearMessages();
                    toast({
                      title: "Chat Cleared",
                      description: "Your conversation history has been cleared."
                    });
                  }}
                >
                  Clear Chat History
                </Button>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-auto pb-4">
            <div className="flex items-center px-4 py-2 mb-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-spiritual-deep" />
                <div>
                  <p className="text-sm font-medium">Logged in as</p>
                  <p className="text-xs text-muted-foreground">{username}</p>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSidebar;
