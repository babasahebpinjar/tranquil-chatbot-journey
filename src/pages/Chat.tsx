import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { sendChatMessage, getAffirmations, AFFIRMATIONS } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut } from "lucide-react";

// Import our new components
import ChatHeader from "@/components/ChatHeader";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import FeaturePanel from "@/components/FeaturePanel";

const Chat: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { messages, addMessage, clearMessages, loading, setLoading } = useChat();
  const [inputValue, setInputValue] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Handle theme toggling
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message || loading || !user) return;

    // Clear input
    setInputValue("");
    
    // Process message for special commands
    if (processSpecialCommands(message)) {
      return;
    }

    // Add user message to chat
    addMessage(message, "user");
    
    // Send to API
    setLoading(true);
    try {
      const response = await sendChatMessage(user.username, message);
      
      // Format the response with sources if available
      let formattedResponse = response.response || "I don't know how to respond to that.";
      
      // Add sources if they exist
      if (response.sources && response.sources.length > 0) {
        formattedResponse += "\n\nSources: " + response.sources.join(", ");
      }
      
      addMessage(formattedResponse, "assistant");
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage("I'm sorry, I encountered an error. Please try again later.", "assistant");
    } finally {
      setLoading(false);
    }
  };

  const processSpecialCommands = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    
    // Meditation timer command
    if (lowerMessage.includes("meditation") && 
        (lowerMessage.includes("start") || lowerMessage.includes("begin"))) {
      // Extract minutes from the message (default to 5)
      const minutesMatch = lowerMessage.match(/(\d+)\s*minute/);
      const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 5;
      
      addMessage(message, "user");
      addMessage(`Starting a ${minutes}-minute meditation session. Find a comfortable position, close your eyes, and focus on your breath.`, "assistant");
      setActiveFeature("meditation");
      return true;
    }
    
    // Daily quote command
    if (lowerMessage.includes("quote") || 
        (lowerMessage.includes("daily") && lowerMessage.includes("wisdom"))) {
      addMessage(message, "user");
      const quotes = getAffirmations("gratitude");
      const quote = `Here's today's inspirational quote: "${quotes[0]}"`;
      addMessage(quote, "assistant");
      setActiveFeature("quote");
      return true;
    }
    
    // Prayer request command
    if (lowerMessage.includes("prayer") && 
        (lowerMessage.includes("submit") || lowerMessage.includes("request"))) {
      addMessage(message, "user");
      addMessage("I'd be honored to receive your prayer request. Please share what's in your heart.", "assistant");
      setActiveFeature("prayer");
      return true;
    }
    
    // Affirmation command
    if (lowerMessage.includes("affirmation") || lowerMessage.includes("positive")) {
      addMessage(message, "user");
      
      // Detect mood from message
      let moodType: keyof typeof AFFIRMATIONS = "peace";
      if (lowerMessage.includes("love")) moodType = "love";
      else if (lowerMessage.includes("strength")) moodType = "strength";
      else if (lowerMessage.includes("grow")) moodType = "growth";
      else if (lowerMessage.includes("gratitude") || lowerMessage.includes("thankful")) moodType = "gratitude";
      
      const affirmations = getAffirmations(moodType);
      const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      
      addMessage(`Here's an affirmation for you: "${randomAffirmation}" Repeat this to yourself with belief and conviction.`, "assistant");
      return true;
    }

    return false;
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-spiritual-light dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <div className="hidden">
        <ChatHeader 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
          logout={logout} 
        />
      </div>
      
      <header className="border-b backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <ChatSidebar
              username={user?.username || ""}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              logout={logout}
              clearMessages={clearMessages}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              setActiveFeature={setActiveFeature}
              closeSidebar={closeSidebar}
              processSpecialCommands={processSpecialCommands}
            />
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
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-4">
        {/* Feature Panels */}
        <FeaturePanel 
          activeFeature={activeFeature} 
          setActiveFeature={setActiveFeature} 
        />
        
        {/* Chat Messages */}
        <ChatMessages 
          messages={messages} 
          loading={loading} 
        />
        
        {/* Chat Input */}
        <ChatInput 
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          loading={loading}
          setActiveFeature={setActiveFeature}
          processSpecialCommands={processSpecialCommands}
        />
      </main>
    </div>
  );
};

export default Chat;
