
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import ChatMessage from "@/components/ChatMessage";
import MeditationTimer from "@/components/MeditationTimer";
import DailyQuote from "@/components/DailyQuote";
import PrayerRequest from "@/components/PrayerRequest";
import { sendChatMessage, getAffirmations, AFFIRMATIONS } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { 
  Send, Moon, Sun, LogOut, Menu, 
  Timer, Quote, MessageSquare, 
  Sparkles, Heart, Volume2, BookHeart 
} from "lucide-react";

const Chat: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { messages, addMessage, clearMessages, loading, setLoading } = useChat();
  const [inputValue, setInputValue] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      // Focus input for next message
      inputRef.current?.focus();
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-spiritual-light dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="border-b backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
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
                            addMessage("Please suggest a positive affirmation for me", "user");
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
                          <p className="text-xs text-muted-foreground">{user?.username}</p>
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
        {activeFeature === "meditation" && (
          <div className="mb-4">
            <MeditationTimer 
              onComplete={() => setActiveFeature(null)}
              onClose={() => setActiveFeature(null)}
            />
          </div>
        )}
        
        {activeFeature === "quote" && (
          <div className="mb-4">
            <DailyQuote />
          </div>
        )}
        
        {activeFeature === "prayer" && (
          <div className="mb-4">
            <PrayerRequest onClose={() => setActiveFeature(null)} />
          </div>
        )}
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {loading && (
              <div className="flex items-center space-x-2 animate-pulse">
                <div className="h-2 w-2 rounded-full bg-spiritual-deep"></div>
                <div className="h-2 w-2 rounded-full bg-spiritual-deep"></div>
                <div className="h-2 w-2 rounded-full bg-spiritual-deep"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Chat Input */}
        <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex space-x-2"
          >
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about spirituality..."
              className="input-spiritual"
              autoComplete="off"
            />
            <Button 
              type="submit"
              size="icon" 
              className="h-12 w-12 bg-spiritual-deep hover:bg-spiritual-deep/90"
              disabled={!inputValue.trim() || loading}
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <div className="mt-2 text-xs text-center text-muted-foreground">
            <button 
              onClick={() => setActiveFeature("meditation")}
              className="hover:text-foreground transition-colors duration-200 mx-1"
            >
              Start meditation
            </button> | 
            <button 
              onClick={() => {
                addMessage("What's today's inspirational quote?", "user");
                processSpecialCommands("What's today's inspirational quote?");
              }}
              className="hover:text-foreground transition-colors duration-200 mx-1"
            >
              Get quote
            </button> | 
            <button 
              onClick={() => setActiveFeature("prayer")}
              className="hover:text-foreground transition-colors duration-200 mx-1"
            >
              Prayer request
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
