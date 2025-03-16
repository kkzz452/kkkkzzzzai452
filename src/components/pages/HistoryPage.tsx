import React, { useState } from "react";
import Header from "../layout/Header";
import SubscriptionBanner from "../subscription/SubscriptionBanner";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { format } from "date-fns";
import { MessageSquare, Trash2, Share2 } from "lucide-react";

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

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  // Sample conversations data
  const conversations: Conversation[] = [
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
  ];

  const filteredConversations = conversations.filter((conversation) => {
    if (activeTab === "all") return true;
    if (activeTab === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return conversation.date > oneWeekAgo;
    }
    if (activeTab === "historical") {
      return ["Абай Құнанбайұлы", "Әл-Фараби"].includes(
        conversation.characterName,
      );
    }
    if (activeTab === "celebrity") {
      return conversation.characterName === "Димаш Құдайберген";
    }
    return true;
  });

  const handleContinueConversation = (conversation: Conversation) => {
    console.log("Continue conversation:", conversation.id);
  };

  const handleDeleteConversation = (
    e: React.MouseEvent,
    conversationId: string,
  ) => {
    e.stopPropagation();
    console.log("Delete conversation:", conversationId);
  };

  const handleShareConversation = (
    e: React.MouseEvent,
    conversationId: string,
  ) => {
    e.stopPropagation();
    console.log("Share conversation:", conversationId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header isLoggedIn={true} subscriptionStatus="free" />
      <SubscriptionBanner status="free" />

      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Әңгімелесу тарихы</h1>

        <Card>
          <CardContent className="p-0">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="border-b">
                <TabsList className="w-full justify-start bg-transparent p-0">
                  <TabsTrigger
                    value="all"
                    className="px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Барлығы
                  </TabsTrigger>
                  <TabsTrigger
                    value="recent"
                    className="px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Соңғы апта
                  </TabsTrigger>
                  <TabsTrigger
                    value="historical"
                    className="px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Тарихи тұлғалар
                  </TabsTrigger>
                  <TabsTrigger
                    value="celebrity"
                    className="px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Атақты адамдар
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="m-0">
                <div className="flex h-[600px]">
                  <div className="w-1/3 border-r">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-4">
                        {filteredConversations.map((conversation) => (
                          <div
                            key={conversation.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedConversation?.id === conversation.id ? "bg-slate-100" : "hover:bg-slate-50"}`}
                            onClick={() =>
                              setSelectedConversation(conversation)
                            }
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <img
                                  src={conversation.characterImage}
                                  alt={conversation.characterName}
                                  className="h-full w-full object-cover"
                                />
                              </Avatar>
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

                  <div className="w-2/3 p-4">
                    {selectedConversation ? (
                      <div className="h-full flex flex-col">
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <Avatar className="h-10 w-10">
                            <img
                              src={selectedConversation.characterImage}
                              alt={selectedConversation.characterName}
                              className="h-full w-full object-cover"
                            />
                          </Avatar>
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
              </TabsContent>

              <TabsContent value="recent" className="m-0">
                <div className="flex h-[600px]">
                  {/* Same content structure as "all" tab */}
                  <div className="w-full flex items-center justify-center p-8">
                    <p>Соңғы аптадағы әңгімелесулер</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="historical" className="m-0">
                <div className="flex h-[600px]">
                  {/* Same content structure as "all" tab */}
                  <div className="w-full flex items-center justify-center p-8">
                    <p>Тарихи тұлғалармен әңгімелесулер</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="celebrity" className="m-0">
                <div className="flex h-[600px]">
                  {/* Same content structure as "all" tab */}
                  <div className="w-full flex items-center justify-center p-8">
                    <p>Атақты адамдармен әңгімелесулер</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HistoryPage;
