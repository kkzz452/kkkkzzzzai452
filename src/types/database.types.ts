export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  subscription_status: "free" | "premium";
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  bio?: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  email_notifications: boolean;
  marketing_notifications: boolean;
  chat_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  type: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomCharacter {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  image_url?: string;
  personality?: string;
  background?: string;
  communication_style?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  character_id?: string;
  custom_character_id?: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  is_user: boolean;
  created_at: string;
}
