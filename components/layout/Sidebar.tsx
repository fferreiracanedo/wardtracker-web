"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import {
  Menu,
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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/features/theme/ThemeToggle";
import { LoginButton } from "@/components/features/auth/LoginButton";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/compare", label: "Comparar", icon: Users },
  { href: "/pricing", label: "Planos", icon: CreditCard },
  { href: "/settings", label: "Configurações", icon: Settings },
];

const SidebarHeader = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div
    className={cn(
      "flex items-center p-4 border-b h-20",
      isCollapsed ? "justify-center" : "justify-between"
    )}
  >
    <Link href="/" className="flex items-center space-x-3 group min-w-0">
      <div className="w-10 h-10 bg-gradient-to-br from-lol-gold to-lol-blue rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300 flex-shrink-0">
        <Crown className="h-6 w-6 text-white" />
      </div>
      {!isCollapsed && (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-lg text-foreground truncate">
            WardScore
          </span>
          <span className="text-xs text-muted-foreground font-medium tracking-wide">
            League Analytics
          </span>
        </div>
      )}
    </Link>
  </div>
);

const NavLink = ({ item, isCollapsed, isActive, onClick }: any) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
        isActive
          ? "bg-primary/10 text-primary font-semibold"
          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        isCollapsed ? "justify-center" : "justify-start"
      )}
      title={isCollapsed ? item.label : undefined}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
      {isActive && (
        <div
          className={cn(
            "absolute bg-primary rounded-full",
            isCollapsed
              ? "w-1.5 h-1.5 -top-0.5 right-1"
              : "w-2 h-2 right-3 top-1/2 -translate-y-1/2"
          )}
        />
      )}
    </Link>
  );
};

const ProBanner = ({ isCollapsed }: { isCollapsed: boolean }) => {
  if (isCollapsed) return null;
  return (
    <div className="px-4 pb-4">
      <Card className="bg-gradient-to-br from-lol-gold/10 to-transparent border-lol-gold/30">
        <CardContent className="p-4 text-center space-y-3">
          <div className="w-12 h-12 bg-gradient-to-br from-lol-gold to-lol-blue rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              Upgrade para Pro
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Análises e insights ilimitados
            </p>
          </div>
          <Button
            size="sm"
            className="w-full bg-lol-gold text-white hover:bg-lol-gold/90"
          >
            Assinar Agora
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const SidebarFooter = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div className="px-4 py-3 border-t">
    {isCollapsed ? (
      <div className="space-y-3">
        <ThemeToggle iconOnly />
        <LoginButton isCollapsed={isCollapsed} />
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Tema & Conta
          </p>
          <ThemeToggle />
        </div>
        <div className="mt-2">
          <LoginButton />
        </div>
      </>
    )}
  </div>
);

const SidebarContent = ({ isCollapsed, closeSidebar }: any) => {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full">
      <SidebarHeader isCollapsed={isCollapsed} />
      <nav className="p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
            isActive={isActive(item.href)}
            onClick={closeSidebar}
          />
        ))}
      </nav>

      <div className="flex-1" />

      <ProBanner isCollapsed={isCollapsed} />
      <SidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
};

export default function Sidebar({ className }: { className?: string }) {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleDesktopCollapse = () => setIsDesktopCollapsed((prev) => !prev);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background/60 z-40 lg:hidden",
          isMobileOpen ? "block" : "hidden"
        )}
        onClick={closeMobileSidebar}
      />

      {/* Mobile trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-20 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar for Desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-background border-r sticky top-0 h-screen transition-all duration-300",
          isDesktopCollapsed ? "w-20" : "w-64",
          className
        )}
      >
        <SidebarContent isCollapsed={isDesktopCollapsed} />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDesktopCollapse}
          className="absolute top-1/2 -right-4 -translate-y-1/2 bg-background border rounded-full w-8 h-8 hover:bg-muted"
        >
          {isDesktopCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </aside>

      {/* Sidebar for Mobile (off-canvas) */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex flex-col bg-background border-r h-full w-64 transition-transform duration-300 lg:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <SidebarContent isCollapsed={false} closeSidebar={closeMobileSidebar} />
        <Button
          variant="ghost"
          size="icon"
          onClick={closeMobileSidebar}
          className="absolute top-4 right-4"
        >
          <X className="h-6 w-6" />
        </Button>
      </aside>
    </>
  );
}
