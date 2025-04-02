
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import { Message } from "@/contexts/ChatContext";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, loading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
  );
};

export default ChatMessages;
