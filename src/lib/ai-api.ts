// Using fetch directly instead of OpenAI SDK to avoid browser compatibility issues

// API key for OpenAI
const API_KEY =
  "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";

// Define message type
export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  characterName?: string;
  characterImage?: string;
}

// Character information interface
export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  systemPrompt: string;
}

// Function to generate AI response
export async function generateAIResponse(
  messages: Message[],
  character: Character,
): Promise<string> {
  try {
    console.log("Generating AI response for character:", character.name);
    console.log("Messages to process:", messages.length);

    // Format messages for the OpenAI API
    const formattedMessages = [
      {
        role: "system",
        content: `${character.systemPrompt}\n\nYou are ${character.name}. ${character.description}\n\nRespond in Kazakh language. Keep responses concise (1-3 paragraphs).`,
      },
      ...messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      })),
    ];

    console.log("Sending request to OpenAI API...");

    // Call the OpenAI API using fetch
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    console.log("API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error details:", errorText);
      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    console.log("API response received successfully");

    // Fallback response in case the API doesn't return expected content
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected API response format:", data);
      return "Жауап алу мүмкін болмады. API форматы күтілгеннен өзгеше.";
    }

    return data.choices[0].message.content || "Жауап алу мүмкін болмады.";
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Кешіріңіз, қате орын алды. Әңгімелесуді кейінірек жалғастырыңыз.";
  }
}

// Function to generate AI voice response
export async function generateAIVoiceResponse(text: string): Promise<string> {
  try {
    // Call the OpenAI API for text-to-speech using fetch
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-audio-preview",
        input: text,
        voice: "alloy",
        response_format: "mp3",
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Convert the response to a blob and create a URL for it
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (error) {
    console.error("Error generating AI voice response:", error);
    return "";
  }
}

// Function to get character system prompts
export function getCharacterSystemPrompt(
  characterType: string,
  name: string,
): string {
  const prompts: Record<string, string> = {
    historical: `You are ${name}, a historical figure from Kazakh history. Respond as if you are this person, with their knowledge, personality, and perspective. Use first-person perspective. Include historical facts and cultural context in your responses.`,
    celebrity: `You are ${name}, a modern Kazakh celebrity. Respond as if you are this person, with their public persona, interests, and perspective. Use first-person perspective. Reference your work and public life in your responses.`,
    custom: `You are ${name}, a custom AI character. Respond according to the personality traits and background information provided. Use first-person perspective and stay in character.`,
  };

  return prompts[characterType] || prompts["custom"];
}
