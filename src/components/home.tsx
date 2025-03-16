import React, { useState, useEffect } from "react";
import Header from "./layout/Header";
import ChatInterface from "./chat/ChatInterface";
import CharacterPanel from "./character/CharacterPanel";
import CharacterCreationForm from "./character/CharacterCreationForm";
import ConversationHistory from "./history/ConversationHistory";
import SubscriptionBanner from "./subscription/SubscriptionBanner";
import { Dialog, DialogContent } from "./ui/dialog";
import { History } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { generateAIResponse, getCharacterSystemPrompt } from "../lib/ai-api";
import { v4 as uuidv4 } from "uuid";

interface HomeProps {
  userName?: string;
  userAvatar?: string;
  subscriptionStatus?: "free" | "premium";
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  characterName?: string;
  characterImage?: string;
}

interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: string;
  isPremium: boolean;
}

const Home = ({
  userName = "Guest User",
  userAvatar = "",
  subscriptionStatus = "free",
}: HomeProps) => {
  const { user } = useAuth();
  const [activeCharacterId, setActiveCharacterId] = useState<string>("1"); // Default to first character
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCreationForm, setShowCreationForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);

  // Fetch characters from Supabase
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const { data, error } = await supabase.from("characters").select("*");

        if (error) throw error;

        if (data) {
          const formattedCharacters = data.map((char) => ({
            id: char.id,
            name: char.name,
            description: char.description || "",
            imageUrl:
              char.image_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${char.name}`,
            type: char.type,
            isPremium: char.is_premium,
          }));
          setCharacters(formattedCharacters);
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    fetchCharacters();
  }, []);

  // Set active character when activeCharacterId changes
  useEffect(() => {
    const character = characters.find((c) => c.id === activeCharacterId);
    if (character) {
      setActiveCharacter(character);
      // Add welcome message from character
      const welcomeMessage = {
        id: uuidv4(),
        content: `Сәлеметсіз бе! Мен ${character.name}. Сізбен сөйлесуге қуаныштымын.`,
        sender: "ai",
        timestamp: new Date(),
        characterName: character.name,
        characterImage: character.imageUrl,
      };
      setMessages([welcomeMessage]);
    }
  }, [activeCharacterId, characters]);

  const handleStartChat = (characterId: string) => {
    setActiveCharacterId(characterId);
  };

  const handleCreateCharacter = () => {
    setShowCreationForm(true);
  };

  const handleCharacterSubmit = async (values: any) => {
    try {
      const { data, error } = await supabase
        .from("custom_characters")
        .insert([
          {
            user_id: user?.id,
            name: values.name,
            description: values.description,
            image_url:
              values.imageUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.name}`,
            personality: values.personality,
            background: values.background,
            communication_style: values.communicationStyle,
          },
        ])
        .select();

      if (error) throw error;

      console.log("Character created:", data);
      setShowCreationForm(false);
    } catch (error) {
      console.error("Error creating character:", error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!activeCharacter || !message.trim()) return;

    // Add user message to the chat
    const userMessage: Message = {
      id: uuidv4(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get AI response
      const systemPrompt = getCharacterSystemPrompt(
        activeCharacter.type,
        activeCharacter.name,
      );
      const aiResponse = await generateAIResponse([...messages, userMessage], {
        id: activeCharacter.id,
        name: activeCharacter.name,
        description: activeCharacter.description,
        imageUrl: activeCharacter.imageUrl,
        systemPrompt,
      });

      // Add AI response to the chat
      const aiMessage: Message = {
        id: uuidv4(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        characterName: activeCharacter.name,
        characterImage: activeCharacter.imageUrl,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Save conversation to database
      await saveConversation([...messages, userMessage, aiMessage]);
    } catch (error) {
      console.error("Error generating AI response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const saveConversation = async (conversationMessages: Message[]) => {
    if (!user || !activeCharacter || conversationMessages.length < 2) return;

    try {
      // Check if conversation exists
      let conversationId;
      const { data: existingConversation } = await supabase
        .from("conversations")
        .select("id")
        .eq("user_id", user.id)
        .eq("character_id", activeCharacter.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (existingConversation && existingConversation.length > 0) {
        conversationId = existingConversation[0].id;
      } else {
        // Create new conversation
        const { data: newConversation, error } = await supabase
          .from("conversations")
          .insert([
            {
              user_id: user.id,
              character_id: activeCharacter.id,
              title: `Conversation with ${activeCharacter.name}`,
            },
          ])
          .select();

        if (error) throw error;
        conversationId = newConversation[0].id;
      }

      // Save the last two messages (user message and AI response)
      const lastMessages = conversationMessages.slice(-2);
      for (const msg of lastMessages) {
        await supabase.from("messages").insert([
          {
            conversation_id: conversationId,
            content: msg.content,
            is_user: msg.sender === "user",
          },
        ]);
      }
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };

  const handleSaveConversation = async () => {
    await saveConversation(messages);
    console.log("Conversation saved");
  };

  const handleShareConversation = () => {
    // Generate a shareable link
    console.log("Conversation shared");
  };

  const handleContinueConversation = async (conversationId: string) => {
    try {
      // Get conversation details
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .select("*, characters(*)")
        .eq("id", conversationId)
        .single();

      if (convError) throw convError;

      // Get messages
      const { data: messageData, error: msgError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (msgError) throw msgError;

      if (conversation && messageData) {
        // Set active character
        setActiveCharacterId(conversation.character_id);

        // Format messages
        const formattedMessages = messageData.map((msg) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.is_user ? "user" : "ai",
          timestamp: new Date(msg.created_at),
          characterName: msg.is_user ? undefined : conversation.characters.name,
          characterImage: msg.is_user
            ? undefined
            : conversation.characters.image_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.characters.name}`,
        }));

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);

      if (error) throw error;
      console.log("Conversation deleted:", conversationId);
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        userName={user?.name || userName}
        userAvatar={user?.avatar_url || userAvatar}
        isLoggedIn={true}
        subscriptionStatus={user?.subscriptionStatus || subscriptionStatus}
      />

      <SubscriptionBanner
        status={user?.subscriptionStatus || subscriptionStatus}
      />

      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left side - Character Panel */}
          <div className="w-full lg:w-1/3 xl:w-1/4 h-[700px]">
            <CharacterPanel
              onStartChat={handleStartChat}
              onCreateCharacter={handleCreateCharacter}
            />
          </div>

          {/* Right side - Chat Interface */}
          <div className="w-full lg:w-2/3 xl:w-3/4 flex justify-center">
            <ChatInterface
              messages={messages}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onSaveConversation={handleSaveConversation}
              onShareConversation={handleShareConversation}
              characterName={activeCharacter?.name}
              characterImage={activeCharacter?.imageUrl}
              characterDescription={activeCharacter?.description}
            />
          </div>
        </div>
      </main>

      {/* Character Creation Form Dialog */}
      <Dialog open={showCreationForm} onOpenChange={setShowCreationForm}>
        <DialogContent className="sm:max-w-4xl p-0">
          <CharacterCreationForm onSubmit={handleCharacterSubmit} />
        </DialogContent>
      </Dialog>

      {/* Conversation History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-4xl p-0">
          <ConversationHistory
            onContinueConversation={handleContinueConversation}
            onDeleteConversation={handleDeleteConversation}
            onShareConversation={handleShareConversation}
          />
        </DialogContent>
      </Dialog>

      {/* Floating button to open conversation history */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setShowHistory(true)}
          className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:bg-primary/90 transition-colors"
        >
          <History className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Home;
