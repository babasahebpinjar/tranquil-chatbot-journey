
import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut, Menu } from "lucide-react";

interface ChatHeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  logout: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isDarkMode, toggleDarkMode, logout }) => {
  return (
    <header className="border-b backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <div className="mr-2">
            <Menu className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-medium">CISHA AI</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleDarkMode}
            className="text-muted-foreground"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={logout}
            className="text-muted-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
