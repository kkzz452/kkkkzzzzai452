import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  subscriptionStatus: "free" | "premium";
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          avatar_url: data.avatar_url,
          subscriptionStatus: data.subscription_status as "free" | "premium",
        });
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error.message);
    }
  };

  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await fetchUserProfile(data.user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setIsLoggedIn(true);
        await fetchUserProfile(session.user.id);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    // Check current session on load
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setIsLoggedIn(true);
          await fetchUserProfile(data.session.user.id);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setIsLoggedIn(false);
      navigate("/auth");

      toast({
        title: "Жүйеден шығу",
        description: "Сіз жүйеден сәтті шықтыңыз",
      });
    } catch (error: any) {
      toast({
        title: "Қате",
        description: error.message || "Жүйеден шығу кезінде қате орын алды",
        variant: "destructive",
      });
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: userData.name,
          avatar_url: userData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      await refreshUser();

      toast({
        title: "Профиль жаңартылды",
        description: "Сіздің профиліңіз сәтті жаңартылды",
      });
    } catch (error: any) {
      toast({
        title: "Қате",
        description:
          error.message || "Профильді жаңарту кезінде қате орын алды",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, logout, updateUser, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
