
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  loading: boolean;
  setActiveFeature: (feature: string | null) => void;
  processSpecialCommands: (message: string) => boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  handleSendMessage,
  loading,
  setActiveFeature,
  processSpecialCommands
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
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
  );
};

export default ChatInput;
