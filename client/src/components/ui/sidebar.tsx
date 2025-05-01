import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  position?: "left" | "right";
  className?: string;
}

export function Sidebar({
  children,
  open = false,
  onClose,
  position = "left",
  className,
  ...props
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(open);

  // Sync with external open state
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  // Handle overlay clicks
  const handleOverlayClick = () => {
    setIsOpen(false);
    onClose?.();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 h-full w-64 flex-col border-r bg-background p-0 shadow-lg transition-transform duration-300 ease-in-out",
          position === "left" ? "left-0" : "right-0",
          isOpen
            ? "translate-x-0"
            : position === "left"
            ? "-translate-x-full"
            : "translate-x-full",
          className
        )}
        {...props}
      >
        {/* Close button for mobile - top right corner */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-sm opacity-70 md:hidden"
          onClick={() => {
            setIsOpen(false);
            onClose?.();
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>

        {/* Sidebar content */}
        {children}
      </div>
    </>
  );
}
