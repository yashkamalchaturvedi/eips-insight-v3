import { 
  users, type User, type InsertUser, 
  proposals, type Proposal, type InsertProposal,
  contributors, type Contributor, type InsertContributor,
  analytics, type Analytics, type InsertAnalytics,
  PROPOSAL_STATUS, PROPOSAL_CATEGORIES, PROPOSAL_TYPES
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Proposal methods
  getProposals(): Promise<Proposal[]>;
  getProposal(id: number): Promise<Proposal | undefined>;
  getProposalById(proposalId: string): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<Proposal | undefined>;
  getProposalsByType(type: typeof PROPOSAL_TYPES[number]): Promise<Proposal[]>;
  getProposalsByStatus(status: typeof PROPOSAL_STATUS[number]): Promise<Proposal[]>;
  getProposalsByCategory(category: typeof PROPOSAL_CATEGORIES[number]): Promise<Proposal[]>;
  getRecentProposals(limit: number): Promise<Proposal[]>;
  
  // Contributor methods
  getContributors(): Promise<Contributor[]>;
  getContributor(id: number): Promise<Contributor | undefined>;
  getContributorByGithubUsername(username: string): Promise<Contributor | undefined>;
  createContributor(contributor: InsertContributor): Promise<Contributor>;
  updateContributor(id: number, contributor: Partial<InsertContributor>): Promise<Contributor | undefined>;
  getTopContributors(limit: number): Promise<Contributor[]>;
  
  // Analytics methods
  getAnalytics(): Promise<Analytics[]>;
  getLatestAnalytics(): Promise<Analytics | undefined>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private proposals: Map<number, Proposal>;
  private contributors: Map<number, Contributor>;
  private analyticsData: Map<number, Analytics>;
  
  private userId: number;
  private proposalId: number;
  private contributorId: number;
  private analyticsId: number;
  
  constructor() {
    this.users = new Map();
    this.proposals = new Map();
    this.contributors = new Map();
    this.analyticsData = new Map();
    
    this.userId = 1;
    this.proposalId = 1;
    this.contributorId = 1;
    this.analyticsId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const timestamp = new Date();
    
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: timestamp
    };
    
    this.users.set(id, user);
    return user;
  }
  
  // Proposal methods
  async getProposals(): Promise<Proposal[]> {
    return Array.from(this.proposals.values());
  }
  
  async getProposal(id: number): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }
  
  async getProposalById(proposalId: string): Promise<Proposal | undefined> {
    return Array.from(this.proposals.values()).find(
      (proposal) => proposal.proposalId === proposalId,
    );
  }
  
  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = this.proposalId++;
    const timestamp = new Date();
    
    const proposal: Proposal = {
      ...insertProposal,
      id,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    this.proposals.set(id, proposal);
    return proposal;
  }
  
  async updateProposal(id: number, data: Partial<InsertProposal>): Promise<Proposal | undefined> {
    const proposal = this.proposals.get(id);
    
    if (!proposal) {
      return undefined;
    }
    
    const updatedProposal: Proposal = {
      ...proposal,
      ...data,
      updatedAt: new Date()
    };
    
    this.proposals.set(id, updatedProposal);
    return updatedProposal;
  }
  
  async getProposalsByType(type: typeof PROPOSAL_TYPES[number]): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).filter(
      (proposal) => proposal.type === type
    );
  }
  
  async getProposalsByStatus(status: typeof PROPOSAL_STATUS[number]): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).filter(
      (proposal) => proposal.status === status
    );
  }
  
  async getProposalsByCategory(category: typeof PROPOSAL_CATEGORIES[number]): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).filter(
      (proposal) => proposal.category === category
    );
  }
  
  async getRecentProposals(limit: number): Promise<Proposal[]> {
    return Array.from(this.proposals.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }
  
  // Contributor methods
  async getContributors(): Promise<Contributor[]> {
    return Array.from(this.contributors.values());
  }
  
  async getContributor(id: number): Promise<Contributor | undefined> {
    return this.contributors.get(id);
  }
  
  async getContributorByGithubUsername(username: string): Promise<Contributor | undefined> {
    return Array.from(this.contributors.values()).find(
      (contributor) => contributor.githubUsername === username
    );
  }
  
  async createContributor(insertContributor: InsertContributor): Promise<Contributor> {
    const id = this.contributorId++;
    const timestamp = new Date();
    
    const contributor: Contributor = {
      ...insertContributor,
      id,
      createdAt: timestamp
    };
    
    this.contributors.set(id, contributor);
    return contributor;
  }
  
  async updateContributor(id: number, data: Partial<InsertContributor>): Promise<Contributor | undefined> {
    const contributor = this.contributors.get(id);
    
    if (!contributor) {
      return undefined;
    }
    
    const updatedContributor: Contributor = {
      ...contributor,
      ...data,
    };
    
    this.contributors.set(id, updatedContributor);
    return updatedContributor;
  }
  
  async getTopContributors(limit: number): Promise<Contributor[]> {
    return Array.from(this.contributors.values())
      .sort((a, b) => (b.proposalCount || 0) - (a.proposalCount || 0))
      .slice(0, limit);
  }
  
  // Analytics methods
  async getAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analyticsData.values());
  }
  
  async getLatestAnalytics(): Promise<Analytics | undefined> {
    const analyticsArray = Array.from(this.analyticsData.values());
    if (analyticsArray.length === 0) return undefined;
    
    return analyticsArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }
  
  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = this.analyticsId++;
    const timestamp = new Date();
    
    const analytics: Analytics = {
      ...insertAnalytics,
      id,
      createdAt: timestamp
    };
    
    this.analyticsData.set(id, analytics);
    return analytics;
  }
  
  // Initialize with sample data for development
  private initializeSampleData() {
    // Sample proposals
    const sampleProposals: InsertProposal[] = [
      {
        proposalId: "EIP-4895",
        title: "Beacon chain withdrawals",
        author: "Alex Stokes",
        category: "Core",
        type: "EIP",
        status: "Final",
        content: "# EIP-4895: Beacon chain withdrawals\n\n## Abstract\nThis proposal introduces a method for withdrawals from the beacon chain.",
        githubUrl: "https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4895.md"
      },
      {
        proposalId: "ERC-6551",
        title: "Non-fungible Token Bound Accounts",
        author: "Jayden Windle",
        category: "ERC",
        type: "ERC",
        status: "Review",
        content: "# ERC-6551: Non-fungible Token Bound Accounts\n\n## Abstract\nThis proposal standardizes a method for creating accounts bound to non-fungible tokens.",
        githubUrl: "https://github.com/ethereum/EIPs/blob/master/EIPS/eip-6551.md"
      },
      {
        proposalId: "EIP-5732",
        title: "Commit Interface",
        author: "Sam Wilson",
        category: "Interface",
        type: "EIP",
        status: "Draft",
        content: "# EIP-5732: Commit Interface\n\n## Abstract\nThis proposal standardizes an interface for commit-reveal schemes.",
        githubUrl: "https://github.com/ethereum/EIPs/blob/master/EIPS/eip-5732.md"
      },
      {
        proposalId: "ERC-5643",
        title: "Subscription NFTs",
        author: "Theo Phannes",
        category: "ERC",
        type: "ERC",
        status: "Final",
        content: "# ERC-5643: Subscription NFTs\n\n## Abstract\nThis proposal introduces a method for managing subscriptions using NFTs.",
        githubUrl: "https://github.com/ethereum/EIPs/blob/master/EIPS/eip-5643.md"
      },
      {
        proposalId: "RIP-7212",
        title: "Receipt Protocol",
        author: "Elena Pérez",
        category: "RIP",
        type: "RIP",
        status: "Stagnant",
        content: "# RIP-7212: Receipt Protocol\n\n## Abstract\nThis proposal defines a standard protocol for receipt generation.",
        githubUrl: "https://github.com/ethereum/RIPs/blob/master/RIPS/rip-7212.md"
      }
    ];
    
    // Sample contributors
    const sampleContributors: InsertContributor[] = [
      {
        name: "Alex Stokes",
        githubUsername: "alexstokes",
        avatarUrl: "https://i.pravatar.cc/100?img=1",
        proposalCount: 23
      },
      {
        name: "Tim Beiko",
        githubUsername: "timbeiko",
        avatarUrl: "https://i.pravatar.cc/100?img=2",
        proposalCount: 19
      },
      {
        name: "William Entriken",
        githubUsername: "fulldecent",
        avatarUrl: "https://i.pravatar.cc/100?img=3",
        proposalCount: 15
      },
      {
        name: "Vitalik Buterin",
        githubUsername: "vbuterin",
        avatarUrl: "https://i.pravatar.cc/100?img=4",
        proposalCount: 12
      }
    ];
    
    // Sample analytics
    const currentDate = new Date();
    const sampleAnalytics: InsertAnalytics = {
      date: currentDate,
      proposalData: {
        totalProposals: 487,
        byType: {
          EIP: 176,
          ERC: 243,
          RIP: 68
        },
        byStatus: {
          Draft: 73,
          Review: 121,
          "Last Call": 62,
          Final: 143,
          Stagnant: 54,
          Withdrawn: 22,
          Living: 12
        },
        monthlyActivity: [
          { month: "Jan", count: 23 },
          { month: "Feb", count: 28 },
          { month: "Mar", count: 21 },
          { month: "Apr", count: 43 },
          { month: "May", count: 32 },
          { month: "Jun", count: 45 },
          { month: "Jul", count: 51 }
        ]
      },
      contributorData: {
        totalContributors: 298,
        newContributors: 28,
        topContributors: sampleContributors.map(c => ({
          name: c.name,
          count: c.proposalCount
        }))
      }
    };
    
    // Add sample data to storage
    for (const proposal of sampleProposals) {
      this.createProposal(proposal);
    }
    
    for (const contributor of sampleContributors) {
      this.createContributor(contributor);
    }
    
    this.createAnalytics(sampleAnalytics);
  }
}

export const storage = new MemStorage();
