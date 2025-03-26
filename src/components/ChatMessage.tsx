
import React from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/contexts/ChatContext";
import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === "user";
  
  return (
    <div
      className={cn(
        "flex items-start gap-3 animate-fade-in mb-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn(
        "h-9 w-9",
        isUser ? "bg-primary text-primary-foreground" : "bg-spiritual-deep text-white"
      )}>
        <span className="text-sm font-semibold">
          {isUser ? "You" : "AI"}
        </span>
      </Avatar>
      
      <div
        className={cn(
          "glass-card rounded-xl px-4 py-3 max-w-[85%] md:max-w-[70%]",
          isUser ? "rounded-tr-sm bg-primary/10" : "rounded-tl-sm"
        )}
      >
        <div className="text-sm md:text-base whitespace-pre-wrap">
          {message.content}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
