import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  characterName?: string;
  characterImage?: string;
}

interface MessageListProps {
  messages?: Message[];
  isTyping?: boolean;
}

const MessageList = ({
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
}: MessageListProps) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-md">
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[80%]`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      message.sender === "ai"
                        ? message.characterImage
                        : "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                    }
                    alt={
                      message.sender === "ai" ? message.characterName : "User"
                    }
                  />
                  <AvatarFallback>
                    {message.sender === "ai"
                      ? message.characterName?.charAt(0)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white rounded-tr-none"
                      : "bg-white border border-gray-200 rounded-tl-none"
                  }`}
                >
                  {message.sender === "ai" && message.characterName && (
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      {message.characterName}
                    </div>
                  )}
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs mt-1 text-right opacity-70">
                    {message.timestamp instanceof Date
                      ? message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex flex-row items-end gap-2 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      messages[0]?.characterImage ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=ai"
                    }
                    alt={messages[0]?.characterName || "AI"}
                  />
                  <AvatarFallback>
                    {messages[0]?.characterName?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-white border border-gray-200 rounded-tl-none">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageList;
