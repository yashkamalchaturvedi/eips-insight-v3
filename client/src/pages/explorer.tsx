import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProposalTable } from "@/components/proposal-table";
import { Proposal } from "@shared/schema";

export default function Explorer() {
  const [location] = useLocation();
  
  // Parse query params for initial filters
  const getQueryParam = (param: string): string | null => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
  };
  
  const type = getQueryParam('type');
  
  // Fetch all proposals
  const { data: proposals, isLoading } = useQuery<Proposal[]>({
    queryKey: ["/api/proposals"],
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Proposal Explorer</h1>
        <p className="text-muted-foreground">
          Browse and filter Ethereum Improvement Proposals (EIPs), Ethereum Request for Comments (ERCs), and other related proposals.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Proposals</CardTitle>
          <CardDescription>
            A comprehensive list of all proposals in the Ethereum ecosystem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProposalTable proposals={proposals || []} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}

// Proposal detail page
export function ProposalDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // Fetch proposal details
  const { data: proposal, isLoading } = useQuery<Proposal>({
    queryKey: [`/api/proposals/${id}`],
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
  
  if (!proposal) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Proposal Not Found</h1>
        <p className="text-muted-foreground">
          The proposal with ID {id} could not be found.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">
            {proposal.type} / {proposal.category}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{proposal.proposalId}: {proposal.title}</h1>
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            By <span className="font-medium">{proposal.author}</span>
          </span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            Last updated {new Date(proposal.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Proposal Content</CardTitle>
          <CardDescription>
            Full content of the {proposal.type} proposal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <pre className="text-sm whitespace-pre-wrap">{proposal.content}</pre>
          </div>
        </CardContent>
      </Card>
      
      {proposal.githubUrl && (
        <div className="flex justify-end">
          <a
            href={proposal.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            View on GitHub →
          </a>
        </div>
      )}
    </div>
  );
}
