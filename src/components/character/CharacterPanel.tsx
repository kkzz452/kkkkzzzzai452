import React, { useState } from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import CharacterList from "./CharacterList";
import CharacterDetail from "./CharacterDetail";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

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

interface CharacterPanelProps {
  onStartChat?: (characterId: string) => void;
  onCreateCharacter?: () => void;
}

const CharacterPanel = ({
  onStartChat = () => {},
  onCreateCharacter = () => {},
}: CharacterPanelProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);

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

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
  };

  const handleStartChat = (characterId: string) => {
    setDetailOpen(false);
    onStartChat(characterId);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-xl font-semibold text-slate-800">Кейіпкерлер</h2>
        <Button onClick={onCreateCharacter} variant="outline" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Жасау
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <CharacterList
          characters={characters}
          onSelectCharacter={handleSelectCharacter}
          selectedCharacterId={selectedCharacter?.id || ""}
        />
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md p-0">
          {selectedCharacter && (
            <CharacterDetail
              character={selectedCharacter}
              onStartChat={handleStartChat}
              onClose={handleCloseDetail}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CharacterPanel;
