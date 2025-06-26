"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Upload,
  BarChart3,
  Trophy,
  Settings,
  CreditCard,
  Users,
  Crown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/features/theme/ThemeToggle";
import LoginButton from "@/components/features/auth/LoginButton";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/ranking", label: "Ranking", icon: Trophy },
    { href: "/compare", label: "Comparar", icon: Users },
    { href: "/pricing", label: "Planos", icon: CreditCard },
    { href: "/settings", label: "Configurações", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div
      className={cn("flex flex-col h-full", isCollapsed && "overflow-hidden")}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center p-4 border-b bg-gradient-to-r from-background to-muted/20",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-lol-gold via-gold to-lol-blue rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
            <Crown className="h-7 w-7 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-gold to-blue bg-clip-text text-transparent">
                WardScore
              </span>
              <span className="text-xs text-muted-foreground font-medium tracking-wide">
                League Analytics
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        {!isMobileOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav
        className={cn("flex-1 p-4 space-y-2", isCollapsed && "overflow-hidden")}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative",
                isActive(item.href)
                  ? "bg-gradient-to-r from-gold/20 to-gold/10 text-gold border border-gold/30 shadow-md"
                  : "hover:bg-muted/80 text-muted-foreground hover:text-foreground hover:shadow-sm",
                isCollapsed && "justify-center px-4 py-3"
              )}
            >
              <Icon
                className={cn(
                  "flex-shrink-0 transition-colors",
                  isActive(item.href) ? "h-5 w-5" : "h-5 w-5",
                  isCollapsed && "mx-auto"
                )}
              />
              {!isCollapsed && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.href) && (
                    <div className="ml-auto w-2 h-2 bg-gold rounded-full shadow-sm animate-pulse" />
                  )}
                </>
              )}
              {isCollapsed && isActive(item.href) && (
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Pro Banner - Only shown when not collapsed */}
      {!isCollapsed && (
        <div className="px-4 pb-4 flex-shrink-0">
          <Card className="bg-gradient-to-br from-gold/5 via-gold/10 to-blue/5 border-gold/30 shadow-lg">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/70 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    Upgrade para Pro
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Análises ilimitadas e IA avançada
                  </p>
                </div>
                <Button
                  size="sm"
                  style={{
                    background: "linear-gradient(to right, #C8AA6E, #D4A574)",
                    color: "white",
                  }}
                  className="w-full hover:opacity-90 font-medium shadow-md hover:shadow-lg transition-all duration-200 border-0"
                >
                  Assinar Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Controls */}
      <div
        className={cn(
          "px-4 py-4 border-t bg-muted/20 mt-auto flex-shrink-0",
          isCollapsed ? "space-y-3 flex flex-col items-center" : "space-y-2"
        )}
      >
        {!isCollapsed ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Configurações
              </span>
              <ThemeToggle />
            </div>
            <div className="pt-1">
              <LoginButton className="w-full" />
            </div>
          </>
        ) : (
          <>
            <ThemeToggle iconOnly />
            <LoginButton iconOnly className="w-10 h-10" />
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Trigger */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-background/80 backdrop-blur-sm border shadow-lg"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-background border-r transition-all duration-300 sticky top-0 h-screen",
          isCollapsed ? "w-20 overflow-hidden" : "w-72 overflow-y-auto",
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex flex-col bg-background border-r h-screen w-72 transition-transform duration-300 lg:hidden shadow-xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-background to-muted/20">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-lol-gold to-lol-blue rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-gold to-blue bg-clip-text text-transparent">
                WardScore
              </span>
              <span className="text-xs text-muted-foreground font-medium tracking-wide">
                League Analytics
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="hover:bg-muted/80"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
      </aside>
    </>
  );
}
