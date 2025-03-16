CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  type TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS custom_characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  personality TEXT,
  background TEXT,
  communication_style TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  custom_character_id UUID REFERENCES custom_characters(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT character_check CHECK (
    (character_id IS NOT NULL AND custom_character_id IS NULL) OR
    (character_id IS NULL AND custom_character_id IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_user BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Insert some default historical characters
INSERT INTO characters (name, description, type, is_premium)
VALUES 
('Абай Құнанбайұлы', 'Қазақтың ұлы ақыны, ағартушы, жазушы, қоғам қайраткері', 'historical', false),
('Әл-Фараби', 'Ұлы ойшыл, философ, математик, музыка теоретигі', 'historical', false),
('Шоқан Уәлиханов', 'Қазақтың ұлы ғалымы, тарихшы, этнограф, фольклоршы', 'historical', false),
('Қасым Аманжолов', 'Қазақтың көрнекті ақыны', 'historical', true),
('Мұхтар Әуезов', 'Қазақтың ұлы жазушысы, драматург, ғалым', 'historical', true);

-- Tables are already in the realtime publication