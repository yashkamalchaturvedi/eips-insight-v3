import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, Menu, Search, X } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
  className?: string;
}

export function Navbar({ onMenuClick, className }: NavbarProps) {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Get the current page title based on the location
  const getPageTitle = () => {
    switch (true) {
      case location === '/':
        return 'Dashboard';
      case location.startsWith('/explorer'):
        return 'Proposal Explorer';
      case location.startsWith('/builder'):
        return 'Proposal Builder';
      case location.startsWith('/analytics'):
        return 'Analytics';
      case location.startsWith('/leaderboard'):
        return 'Contributor Leaderboard';
      default:
        return 'EIPsInsight';
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 w-full items-center border-b bg-background px-4",
      className
    )}>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Mobile logo - only visible on small screens */}
          <Link href="/">
            <div className="flex items-center md:hidden cursor-pointer">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="ml-2 text-xl font-semibold">EIPsInsight</span>
            </div>
          </Link>
          
          {/* Page title - hidden on mobile */}
          <div className="hidden md:flex md:items-center md:justify-between">
            <h2 className="text-xl font-semibold">{getPageTitle()}</h2>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Desktop search bar */}
          <div className="relative hidden md:block md:w-60">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search proposals..."
              className="w-full pl-9 pr-4"
            />
          </div>
          
          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>
          
          {/* Notifications button */}
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          
          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
      
      {/* Mobile search bar - only visible when search is toggled */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-16 z-40 border-b bg-background p-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search proposals..."
              className="w-full pl-9 pr-4"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
