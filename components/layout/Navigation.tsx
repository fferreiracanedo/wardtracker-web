"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Trophy, BarChart3, Settings, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/features/theme/ThemeToggle";
import { LoginButton } from "@/components/features/auth/LoginButton";

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/upload", label: "Upload", icon: null },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      href: "/ranking",
      label: "Ranking",
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      href: "/compare",
      label: "Comparar",
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      href: "/pricing",
      label: "Planos",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      href: "/settings",
      label: "Configurações",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <nav
      className={`bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-lol-gold to-lol-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">
              WardScore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LoginButton />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </nav>
  );
}
