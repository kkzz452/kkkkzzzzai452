CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  bio TEXT,
  language TEXT DEFAULT 'kk',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS user_settings (
  id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email_notifications BOOLEAN DEFAULT TRUE,
  marketing_notifications BOOLEAN DEFAULT FALSE,
  chat_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, subscription_status)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email, 'free');
  
  INSERT INTO public.user_profiles (id)
  VALUES (new.id);
  
  INSERT INTO public.user_settings (id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tables are already in the realtime publication