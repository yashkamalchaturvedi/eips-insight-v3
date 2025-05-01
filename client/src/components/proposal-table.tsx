import { useState } from "react";
import { Link } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Filter, MoreHorizontal, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Proposal, PROPOSAL_STATUS, PROPOSAL_CATEGORIES, PROPOSAL_TYPES } from "@shared/schema";

// Status color mapping
const getStatusColor = (status: string): string => {
  switch (status) {
    case "Final":
      return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
    case "Review":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
    case "Draft":
      return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200";
    case "Stagnant":
      return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
    case "Last Call":
      return "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200";
    case "Withdrawn":
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    case "Living":
      return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
    default:
      return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200";
  }
};

// Category color mapping
const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Core":
      return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
    case "ERC":
      return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
    case "Interface":
      return "bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200";
    case "Networking":
      return "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200";
    case "Meta":
      return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
    case "Informational":
      return "bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200";
    case "RIP":
      return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
    default:
      return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200";
  }
};

// Format relative time
const getRelativeTime = (dateString: Date | null) => {
  if (!dateString) return "Unknown";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  } else if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  } else if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  } else {
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  }
};

interface ProposalTableProps {
  proposals: Proposal[];
  isLoading?: boolean;
  className?: string;
}

export function ProposalTable({
  proposals = [],
  isLoading = false,
  className,
}: ProposalTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Apply filters and search to proposals
  const filteredProposals = proposals.filter((proposal) => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.proposalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.author.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Status filter
    const matchesStatus = !statusFilter || proposal.status === statusFilter;
    
    // Category filter
    const matchesCategory = !categoryFilter || proposal.category === categoryFilter;
    
    // Type filter
    const matchesType = !typeFilter || proposal.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesType;
  });



  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
    setCategoryFilter(null);
    setTypeFilter(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and filter controls */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search proposals..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Status filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Status
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {PROPOSAL_STATUS.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                >
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      statusFilter === status ? "bg-primary" : "bg-muted"
                    )} />
                    <span>{status}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Category filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Category
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {PROPOSAL_CATEGORIES.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setCategoryFilter(categoryFilter === category ? null : category)}
                >
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      categoryFilter === category ? "bg-primary" : "bg-muted"
                    )} />
                    <span>{category}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Type filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Type
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {PROPOSAL_TYPES.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                >
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      typeFilter === type ? "bg-primary" : "bg-muted"
                    )} />
                    <span>{type}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Clear filters button - only show if filters are applied */}
          {(searchTerm || statusFilter || categoryFilter || typeFilter) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {/* Active filters display */}
      {(statusFilter || categoryFilter || typeFilter) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          {statusFilter && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status: {statusFilter}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => setStatusFilter(null)}
              >
                <span className="sr-only">Remove</span>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {categoryFilter && (
            <Badge variant="outline" className="flex items-center gap-1">
              Category: {categoryFilter}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => setCategoryFilter(null)}
              >
                <span className="sr-only">Remove</span>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {typeFilter && (
            <Badge variant="outline" className="flex items-center gap-1">
              Type: {typeFilter}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => setTypeFilter(null)}
              >
                <span className="sr-only">Remove</span>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
      
      {/* Proposals table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Author</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={7} className="h-12 animate-pulse">
                    <div className="h-4 bg-muted rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredProposals.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No proposals found</p>
                    {(searchTerm || statusFilter || categoryFilter || typeFilter) && (
                      <Button variant="link" onClick={clearFilters} className="mt-2">
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Proposals
              filteredProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-medium text-primary">
                    <Link href={`/explorer/${proposal.proposalId}`}>
                      <a>{proposal.proposalId}</a>
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[16rem] truncate">
                    {proposal.title}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {proposal.author}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary" className={getCategoryColor(proposal.category)}>
                      {proposal.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(proposal.status)}>
                      {proposal.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {getRelativeTime(proposal.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link href={`/explorer/${proposal.proposalId}`}>
                            <a className="w-full">View details</a>
                          </Link>
                        </DropdownMenuItem>
                        {proposal.githubUrl && (
                          <DropdownMenuItem>
                            <a
                              href={proposal.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full"
                            >
                              View on GitHub
                            </a>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Results count */}
      {!isLoading && filteredProposals.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredProposals.length} of {proposals.length} proposals
        </div>
      )}
    </div>
  );
}

// Smaller version of ProposalTable with fewer columns, used on the dashboard
export function RecentProposalsTable({
  proposals = [],
  isLoading = false,
  limit = 5,
  className,
}: ProposalTableProps & { limit?: number }) {
  const limitedProposals = proposals.slice(0, limit);
  
  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Author</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading state
            Array.from({ length: limit }).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                <TableCell colSpan={6} className="h-12 animate-pulse">
                  <div className="h-4 bg-muted rounded"></div>
                </TableCell>
              </TableRow>
            ))
          ) : limitedProposals.length === 0 ? (
            // Empty state
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <p className="text-muted-foreground">No proposals found</p>
              </TableCell>
            </TableRow>
          ) : (
            // Proposals
            limitedProposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell className="font-medium text-primary">
                  <Link href={`/explorer/${proposal.proposalId}`}>
                    <a>{proposal.proposalId}</a>
                  </Link>
                </TableCell>
                <TableCell className="max-w-[16rem] truncate">
                  {proposal.title}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {proposal.author}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary" className={getCategoryColor(proposal.category)}>
                    {proposal.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(proposal.status)}>
                    {proposal.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {getRelativeTime(proposal.updatedAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
