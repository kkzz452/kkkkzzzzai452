import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell, Menu, Settings, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  isLoggedIn?: boolean;
  subscriptionStatus?: "free" | "premium";
}

const Header = ({
  userName = "Guest User",
  userAvatar = "",
  isLoggedIn = true,
  subscriptionStatus = "free",
}: HeaderProps) => {
  return (
    <header className="w-full h-20 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-bold">Aqyl AI</span>
        </Link>

        <nav className="ml-10 hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-foreground hover:text-primary transition-colors"
          >
            Басты бет
          </Link>
          <Link
            to="/characters"
            className="text-foreground hover:text-primary transition-colors"
          >
            Кейіпкерлер
          </Link>
          <Link
            to="/history"
            className="text-foreground hover:text-primary transition-colors"
          >
            Тарих
          </Link>
          <Link
            to="/about"
            className="text-foreground hover:text-primary transition-colors"
          >
            Біз туралы
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
              <div
                className={`w-2 h-2 rounded-full ${subscriptionStatus === "premium" ? "bg-green-500" : "bg-amber-500"}`}
              ></div>
              <span className="text-sm font-medium capitalize">
                {subscriptionStatus === "premium" ? "Премиум" : "Тегін"} жоспар
              </span>
              {subscriptionStatus === "free" && (
                <Button variant="link" size="sm" className="text-primary p-0">
                  Жаңарту
                </Button>
              )}
            </div>

            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Менің аккаунтым</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Профиль
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Параметрлер
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("userName");
                    window.location.href = "/auth";
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Шығу
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/auth")}
            >
              Кіру
            </Button>
            <Button
              onClick={() => (window.location.href = "/auth?tab=register")}
            >
              Тіркелу
            </Button>
          </>
        )}

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/">Басты бет</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/characters">Кейіпкерлер</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/history">Тарих</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/about">Біз туралы</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
