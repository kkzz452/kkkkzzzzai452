import React, { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send, Save, Share2, Paperclip, Mic } from "lucide-react";

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  onSaveConversation?: () => void;
  onShareConversation?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

const MessageInput = ({
  onSendMessage = () => {},
  onSaveConversation = () => {},
  onShareConversation = () => {},
  isLoading = false,
  placeholder = "Хабарламаңызды жазыңыз...",
}: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      console.log("Message sent:", message); // Add logging
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full bg-background border-t border-border p-4">
      <div className="flex flex-col space-y-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[80px] resize-none"
          disabled={isLoading}
        />
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              type="button"
              disabled={isLoading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              type="button"
              disabled={isLoading}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveConversation}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              Сақтау
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShareConversation}
              disabled={isLoading}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Бөлісу
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Жіберу
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
