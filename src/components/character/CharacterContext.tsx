import React, { createContext, useContext, useState, ReactNode } from "react";
import { Character } from "../../lib/ai-api";

// Sample characters
const defaultCharacters: Character[] = [
  {
    id: "abai",
    name: "Абай Құнанбаев",
    description:
      "Абай Құнанбаев (1845-1904) - великий казахский поэт, композитор, просветитель, мыслитель и общественный деятель.",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abai",
    systemPrompt:
      "You are Abai Kunanbayev, a renowned Kazakh poet and philosopher from the 19th century. You wrote poetry and prose about Kazakh life and advocated for education and moral values.",
  },
  {
    id: "al-farabi",
    name: "Әл-Фараби",
    description:
      "Әл-Фараби (870-950) - средневековый философ, математик, музыкант и ученый. Один из крупнейших представителей средневековой восточной философии.",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlFarabi",
    systemPrompt:
      "You are Al-Farabi, a medieval philosopher and scientist known as 'The Second Teacher' after Aristotle. You made significant contributions to philosophy, logic, sociology, medicine, mathematics, and music.",
  },
  {
    id: "dimash",
    name: "Димаш Құдайберген",
    description:
      "Димаш Құдайберген - современный казахский певец с широким вокальным диапазоном, известный своими выступлениями на международной сцене.",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dimash",
    systemPrompt:
      "You are Dimash Kudaibergen, a contemporary Kazakh singer with a wide vocal range. You're known for your performances on international stages and your unique vocal abilities.",
  },
  {
    id: "teacher",
    name: "Қазақ Мұғалімі",
    description:
      "Қазақ тілі мен әдебиеті мұғалімі, қазақ тілін үйренушілерге көмектесуге дайын.",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher",
    systemPrompt:
      "You are a Kazakh language teacher. Your goal is to help people learn the Kazakh language. Provide explanations about grammar, vocabulary, and cultural context when appropriate.",
  },
];

interface CharacterContextType {
  characters: Character[];
  selectedCharacter: Character | null;
  setSelectedCharacter: (character: Character) => void;
  addCharacter: (character: Character) => void;
  removeCharacter: (id: string) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined,
);

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return context;
};

interface CharacterProviderProps {
  children: ReactNode;
}

export const CharacterProvider = ({ children }: CharacterProviderProps) => {
  // Try to load characters from localStorage, or use defaults
  const [characters, setCharacters] = useState<Character[]>(() => {
    const savedCharacters = localStorage.getItem("characters");
    return savedCharacters ? JSON.parse(savedCharacters) : defaultCharacters;
  });

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    characters[0] || null,
  );

  // Save characters to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("characters", JSON.stringify(characters));
  }, [characters]);

  const addCharacter = (character: Character) => {
    setCharacters((prev) => [
      ...prev,
      { ...character, id: crypto.randomUUID() },
    ]);
  };

  const removeCharacter = (id: string) => {
    // Don't allow removing default characters
    if (defaultCharacters.some((char) => char.id === id)) {
      return;
    }

    setCharacters((prev) => prev.filter((char) => char.id !== id));

    // If the removed character was selected, select the first available character
    if (selectedCharacter?.id === id) {
      setSelectedCharacter(characters[0]);
    }
  };

  return (
    <CharacterContext.Provider
      value={{
        characters,
        selectedCharacter,
        setSelectedCharacter,
        addCharacter,
        removeCharacter,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};
