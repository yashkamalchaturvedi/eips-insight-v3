import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  change?: {
    value: number;
    timeframe?: string;
    isPositive?: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  icon,
  title,
  value,
  change,
  iconBgColor = "bg-blue-100 dark:bg-blue-900",
  iconColor = "text-blue-500 dark:text-blue-300",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("border", className)}>
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className={cn("mr-4 rounded-full p-3", iconBgColor, iconColor)}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
        
        {change && (
          <div className="mt-2 flex items-center text-xs">
            <span className={cn(
              "flex items-center",
              change.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {change.isPositive ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {Math.abs(change.value)}%
            </span>
            {change.timeframe && (
              <span className="ml-2 text-muted-foreground">
                from {change.timeframe}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
