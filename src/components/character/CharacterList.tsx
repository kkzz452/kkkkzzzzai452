import React, { useState } from "react";
import { Avatar } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Search, Filter } from "lucide-react";

interface Character {
  id: string;
  name: string;
  category: "historical" | "celebrity" | "custom";
  description: string;
  imageUrl: string;
}

interface CharacterListProps {
  characters?: Character[];
  onSelectCharacter?: (character: Character) => void;
  selectedCharacterId?: string;
}

const CharacterList = ({
  characters = [
    {
      id: "1",
      name: "Abai Kunanbayev",
      category: "historical",
      description: "Kazakh poet, composer and philosopher",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abai",
    },
    {
      id: "2",
      name: "Al-Farabi",
      category: "historical",
      description: "Medieval philosopher and scientist",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlFarabi",
    },
    {
      id: "3",
      name: "Dimash Kudaibergen",
      category: "celebrity",
      description: "Contemporary Kazakh singer with a wide vocal range",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dimash",
    },
    {
      id: "4",
      name: "Kazakh Teacher",
      category: "custom",
      description: "Custom AI agent to help with Kazakh language learning",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher",
    },
    {
      id: "5",
      name: "Kazakh Historian",
      category: "custom",
      description: "Expert on Kazakh history and cultural traditions",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Historian",
    },
  ],
  onSelectCharacter = () => {},
  selectedCharacterId = "",
}: CharacterListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

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

  return (
    <div className="w-full h-full bg-white rounded-md border border-gray-200 shadow-sm flex flex-col">
      <div className="p-4 border-b border-gray-200">
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
        className="w-full"
      >
        <div className="px-4 border-b border-gray-200">
          <TabsList className="w-full justify-start bg-transparent">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gray-100"
            >
              Барлығы
            </TabsTrigger>
            <TabsTrigger
              value="historical"
              className="data-[state=active]:bg-gray-100"
            >
              Тарихи
            </TabsTrigger>
            <TabsTrigger
              value="celebrity"
              className="data-[state=active]:bg-gray-100"
            >
              Атақты
            </TabsTrigger>
            <TabsTrigger
              value="custom"
              className="data-[state=active]:bg-gray-100"
            >
              Арнайы
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="flex-1 mt-0">
          <ScrollArea className="h-[500px]">
            <CharacterGrid
              characters={filteredCharacters}
              onSelectCharacter={onSelectCharacter}
              selectedCharacterId={selectedCharacterId}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="historical" className="flex-1 mt-0">
          <ScrollArea className="h-[500px]">
            <CharacterGrid
              characters={filteredCharacters}
              onSelectCharacter={onSelectCharacter}
              selectedCharacterId={selectedCharacterId}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="celebrity" className="flex-1 mt-0">
          <ScrollArea className="h-[500px]">
            <CharacterGrid
              characters={filteredCharacters}
              onSelectCharacter={onSelectCharacter}
              selectedCharacterId={selectedCharacterId}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="custom" className="flex-1 mt-0">
          <ScrollArea className="h-[500px]">
            <CharacterGrid
              characters={filteredCharacters}
              onSelectCharacter={onSelectCharacter}
              selectedCharacterId={selectedCharacterId}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface CharacterGridProps {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
  selectedCharacterId: string;
}

const CharacterGrid = ({
  characters,
  onSelectCharacter,
  selectedCharacterId,
}: CharacterGridProps) => {
  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-gray-500 mb-4">Кейіпкерлер табылмады</p>
        <Button variant="outline">Жаңа кейіпкер жасау</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {characters.map((character) => (
        <div
          key={character.id}
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedCharacterId === character.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50 border border-transparent"}`}
          onClick={() => onSelectCharacter(character)}
        >
          <Avatar className="h-12 w-12 mr-4">
            <img
              src={character.imageUrl}
              alt={character.name}
              className="object-cover"
            />
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium">{character.name}</h3>
            <p className="text-sm text-gray-500">{character.description}</p>
          </div>
          <div className="ml-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${character.category === "historical" ? "bg-amber-100 text-amber-800" : character.category === "celebrity" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}`}
            >
              {character.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CharacterList;
