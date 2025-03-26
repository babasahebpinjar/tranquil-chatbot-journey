
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (content: string, sender: "user" | "assistant") => void;
  clearMessages: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Load messages from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedMessages = localStorage.getItem(`cisha_messages_${user.username}`);
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
          // Convert string timestamps back to Date objects
          const messagesWithDates = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
        } catch (error) {
          console.error("Failed to parse stored messages:", error);
          setMessages([]);
        }
      } else {
        // Add welcome message for new users
        setMessages([
          {
            id: "welcome",
            sender: "assistant",
            content: "Welcome to CISHA AI 🙏. How may I assist you on your spiritual journey today?",
            timestamp: new Date()
          }
        ]);
      }
    }
  }, [user]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`cisha_messages_${user.username}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  const addMessage = (content: string, sender: "user" | "assistant") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    if (user) {
      localStorage.removeItem(`cisha_messages_${user.username}`);
      setMessages([{
        id: "welcome",
        sender: "assistant",
        content: "Welcome to CISHA AI 🙏. How may I assist you on your spiritual journey today?",
        timestamp: new Date()
      }]);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages, loading, setLoading }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
