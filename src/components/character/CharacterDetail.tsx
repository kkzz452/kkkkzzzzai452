import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { MessageCircle, Info, Clock, BookOpen, Star } from "lucide-react";

interface CharacterDetailProps {
  character?: {
    id: string;
    name: string;
    category: "historical" | "celebrity" | "custom";
    imageUrl: string;
    description: string;
    background: string;
    era: string;
    specialties: string[];
    popularity: number;
  };
  onStartChat?: (characterId: string) => void;
  onClose?: () => void;
}

const CharacterDetail = ({
  character = {
    id: "abai-1",
    name: "Abai Qunanbaiuly",
    category: "historical",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abai",
    description: "Renowned Kazakh poet, composer and philosopher",
    background:
      "Abai Qunanbaiuly was a Kazakh poet, composer, and philosopher who founded the written Kazakh literature and influenced the modern Kazakh literary language.",
    era: "1845-1904",
    specialties: ["Poetry", "Philosophy", "Music", "Translation"],
    popularity: 98,
  },
  onStartChat = () => {},
  onClose = () => {},
}: CharacterDetailProps) => {
  return (
    <Card className="w-full max-w-md bg-white shadow-lg overflow-hidden">
      <CardHeader className="bg-slate-50 pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={character.imageUrl} alt={character.name} />
            <AvatarFallback>{character.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold">
              {character.name}
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              {character.description}
            </CardDescription>
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
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium flex items-center gap-2 text-slate-700">
            <Info className="h-4 w-4" /> Өмірбаян
          </h3>
          <p className="mt-2 text-sm text-slate-600">{character.background}</p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <Clock className="h-4 w-4" /> Дәуір
            </h3>
            <p className="mt-1 text-sm text-slate-600">{character.era}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <Star className="h-4 w-4" /> Танымалдылық
            </h3>
            <div className="mt-1 flex items-center">
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${character.popularity}%` }}
                />
              </div>
              <span className="ml-2 text-xs text-slate-600">
                {character.popularity}%
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium flex items-center gap-2 text-slate-700">
            <BookOpen className="h-4 w-4" /> Мамандықтар
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {character.specialties.map((specialty, index) => (
              <Badge key={index} variant="outline" className="bg-slate-50">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between bg-slate-50 pt-4">
        <Button variant="outline" onClick={onClose}>
          Жабу
        </Button>
        <Button onClick={() => onStartChat(character.id)} className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Әңгімелесуді бастау
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CharacterDetail;
