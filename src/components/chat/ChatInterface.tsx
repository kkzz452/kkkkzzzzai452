import React, { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Info, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  characterName?: string;
  characterImage?: string;
}

interface ChatInterfaceProps {
  messages?: Message[];
  isTyping?: boolean;
  onSendMessage?: (message: string) => void;
  onSaveConversation?: () => void;
  onShareConversation?: () => void;
  characterName?: string;
  characterImage?: string;
  characterDescription?: string;
}

const ChatInterface = ({
  messages = [
    {
      id: "1",
      content:
        "Сәлеметсіз бе! Мен Абай Құнанбаевпын. Сізбен сөйлесуге қуаныштымын.",
      sender: "ai",
      timestamp: new Date(Date.now() - 3600000),
      characterName: "Абай Құнанбаев",
      characterImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abai",
    },
    {
      id: "2",
      content: "Сәлеметсіз бе, Абай! Сіздің өлеңдеріңіз туралы айтып берсеңіз.",
      sender: "user",
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      id: "3",
      content:
        'Менің өлеңдерім қазақ халқының өмірі мен мәдениетін көрсетеді. Мен әділдік, білім және адамгершілік туралы жаздым. Менің ең танымал шығармаларымның бірі - "Қара сөздер".',
      sender: "ai",
      timestamp: new Date(Date.now() - 1200000),
      characterName: "Абай Құнанбаев",
      characterImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abai",
    },
  ],
  isTyping = false,
  onSendMessage = () => {},
  onSaveConversation = () => {},
  onShareConversation = () => {},
  characterName = "Абай Құнанбаев",
  characterImage = "https://api.dicebear.com/7.x/avataaars/svg?seed=Abai",
  characterDescription = "Абай Құнанбаев (1845-1904) - великий казахский поэт, композитор, просветитель, мыслитель и общественный деятель. Основоположник казахской письменной литературы и литературного языка.",
}: ChatInterfaceProps) => {
  const [showCharacterInfo, setShowCharacterInfo] = useState(true);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (message: string) => {
    onSendMessage(message);
    setInputMessage("");
  };

  return (
    <Card className="flex flex-col h-[700px] w-full max-w-[1000px] bg-white shadow-md">
      {showCharacterInfo && (
        <div className="bg-blue-50 p-3 flex items-center justify-between border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={characterImage} alt={characterName} />
              <AvatarFallback>{characterName?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-blue-900">{characterName}</h3>
              <p className="text-sm text-blue-700 line-clamp-1">
                {characterDescription}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCharacterInfo(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} isTyping={isTyping} />
        </div>
        <div className="mt-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            onSaveConversation={onSaveConversation}
            onShareConversation={onShareConversation}
            isLoading={isTyping}
            placeholder="Хабарламаңызды жазыңыз..."
          />
        </div>
      </CardContent>
      {!showCharacterInfo && (
        <div className="p-2 border-t flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCharacterInfo(true)}
            className="text-xs flex items-center text-blue-600"
          >
            <Info className="h-3 w-3 mr-1" />
            Кейіпкер туралы ақпарат
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ChatInterface;
