import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface UserAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({
  src,
  alt = "User avatar",
  fallback,
  className,
  size = "md",
}: UserAvatarProps) {
  // Size mapping
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  // Get user initials for fallback
  const getInitials = () => {
    if (!fallback) return "";
    
    const parts = fallback.split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="bg-muted flex items-center justify-center">
        {fallback ? (
          <span className="text-xs font-medium">{getInitials()}</span>
        ) : (
          <User className="h-5 w-5 text-muted-foreground" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
