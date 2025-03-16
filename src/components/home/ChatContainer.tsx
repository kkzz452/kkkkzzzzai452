import React, { useState, useEffect } from "react";
import ChatInterface from "../chat/ChatInterface";
import { generateAIResponse, Message, Character } from "../../lib/ai-api";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "../ui/use-toast";
import ErrorBoundary from "../chat/ErrorBoundary";

interface ChatContainerProps {
  selectedCharacter?: Character;
}

const ChatContainer = ({
  selectedCharacter = {
    id: "abai",
    name: "Абай Құнанбаев",
    description:
      "Абай Құнанбаев (1845-1904) - великий казахский поэт, композитор, просветитель, мыслитель и общественный деятель.",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abai",
    systemPrompt:
      "You are Abai Kunanbayev, a renowned Kazakh poet and philosopher from the 19th century. You wrote poetry and prose about Kazakh life and advocated for education and moral values.",
  },
}: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      content:
        "Сәлеметсіз бе! Мен Абай Құнанбаевпын. Сізбен сөйлесуге қуаныштымын.",
      sender: "ai",
      timestamp: new Date(),
      characterName: "Абай Құнанбаев",
      characterImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abai",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  // Update messages when character changes
  useEffect(() => {
    if (selectedCharacter) {
      const welcomeMessage: Message = {
        id: uuidv4(),
        content: `Сәлеметсіз бе! Мен ${selectedCharacter.name}. Сізбен сөйлесуге қуаныштымын.`,
        sender: "ai",
        timestamp: new Date(),
        characterName: selectedCharacter.name,
        characterImage: selectedCharacter.imageUrl,
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedCharacter]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    console.log("Handling message:", content);

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    // Update messages state with the new user message
    setMessages((prev) => {
      const updatedMessages = [...prev, userMessage];
      console.log("Updated messages:", updatedMessages);
      return updatedMessages;
    });

    setIsTyping(true);

    try {
      // Generate AI response
      console.log("Generating AI response...");
      const aiResponseContent = await generateAIResponse(
        [...messages, userMessage],
        selectedCharacter,
      );
      console.log("AI response received:", aiResponseContent);

      // Add AI response
      const aiMessage: Message = {
        id: uuidv4(),
        content: aiResponseContent,
        sender: "ai",
        timestamp: new Date(),
        characterName: selectedCharacter.name,
        characterImage: selectedCharacter.imageUrl,
      };

      // Update messages state with the AI response
      setMessages((prev) => {
        const updatedMessages = [...prev, aiMessage];
        console.log("Messages after AI response:", updatedMessages);
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Қате",
        description: "Жауап алу кезінде қате орын алды. Қайталап көріңіз.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveConversation = () => {
    // Save conversation to local storage for now
    const conversations = JSON.parse(
      localStorage.getItem("conversations") || "[]",
    );
    const newConversation = {
      id: uuidv4(),
      characterName: selectedCharacter.name,
      characterImage: selectedCharacter.imageUrl,
      messages: messages,
      timestamp: new Date(),
    };

    localStorage.setItem(
      "conversations",
      JSON.stringify([...conversations, newConversation]),
    );

    toast({
      title: "Сақталды",
      description: "Әңгіме сәтті сақталды.",
    });
  };

  const handleShareConversation = () => {
    // Create a shareable text version of the conversation
    const conversationText = messages
      .map((msg) => {
        const sender = msg.sender === "ai" ? msg.characterName : "Мен";
        return `${sender}: ${msg.content}`;
      })
      .join("\n\n");

    // Copy to clipboard
    navigator.clipboard.writeText(conversationText).then(
      () => {
        toast({
          title: "Көшірілді",
          description: "Әңгіме мәтіні алмасу буферіне көшірілді.",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Қате",
          description: "Мәтінді көшіру кезінде қате орын алды.",
          variant: "destructive",
        });
      },
    );
  };

  return (
    <ErrorBoundary>
      <ChatInterface
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onSaveConversation={handleSaveConversation}
        onShareConversation={handleShareConversation}
        characterName={selectedCharacter.name}
        characterImage={selectedCharacter.imageUrl}
        characterDescription={selectedCharacter.description}
      />
    </ErrorBoundary>
  );
};

export default ChatContainer;
