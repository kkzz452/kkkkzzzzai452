import React, { useState } from "react";
import { format } from "date-fns";
import { Share2, Trash2, MessageSquare } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface Conversation {
  id: string;
  characterName: string;
  characterImage: string;
  lastMessage: string;
  date: Date;
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ConversationHistoryProps {
  conversations?: Conversation[];
  onContinueConversation?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
  onShareConversation?: (conversationId: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ConversationHistory = ({
  conversations = [
    {
      id: "1",
      characterName: "Абай Құнанбайұлы",
      characterImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=abai",
      lastMessage: "Қараңғы түнде тау қалғып, ұйқыға кетер балбырап...",
      date: new Date(2023, 5, 15),
      messages: [
        {
          id: "m1",
          content: "Сәлеметсіз бе, Абай мырза!",
          sender: "user",
          timestamp: new Date(2023, 5, 15, 14, 30),
        },
        {
          id: "m2",
          content: "Сәлеметсіз! Қалыңыз қалай?",
          sender: "ai",
          timestamp: new Date(2023, 5, 15, 14, 31),
        },
        {
          id: "m3",
          content: "Қараңғы түнде тау қалғып, ұйқыға кетер балбырап...",
          sender: "ai",
          timestamp: new Date(2023, 5, 15, 14, 32),
        },
      ],
    },
    {
      id: "2",
      characterName: "Әл-Фараби",
      characterImage:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=alfarabi",
      lastMessage: "Білімдінің сөзін тыңда және түсін...",
      date: new Date(2023, 6, 20),
      messages: [
        {
          id: "m1",
          content: "Әл-Фараби, философия туралы сұрағым бар",
          sender: "user",
          timestamp: new Date(2023, 6, 20, 10, 15),
        },
        {
          id: "m2",
          content: "Білімдінің сөзін тыңда және түсін...",
          sender: "ai",
          timestamp: new Date(2023, 6, 20, 10, 16),
        },
      ],
    },
    {
      id: "3",
      characterName: "Димаш Құдайберген",
      characterImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=dimash",
      lastMessage: "Музыка - жан азығы",
      date: new Date(2023, 7, 5),
      messages: [
        {
          id: "m1",
          content: "Димаш, сіздің даусыңыз керемет!",
          sender: "user",
          timestamp: new Date(2023, 7, 5, 18, 45),
        },
        {
          id: "m2",
          content: "Рахмет! Музыка - жан азығы",
          sender: "ai",
          timestamp: new Date(2023, 7, 5, 18, 46),
        },
      ],
    },
  ],
  onContinueConversation = () => {},
  onDeleteConversation = () => {},
  onShareConversation = () => {},
  isOpen = false,
  onOpenChange = () => {},
}: ConversationHistoryProps) => {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const handleContinueConversation = (conversation: Conversation) => {
    onContinueConversation(conversation.id);
    onOpenChange(false);
  };

  const handleDeleteConversation = (
    e: React.MouseEvent,
    conversationId: string,
  ) => {
    e.stopPropagation();
    onDeleteConversation(conversationId);
  };

  const handleShareConversation = (
    e: React.MouseEvent,
    conversationId: string,
  ) => {
    e.stopPropagation();
    onShareConversation(conversationId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Әңгімелесу тарихы</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-white">
        <DialogHeader>
          <DialogTitle>Әңгімелесу тарихы</DialogTitle>
        </DialogHeader>

        <div className="flex h-[500px] mt-4">
          {/* Conversation List */}
          <div className="w-1/3 border-r pr-4">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedConversation?.id === conversation.id ? "bg-slate-100" : "hover:bg-slate-50"}`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={conversation.characterImage}
                        alt={conversation.characterName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">
                          {conversation.characterName}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {format(conversation.date, "MMM d")}
                      </span>
                    </div>
                    <div className="flex justify-end mt-2 gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) =>
                          handleShareConversation(e, conversation.id)
                        }
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) =>
                          handleDeleteConversation(e, conversation.id)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Conversation Detail */}
          <div className="w-2/3 pl-4">
            {selectedConversation ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-3 pb-3 border-b">
                  <img
                    src={selectedConversation.characterImage}
                    alt={selectedConversation.characterName}
                    className="w-10 h-10 rounded-full"
                  />
                  <h2 className="font-medium">
                    {selectedConversation.characterName}
                  </h2>
                </div>

                <ScrollArea className="flex-1 my-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                        >
                          <p>{message.content}</p>
                          <span className="block text-xs mt-1 opacity-70">
                            {format(message.timestamp, "HH:mm")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="pt-3 border-t">
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleContinueConversation(selectedConversation)
                    }
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Әңгімелесуді жалғастыру
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>Мәліметтерді көру үшін әңгімелесуді таңдаңыз</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Жабу
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationHistory;
