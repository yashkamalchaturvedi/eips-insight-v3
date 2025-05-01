import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";

interface ContributorCardProps {
  name: string;
  avatarUrl?: string;
  proposalCount: number;
  githubUsername?: string;
  isLoading?: boolean;
  className?: string;
}

export function ContributorCard({
  name,
  avatarUrl,
  proposalCount,
  githubUsername,
  isLoading = false,
  className,
}: ContributorCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-3">
        {isLoading ? (
          <div className="flex animate-pulse items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-muted"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-3 w-16 bg-muted rounded"></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <UserAvatar
              src={avatarUrl}
              alt={`${name}'s avatar`}
              fallback={name}
            />
            <div>
              {githubUsername ? (
                <Link href={`/leaderboard/${githubUsername}`}>
                  <a className="font-medium hover:text-primary hover:underline">
                    {name}
                  </a>
                </Link>
              ) : (
                <p className="font-medium">{name}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {proposalCount} {proposalCount === 1 ? "proposal" : "proposals"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TopContributorsGrid({
  contributors = [],
  isLoading = false,
  limit = 4,
  className,
}: {
  contributors: Array<{
    name: string;
    avatarUrl?: string;
    proposalCount: number;
    githubUsername?: string;
  }>;
  isLoading?: boolean;
  limit?: number;
  className?: string;
}) {
  const limitedContributors = contributors.slice(0, limit);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4",
        className
      )}
    >
      {isLoading
        ? Array.from({ length: limit }).map((_, index) => (
            <ContributorCard
              key={`loading-${index}`}
              name=""
              proposalCount={0}
              isLoading={true}
            />
          ))
        : limitedContributors.map((contributor, index) => (
            <ContributorCard
              key={index}
              name={contributor.name}
              avatarUrl={contributor.avatarUrl}
              proposalCount={contributor.proposalCount}
              githubUsername={contributor.githubUsername}
            />
          ))}
    </div>
  );
}
