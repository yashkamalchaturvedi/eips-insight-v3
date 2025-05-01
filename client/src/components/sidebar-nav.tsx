import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  LayoutDashboard,
  Search,
  FileEdit,
  BarChart2,
  Trophy,
  User,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarNavProps {
  className?: string;
  onNavItemClick?: () => void;
}

export function SidebarNav({ className, onNavItemClick }: SidebarNavProps) {
  const [location] = useLocation();
  const [proposalTypesOpen, setProposalTypesOpen] = useState(true);

  return (
    <ScrollArea className={cn("h-full w-full", className)}>
      <div className="flex h-full flex-col justify-between">
        <div className="px-3 py-2">
          <div className="mb-2 px-4 py-3">
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h1 className="text-xl font-bold">EIPsInsight</h1>
            </div>
          </div>
          
          <div className="space-y-1 py-2">
            <NavItem 
              href="/" 
              icon={<LayoutDashboard className="h-5 w-5" />} 
              label="Dashboard" 
              isActive={location === '/'} 
              onClick={onNavItemClick}
            />
            <NavItem 
              href="/explorer" 
              icon={<Search className="h-5 w-5" />} 
              label="Proposal Explorer" 
              isActive={location.startsWith('/explorer')} 
              onClick={onNavItemClick}
            />
            <NavItem 
              href="/builder" 
              icon={<FileEdit className="h-5 w-5" />} 
              label="Proposal Builder" 
              isActive={location.startsWith('/builder')} 
              onClick={onNavItemClick}
            />
            <NavItem 
              href="/analytics" 
              icon={<BarChart2 className="h-5 w-5" />} 
              label="Analytics" 
              isActive={location.startsWith('/analytics')} 
              onClick={onNavItemClick}
            />
            <NavItem 
              href="/leaderboard" 
              icon={<Trophy className="h-5 w-5" />} 
              label="Contributor Leaderboard" 
              isActive={location.startsWith('/leaderboard')} 
              onClick={onNavItemClick}
            />
          </div>
          
          <Collapsible
            open={proposalTypesOpen}
            onOpenChange={setProposalTypesOpen}
            className="mt-8 pt-6 border-t border-border"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Proposal Types
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200",
                    proposalTypesOpen ? "rotate-180" : ""
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pt-1">
              <ProposalTypeItem type="EIPs" color="bg-blue-500" onClick={onNavItemClick} />
              <ProposalTypeItem type="ERCs" color="bg-purple-500" onClick={onNavItemClick} />
              <ProposalTypeItem type="RIPs" color="bg-green-500" onClick={onNavItemClick} />
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        <div className="mt-auto border-t border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <User className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium">Guest User</span>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

function NavItem({ href, icon, label, isActive, onClick }: NavItemProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
        onClick={onClick}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </div>
    </Link>
  );
}

interface ProposalTypeItemProps {
  type: string;
  color: string;
  onClick?: () => void;
}

function ProposalTypeItem({ type, color, onClick }: ProposalTypeItemProps) {
  return (
    <Link href={`/explorer?type=${type}`}>
      <div
        className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
        onClick={onClick}
      >
        <span className={`mr-3 h-2 w-2 rounded-full ${color}`}></span>
        {type}
      </div>
    </Link>
  );
}
