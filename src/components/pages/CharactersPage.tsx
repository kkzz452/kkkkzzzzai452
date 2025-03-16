import React, { useState } from "react";
import Header from "../layout/Header";
import SubscriptionBanner from "../subscription/SubscriptionBanner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Dialog, DialogContent } from "../ui/dialog";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Search, PlusCircle, MessageCircle } from "lucide-react";
import CharacterDetail from "../character/CharacterDetail";
import CharacterCreationForm from "../character/CharacterCreationForm";

interface Character {
  id: string;
  name: string;
  category: "historical" | "celebrity" | "custom";
  description: string;
  imageUrl: string;
  background: string;
  era: string;
  specialties: string[];
  popularity: number;
}

const CharactersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [showCreationForm, setShowCreationForm] = useState(false);

  // Sample characters data
  const characters: Character[] = [
    {
      id: "1",
      name: "Abai Kunanbayev",
      category: "historical",
      description: "Kazakh poet, composer and philosopher",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abai",
      background:
        "Abai Qunanbaiuly was a Kazakh poet, composer, and philosopher who founded the written Kazakh literature and influenced the modern Kazakh literary language.",
      era: "1845-1904",
      specialties: ["Poetry", "Philosophy", "Music", "Translation"],
      popularity: 98,
    },
    {
      id: "2",
      name: "Al-Farabi",
      category: "historical",
      description: "Medieval philosopher and scientist",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlFarabi",
      background:
        "Abu Nasr Al-Farabi was a renowned philosopher and jurist who wrote in the fields of political philosophy, metaphysics, ethics and logic.",
      era: "872-950",
      specialties: ["Philosophy", "Mathematics", "Music Theory", "Logic"],
      popularity: 92,
    },
    {
      id: "3",
      name: "Dimash Kudaibergen",
      category: "celebrity",
      description: "Contemporary Kazakh singer with a wide vocal range",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dimash",
      background:
        "Dimash Kudaibergen is a Kazakh singer, songwriter, and multi-instrumentalist known for his wide vocal range covering 6 octaves.",
      era: "1994-present",
      specialties: ["Singing", "Composition", "Piano", "Dombra"],
      popularity: 95,
    },
    {
      id: "4",
      name: "Kazakh Teacher",
      category: "custom",
      description: "Custom AI agent to help with Kazakh language learning",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher",
      background:
        "A personalized AI tutor designed to help students learn the Kazakh language through conversation practice and cultural context.",
      era: "Contemporary",
      specialties: [
        "Language Teaching",
        "Grammar",
        "Pronunciation",
        "Cultural Context",
      ],
      popularity: 88,
    },
    {
      id: "5",
      name: "Kazakh Historian",
      category: "custom",
      description: "Expert on Kazakh history and cultural traditions",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Historian",
      background:
        "A specialized AI character with deep knowledge of Kazakh history, traditions, and cultural practices from ancient times to the present day.",
      era: "All periods",
      specialties: [
        "History",
        "Cultural Traditions",
        "Nomadic Lifestyle",
        "Genealogy",
      ],
      popularity: 85,
    },
  ];

  const filteredCharacters = characters.filter((character) => {
    // Filter by search query
    const matchesSearch =
      character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by category tab
    const matchesCategory =
      activeTab === "all" ||
      (activeTab === "historical" && character.category === "historical") ||
      (activeTab === "celebrity" && character.category === "celebrity") ||
      (activeTab === "custom" && character.category === "custom");

    return matchesSearch && matchesCategory;
  });

  const handleStartChat = (characterId: string) => {
    console.log("Start chat with:", characterId);
  };

  const handleCharacterSubmit = (values: any) => {
    console.log("Character created:", values);
    setShowCreationForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header isLoggedIn={true} subscriptionStatus="free" />
      <SubscriptionBanner status="free" />

      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Кейіпкерлер</h1>
          <Button onClick={() => setShowCreationForm(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Жаңа кейіпкер жасау
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Кейіпкерлерді іздеу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
            </div>

            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="all">Барлығы</TabsTrigger>
                <TabsTrigger value="historical">Тарихи</TabsTrigger>
                <TabsTrigger value="celebrity">Атақты</TabsTrigger>
                <TabsTrigger value="custom">Арнайы</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCharacters.map((character) => (
                    <div
                      key={character.id}
                      className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-4 flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary">
                          <img
                            src={character.imageUrl}
                            alt={character.name}
                            className="h-full w-full object-cover"
                          />
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-lg">
                            {character.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {character.description}
                          </p>
                          <div className="mt-2">
                            <Badge
                              variant={
                                character.category === "historical"
                                  ? "default"
                                  : character.category === "celebrity"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {character.category.charAt(0).toUpperCase() +
                                character.category.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="border-t p-3 flex justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCharacter(character)}
                        >
                          Толығырақ
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStartChat(character.id)}
                          className="gap-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Сөйлесу
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="historical" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Same content structure as "all" tab, filtered for historical */}
                </div>
              </TabsContent>

              <TabsContent value="celebrity" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Same content structure as "all" tab, filtered for celebrity */}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Same content structure as "all" tab, filtered for custom */}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Character Detail Dialog */}
        <Dialog
          open={!!selectedCharacter}
          onOpenChange={(open) => !open && setSelectedCharacter(null)}
        >
          <DialogContent className="sm:max-w-md p-0">
            {selectedCharacter && (
              <CharacterDetail
                character={selectedCharacter}
                onStartChat={handleStartChat}
                onClose={() => setSelectedCharacter(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Character Creation Form Dialog */}
        <Dialog open={showCreationForm} onOpenChange={setShowCreationForm}>
          <DialogContent className="sm:max-w-4xl p-0">
            <CharacterCreationForm onSubmit={handleCharacterSubmit} />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default CharactersPage;
