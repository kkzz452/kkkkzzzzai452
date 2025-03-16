import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";

const SupabaseAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Make sure we have a session
      if (!data || !data.session) throw new Error("No session returned");

      toast({
        title: "Сәтті кіру",
        description: "Сіз жүйеге сәтті кірдіңіз",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Қате",
        description: error.message || "Кіру кезінде қате орын алды",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Тіркелу сәтті аяқталды",
        description: "Сіздің электрондық поштаңызға растау хаты жіберілді",
      });

      setActiveTab("login");
    } catch (error: any) {
      toast({
        title: "Қате",
        description: error.message || "Тіркелу кезінде қате орын алды",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?tab=update-password`,
      });

      if (error) throw error;

      toast({
        title: "Құпия сөзді қалпына келтіру",
        description: "Сіздің электрондық поштаңызға нұсқаулар жіберілді",
      });
    } catch (error: any) {
      toast({
        title: "Қате",
        description:
          error.message || "Құпия сөзді қалпына келтіру кезінде қате орын алды",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {activeTab === "login" && "Aqyl AI-ға кіру"}
          {activeTab === "register" && "Aqyl AI-ға тіркелу"}
          {activeTab === "forgot-password" && "Құпия сөзді қалпына келтіру"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Кіру</TabsTrigger>
            <TabsTrigger value="register">Тіркелу</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Электрондық пошта</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Құпия сөз</Label>
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    type="button"
                    onClick={() => setActiveTab("forgot-password")}
                  >
                    Құпия сөзді ұмыттыңыз ба?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Құпия сөзіңізді енгізіңіз"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Жүктелуде..." : "Кіру"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Аты-жөні</Label>
                <Input
                  id="name"
                  placeholder="Аты-жөніңізді енгізіңіз"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Электрондық пошта</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Құпия сөз</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Құпия сөзіңізді енгізіңіз"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Жүктелуде..." : "Тіркелу"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="forgot-password" className="space-y-4">
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Электрондық пошта</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Жүктелуде..." : "Құпия сөзді қалпына келтіру"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setActiveTab("login")}
              >
                Артқа қайту
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SupabaseAuth;
