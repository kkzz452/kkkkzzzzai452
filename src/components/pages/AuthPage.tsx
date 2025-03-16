import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import SupabaseAuth from "../auth/SupabaseAuth";
import { useToast } from "../ui/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  // Handle password reset from email link
  useEffect(() => {
    const handlePasswordReset = async () => {
      const tab = searchParams.get("tab");
      if (tab === "update-password") {
        // This is a password reset request
        toast({
          title: "Құпия сөзді жаңарту",
          description: "Жаңа құпия сөзді енгізіңіз",
        });
      }
    };
    handlePasswordReset();
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-xl">A</span>
          </div>
          <h1 className="text-3xl font-bold">Aqyl AI</h1>
          <p className="text-muted-foreground mt-2">
            Қазақ тіліндегі тарихи тұлғалармен сөйлесу платформасы
          </p>
        </div>
        <SupabaseAuth />
      </div>
    </div>
  );
};

export default AuthPage;
