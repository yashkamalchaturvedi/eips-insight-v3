import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UserAvatar } from "@/components/user-avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trophy, GitPullRequestIcon, GitCommitIcon, MessageSquareIcon } from "lucide-react";
import { Contributor } from "@shared/schema";

export default function Leaderboard() {
  // Fetch contributors
  const { data: contributors, isLoading } = useQuery<Contributor[]>({
    queryKey: ["/api/contributors"],
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("proposalCount");
  
  // Filter contributors based on search term
  const filteredContributors = contributors?.filter(contributor =>
    contributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contributor.githubUsername.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Sort contributors based on the selected sort option
  const sortedContributors = [...filteredContributors].sort((a, b) => {
    if (sortBy === "proposalCount") {
      return (b.proposalCount || 0) - (a.proposalCount || 0);
    } else if (sortBy === "nameAsc") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "nameDesc") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });
  
  // Generate ranks for contributors
  const rankedContributors = sortedContributors.map((contributor, index) => ({
    ...contributor,
    rank: index + 1
  }));
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contributor Leaderboard</h1>
        <p className="text-muted-foreground">
          Explore the most active contributors in the Ethereum ecosystem.
        </p>
      </div>
      
      <Tabs defaultValue="leaderboard">
        <TabsList>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leaderboard" className="space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="relative sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search contributors..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select 
              value={sortBy} 
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proposalCount">Most Proposals</SelectItem>
                <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
                <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
              <CardDescription>
                Ranked by number of proposals submitted, reviewed, or edited.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Rank</TableHead>
                    <TableHead>Contributor</TableHead>
                    <TableHead className="text-right">Proposals</TableHead>
                    <TableHead className="hidden md:table-cell">GitHub</TableHead>
                    <TableHead className="hidden md:table-cell text-right">Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading state
                    Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={`loading-${i}`}>
                        <TableCell colSpan={5} className="h-12 animate-pulse">
                          <div className="h-4 bg-muted rounded"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : rankedContributors.length === 0 ? (
                    // Empty state
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Trophy className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No contributors found</p>
                          {searchTerm && (
                            <Button 
                              variant="link" 
                              onClick={() => setSearchTerm("")} 
                              className="mt-2"
                            >
                              Clear search
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Contributors list
                    rankedContributors.map((contributor) => (
                      <TableRow key={contributor.id}>
                        <TableCell className="font-medium">
                          {contributor.rank === 1 ? (
                            <div className="flex items-center">
                              <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                              {contributor.rank}
                            </div>
                          ) : contributor.rank === 2 ? (
                            <div className="flex items-center">
                              <Trophy className="h-4 w-4 text-gray-400 mr-1" />
                              {contributor.rank}
                            </div>
                          ) : contributor.rank === 3 ? (
                            <div className="flex items-center">
                              <Trophy className="h-4 w-4 text-amber-600 mr-1" />
                              {contributor.rank}
                            </div>
                          ) : (
                            contributor.rank
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <UserAvatar 
                              src={contributor.avatarUrl} 
                              alt={`${contributor.name}'s avatar`}
                              fallback={contributor.name}
                              size="sm"
                            />
                            <div>
                              <div className="font-medium">{contributor.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {contributor.proposalCount || 0}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <a 
                            href={`https://github.com/${contributor.githubUsername}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            @{contributor.githubUsername}
                          </a>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <GitCommitIcon className="h-3 w-3" />
                              <span>{Math.floor(Math.random() * 100) + 50}</span>
                            </Badge>
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <GitPullRequestIcon className="h-3 w-3" />
                              <span>{Math.floor(Math.random() * 50) + 10}</span>
                            </Badge>
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <MessageSquareIcon className="h-3 w-3" />
                              <span>{Math.floor(Math.random() * 200) + 20}</span>
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Contributor Activity</CardTitle>
              <CardDescription>
                Monthly activity breakdown of top contributors.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-muted p-10">
                  <GitCommitIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Coming Soon</h3>
                <p className="text-center text-muted-foreground">
                  We're working on a more detailed contributor activity view.
                  Check back soon for more insights into GitHub contributions, 
                  code reviews, and discussions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Contributor detail page
export function ContributorDetail({ params }: { params: { username: string } }) {
  const { username } = params;
  
  // Fetch contributor details
  const { data: contributor, isLoading } = useQuery<Contributor>({
    queryKey: [`/api/contributors/github/${username}`],
  });
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-muted rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-muted rounded"></div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-6 w-1/4 bg-muted rounded mb-2"></div>
              <div className="h-4 w-1/3 bg-muted rounded"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-3/4 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!contributor) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Contributor Not Found</h1>
        <p className="text-muted-foreground">
          The contributor with username @{username} could not be found.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <UserAvatar 
          src={contributor.avatarUrl} 
          alt={`${contributor.name}'s avatar`}
          fallback={contributor.name}
          size="lg"
        />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{contributor.name}</h1>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <a 
              href={`https://github.com/${contributor.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @{contributor.githubUsername}
            </a>
            <span>•</span>
            <span>{contributor.proposalCount} proposals</span>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="proposals">
        <TabsList>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="proposals">
          <Card>
            <CardHeader>
              <CardTitle>Contributed Proposals</CardTitle>
              <CardDescription>
                Proposals authored or contributed to by {contributor.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-center text-muted-foreground">
                  Detailed proposal information coming soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                GitHub activity and contributions.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-center text-muted-foreground">
                  Activity timeline coming soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Contribution Statistics</CardTitle>
              <CardDescription>
                Detailed breakdown of contributions.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-center text-muted-foreground">
                  Contribution statistics coming soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
