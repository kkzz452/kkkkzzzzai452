import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import SubscriptionBanner from "../subscription/SubscriptionBanner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { User, Settings, Bell, CreditCard, LogOut, Upload } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { useToast } from "../ui/use-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const { user, logout, updateUser } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [language, setLanguage] = useState("kk");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  const [chatNotifications, setChatNotifications] = useState(true);

  // Load user profile data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email || "");

      // Fetch additional profile data
      const fetchProfileData = async () => {
        try {
          // Get user profile
          const { data: profileData, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profileError) throw profileError;

          if (profileData) {
            setBio(profileData.bio || "");
            setLanguage(profileData.language || "kk");
          }

          // Get user settings
          const { data: settingsData, error: settingsError } = await supabase
            .from("user_settings")
            .select("*")
            .eq("id", user.id)
            .single();

          if (settingsError) throw settingsError;

          if (settingsData) {
            setEmailNotifications(settingsData.email_notifications);
            setMarketingNotifications(settingsData.marketing_notifications);
            setChatNotifications(settingsData.chat_notifications);
          }
        } catch (error: any) {
          console.error("Error fetching profile data:", error.message);
        }
      };

      fetchProfileData();
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      // Update user name
      await updateUser({ name });

      // Update user profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({
          bio,
          language,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      toast({
        title: "Профиль сақталды",
        description: "Сіздің профиліңіз сәтті жаңартылды",
      });
    } catch (error: any) {
      toast({
        title: "Қате",
        description: error.message || "Профильді сақтау кезінде қате орын алды",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotifications = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_settings")
        .update({
          email_notifications: emailNotifications,
          marketing_notifications: marketingNotifications,
          chat_notifications: chatNotifications,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Хабарландыру параметрлері сақталды",
        description: "Сіздің хабарландыру параметрлеріңіз сәтті жаңартылды",
      });
    } catch (error: any) {
      toast({
        title: "Қате",
        description:
          error.message || "Параметрлерді сақтау кезінде қате орын алды",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const currentPassword = (
      form.elements.namedItem("current-password") as HTMLInputElement
    ).value;
    const newPassword = (
      form.elements.namedItem("new-password") as HTMLInputElement
    ).value;
    const confirmPassword = (
      form.elements.namedItem("confirm-password") as HTMLInputElement
    ).value;

    if (newPassword !== confirmPassword) {
      toast({
        title: "Қате",
        description: "Жаңа құпия сөздер сәйкес келмейді",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Құпия сөз өзгертілді",
        description: "Сіздің құпия сөзіңіз сәтті өзгертілді",
      });

      // Clear form
      form.reset();
    } catch (error: any) {
      toast({
        title: "Қате",
        description:
          error.message || "Құпия сөзді өзгерту кезінде қате орын алды",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Сіз шынымен аккаунтыңызды жойғыңыз келе ме? Бұл әрекетті кері қайтару мүмкін емес.",
      )
    ) {
      return;
    }

    try {
      // In a real app, you would need to implement a secure account deletion process
      // This is a simplified version
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      navigate("/auth");

      toast({
        title: "Аккаунт жойылды",
        description: "Сіздің аккаунтыңыз сәтті жойылды",
      });
    } catch (error: any) {
      toast({
        title: "Қате",
        description: error.message || "Аккаунтты жою кезінде қате орын алды",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Жүктелуде...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header isLoggedIn={true} subscriptionStatus={user.subscriptionStatus} />
      <SubscriptionBanner status={user.subscriptionStatus} />

      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatar_url || ""} alt={user.name} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-2">
                    <Badge
                      variant={
                        user.subscriptionStatus === "premium"
                          ? "default"
                          : "outline"
                      }
                    >
                      {user.subscriptionStatus === "premium"
                        ? "Премиум"
                        : "Тегін"}{" "}
                      жоспар
                    </Badge>
                  </div>
                </div>

                <nav className="space-y-1">
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Профиль
                  </Button>
                  <Button
                    variant={activeTab === "security" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("security")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Қауіпсіздік
                  </Button>
                  <Button
                    variant={
                      activeTab === "notifications" ? "default" : "ghost"
                    }
                    className="w-full justify-start"
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Хабарландырулар
                  </Button>
                  <Button
                    variant={activeTab === "subscription" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("subscription")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Жазылым
                  </Button>
                  <Separator className="my-2" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Шығу
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="w-full md:w-3/4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === "profile" && "Профиль параметрлері"}
                  {activeTab === "security" && "Қауіпсіздік параметрлері"}
                  {activeTab === "notifications" && "Хабарландыру параметрлері"}
                  {activeTab === "subscription" && "Жазылым параметрлері"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="profile" className="space-y-6">
                    <form onSubmit={handleSaveProfile}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="avatar">Профиль суреті</Label>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage
                                src={user.avatar_url || ""}
                                alt={user.name}
                              />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <Button type="button" variant="outline" size="sm">
                              <Upload className="mr-2 h-4 w-4" />
                              Суретті жүктеу
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Аты-жөні</Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Электрондық пошта</Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Өзіңіз туралы</Label>
                          <textarea
                            id="bio"
                            className="w-full min-h-[100px] p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Өзіңіз туралы қысқаша мәлімет..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                          ></textarea>
                        </div>

                        <div className="space-y-2">
                          <Label>Тіл</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              type="button"
                              variant={
                                language === "kk" ? "default" : "outline"
                              }
                              className="justify-start"
                              onClick={() => setLanguage("kk")}
                            >
                              🇰🇿 Қазақша
                            </Button>
                            <Button
                              type="button"
                              variant={
                                language === "ru" ? "default" : "outline"
                              }
                              className="justify-start"
                              onClick={() => setLanguage("ru")}
                            >
                              🇷🇺 Русский
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button type="submit">Сақтау</Button>
                        </div>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          Құпия сөзді өзгерту
                        </h3>
                        <form onSubmit={handlePasswordChange}>
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="current-password">
                                Ағымдағы құпия сөз
                              </Label>
                              <Input
                                id="current-password"
                                name="current-password"
                                type="password"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-password">
                                Жаңа құпия сөз
                              </Label>
                              <Input
                                id="new-password"
                                name="new-password"
                                type="password"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">
                                Жаңа құпия сөзді растау
                              </Label>
                              <Input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button type="submit">Құпия сөзді өзгерту</Button>
                          </div>
                        </form>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          Екі факторлы аутентификация
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Қосымша қауіпсіздік үшін екі факторлы аутентификацияны
                          қосыңыз
                        </p>
                        <div className="flex items-center justify-between">
                          <div>Екі факторлы аутентификация</div>
                          <Switch />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-red-500">
                          Аккаунтты жою
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Аккаунтты жойғаннан кейін, барлық деректеріңіз
                          жойылады және қалпына келтіру мүмкін болмайды
                        </p>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                        >
                          Аккаунтты жою
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notifications" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Хабарландыру параметрлері
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div>Электрондық пошта хабарландырулары</div>
                            <div className="text-sm text-muted-foreground">
                              Жаңа мүмкіндіктер мен жаңартулар туралы
                              хабарландырулар алу
                            </div>
                          </div>
                          <Switch
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div>Маркетингтік хабарландырулар</div>
                            <div className="text-sm text-muted-foreground">
                              Арнайы ұсыныстар мен жеңілдіктер туралы
                              хабарландырулар алу
                            </div>
                          </div>
                          <Switch
                            checked={marketingNotifications}
                            onCheckedChange={setMarketingNotifications}
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div>Әңгімелесу хабарландырулары</div>
                            <div className="text-sm text-muted-foreground">
                              Жаңа хабарламалар туралы хабарландырулар алу
                            </div>
                          </div>
                          <Switch
                            checked={chatNotifications}
                            onCheckedChange={setChatNotifications}
                          />
                        </div>

                        <div className="flex justify-end mt-4">
                          <Button onClick={handleSaveNotifications}>
                            Сақтау
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="subscription" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Ағымдағы жазылым</h3>
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-xl font-bold">
                                {user.subscriptionStatus === "premium"
                                  ? "Премиум"
                                  : "Тегін"}{" "}
                                жоспар
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {user.subscriptionStatus === "premium"
                                  ? "Барлық мүмкіндіктерге толық қол жеткізу"
                                  : "Шектеулі мүмкіндіктерге қол жеткізу"}
                              </p>
                            </div>
                            <Badge
                              variant={
                                user.subscriptionStatus === "premium"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {user.subscriptionStatus === "premium"
                                ? "Белсенді"
                                : "Тегін"}
                            </Badge>
                          </div>

                          {user.subscriptionStatus === "free" && (
                            <div className="mt-4">
                              <Button className="w-full">
                                Премиумға жаңарту
                              </Button>
                            </div>
                          )}

                          {user.subscriptionStatus === "premium" && (
                            <div className="mt-4">
                              <Button variant="outline" className="w-full">
                                Жазылымды басқару
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {user.subscriptionStatus === "free" && (
                        <div className="mt-6">
                          <h3 className="text-lg font-medium mb-4">
                            Премиум жоспар артықшылықтары
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-center">
                              <div className="mr-2 h-5 w-5 text-green-500">
                                ✓
                              </div>
                              <span>Барлық тарихи тұлғаларға қол жеткізу</span>
                            </li>
                            <li className="flex items-center">
                              <div className="mr-2 h-5 w-5 text-green-500">
                                ✓
                              </div>
                              <span>Шексіз әңгімелесулер</span>
                            </li>
                            <li className="flex items-center">
                              <div className="mr-2 h-5 w-5 text-green-500">
                                ✓
                              </div>
                              <span>Арнайы кейіпкерлерді жасау</span>
                            </li>
                            <li className="flex items-center">
                              <div className="mr-2 h-5 w-5 text-green-500">
                                ✓
                              </div>
                              <span>Жоғары сапалы жауаптар</span>
                            </li>
                            <li className="flex items-center">
                              <div className="mr-2 h-5 w-5 text-green-500">
                                ✓
                              </div>
                              <span>Жарнамасыз тәжірибе</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
